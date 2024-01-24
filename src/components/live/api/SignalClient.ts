// 内部选项
import {
    AddTrackRequest,
    ConnectionQualityUpdate,
    JoinResponse,
    LeaveRequest,
    MuteTrackRequest,
    ReconnectResponse,
    SessionDescription,
    SignalRequest,
    SignalResponse,
    SignalTarget,
    SimulateScenario,
    StreamStateUpdate,
    SubscribedQualityUpdate,
    SubscriptionPermissionUpdate,
    SubscriptionResponse,
    SyncState,
    TrackPermission,
    TrackPublishedResponse,
    TrackUnpublishedResponse,
    TrickleRequest,
    UpdateParticipantMetadata,
    UpdateSubscription,
    UpdateTrackSettings
} from "@/components/live/protocol/tc_rtc_pb";
import log from "@/components/live/logger";
import {AsyncQueue} from "@/components/live/utils/AsyncQueue";
import {
    ClientInfo,
    DisconnectReason,
    ParticipantInfo,
    ReconnectReason,
    Room,
    SpeakerInfo,
    VideoLayer
} from "@/components/live/protocol/tc_models_pb";
import {getClientInfo, isReactNative, Mutex, sleep} from "@/components/live/room/utils";
import {ConnectionError, ConnectionErrorReason} from "@/components/live/room/errors";
import CriticalTimers from "@/components/live/timers";

interface ConnectOpts {
    autoSubscribe: boolean;

    reconnect?: boolean;

    reconnectReason?: number;

    sid?: string;

    /** @deprecated */
    publishOnly?: string;

    adaptiveStream?: boolean;
}

// 公共选项
export interface SignalOptions {
    autoSubscribe: boolean;
    /** @deprecated */
    publishOnly?: string;
    adaptiveStream?: boolean;
    maxRetries: number;
}

type SignalMessage = SignalRequest['message'];

type SignalKind = NonNullable<SignalMessage>['case'];

const passThroughQueueSignals: Array<SignalKind> = [
    'syncState',
    'trickle',
    'offer',
    'answer',
    'simulate',
    'leave',
];

function canPassThroughQueue(req: SignalMessage): boolean {
    const canPass = passThroughQueueSignals.indexOf(req!.case) >= 0;
    log.trace('request allowed to bypass queue:', {canPass, req});
    return canPass;
}

export class SignalClient {
    isConnected: boolean;

    isReconnecting: boolean;

    requestQueue: AsyncQueue;

    queuedRequests: Array<() => Promise<void>>;

    useJSON: boolean;

    /** 信号rtt（以毫秒为单位） */
    rtt: number = 0;

    /** 通过延迟消息来模拟信令延迟 */
    signalLatency?: number;

    onClose?: (reason: string) => void;

    onAnswer?: (sd: RTCSessionDescriptionInit) => void;

    onOffer?: (sd: RTCSessionDescriptionInit) => void;

    // 当有新的 ICE 候选者可用时
    onTrickle?: (sd: RTCIceCandidateInit, target: SignalTarget) => void;

    onParticipantUpdate?: (updates: ParticipantInfo[]) => void;

    onLocalTrackPublished?: (res: TrackPublishedResponse) => void;

    onNegotiateRequested?: () => void;

    onSpeakersChanged?: (res: SpeakerInfo[]) => void;

    onRemoteMuteChanged?: (trackSid: string, muted: boolean) => void;

    onRoomUpdate?: (room: Room) => void;

    onConnectionQuality?: (update: ConnectionQualityUpdate) => void;

    onStreamStateUpdate?: (update: StreamStateUpdate) => void;

    onSubscribedQualityUpdate?: (update: SubscribedQualityUpdate) => void;

    onSubscriptionPermissionUpdate?: (update: SubscriptionPermissionUpdate) => void;

    onSubscriptionError?: (update: SubscriptionResponse) => void;

    onLocalTrackUnpublished?: (res: TrackUnpublishedResponse) => void;

    onTokenRefresh?: (token: string) => void;

    onLeave?: (leave: LeaveRequest) => void;

    connectOptions?: ConnectOpts;

    ws?: WebSocket;

    private options?: SignalOptions;

    private pingTimeout: ReturnType<typeof setTimeout> | undefined;

    private pingTimeoutDuration: number | undefined;

    private pingIntervalDuration: number | undefined;

