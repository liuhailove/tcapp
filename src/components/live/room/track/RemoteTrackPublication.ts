import {TrackPublication} from "@/components/live/room/track/TrackPublication";
import RemoteTrack from "@/components/live/room/track/RemoteTrack";
import {SubscriptionError, TrackInfo, VideoQuality} from "@/components/live/protocol/tc_models_pb";
import {Track} from "@/components/live/room/track/Track";
import {UpdateSubscription, UpdateTrackSettings} from "@/components/live/protocol/tc_rtc_pb";
import {TrackEvent} from "@/components/live/room/LiveEvents";
import RemoteVideoTrack from "@/components/live/room/track/RemoteVideoTrack";
import log from "@/components/live/logger";

export default class RemoteTrackPublication extends TrackPublication {
    track?: RemoteTrack = undefined;

    protected allowed = true;

    // 跟踪客户端订阅曲目的愿望，如果 autoSubscribe 处于活动状态，也为 true
    protected subscribed?: boolean;

    protected disabled: boolean = false;

    protected currentVideoQuality?: VideoQuality = VideoQuality.HIGH;

    protected videoDimensions?: Track.Dimensions;

    protected fps?: number;

    protected subscriptionError?: SubscriptionError;

    constructor(kind: Track.Kind, ti: TrackInfo, autoSubscribe: boolean | undefined) {
        super(kind, ti.sid, ti.name);
        this.subscribed = autoSubscribe;
        this.updateInfo(ti);
    }

    /**
     * 订阅或取消订阅该远程曲目
     * @param subscribed true 表示订阅曲目， false 表示取消订阅
     */
    setSubscribed(subscribed: boolean) {
        const prevStatus = this.subscriptionStatus;
        const prevPermission = this.permissionStatus;
        this.subscribed = subscribed;
        // 当所需的订阅状态发生变化时重置允许的状态
        // 如果不允许，服务器会通过信号消息通知客户端
        if (subscribed) {
            this.allowed = true;
        }

        const sub: UpdateSubscription = {
            trackSids: [this.trackSid],
            subscribe: this.subscribed,
            participantTracks: [
                {
                    // 发送一个空的参与者 ID，因为 TrackPublication 不保留它
                    // 由接收该消息的参与者填写
                    participantSid: '',
                    trackSids: [this.trackSid],
                },
            ],
        };

        this.emit(TrackEvent.UpdateSubscription, sub);
        this.emitSubscriptionUpdateIfChanged(prevStatus);
        this.emitPermissionUpdateIfChanged(prevPermission);
    }

    get subscriptionStatus(): TrackPublication.SubscriptionStatus {
        if (this.subscribed === false) {
            return TrackPublication.SubscriptionStatus.Unsubscribed;
        }
        if (!super.isSubscribed) {
            return TrackPublication.SubscriptionStatus.Desired;
        }
        return TrackPublication.SubscriptionStatus.Subscribed;
    }

    get permissionStatus(): TrackPublication.PermissionStatus {
        return this.allowed
            ? TrackPublication.PermissionStatus.Allowed
            : TrackPublication.PermissionStatus.NotAllowed;
    }

    /**
     * 如果曲目已订阅并准备好播放，则返回 true
     */
    get isSubscribed(): boolean {
        if (this.subscribed === false) {
            return false;
        }
        return super.isSubscribed;
    }

    /**
     * 返回客户端订阅曲目的愿望，如果启用了自动订阅，则也为 true
     */
    get isDesired(): boolean {
        return this.subscribed !== false;
    }

    get isEnabled(): boolean {
        return !this.disabled;
    }

    /**
     * 禁止服务器发送该曲目的数据。 这在以下情况下很有用
     * 参与者不在屏幕上，您可以禁用流式传输他们的视频
     * 降低带宽要求
     * @param enabled
     */
    setEnabled(enabled: boolean) {
        if (!this.isManualOperationAllowed() || this.disabled === !enabled) {
            return;
        }
        this.disabled = !enabled;

        this.emitTrackUpdate();
    }

    /**
     * 对于支持联播的曲目，调整订阅质量
     *
     * 这表示客户可以接受的最高质量。 如果网络
     * 带宽不允许，服务器会自动降低质量至
     * 优化不间断视频
     */
    setVideoQuality(quality: VideoQuality) {
        if (!this.isManualOperationAllowed() || this.currentVideoQuality === quality) {
            return;
        }
        this.currentVideoQuality = quality;
        this.videoDimensions = undefined;

        this.emitTrackUpdate();
    }

    setVideoDimensions(dimensions: Track.Dimensions) {
        if (!this.isManualOperationAllowed()) {
            return;
        }
        if (
            this.videoDimensions?.width === dimensions.width &&
            this.videoDimensions?.height === dimensions.height
        ) {
            return;
        }
        this.currentVideoQuality = undefined;

        this.emitTrackUpdate();
    }

