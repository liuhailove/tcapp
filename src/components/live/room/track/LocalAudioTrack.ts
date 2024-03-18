import LocalTrack from "@/components/live/room/track/LocalTrack";
import {AudioSenderStats, computeBitrate, monitorFrequency} from "@/components/live/room/stats";
import {Track} from "@/components/live/room/track/Track";
import log from "@/components/live/logger";
import {AudioCaptureOptions} from "@/components/live/room/track/options";
import {isWeb, unwrapConstraint} from "@/components/live/room/utils";
import {TrackEvent} from "@/components/live/room/LiveEvents";
import {constraintsForOptions, detectSilence} from "@/components/live/room/track/utils";
import {LoggerOptions} from "@/components/live/room/types";
import {AudioProcessorOptions, TrackProcessor} from "@/components/live/room/track/processor/types";


export default class LocalAudioTrack extends LocalTrack<Track.Kind.Audio> {

    stopOnMute: boolean = false;

    private prevStats?: AudioSenderStats;

    protected processor?: TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> | undefined;

    /**
     *
     * @param 媒体Track
     * @param constraints 重新启动或重新获取轨道时使用的 MediaTrackConstraints
     * @param userProvidedTrack 向 SDK 发出信号，指示 mediaTrack 是否应由 SDK 在内部管理（即释放和重新获取）
     */
    constructor(
        mediaTrack: MediaStreamTrack,
        constraints?: MediaTrackConstraints,
        userProvidedTrack = true,
        audioContext?: AudioContext,
        loggerOptions?: LoggerOptions,
    ) {
        super(mediaTrack, Track.Kind.Audio, constraints, userProvidedTrack, loggerOptions);
        this.audioContext = audioContext;
        this.checkForSilence();
    }

    async setDeviceId(deviceId: ConstrainDOMString): Promise<boolean> {
        if (
            this._constraints.deviceId === deviceId &&
            this._mediaStreamTrack.getSettings().deviceId === unwrapConstraint(deviceId)
        ) {
            return true;
        }
        this._constraints.deviceId = deviceId;
        if (!this.isMuted) {
            await this.restartTrack();
        }
        return (
            this.isMuted || unwrapConstraint(deviceId) === this._mediaStreamTrack.getSettings().deviceId
        );
    }

    async mute(): Promise<LocalAudioTrack> {
        const unlock = await this.muteLock.lock();
        try {
            if (this.isMuted) {
                this.log.debug('Track already muted', this.logContext);
                return this;
            }

            // 禁用特殊处理，因为它将导致 BT 耳机切换通信模式
            if (this.source === Track.Source.Microphone && this.stopOnMute && !this.isUserProvided) {
                log.debug('stopping mic track');
                // 同时停止曲目，以便麦克风指示灯关闭
                this._mediaStreamTrack.stop();
            }
            await super.mute();
            return this;
        } finally {
            unlock();
        }
    }

    async unmute(): Promise<LocalAudioTrack> {
        const unlock = await this.muteLock.lock();
        try {
            if (!this.isMuted) {
                this.log.debug('Track already unmuted', this.logContext);
                return this;
            }

            const deviceHasChanged =
                this._constraints.deviceId &&
                this._mediaStreamTrack.getSettings().deviceId !==
                unwrapConstraint(this._constraints.deviceId);

            if (
                this.source === Track.Source.Microphone &&
                (this.stopOnMute || this._mediaStreamTrack.readyState === 'ended' || deviceHasChanged) &&
                !this.isUserProvided
            ) {
                this.log.debug('reacquiring mic track', this.logContext);
                await this.restartTrack();
            }
            await super.unmute();
            return this;
        } finally {
            unlock();
        }
    }

    async restartTrack(options?: AudioCaptureOptions) {
        let constraints: MediaTrackConstraints | undefined;
        if (options) {
            const streamConstraints = constraintsForOptions({audio: options});
            if (typeof streamConstraints.audio !== 'boolean') {
                constraints = streamConstraints.audio;
            }
        }
        await this.restart(constraints);
    }

    protected async restart(constraints?: MediaTrackConstraints): Promise<LocalTrack> {
        const track = await super.restart(constraints);
        this.checkForSilence();
        return track;
    }

    startMonitor() {
        if (!isWeb()) {
            return;
        }
        if (this.monitorInterval) {
            return;
        }
        this.monitorInterval = setInterval(() => {
            this.monitorSender();
        }, monitorFrequency);
    }

    protected monitorSender = async () => {
        if (!this.sender) {
            this._currentBitrate = 0;
            return;
        }

        let stats: AudioSenderStats | undefined;
        try {
            stats = await this.getSenderStats();
        } catch (e) {
            this.log.error('could not get audio sender stats', {...this.logContext, error: e});
            return;
        }

        if (stats && this.prevStats) {
            this._currentBitrate = computeBitrate(stats, this.prevStats);
        }

        this.prevStats = stats;
    };

    async setProcessor(processor: TrackProcessor<Track.Kind.Audio, AudioProcessorOptions>) {
        const unlock = await this.processorLock.lock();
        try {
            if (!this.audioContext) {
                throw Error(
                    'Audio context needs to be set on LocalAudioTrack in order to enable processors',
                );
            }
            if (this.processor) {
                await this.stopProcessor();
            }

            const processorOptions = {
                kind: this.kind,
                track: this._mediaStreamTrack,
                audioContext: this.audioContext,
            };
            this.log.debug(`setting up audio processor ${processor.name}`, this.logContext);

            await processor.init(processorOptions);
            this.processor = processor;
            if (this.processor.processedTrack) {
                await this.sender?.replaceTrack(this.processor.processedTrack);
            }
            this.emit(TrackEvent.TrackProcessorUpdate, this.processor);
        } finally {
            unlock();
        }
    }

    /**
     * @internal
     * @experimental
     */
    setAudioContext(audioContext: AudioContext | undefined) {
        this.audioContext = audioContext;
    }

    async getSenderStats(): Promise<AudioSenderStats | undefined> {
        if (!this.sender?.getStats) {
            return undefined;
        }

        const stats = await this.sender.getStats();
        let audioStats: AudioSenderStats | undefined;
        stats.forEach((v) => {
            if (v.type === 'outbound-rtp') {
                audioStats = {
                    type: 'audio',
                    streamId: v.id,
                    packetsSent: v.packetsSent,
                    packetsLost: v.packetsLost,
                    bytesSent: v.bytesSent,
                    timestamp: v.timestamp,
                    roundTripTime: v.roundTripTime,
                    jitter: v.jitter,
                };
            }
        });

        return audioStats;
    }

    async checkForSilence() {
        const trackIsSilent = await detectSilence(this);
        if (trackIsSilent) {
            if (!this.isMuted) {
                this.log.warn('silence detected on local audio track', this.logContext);
            }
            this.emit(TrackEvent.AudioSilenceDetected);
        }
        return trackIsSilent;
    }
}