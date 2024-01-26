import {Track} from "@/components/live/room/track/Track";
import {TrackEvent} from "@/components/live/room/LiveEvents";
import {monitorFrequency} from "@/components/live/room/stats";

export default abstract class RemoteTrack extends Track {
    receiver?: RTCRtpReceiver;

    constructor(
        mediaTrack: MediaStreamTrack,
        sid: string,
        kind: Track.Kind,
        receiver?: RTCRtpReceiver,
    ) {
        super(mediaTrack, kind);
        this.sid = sid;
        this.receiver = receiver;
    }

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
        stream.onremovetrack = () => {
            this.receiver = undefined;
            this._currentBitrate = 0;
            this.emit(TrackEvent.Ended, this);
        }
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

    startMonitor() {
        if (!this.monitorInterval) {
            this.monitorInterval = setInterval(() => this.monitorReceiver(), monitorFrequency);
        }
    }

    protected abstract monitorReceiver(): void;
}