    private pingInterval: ReturnType<typeof setInterval> | undefined;

    private closingLock: Mutex;

    constructor(useJSON: boolean = false) {
        this.isConnected = false;
        this.isReconnecting = false;
        this.useJSON = useJSON;
        this.requestQueue = new AsyncQueue();
        this.queuedRequests = [];
        this.closingLock = new Mutex();
    }

    async join(
        url: string,
        token: string,
        opts: SignalOptions,
        abortSignal?: AbortSignal,
    ): Promise<JoinResponse> {
        // 在完全重新连接期间，即使当前已连接，我们也希望启动序列
        this.isConnected = false;
        this.options = opts;
        const res = await this.connect(url, token, opts, abortSignal);
        return res as JoinResponse;
    }

    async reconnect(
        url: string,
        token: string,
        sid?: string,
        reason?: ReconnectReason,
    ): Promise<ReconnectResponse | void> {
        if (!this.options) {
            log.warn('attempted to reconnect without signal options being set, ignoring');
            return;
        }
        this.isReconnecting = true;
        // 清除 ping 间隔并在重新连接后重新启动
        this.clearPingInterval();

        const res = await this.connect(url, token, {
            ...this.options,
            reconnect: true,
            sid,
            reconnectReason: reason,
        });
        return res;
    }

    connect(
        url: string,
        token: string,
        opts: ConnectOpts,
        abortSignal?: AbortSignal,
    ): Promise<JoinResponse | ReconnectResponse | void> {
        this.connectOptions = opts;
        if (url.startsWith('http')) {
            url = url.replace('http', 'ws');
        }
        // 去掉尾部斜杠
        url = url.replace(/\/$/, '');
        url += '/rtc';

        const clientInfo = getClientInfo();
        const params = createConnectionParams(token, clientInfo, opts);

        return new Promise<JoinResponse | ReconnectResponse | void>(async (resolve, reject) => {
            const abortHandler = async () => {
                this.close();
                reject(new ConnectionError('room connection has been cancelled (signal)'));
            };

            if (abortSignal?.aborted) {
                abortHandler();
            }
            abortSignal?.addEventListener('abort', abortHandler);
            log.debug(`connecting to ${url + params}`);
            if (this.ws) {
                await this.close();
            }
            this.ws = new WebSocket(url + params);
            this.ws.binaryType = 'arraybuffer';

            this.ws.onerror = async (ev: Event) => {
                if (!this.isConnected) {
                    try {
                        const resp = await fetch(`http${url.substring(2)}/validate${params}`);
                        if (resp.status.toFixed(0).startsWith('4')) {
                            const msg = await resp.text();
                            reject(new ConnectionError(msg, ConnectionErrorReason.NotAllowed, resp.status));
                        } else {
                            reject(
                                new ConnectionError(
                                    'Internal error',
                                    ConnectionErrorReason.InternalError,
                                    resp.status,
                                ),
                            );
                        }
                    } catch (e) {
                        reject(
                            new ConnectionError(
                                'server was not reachable',
                                ConnectionErrorReason.ServerUnreachable,
                            ),
                        );
                    }
                    return;
                }
                // 其他错误，处理
                this.handleWSError(ev);
            };

            // onmessage
            this.ws.onmessage = async (ev: MessageEvent) => {
                // 在收到 JoinResponse 之前不认为已连接
                let resp: SignalResponse;
                if (typeof ev.data === 'string') {
                    const json = JSON.parse(ev.data);
                    resp = SignalResponse.fromJson(json);
                } else if (ev.data instanceof ArrayBuffer) {
                    resp = SignalResponse.fromBinary(new Uint8Array(ev.data));
                } else {
                    log.error(`could not decode websocket message: ${typeof ev.data}`);
                    return;
                }

                if (!this.isConnected) {
                    let shouldProcessMessage = false;
                    // 只处理连接消息
                    if (resp.message?.case === 'join') {
                        this.isConnected = true;
                        abortSignal?.removeEventListener('abort', abortHandler);
                        this.pingTimeoutDuration = resp.message.value.pingTimeout;
                        this.pingIntervalDuration = resp.message.value.pingInterval;

                        if (this.pingTimeoutDuration && this.pingTimeoutDuration > 0) {
                            log.debug('ping config', {
                                timeout: this.pingTimeoutDuration,
                                interval: this.pingIntervalDuration,
                            });
                            this.startPingInterval();
                        }
                        resolve(resp.message.value);
                    } else if (opts.reconnect) {
                        // 在重新连接时，收到任何消息都意味着信号已重新连接
                        this.isConnected = true;
                        abortSignal?.removeEventListener('abort', abortHandler);
                        this.startPingInterval();
                        if (resp.message?.case === 'reconnect') {
                            resolve(resp.message?.value);
                        } else {
                            resolve();
                            shouldProcessMessage = true;
                        }
                    } else if (!opts.reconnect) {
                        // 非重连情况，应该首先收到加入响应
                        reject(
                            new ConnectionError(
                                `did not receive join response, got ${resp.message?.case} instead`,
                            ),
                        );
                    }
                    if (!shouldProcessMessage) {
                        return;
                    }
                }

                if (this.signalLatency) {
                    await sleep(this.signalLatency);
                }
                this.handleSignalResponse(resp);
            };

            this.ws.onclose = (ev: CloseEvent) => {
                log.warn(`websocket closed`, {ev});
                this.handleOnClose(ev.reason);
            };
        });
    }

