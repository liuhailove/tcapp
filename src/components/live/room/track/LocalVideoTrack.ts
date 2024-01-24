import LocalTrack from "@/components/live/room/track/LocalTrack";
import { VideoLayer, VideoQuality} from "@/components/live/protocol/tc_models_pb";
import {SignalClient} from "@/components/live/api/SignalClient";
import {computeBitrate, monitorFrequency, VideoSenderStats} from "@/components/live/room/stats";
import {SubscribedCodec, SubscribedQuality} from "@/components/live/protocol/tc_rtc_pb";
import {isFireFox, isMobile, isWeb, Mutex} from "@/components/live/room/utils";
import {Track} from "@/components/live/room/track/Track";
import log from "@/components/live/logger";
import {VideoCaptureOptions, VideoCodec} from "@/components/live/room/track/options";
import {constraintsForOptions} from "@/components/live/room/track/utils";
import {ScalabilityMode} from "@/components/live/room/participant/publishUtils";

export class SimulcastTrackInfo {
    codec: VideoCodec;

    mediaStreamTrack: MediaStreamTrack;

    sender?: RTCRtpSender;

    encodings?: RTCRtpEncodingParameters[];

    constructor(codec: VideoCodec, mediaStreamTrack: MediaStreamTrack) {
        this.codec = codec;
        this.mediaStreamTrack = mediaStreamTrack;
    }
}

const refreshSubscribedCodecAfterNewCodec = 5000;


export default class LocalVideoTrack extends LocalTrack {

    signalClient?: SignalClient;

    private prevStats?: Map<string, VideoSenderStats>;

    private encodings?: RTCRtpEncodingParameters[];

    simulcastCodecs: Map<VideoCodec, SimulcastTrackInfo> = new Map<VideoCodec, SimulcastTrackInfo>();

    private subscribedCodecs?: SubscribedCodec[];

    // 防止并发操作来跟踪发件人
    // 如果同时调用多个 get/setParameter，则事件发生的特定时间
    // 可能会导致浏览器在 `setParameter` 中抛出异常，因为
    // 缺少 `getParameter` 调用
    private senderLock: Mutex;

    /**
     *
     * @param mediaTrack
     * @param constraints 重新启动或重新获取轨道时使用的 MediaTrackConstraints
     * @param userProvidedTrack 向 SDK 发出信号，指示 mediaTrack 是否应由 SDK 在内部管理（即释放和重新获取）
     */
    constructor(mediaTrack: MediaStreamTrack,
                constraints?: MediaTrackConstraints,
                userProvidedTrack = true) {
        super(mediaTrack, Track.Kind.Video, constraints, userProvidedTrack);
        this.senderLock = new Mutex();
    }

    get isSimulcast(): boolean {
        if (this.senderLock && this.sender.getParameters().encodings.length > 1) {
            return true;
        }
        return false;
    }


    startMonitor(signalClient?: SignalClient) {
        this.signalClient = signalClient;
        if (!isWeb()) {
            return;
        }

        // 保存原始编码
        // TODO : 合并联播跟踪统计数据
        const params = this.sender?.getParameters();
        if (params) {
            this.encodings = params.encodings;
        }

        if (this.monitorInterval) {
            return;
        }
        this.monitorInterval = setInterval(() => {
            this.monitorSender();
        }, monitorFrequency);
    }

    stop() {
        this._mediaStreamTrack.getConstraints();
        this.simulcastCodecs.forEach((trackInfo) => {
            trackInfo.mediaStreamTrack.stop();
        });
        super.stop();
    }

    async mute(): Promise<LocalVideoTrack> {
        const unlock = await this.muteLock.lock();
        try {
            if (this.source === Track.Source.Camera && !this.isUserProvided) {
                log.debug('stopping camera track');
                // 同时停止轨道，以便相机指示灯关闭
                this._mediaStreamTrack.stop();
            }
            await super.mute();
            return this;
        } finally {
            unlock();
        }
    }

