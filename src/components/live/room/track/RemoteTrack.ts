import {Track} from "@/components/live/room/track/Track";
import {TrackEvent} from "@/components/live/room/LiveEvents";
import {monitorFrequency} from "@/components/live/room/stats";
import {LoggerOptions} from "@/components/live/room/types";

export default abstract class RemoteTrack<TrackKind extends Track.Kind = Track.Kind> extends Track<TrackKind> {
    receiver?: RTCRtpReceiver;

    constructor(
        mediaTrack: MediaStreamTrack,
        sid: string,
        kind: TrackKind,
        receiver?: RTCRtpReceiver,
        loggerOptions?: LoggerOptions,
    ) {
        super(mediaTrack, kind, loggerOptions);

        this.sid = sid;
        this.receiver = receiver;
    }

    /** @internal */
    setMuted(muted: boolean) {
        if (this.isMuted !== muted) {
            this.isMuted = muted;
            this._mediaStreamTrack.enabled = !muted;
            this.emit(muted ? TrackEvent.Muted : TrackEvent.Unmuted, this);
        }
    }

    setMediaStream(stream: MediaStream) {
        // 这需要确定曲目何时完成
        // 我们在自己的 MediaStream 中发送每个曲目，因此我们可以假设
        // 当前曲目是唯一可以删除的曲目。
        this.mediaStream = stream;
        const onRemoveTrack = (event: MediaStreamTrackEvent) => {
            if (event.track === this._mediaStreamTrack) {
                stream.removeEventListener('removetrack', onRemoveTrack);
                this.receiver = undefined;
                this._currentBitrate = 0;
                this.emit(TrackEvent.Ended, this);
            }
        };
        stream.addEventListener('removetrack', onRemoveTrack);
    }

    start() {
        this.startMonitor();
        // 使用 track 的 `enabled` 来启用收发器的重用
        super.enable();
    }

    stop() {
        this.stopMonitor();
        // 使用 track 的 `enabled` 来启用收发器的重用
        super.disable();
    }


    /**
     * Gets the RTCStatsReport for the RemoteTrack's underlying RTCRtpReceiver
     * See https://developer.mozilla.org/en-US/docs/Web/API/RTCStatsReport
     *
     * @returns Promise<RTCStatsReport> | undefined
     */
    async getRTCStatsReport(): Promise<RTCStatsReport | undefined> {
        if (!this.receiver?.getStats) {
            return;
        }
        return await this.receiver.getStats();
    }

    /* @internal */
    startMonitor() {
        if (!this.monitorInterval) {
            this.monitorInterval = setInterval(() => this.monitorReceiver(), monitorFrequency);
        }
    }

    protected abstract monitorReceiver(): void;
}