    async close() {
        const unlock = await this.closingLock.lock();
        try {
            this.isConnected = false;
            if (this.ws) {
                this.ws.onclose = null;
                this.ws.onmessage = null;
                this.ws.onopen = null;

                // 调用 `ws.close()` 仅开始关闭握手（CLOSING 状态），最好等到状态实际 CLOSED
                const closePromise = new Promise((resolve) => {
                    if (this.ws) {
                        this.ws.onclose = resolve;
                    } else {
                        resolve(true);
                    }
                });

                if (this.ws.readyState < this.ws.CLOSING) {
                    this.ws.close();
                    // 250ms 宽限期，让 ws 优雅关闭
                    await Promise.race([closePromise, sleep(250)]);
                }
                this.ws = undefined;
                this.clearPingInterval();
            }
        } finally {
            unlock();
        }
    }

    // 加入后的初始offer
    sendOffer(offer: RTCSessionDescriptionInit) {
        log.debug('sending offer', offer);
        this.sendRequest({
            case: 'offer',
            value: toProtoSessionDescription(offer),
        });
    }

    // 应答服务器发起的报价
    sendAnswer(answer: RTCSessionDescriptionInit) {
        log.debug('sending answer');
        return this.sendRequest({
            case: "answer",
            value: toProtoSessionDescription(answer),
        });
    }

    sendIceCandidate(candidate: RTCIceCandidateInit, target: SignalTarget) {
        log.trace('sending ice candidate', candidate);
        return this.sendRequest({
            case: "trickle",
            value: TrickleRequest.fromJson({
                candidateInit: JSON.stringify(candidate),
                target: target,
            }),
        });
    }

    sendMuteTrack(trackSid: string, muted: boolean) {
        return this.sendRequest({
            case: 'mute',
            value: MuteTrackRequest.fromJson({
                sid: trackSid,
                muted,
            }),
        })
    }

    sendAddTrack(req: AddTrackRequest) {
        return this.sendRequest({
            case: 'addTrack',
            value: req,
        })
    }

    sendUpdateLocalMetadata(metadata: string, name: string) {
        return this.sendRequest({
            case: 'updateMetadata',
            value: UpdateParticipantMetadata.fromJson({
                metadata,
                name,
            })
        });
    }

    sendUpdateTrackSettings(settings: UpdateTrackSettings) {
        this.sendRequest({
            case: "trackSetting",
            value: settings,
        })
    }

    sendUpdateSubscription(sub: UpdateSubscription) {
        return this.sendRequest({
            case: "subscription",
            value: sub,
        });
    }

    sendSyncState(sync: SyncState) {
        return this.sendRequest({
            case: "syncState",
            value: sync,
        })
    }

    sendUpdateVideoLayers(trackSid: string, layers: VideoLayer[]) {
        return this.sendRequest({
            case: "updateLayers",
            value: {
                trackSid: trackSid,
                layers: layers,
            },
        });
    }

    sendUpdateSubscriptionPermission(allParticipants: boolean, trackPermissions: TrackPermission[]) {
        return this.sendRequest({
            case: "subscriptionPermission",
            value: {
                allParticipants,
                trackPermissions,
            },
        });
    }

    sendSimulateScenario(scenario: SimulateScenario) {
        return this.sendRequest({
            case: "simulate",
            value: scenario,
        })
    }