    async unmute(): Promise<LocalVideoTrack> {
        const unlock = await this.muteLock.lock();
        try {
            if (this.source === Track.Source.Camera && !this.isUserProvided) {
                log.debug('reacquiring camera track');
                await this.restartTrack();
            }
            await super.unmuted();
        } finally {
            unlock();
        }
    }

    async getSenderStats(): Promise<VideoSenderStats[]> {
        if (!this.sender?.getStats) {
            return [];
        }

        const items: VideoSenderStats[] = [];

        const stats = await this.sender.getStats();
        stats.forEach((v) => {
            if (v.type === 'outbound-rtp') {
                const vs: VideoSenderStats = {
                    type: 'video',
                    streamId: v.id,
                    frameHeight: v.frameHeight,
                    frameWidth: v.frameWidth,
                    firCount: v.firCount,
                    pliCount: v.pliCount,
                    nackCount: v.nackCount,
                    packetsSent: v.packetsSent,
                    bytesSent: v.bytesSent,
                    framesSent: v.framesSent,
                    timestamp: v.timestamp,
                    rid: v.rid ?? v.id,
                    retransmittedPacketsSent: v.retransmittedPacketsSent,
                    qualityLimitationReason: v.qualityLimitationReason,
                    qualityLimitationResolutionChanges: v.qualityLimitationResolutionChanges,
                };

                // 找到适当的远程入站 rtp item
                const r = stats.get(v.remoteId);
                if (r) {
                    vs.jitter = r.jitter;
                    vs.packetsLost = r.packetsLost;
                    vs.roundTripTime = r.roundTripTime;
                }

                items.push(vs);
            }
        });

        return items;
    }

    setPublishingQuality(maxQuality: VideoQuality) {
        const qualities: SubscribedQuality[] = [];
        for (let q: VideoQuality.LOW; q <= VideoQuality.HIGH; q += 1) {
            qualities.push({
                quality: q,
                enabled: q <= maxQuality,
            });
        }
        log.debug(`setting publishing quality. max quality ${maxQuality}`);
        this.setPublishingLayers(qualities);
    }

    async setDeviceId(deviceId: ConstrainDOMString) {
        if (this.constraints.deviceId === deviceId) {
            return;
        }
        this.constraints.deviceId = deviceId;
        // 当视频静音时，底层媒体流轨道将停止并且
        // 稍后会重新启动
        if (!this.isMuted) {
            await this.restartTrack();
        }
    }

    async restartTrack(options?: VideoCaptureOptions) {
        let constraints: MediaTrackConstraints | undefined;
        if (options) {
            const streamConstraints = constraintsForOptions({video: options});
            if (typeof streamConstraints.video !== 'boolean') {
                constraints = streamConstraints.video;
            }
        }
        await this.restart(constraints);
    }

    addSimulcastTrack(codec: VideoCodec, encodings?: RTCRtpEncodingParameters[]): SimulcastTrackInfo {
        if (this.simulcastCodecs.has(codec)) {
            throw new Error(`${codec} already added`);
        }
        const simulcastCodecInfo: SimulcastTrackInfo = {
            codec,
            mediaStreamTrack: this.mediaStreamTrack.clone(),
            sender: undefined,
            encodings,
        };
        this.simulcastCodecs.set(codec, simulcastCodecInfo);
        return simulcastCodecInfo;
    }

    setSimulcastTrackSender(codec: VideoCodec, sender: RTCRtpSender) {
        const simulcastCodecInfo = this.simulcastCodecs.get(codec);
        if (!simulcastCodecInfo) {
            return;
        }
        simulcastCodecInfo.sender = sender;
        // 浏览器将在新编解码器发布后启用禁用的编解码器/层，
        // 因此在发布新编解码器后刷新订阅的编解码器
        setTimeout(() => {
            if (this.subscribedCodecs) {
                this.setPublishingCodecs(this.subscribedCodecs);
            }
        }, refreshSubscribedCodecAfterNewCodec);
    }

