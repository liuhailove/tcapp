// 内部选项
import {
    AddTrackRequest,
    ConnectionQualityUpdate,
    JoinResponse,
    LeaveRequest,
    MuteTrackRequest, Ping,
    ReconnectResponse,
    SessionDescription,
    SignalRequest,
    SignalResponse,
    SignalTarget,
    SimulateScenario,
    StreamStateUpdate,
    SubscribedQualityUpdate, SubscriptionPermission,
    SubscriptionPermissionUpdate,
    SubscriptionResponse,
    SyncState,
    TrackPermission,
    TrackPublishedResponse,
    TrackUnpublishedResponse,
    TrickleRequest,
    UpdateParticipantMetadata,
    UpdateSubscription,
    UpdateTrackSettings, UpdateVideoLayers
} from "@/components/live/protocol/tc_rtc_pb";
import log, {LoggerNames} from "@/components/live/logger";
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
import {getClientInfo, isReactNative, Mutex, sleep, toWebsocketUrl} from "@/components/live/room/utils";
import {ConnectionError, ConnectionErrorReason} from "@/components/live/room/errors";
import CriticalTimers from "@/components/live/room/timers";
import {LoggerOptions} from "@/components/live/room/types";
import {getLogger} from "loglevel";
import {protoInt64} from "@bufbuild/protobuf";

interface ConnectOpts extends SignalOptions {
    autoSubscribe: boolean;

    reconnect?: boolean;

    reconnectReason?: number;

    sid?: string;
}

// 公共选项
export interface SignalOptions {
    /**
     * 自动订阅
     */
    autoSubscribe: boolean;
    /**
     * 自适应流
     */
    adaptiveStream?: boolean;
    /**
     * 最大重试次数
     */
    maxRetries: number;
    /**
     * e2ee enable
     */
    e2eeEnabled: boolean;
    /**
     * websocket超时时间
     */
    websocketTimeout: number;
}

type SignalMessage = SignalRequest['message'];

type SignalKind = NonNullable<SignalMessage>['case'];