    sendPing() {
        /** 发送 ping 和 pingReq 以兼容新旧服务器 */
        return Promise.all([
            this.sendRequest({
                case: "ping",
                value: Date.now(),
            }),
            this.sendRequest({
                case: "pingReq",
                value: {
                    timestamp: Date.now(),
                    rtt: this.rtt,
                },
            }),
        ]);
    }

    sendLeave() {
        return this.sendRequest({
            case: "leave",
            value: {
                canReconnect: false,
                reason: DisconnectReason.CLIENT_INITIATED,
            },
        });
    }

    async sendRequest(message: SignalMessage, fromQueue: boolean = false) {
        // 重新连接时捕获所有请求并将它们放入队列中，
        // 除非请求来自队列，然后不再入队
        const canQueue = !fromQueue && !canPassThroughQueue(message);
        if (canQueue && this.isReconnecting) {
            this.queuedRequests.push(async () => {
                await this.sendRequest(message, true);
            });
            return;
        }
        // 确保先前排队的请求首先被发送
        if (!fromQueue) {
            await this.requestQueue.flush();
        }
        if (this.signalLatency) {
            await sleep(this.signalLatency);
        }
        if (!this.ws || this.ws.readyState !== this.ws.OPEN) {
            log.error(`cannot send signal request before connected, type: ${message?.case}`);
            return;
        }

        const req = {
            message,
        };
        try {
            if (this.useJSON) {
                this.ws.send(JSON.stringify(req.toString()))
            } else {
                this.ws.send(req.toString());
            }
        } catch (e) {
            log.error('error sending signal message', {error: e});
        }
    }


    private handleSignalResponse(res: SignalResponse) {
        const msg = res.message;
        if (msg === undefined) {
            log.debug('received unsupported message');
            return;
        }
        if (msg.case === 'answer') {
            const sd = fromProtoSessionDescription(msg.value);
            if (this.onAnswer) {
                this.onAnswer(sd);
            }
        } else if (msg.case === 'offer') {
            const sd = fromProtoSessionDescription(msg.value);
            if (this.onOffer) {
                this.onOffer(sd);
            }
        } else if (msg.case === 'trickle') {
            const candidate: RTCIceCandidateInit = JSON.parse(msg.value.candidateInit!);
            if (this.onTrickle) {
                this.onTrickle(candidate, msg.value.target);
            }
        } else if (msg.case === 'update') {
            if (this.onParticipantUpdate) {
                this.onParticipantUpdate(msg.value.participants ?? []);
            }
        } else if (msg.case === 'trackPublished') {
            if (this.onLocalTrackPublished) {
                this.onLocalTrackPublished(msg.value);
            }
        } else if (msg.case === 'speakersChanged') {
            if (this.onSpeakersChanged) {
                this.onSpeakersChanged(msg.value.speakers ?? []);
            }
        } else if (msg.case === 'leave') {
            if (this.onLeave) {
                this.onLeave(msg.value);
            }
        } else if (msg.case === 'mute') {
            if (this.onRemoteMuteChanged) {
                this.onRemoteMuteChanged(msg.value.sid, msg.value.muted);
            }
        } else if (msg.case === 'roomUpdate') {
            if (this.onRoomUpdate && msg.value.room) {
                this.onRoomUpdate(msg.value.room);
            }
        } else if (msg.case === 'connectionQuality') {
            if (this.onConnectionQuality) {
                this.onConnectionQuality(msg.value);
            }
        } else if (msg.case === 'streamStateUpdate') {
            if (this.onStreamStateUpdate) {
                this.onStreamStateUpdate(msg.value);
            }
        } else if (msg.case === 'subscribedQualityUpdate') {
            if (this.onSubscribedQualityUpdate) {
                this.onSubscribedQualityUpdate(msg.value);
            }
        } else if (msg.case === 'refreshToken') {
            if (this.onTokenRefresh) {
                this.onTokenRefresh(msg.value);
            }
        } else if (msg.case === 'trackUnpublished') {
            if (this.onLocalTrackUnpublished) {
                this.onLocalTrackUnpublished(msg.value);
            }
        } else if (msg.case === 'subscriptionResponse') {
            if (this.onSubscriptionError) {
                this.onSubscriptionError(msg.value);
            }
        } else if (msg.case === 'pong') {
            this.resetPingTimeout();
        } else if (msg.case === 'pongResp') {
            this.rtt = Date.now() - Number(msg.value.lastPingTimestamp);
            this.resetPingTimeout();
        } else {
            log.debug('unsupported message', msg);
        }
    }

