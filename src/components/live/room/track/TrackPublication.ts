import {Track} from "@/components/live/room/track/Track";
import {UpdateSubscription, UpdateTrackSettings} from "@/components/live/protocol/tc_rtc_pb";
import RemoteTrack from "@/components/live/room/track/RemoteTrack";
import {Encryption_Type, SubscriptionError, TrackInfo} from "@/components/live/protocol/tc_models_pb";
import {EventEmitter} from "events";
import TypedEventEmitter from "typed-emitter";
import LocalAudioTrack from "@/components/live/room/track/LocalAudioTrack";
import RemoteAudioTrack from "@/components/live/room/track/RemoteAudioTrack";
import LocalVideoTrack from "@/components/live/room/track/LocalVideoTrack";
import RemoteVideoTrack from "@/components/live/room/track/RemoteVideoTrack";
import log, {LoggerNames} from "@/components/live/logger";
import {LoggerOptions} from "@/components/live/room/types";
import { TrackEvent } from '@/components/live/room/LiveEvents';
import {getLogger} from "loglevel";
import {getLogContextFromTrack} from "@/components/live/room/track/utils";

export class TrackPublication extends (EventEmitter as new () => TypedEventEmitter<PublicationEventCallbacks>) {
    kind: Track.Kind;

    trackName: string;

    trackSid: Track.SID;

    track?: Track;

    source: Track.Source;

    /**
     * 已发布曲目的 MimeType
     */
    mimeType?: string;

    /**
     * 原始发布流的尺寸，仅限视频
     */
    dimensions?: Track.Dimensions;

    /**
     * true 如果曲目被同时广播到服务器，仅限视频
     */
    simulcasted?: boolean;

    trackInfo?: TrackInfo;

    protected metadataMuted: boolean = false;

    protected encryption: Encryption_Type = Encryption_Type.NONE;

    protected log = log;

    private loggerContextCb?: LoggerOptions['loggerContextCb'];

    constructor(kind: Track.Kind, id: string, name: string, loggerOptions?: LoggerOptions) {
        super();
        this.log = getLogger(loggerOptions?.loggerName ?? LoggerNames.Publication);
        this.loggerContextCb = this.loggerContextCb;
        this.setMaxListeners(100);
        this.kind = kind;
        this.trackSid = id;
        this.trackName = name;
        this.source = Track.Source.Unknown;
    }

    setTrack(track?: Track) {
        if (this.track) {
            // 移除订阅
            this.track.off(TrackEvent.Muted, this.handleMuted);
            this.track.off(TrackEvent.Unmuted, this.handleUnmuted);
        }

        this.track = track;

        if (track) {
            // 转发事件
            track.on(TrackEvent.Muted, this.handleMuted);
            track.on(TrackEvent.Unmuted, this.handleUnmuted);
        }
    }

    protected get logContext() {
        return {
            ...this.loggerContextCb?.(),
            ...getLogContextFromTrack(this),
        };
    }

    get isMuted(): boolean {
        return this.metadataMuted;
    }

    get isEnabled(): boolean {
        return true;
    }

    get isSubscribed(): boolean {
        return this.track !== undefined;
    }

    get isEncrypted(): boolean {
        return this.encryption !== Encryption_Type.NONE;
    }

    /**
     * 如果该发布包含音轨，则为 [AudioTrack]
     */
    get audioTrack(): LocalAudioTrack | RemoteAudioTrack | undefined {
        if (this.track instanceof LocalAudioTrack || this.track instanceof RemoteAudioTrack) {
            return this.track;
        }
    }

    /**
     * 如果该发布包含视频轨道，则为 [VideoTrack]
     */
    get videoTrack(): LocalVideoTrack | RemoteVideoTrack | undefined {
        if (this.track instanceof LocalVideoTrack || this.track instanceof RemoteVideoTrack) {
            return this.track;
        }
    }

    handleMuted = () => {
        this.emit(TrackEvent.Muted);
    };

    handleUnmuted = () => {
        this.emit(TrackEvent.Unmuted);
    };

    /** @internal */
    updateInfo(info: TrackInfo) {
        this.trackSid = info.sid;
        this.trackName = info.name;
        this.source = Track.sourceFromProto(info.source);
        this.mimeType = info.mimeType;
        if (this.kind === Track.Kind.Video && info.width > 0) {
            this.dimensions = {
                width: info.width,
                height: info.height,
            };
            this.simulcasted = info.simulcast;
        }
        this.encryption = info.encryption;
        this.trackInfo = info;
        this.log.debug('update publication info', {...this.logContext, info});
    }
}

export namespace TrackPublication {
    export enum SubscriptionStatus {
        Desired = 'desired',
        Subscribed = 'subscribed',
        Unsubscribed = 'unsubscribed',
    }

    export enum PermissionStatus {
        Allowed = 'allowed',
        NotAllowed = 'not_allowed',
    }
}

export type PublicationEventCallbacks = {
    muted: () => void;
    unmuted: () => void;
    ended: (track?: Track) => void;
    updateSettings: (settings: UpdateTrackSettings) => void;
    subscriptionPermissionChanged: (
        status: TrackPublication.PermissionStatus,
        prevStatus: TrackPublication.PermissionStatus,
    ) => void;
    updateSubscription: (sub: UpdateSubscription) => void;
    subscribed: (track: RemoteTrack) => void;
    unsubscribed: (track: RemoteTrack) => void;
    subscriptionStatusChanged: (
        status: TrackPublication.SubscriptionStatus,
        prevStatus: TrackPublication.SubscriptionStatus,
    ) => void;
    subscriptionFailed: (error: SubscriptionError) => void;
};
