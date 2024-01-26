import LocalTrack from "@/components/live/room/track/LocalTrack";
import {AudioSenderStats, computeBitrate, monitorFrequency} from "@/components/live/room/stats";
import {Track} from "@/components/live/room/track/Track";
import log from "@/components/live/logger";
import {AudioCaptureOptions} from "@/components/live/room/track/options";
import {isWeb} from "@/components/live/room/utils";
import {TrackEvent} from "@/components/live/room/LiveEvents";
import {constraintsForOptions, detectSilence} from "@/components/live/room/track/utils";


export default class LocalAudioTrack extends LocalTrack {

    stopOnMute: boolean = false;

    private prevStats?: AudioSenderStats;

    /**
     *
     * @param 媒体Track
     * @param constraints 重新启动或重新获取轨道时使用的 MediaTrackConstraints
     * @param userProvidedTrack 向 SDK 发出信号，指示 mediaTrack 是否应由 SDK 在内部管理（即释放和重新获取）
     */
    constructor(
        mediaTrack: MediaStreamTrack,
        constraints?: MediaTrackConstraints,
        userProviderTrack = true,
    ) {
        super(mediaTrack, Track.Kind.Audio, constraints, userProviderTrack);
        this.checkForSilence();
    }

    async setDeviceId(deviceId: ConstrainDOMString) {
        if (this.constraints.deviceId === deviceId) {
            return;
        }
        this.constraints.deviceId = deviceId;
        if (!this.isMuted) {
            await this.restartTrack();
        }
    }

    async mute(): Promise<LocalAudioTrack> {
        const unlock = await this.muteLock.lock();
        try {
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
            if (
                this.source === Track.Source.Microphone &&
                (this.stopOnMute || this._mediaStreamTrack.readyState === 'ended') &&
                !this.isUserProvided
            ) {
                log.debug('reacquiring mic track');
                await this.restartTrack();
            }
            await super.unmuted();
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
            log.error('could not get audio sender stats', {error: e});
        }

        if (stats && this.prevStats) {
            this._currentBitrate = computeBitrate(stats, this.prevStats);
        }

        this.prevStats = stats;
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
                log.warn('silence detected on local audio track');
            }
            this.emit(TrackEvent.AudioSilenceDetected);
        }
        return trackIsSilent;
    }

}