    setReconnected() {
        while (this.queuedRequests.length > 0) {
            const req = this.queuedRequests.shift();
            if (req) {
                this.requestQueue.run(req);
            }
        }
        this.isReconnecting = false;
    }

    private async handleOnClose(reason: string) {
        if (!this.isConnected) {
            return;
        }
        await this.close();
        log.debug(`websocket connection closed: ${reason}`);
        if (this.onClose) {
            this.onClose(reason);
        }
    }

    private handleWSError(ev: Event) {
        log.error('websocket error', ev);
    }

    /**
     * 重置 ping 超时并开始新的超时。
     * 收到pong消息后调用此方法
     */
    private resetPingTimeout() {
        this.clearPingTimeout();
        if (!this.pingTimeoutDuration) {
            log.warn('ping timeout duration not set');
            return;
        }
        this.pingTimeout = CriticalTimers.setTimeout(() => {
            log.warn(
                `ping timeout triggered. last pong received at: ${new Date(Date.now() - this.pingTimeoutDuration! * 1000).toUTCString()}`,
            );
            this.handleOnClose('ping timeout');
        }, this.pingTimeoutDuration * 1000);
    }

    /**
     * 清除 ping 超时（不启动新的超时）
     */
    private clearPingTimeout() {
        if (this.pingTimeout) {
            CriticalTimers.clearTimeout(this.pingTimeout);
        }
    }

    private startPingInterval() {
        this.clearPingInterval();
        this.resetPingTimeout();
        if (!this.pingIntervalDuration) {
            log.warn('ping interval duration not set');
            return;
        }
        log.debug('start ping interval');
        this.pingInterval = CriticalTimers.setInternal(() => {
            this.sendPing();
        }, this.pingIntervalDuration * 1000)
    }

    private clearPingInterval() {
        log.debug('clearing ping interval');
        this.clearPingTimeout();
        if (this.pingInterval) {
            CriticalTimers.clearInterval(this.pingInterval);
        }
    }
}

function fromProtoSessionDescription(sd: SessionDescription): RTCSessionDescriptionInit {
    const rsd: RTCSessionDescriptionInit = {
        type: 'offer',
        sdp: sd.sdp,
    };
    switch (sd.type) {
        case 'answer':
        case 'offer':
        case 'pranswer':
        case 'rollback':
            rsd.type = sd.type;
            break;
        default:
            break;
    }
    return rsd;
}

export function toProtoSessionDescription(
    rsd: RTCSessionDescription | RTCSessionDescriptionInit,
): SessionDescription {
    const sd: SessionDescription = {
        sdp: rsd.sdp!,
        type: rsd.type!,
    };
    return sd;
}

function createConnectionParams(token: string, info: ClientInfo, opts: ConnectOpts): string {
    const params = new URLSearchParams();
    params.set('access_token', token);

    // opts
    if (opts.reconnect) {
        params.set('reconnect', '1');
        if (opts.sid) {
            params.set('sid', opts.sid);
        }
    }

    params.set('auto_subscribe', opts.autoSubscribe ? '1' : '0');

    // ClientInfo
    params.set('sdk', isReactNative() ? 'reactnative' : 'js');
    params.set('version', info.version!);
    params.set('protocol', info.protocol!.toString());
    if (info.deviceModel) {
        params.set('device_model', info.deviceModel);
    }
    if (info.os) {
        params.set('os', info.os);
    }
    if (info.osVersion) {
        params.set('os_version', info.osVersion);
    }
    if (info.browser) {
        params.set('browser', info.browser);
    }
    if (info.browserVersion) {
        params.set('browser_version', info.browserVersion);
    }
    if (opts.publishOnly !== undefined) {
        params.set('publish', opts.publishOnly);
    }
    if (opts.adaptiveStream) {
        params.set('adaptive_stream', '1');
    }
    if (opts.reconnectReason) {
        params.set('reconnect_reason', opts.reconnectReason.toString());
    }
    // @ts-ignore
    if (navigator.connection?.type) {
        // @ts-ignore
        params.set('network', navigator.connect.type);
    }

    return `?${params.toString()}`;
}