    setVideoFPS(fps: number) {
        if (!this.isManualOperationAllowed()) {
            return;
        }

        if (!(this.track instanceof RemoteVideoTrack)) {
            return;
        }

        if (this.fps === fps) {
            return;
        }

        this.fps = fps;
        this.emitTrackUpdate();
    }

    get videoQuality(): VideoQuality | undefined {
        return this.currentVideoQuality;
    }

    setTrack(track?: RemoteTrack) {
        const prevStatus = this.subscriptionStatus;
        const prevPermission = this.permissionStatus;
        const prevTrack = this.track;
        if (prevTrack === track) {
            return;
        }
        if (prevTrack) {
            // 取消监听
            prevTrack.off(TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange);
            prevTrack.off(TrackEvent.VisibilityChanged, this.handleVisibilityChange);
            prevTrack.off(TrackEvent.Ended, this.handleEnded);
            prevTrack.detach();
            prevTrack.stopMonitor();
            this.emit(TrackEvent.Unsubscribed, prevTrack);
        }
        super.setTrack(track);
        if (track) {
            track.sid = this.trackSid;
            track.on(TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange);
            track.on(TrackEvent.VisibilityChanged, this.handleVisibilityChange);
            track.on(TrackEvent.Ended, this.handleEnded);
            this.emit(TrackEvent.Subscribed, track);
        }
        this.emitPermissionUpdateIfChanged(prevPermission);
        this.emitSubscriptionUpdateIfChanged(prevStatus);
    }

    setAllowed(allowed: boolean) {
        const prevStatus = this.subscriptionStatus;
        const prevPermission = this.permissionStatus;
        this.allowed = allowed;
        this.emitPermissionUpdateIfChanged(prevPermission);
        this.emitSubscriptionUpdateIfChanged(prevStatus);
    }

    setSubscriptionError(error: SubscriptionError) {
        this.emit(TrackEvent.SubscriptionFailed, error);
    }

    updateInfo(info: TrackInfo) {
        super.updateInfo(info);
        const prevMetadataMuted = this.metadataMuted;
        this.metadataMuted = info.muted;
        if (this.track) {
            this.track.setMuted(info.muted);
        } else if (prevMetadataMuted !== info.muted) {
            this.emit(info.muted ? TrackEvent.Muted : TrackEvent.Unmuted);
        }
    }

    private emitSubscriptionUpdateIfChanged(previousStatus: TrackPublication.SubscriptionStatus) {
        const currentStatus = this.subscriptionStatus;
        if (previousStatus === currentStatus) {
            return;
        }
        this.emit(TrackEvent.SubscriptionStatusChanged, currentStatus, previousStatus);
    }

    private emitPermissionUpdateIfChanged(
        previousPermissionStatus: TrackPublication.PermissionStatus,
    ) {
        const currentPermissionStatus = this.permissionStatus;
        if (currentPermissionStatus != previousPermissionStatus) {
            this.emit(
                TrackEvent.SubscriptionPermissionChanged,
                this.permissionStatus,
                previousPermissionStatus,
            );
        }
    }

    private isManualOperationAllowed(): boolean {
        if (this.kind === Track.Kind.Video && this.isAdaptiveStream) {
            log.warn('adaptive stream is enabled, cannot change video track settings', {
                trackSid: this.trackSid,
            });
            return false;
        }
        if (!this.isDesired) {
            log.warn('cannot update track settings when not subscribed', {trackSid: this.trackSid});
            return false;
        }
        return true;
    }

    protected handleEnded = (track: RemoteTrack) => {
        this.setTrack(undefined);
        this.emit(TrackEvent.Ended, track);
    }

    protected get isAdaptiveStream(): boolean {
        return this.track instanceof RemoteVideoTrack && this.track.isAdaptiveStream;
    }

    protected handleVisibilityChange = (visible: boolean) => {
        log.debug(`adaptivestream video visibility ${this.trackSid}, visible=${visible}`, {
            trackSid: this.trackSid,
        });
        this.disabled = !visible;
        this.emitTrackUpdate();
    };

    protected handleVideoDimensionsChange = (dimensions: Track.Dimensions) => {
        log.debug(`adaptivestream video dimensions ${dimensions.width}x${dimensions.height}`, {
            trackSid: this.trackSid,
        });
        this.videoDimensions = dimensions;
        this.emitTrackUpdate();
    };

    emitTrackUpdate() {
        const settings: UpdateTrackSettings = UpdateTrackSettings.fromJson({
            trackSids: [this.trackSid],
            disabled: this.disabled,
            fps: this.fps,
        });
        if (this.videoDimensions) {
            settings.width = this.videoDimensions.width;
            settings.height = this.videoDimensions.height;
        } else if (this.currentVideoQuality !== undefined) {
            settings.quality = this.currentVideoQuality;
        } else {
            // 默认为高质量
            settings.quality = VideoQuality.HIGH;
        }

        this.emit(TrackEvent.UpdateSettings, settings);
    }
}