    /**
     * @内部的
     * 设置应该发布的编解码器
     */
    async setPublishingCodecs(codecs: SubscribedCodec[]): Promise<VideoCodec[]> {
        log.debug('setting publishing codecs', {
            codecs,
            currentCodec: this.codec,
        });
        // 仅启用已设置的首选项编解码器的联播编解码器
        if (!this.codec && codecs.length > 0) {
            await this.setPublishingLayers(codecs[0].qualities);
            return [];
        }

        this.subscribedCodecs = codecs;

        const newCodecs: VideoCodec[] = [];
        for await (const codec of codecs) {
            if (!this.codec || this.codec === codec.codec) {
                await this.setPublishingLayers(codec.qualities);
            } else {
                const simulcastCodecInfo = this.simulcastCodecs.get(codec.codec as VideoCodec);
                log.debug(`try setPublishing for ${codec.codec}`, simulcastCodecInfo);
                if (!simulcastCodecInfo || !simulcastCodecInfo.sender) {
                    for (const q of codec.qualities) {
                        if (q.enabled) {
                            newCodecs.push(codec.codec as VideoCodec);
                            break;
                        }
                    }
                } else if (simulcastCodecInfo.encodings) {
                    log.debug(`try setPublishingLayersForSender ${codec.codec}`);
                    await setPublishingLayersForSender(
                        simulcastCodecInfo.sender,
                        simulcastCodecInfo.encodings!,
                        codec.qualities,
                        this.senderLock,
                    );
                }
            }
        }
        return newCodecs;
    }

    /**
     * @内部的
     * 设置应该发布的图层
     */
    async setPublishingLayers(qualities: SubscribedQuality[]) {
        log.debug('setting publishing layers', qualities);
        if (!this.sender || !this.encodings) {
            return;
        }

        await setPublishingLayersForSender(this.sender, this.encodings, qualities, this.senderLock);
    }

    protected monitorSender = async () => {
        if (!this.sender) {
            this._currentBitrate = 0;
            return;
        }

        let stats: VideoSenderStats[] | undefined;
        try {
            stats = await this.getSenderStats();
        } catch (e) {
            log.error('could not get audio sender stats', {error: e});
            return;
        }
        const statsMap = new Map<string, VideoSenderStats>(stats.map((s) => [s.rid, s]));

        if (this.prevStats) {
            let totalBitrate = 0;
            statsMap.forEach((s, key) => {
                const prev = this.prevStats?.get(key);
                totalBitrate += computeBitrate(s, prev);
            });
            this._currentBitrate = totalBitrate;
        }

        this.prevStats = statsMap;
    };

    protected async handleAppVisibilityChanged() {
        await super.handleAppVisibilityChanged();
        if (!isMobile()) {
            return;
        }
        if (this.isInBackground && this.source == Track.Source.Camera) {
            this._mediaStreamTrack.enabled = false;
        }
    }
}