const passThroughQueueSignals: Array<SignalKind> = [
    'syncState',
    'trickle',// 在建立对等连接时逐步收集和交换候选地址
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

export enum SignalConnectionState {
    CONNECTING,
    CONNECTED,
    RECONNECTING,
    DISCONNECTING,
    DISCONNECTED,
}

export class SignalClient {
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

    /**
     * 连接属性
     */
    connectOptions?: ConnectOpts;

    /**
     * websocket实例
     */
    ws?: WebSocket;

    /**
     * SignalOptions
     */
    private options?: SignalOptions;

    /**
     * ping超时时间
     * @private
     */
    private pingTimeout: ReturnType<typeof setTimeout> | undefined;


    private pingTimeoutDuration: number | undefined;

    /**
     * ping间隔
     * @private
     */
    private pingIntervalDuration: number | undefined;

    private pingInterval: ReturnType<typeof setInterval> | undefined;

    private closingLock: Mutex;

    /**
     * 连接状态
     */
    private state: SignalConnectionState = SignalConnectionState.DISCONNECTED;

    /**
     * 连接锁
     * @private
     */
    private connectionLock: Mutex;

    /**
     * 日志
     * @private
     */
    private log = log;

    private loggerContextCb?: LoggerOptions['loggerContextCb'];

    get currentState() {
        return this.state;
    }

    get isDisconnected() {
        return (
            this.state === SignalConnectionState.DISCONNECTING ||
            this.state === SignalConnectionState.DISCONNECTED
        );
    }

    private get isEstablishingConnection() {
        return (
            this.state === SignalConnectionState.CONNECTING ||
            this.state === SignalConnectionState.RECONNECTING
        );
    }

    constructor(useJSON: boolean = false, loggerOptions: LoggerOptions = {}) {
        this.log = getLogger(loggerOptions.loggerName ?? LoggerNames.Signal);
        this.loggerContextCb = loggerOptions.loggerContextCb;
        this.useJSON = useJSON;
        this.requestQueue = new AsyncQueue();
        this.queuedRequests = [];
        this.closingLock = new Mutex();
        this.connectionLock = new Mutex();
        this.state = SignalConnectionState.DISCONNECTED;
    }

    private get logContext() {
        return this.loggerContextCb?.() ?? {};
    }

    async join(
        url: string,
        token: string,
        opts: SignalOptions,
        abortSignal?: AbortSignal,
    ): Promise<JoinResponse> {
        // 在完全重新连接期间，即使当前已连接，我们也希望启动序列
        this.state = SignalConnectionState.CONNECTING;
        this.options = opts;
        const res = await this.connect(url, token, opts, abortSignal);
        this.log.info(
            'joinResp',
            {...this.logContext, res}
        );
        console.info("joinResp");
        return res as JoinResponse;
    }

    async reconnect(
        url: string,
        token: string,
        sid?: string,
        reason?: ReconnectReason,
    ): Promise<ReconnectResponse | undefined> {
        if (!this.options) {
            this.log.warn(
                'attempted to reconnect without signal options being set, ignoring',
                this.logContext,
            );
            return;
        }
        this.state = SignalConnectionState.RECONNECTING;
        // 清除 ping 间隔并在重新连接后重新启动
        this.clearPingInterval();

        return await this.connect(url, token, {
            ...this.options,
            reconnect: true,
            sid,
            reconnectReason: reason,
        });
    }

    connect(
        url: string,
        token: string,
        opts: ConnectOpts,
        abortSignal?: AbortSignal,
    ): Promise<JoinResponse | ReconnectResponse | undefined> {
        this.connectOptions = opts;
        url = toWebsocketUrl(url);
        // 去掉尾部斜杠
        url = url.replace(/\/$/, '');
        url += '/rtc';

        const clientInfo = getClientInfo();
        const params = createConnectionParams(token, clientInfo, opts);

        return new Promise<JoinResponse | ReconnectResponse | undefined>(async (resolve, reject) => {

            const unlock = await this.connectionLock.lock();
            try {
                const abortHandler = async () => {
                    this.close();
                    clearTimeout(wsTimeout);
                    reject(new ConnectionError('room connection has been cancelled (signal)'));
                };

                const wsTimeout = setTimeout(() => {
                    this.close();
                    reject(new ConnectionError('room connection has timed out (signal)'));
                }, opts.websocketTimeout);

                if (abortSignal?.aborted) {
                    abortHandler();
                }

                abortSignal?.addEventListener('abort', abortHandler);
                this.log.debug(`connecting to ${url + params}`, this.logContext);
                if (this.ws) {
                    await this.close();
                }
                this.ws = new WebSocket(url + params);
                this.ws.binaryType = 'arraybuffer';

                this.ws.onopen = () => {
                    clearTimeout(wsTimeout);
                };

                this.ws.onerror = async (ev: Event) => {
                    if (this.state !== SignalConnectionState.CONNECTED) {
                        this.state = SignalConnectionState.DISCONNECTED;
                        clearTimeout(wsTimeout);
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
                    this.log.warn(`wsonmessage ${ev}`, this.logContext);
                    // 在收到 JoinResponse 之前不认为已连接
                    let resp: SignalResponse;
                    if (typeof ev.data === 'string') {
                        const json = JSON.parse(ev.data);
                        resp = SignalResponse.fromJson(json, {ignoreUnknownFields: true});
                    } else if (ev.data instanceof ArrayBuffer) {
                        resp = SignalResponse.fromBinary(new Uint8Array(ev.data));
                    } else {
                        this.log.error(
                            `could not decode websocket message: ${typeof ev.data}`,
                            this.logContext,
                        );
                        return;
                    }

                    this.log.warn(`wsonmessage resp ${resp.toJsonString()}`, this.logContext);
                    this.log.warn(`wsonmessage state ${this.state}`, this.logContext);

                    if (this.state !== SignalConnectionState.CONNECTED) {
                        let shouldProcessMessage = false;
                        this.log.warn(`wsonmessage case ${resp.message?.case}`, this.logContext);

                        // 只处理连接消息
                        if (resp.message?.case === 'join') {
                            this.state = SignalConnectionState.CONNECTED;
                            abortSignal?.removeEventListener('abort', abortHandler);
                            this.pingTimeoutDuration = resp.message.value.pingTimeout;
                            this.pingIntervalDuration = resp.message.value.pingInterval;

                            if (this.pingTimeoutDuration && this.pingTimeoutDuration > 0) {
                                this.log.debug('ping config', {
                                    ...this.logContext,
                                    timeout: this.pingTimeoutDuration,
                                    interval: this.pingIntervalDuration,
                                });
                                this.startPingInterval();
                            }
                            resolve(resp.message.value);
                        } else if (this.state === SignalConnectionState.RECONNECTING &&
                            resp.message.case !== 'leave'
                        ) {
                            // 在重新连接时，收到任何消息都意味着信号已重新连接
                            this.state = SignalConnectionState.CONNECTED;
                            abortSignal?.removeEventListener('abort', abortHandler);
                            this.startPingInterval();
                            if (resp.message?.case === 'reconnect') {
                                resolve(resp.message?.value);
                            } else {
                                this.log.debug(
                                    'declaring signal reconnected without reconnect response received',
                                    this.logContext,
                                );
                                resolve();
                                shouldProcessMessage = true;
                            }
                        } else if (this.isEstablishingConnection && resp.message.case === 'leave') {
                            reject(
                                new ConnectionError(
                                    'Received leave request while trying to (re)connect',
                                    ConnectionErrorReason.LeaveRequest,
                                ),
                            );
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
                    if (this.isEstablishingConnection) {
                        reject(new ConnectionError('Websocket got closed during a (re)connection attempt'));
                    }

                    this.log.warn(`websocket closed`, {
                        ...this.logContext,
                        reason: ev.reason,
                        code: ev.code,
                        wasClean: ev.wasClean,
                        state: this.state,
                    });
                    this.handleOnClose(ev.reason);
                };

            } finally {
                unlock();
            }
        });
    }

    resetCallbacks = () => {
        this.onAnswer = undefined;
        this.onLeave = undefined;
        this.onLocalTrackPublished = undefined;
        this.onLocalTrackUnpublished = undefined;
        this.onNegotiateRequested = undefined;
        this.onOffer = undefined;
        this.onRemoteMuteChanged = undefined;
        this.onSubscribedQualityUpdate = undefined;
        this.onTokenRefresh = undefined;
        this.onTrickle = undefined;
        this.onClose = undefined;
    }

    async close(updateState: boolean = true) {
        const unlock = await this.closingLock.lock();
        try {
            if (updateState) {
                this.state = SignalConnectionState.DISCONNECTING;
            }
            if (this.ws) {
                this.ws.onclose = null;
                this.ws.onmessage = null;
                this.ws.onopen = null;

                // 调用 `ws.close()` 仅开始关闭握手（CLOSING 状态），最好等到状态实际 CLOSED
                const closePromise = new Promise((resolve) => {
                    if (this.ws) {
                        this.ws.onclose = () => {
                            resolve();
                        };
                    } else {
                        resolve();
                    }
                });

                if (this.ws.readyState < this.ws.CLOSING) {
                    this.ws.close();
                    // 250ms 宽限期，让 ws 优雅关闭
                    await Promise.race([closePromise, sleep(250)]);
                }
                this.ws = undefined;
            }
        } finally {
            if (updateState) {
                this.state = SignalConnectionState.DISCONNECTED;
            }
            this.clearPingInterval();
            unlock();
        }
    }

    // 加入后的初始offer
    sendOffer(offer: RTCSessionDescriptionInit) {
        this.log.debug('sending offer', {...this.logContext, offerSdp: offer.sdp});
        this.sendRequest({
            case: 'offer',
            value: toProtoSessionDescription(offer),
        });
    }

    // 应答服务器发起的报价
    sendAnswer(answer: RTCSessionDescriptionInit) {
        this.log.debug('sending answer', {...this.logContext, answerSdp: answer.sdp});
        return this.sendRequest({
            case: "answer",
            value: toProtoSessionDescription(answer),
        });
    }

    sendIceCandidate(candidate: RTCIceCandidateInit, target: SignalTarget) {
        this.log.trace('sending ice candidate', {...this.logContext, candidate});
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
            value: new UpdateVideoLayers({
                trackSid: trackSid,
                layers: layers,
            }),
        });
    }

    sendUpdateSubscriptionPermission(allParticipants: boolean, trackPermissions: TrackPermission[]) {
        return this.sendRequest({
            case: "subscriptionPermission",
            value: new SubscriptionPermission({
                allParticipants,
                trackPermissions,
            }),
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
                value: protoInt64.parse(Date.now()),
            }),
            this.sendRequest({
                case: "pingReq",
                value: new Ping({
                    timestamp: protoInt64.parse(Date.now()),
                    rtt: protoInt64.parse(this.rtt),
                }),
            }),
        ]);
    }

    sendLeave() {
        return this.sendRequest({
            case: "leave",
            value: new LeaveRequest({
                canReconnect: false,
                reason: DisconnectReason.CLIENT_INITIATED,
            }),
        });
    }

    async sendRequest(message: SignalMessage, fromQueue: boolean = false) {
        // 重新连接时捕获所有请求并将它们放入队列中，
        // 除非请求来自队列，然后不再入队
        const canQueue = !fromQueue && !canPassThroughQueue(message);
        if (canQueue && this.state === SignalConnectionState.RECONNECTING) {
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
            this.log.error(
                `cannot send signal request before connected, type: ${message?.case}`,
                this.logContext,
            );
            return;
        }

        const req = new SignalRequest({message});
        try {
            if (this.useJSON) {
                this.ws.send(req.toJsonString());
            } else {
                this.ws.send(req.toBinary());
            }
        } catch (e) {
            this.log.error('error sending signal message', {...this.logContext, error: e});
        }
    }


    private handleSignalResponse(res: SignalResponse) {
        const msg = res.message;
        if (msg === undefined) {
            this.log.debug('received unsupported message', this.logContext);
            return;
        }

        let pingHandled = false;
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
            this.log.warn(`received trackPublished message ,callBacks ${this.onLocalTrackPublished}`, this.logContext);
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
        } else if (msg.case === 'subscriptionPermissionUpdate') {
            if (this.onSubscriptionPermissionUpdate) {
                this.onSubscriptionPermissionUpdate(msg.value);
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
            // this.log.info('pong message', {...this.logContext, msgCase: msg.case});
            // this.resetPingTimeout();
        } else if (msg.case === 'pongResp') {
            this.log.warn('pongResp message', {...this.logContext, msgCase: msg.case});
            this.rtt = Date.now() - Number.parseInt(msg.value.lastPingTimestamp.toString());
            this.resetPingTimeout();
            pingHandled = true;
        } else {
            this.log.debug('unsupported message', {...this.logContext, msgCase: msg.case});
        }

        if (!pingHandled) {
            this.log.warn('pingHandled message', {...this.logContext, msgCase: msg.case});
            this.resetPingTimeout();
        }
    }

    setReconnected() {
        while (this.queuedRequests.length > 0) {
            const req = this.queuedRequests.shift();
            if (req) {
                this.requestQueue.run(req);
            }
        }
    }

    public async handleOnClose(reason: string) {
        if (this.state === SignalConnectionState.DISCONNECTED) {
            return;
        }
        const onCloseCallback = this.onClose;
        await this.close();
        this.log.debug(`websocket connection closed: ${reason}`, {...this.logContext, reason});
        if (onCloseCallback) {
            onCloseCallback(reason);
        }
    }

    private handleWSError(ev: Event) {
        this.log.error('websocket error', {...this.logContext, error: ev});
    }

    /**
     * 重置 ping 超时并开始新的超时。
     * 收到pong消息后调用此方法
     */
    private resetPingTimeout() {
        this.log.warn('resetPingTimeout', {...this.logContext});
        this.clearPingTimeout();
        if (!this.pingTimeoutDuration) {
            this.log.warn('ping timeout duration not set', this.logContext);
            return;
        }
        this.pingTimeout = CriticalTimers.setTimeout(() => {
            this.log.warn(
                `ping timeout triggered. last pong received at: ${new Date(
                    Date.now() - this.pingTimeoutDuration! * 1000,
                ).toUTCString()}`,
                this.logContext,
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
        this.log.warn('startPingInterval', {...this.logContext});
        this.clearPingInterval();
        this.resetPingTimeout();
        if (!this.pingIntervalDuration) {
            this.log.warn('ping interval duration not set', this.logContext);
            return;
        }
        this.log.debug('start ping interval', this.logContext);
        this.pingInterval = CriticalTimers.setInternal(() => {
            this.sendPing();
        }, this.pingIntervalDuration * 1000)
    }

    private clearPingInterval() {
        this.log.debug('clearing ping interval', this.logContext);
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
    return new SessionDescription({
        sdp: rsd.sdp!,
        type: rsd.type!,
    });
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