async function setPublishingLayersForSender(
    sender: RTCRtpSender,
    senderEncodings: RTCRtpEncodingParameters[],
    qualities: SubscribedQuality[],
    senderLock: Mutex
) {
    const unlock = await senderLock.lock();
    log.debug('setPublishingLayersForSender', {sender, qualities, senderEncodings});
    try {
        const params = sender.getParameters();
        const {encodings} = params;
        if (!encodings) {
            return;
        }

        if (encodings.length !== senderEncodings.length) {
            log.warn('cannot set publishing layers, encodings mismatch');
            return;
        }

        let hasChanged = false;

        /* 禁用可关闭的空间层，因为它与当前服务器/客户端存在视频模糊/冻结问题
             1. chrome 113：当切换到具有可扩展性模式更改的上层时，会生成
                   低分辨率帧，恢复速度非常快，但值得注意
             2. tc sfu：额外的 pli 请求导致视频冻结几帧，也很明显
        */
        const closableSpatial = false;
        /* @ts-ignore */
        if (closableSpatial && encodings[0].scalabilityMode) {
            // svc dynacast encodings
            const encoding = encodings[0];
            /* @ts-ignore */
            // const mode = new ScalabilityMode(encoding.scalabilityMode);
            let maxQuality = VideoQuality.OFF;
            qualities.forEach((q) => {
                if (q.enabled && (maxQuality === VideoQuality.OFF || q.quality > maxQuality)) {
                    maxQuality = q.quality;
                }
            });

            if (maxQuality === VideoQuality.OFF) {
                if (encoding.active) {
                    encoding.active = false;
                    hasChanged = true;
                }
            } else if (!encoding.active /* || mode.spatial !== maxQuality + 1*/) {
                hasChanged = true;
                encoding.active = true;
                /*
                @ts-ignore
                const originalMode = new ScalabilityMode(senderEncodings[0].scalabilityMode)
                mode.spatial = maxQuality + 1;
                mode.suffix = originalMode.suffix;
                if (mode.spatial === 1) {
                  // no suffix for L1Tx
                  mode.suffix = undefined;
                }
                @ts-ignore
                encoding.scalabilityMode = mode.toString();
                encoding.scaleResolutionDownBy = 2 ** (2 - maxQuality);
              */
            }
        } else {
            // simulcast dynacast encodings
            encodings.forEach((encoding, idx) => {
                let rid = encoding.rid ?? '';
                if (rid === '') {
                    rid = 'q';
                }
                const quality = videoQualityForRid(rid);
                const subscribedQuality = qualities.find((q) => q.quality === quality);
                if (!subscribedQuality) {
                    return;
                }
                if (encoding.active !== subscribedQuality.enabled) {
                    hasChanged = true;
                    encoding.active = subscribedQuality.enabled;
                    log.debug(`setting layer ${subscribedQuality.quality} to ${encoding.active ? 'enabled' : 'disabled'}`);
                }

                // FireFox不支持将encoding.active设置为false，所以我们
                // 有一个解决方法，将其比特率和分辨率降低到最小值。
                if (isFireFox()) {
                    if (subscribedQuality.enabled) {
                        encoding.scaleResolutionDownBy = senderEncodings[idx].scaleResolutionDownBy;
                        encoding.maxBitrate = senderEncodings[idx].maxBitrate;
                        /* @ts-ignore */
                        encoding.maxFramerate = senderEncodings[idx].maxFramerate;
                    } else {
                        encoding.scaleResolutionDownBy = 4;
                        encoding.maxFramerate = 10;
                        /* @ts-ignore */
                        encoding.maxFramerate = 2;
                    }
                }
            });
        }

        if (hasChanged) {
            params.encodings = encodings;
            log.debug(`setting encodings`, params.encodings);
            await sender.setParameters(params);
        }
    } finally {
        unlock();
    }
}

export function videoQualityForRid(rid: string): VideoQuality {
    switch (rid) {
        case 'f':
            return VideoQuality.HIGH;
        case 'h':
            return VideoQuality.MEDIUM;
        case 'q':
            return VideoQuality.LOW;
        default:
            return VideoQuality.UNRECOGNIZED
    }
}

export function videoLayersFromEncodings(
    width: number,
    height: number,
    encodings?: RTCRtpEncodingParameters[],
    svc?: boolean
): VideoLayer[] {
    // default to a single layer, HQ
    if (!encodings) {
        return [
            {
                quality: VideoQuality.HIGH,
                width,
                height,
                bitrate: 0,
                ssrc: 0,
            },
        ];
    }

    if (svc) {
        // svc layers
        /* @ts-ignore */
        const sm = new ScalabilityMode(encodings[0].scalabilityMode);
        const layers = [];
        for (let i = 0; i < sm.spatial; i += 1) {
            layers.push({
                quality: VideoQuality.HIGH - i,
                width: width / 2 ** i,
                height: height / 2 ** i,
                bitrate: encodings[0].maxBitrate ? encodings[0].maxBitrate / 3 ** i : 0,
                ssrc: 0,
            });
        }
        return layers;
    }

    return encodings.map((encoding) => {
        const scale = encoding.scaleResolutionDownBy ?? 1;
        let quality = videoQualityForRid(encoding.rid ?? '');
        if (quality === VideoQuality.UNRECOGNIZED && encodings.length === 1) {
            quality = VideoQuality.HIGH;
        }
        return {
            quality,
            width: width / scale,
            height: height / scale,
            bitrate: encoding.maxBitrate ?? 0,
            ssrc: 0,
        };
    });
}


