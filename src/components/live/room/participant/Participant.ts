import {EventEmitter} from 'events';

import {
    ConnectionQuality as ProtoQuality,
    DataPacket_Kind, ParticipantInfo, ParticipantPermission,
    SubscriptionError
} from '@/components/live/protocol/tc_models_pb';
import TypedEmitter from "typed-emitter/rxjs";
import RemoteTrack from "@/components/live/room/track/RemoteTrack";
import {Track} from "@/components/live/room/track/Track";
import {TrackPublication} from "@/components/live/room/track/TrackPublication";
import RemoteTrackPublication from "@/components/live/room/track/RemoteTrackPublication";
import LocalTrackPublication from "@/components/live/room/track/LocalTrackPublication";
import log, {LoggerNames, StructuredLogger} from "@/components/live/logger";
import {ParticipantEvent, TrackEvent} from "@/components/live/room/LiveEvents";
import {LoggerOptions} from "@/components/live/room/types";
import {getLogger} from "loglevel";
import RemoteAudioTrack from "@/components/live/room/track/RemoteAudioTrack";
import LocalAudioTrack from "@/components/live/room/track/LocalAudioTrack";

export enum ConnectionQuality {
    Excellent = 'excellent',
    Good = 'good',
    Poor = 'poor',
    Unknown = 'unknown',
}

function qualityFromProto(q: ProtoQuality): ConnectionQuality {
    switch (q) {
        case ProtoQuality.EXCELLENT:
            return ConnectionQuality.Excellent;
        case ProtoQuality.GOOD:
            return ConnectionQuality.Good;
        case ProtoQuality.POOR:
            return ConnectionQuality.Poor;
        default:
            return ConnectionQuality.Unknown;
    }
}

export default class Participant extends (EventEmitter as new () => TypedEmitter<ParticipantEventCallbacks>) {
    protected participantInfo?: ParticipantInfo;

    audioTrackPublications: Map<string, TrackPublication>;

    videoTrackPublications: Map<string, TrackPublication>;

    /** map of track sid => all published tracks */
    trackPublications: Map<string, TrackPublication>;

    /** audio level between 0-1.0, 1 being loudest, 0 being softest */
    audioLevel: number = 0;

    /** if participant is currently speaking */
    isSpeaking: boolean = false;

    /** server assigned unique id */
    sid: string;

    /** client assigned identity, encoded in JWT token */
    identity: string;

    /** client assigned display name, encoded in JWT token */
    name?: string;

    /** client metadata, opaque to TcApp */
    metadata?: string;

    lastSpokeAt?: Date | undefined;

    permissions?: ParticipantPermission;

    private _connectionQuality: ConnectionQuality = ConnectionQuality.Unknown;

    protected audioContext?: AudioContext;

    protected log: StructuredLogger = log;

    protected loggerOptions?: LoggerOptions;

    protected get logContext() {
        return {
            ...this.loggerOptions?.loggerContextCb?.(),
            participantSid: this.sid,
            participantId: this.identity,
        };
    }

    get isEncrypted() {
        return (
            this.trackPublications.size > 0 &&
            // TODO
            Array.from(this.trackPublications.values()).every((tr) => {
                // TODO
                //tr.isEncrypted;
                return true;
            })
        );
    }

    constructor(sid: string, identity: string, name?: string, metadata?: string, loggerOptions?: LoggerOptions,) {
        super();

        this.log = getLogger(loggerOptions?.loggerName ?? LoggerNames.Participant);
        this.loggerOptions = loggerOptions;

        this.setMaxListeners(100);
        this.sid = sid;
        this.identity = identity;
        this.name = name;
        this.metadata = metadata;
        this.audioTrackPublications = new Map();
        this.videoTrackPublications = new Map();
        this.trackPublications = new Map();
    }

    getTrackPublications(): TrackPublication[] {
        return Array.from(this.trackPublications.values());
    }

    /**
     * Finds the first track that matches the source filter, for example, getting
     * the user's camera track with getTrackBySource(Track.Source.Camera).
     * @param source
     * @returns
     */
    getTrackPublication(source: Track.Source): TrackPublication | undefined {
        for (const [, pub] of this.trackPublications) {
            if (pub.source === source) {
                return pub;
            }
        }
    }

    /**
     * Finds the first track that matches the track's name.
     * @param name
     * @returns
     */
    getTrackPublicationByName(name: string): TrackPublication | undefined {
        for (const [, pub] of this.trackPublications) {
            if (pub.trackName === name) {
                return pub;
            }
        }
    }

    get connectionQuality(): ConnectionQuality {
        return this._connectionQuality;
    }

    get isCameraEnabled(): boolean {
        const track = this.getTrackPublication(Track.Source.Camera);
        return !(track?.isMuted ?? true);
    }

    get isMicrophoneEnabled(): boolean {
        const track = this.getTrackPublication(Track.Source.Microphone);
        return !(track?.isMuted ?? true);
    }

    get isScreenShareEnabled(): boolean {
        const track = this.getTrackPublication(Track.Source.ScreenShare);
        return !!track;
    }

    get isLocal(): boolean {
        return false;
    }

    /** when participant joined the room */
    get joinedAt(): Date | undefined {
        if (this.participantInfo) {
            return new Date(Number(this.participantInfo.joinedAt * 1000));
        }
        return new Date();
    }

    updateInfo(info: ParticipantInfo): boolean {
        // it's possible the update could be applied out of order due to await
        // during reconnect sequences. when that happens, it's possible for server
        // to have sent more recent version of participant info while JS is waiting
        // to process the existing payload.
        // when the participant sid remains the same, and we already have a later version
        // of the payload, they can be safely skipped
        if (
            this.participantInfo &&
            this.participantInfo.sid == info.sid &&
            this.participantInfo.version > info.version
        ) {
            return false;
        }

        this.identity = info.identity;
        this.sid = info.sid;
        this._setName(info.name);
        this._setMetadata(info.metadata);
        if (info.permission) {
            this.setPermissions(info.permission);
        }
        // set this last so setMetadata can detect changes
        this.participantInfo = info;
        this.log.trace('update participant info', {...this.logContext, info});
        return true;
    }

    /**
     * Updates metadata from server
     **/
    private _setMetadata(md: string) {
        const changed = this.metadata !== md;
        const prevMetadata = this.metadata;
        this.metadata = md;

        if (changed) {
            this.emit(ParticipantEvent.ParticipantMetadataChanged, prevMetadata);
        }
    }

    private _setName(name: string) {
        const changed = this.name !== name;
        this.name = name;

        if (changed) {
            this.emit(ParticipantEvent.ParticipantNameChanged, name);
        }
    }

    setPermissions(permissions: ParticipantPermission): boolean {
        const prevPermissions = this.permissions;
        const changed =
            permissions.canPublish !== this.permissions?.canPublish ||
            permissions.canSubscribe !== this.permissions?.canSubscribe ||
            permissions.canPublishData !== this.permissions?.canPublishData ||
            permissions.hidden !== this.permissions?.hidden ||
            permissions.recorder !== this.permissions?.recorder ||
            permissions.canPublishSources.length !== this.permissions.canPublishSources.length ||
            permissions.canPublishSources.some(
                (value, index) => value !== this.permissions?.canPublishSources[index],
            );
        this.permissions = permissions;

        if (changed) {
            this.emit(ParticipantEvent.ParticipantPermissionsChanged, prevPermissions);
        }
        return changed;
    }

    setIsSpeaking(speaking: boolean) {
        if (speaking === this.isSpeaking) {
            return;
        }
        this.isSpeaking = speaking;
        if (speaking) {
            this.lastSpokeAt = new Date();
        }
        this.emit(ParticipantEvent.IsSpeakingChanged, speaking);
    }

    setConnectionQuality(q: ProtoQuality) {
        const prevQuality = this._connectionQuality;
        this._connectionQuality = qualityFromProto(q);
        if (prevQuality !== this._connectionQuality) {
            this.emit(ParticipantEvent.ConnectionQualityChanged, this._connectionQuality);
        }
    }

    /** @internal */
    setAudioContext(ctx: AudioContext | undefined) {
        this.audioContext = ctx;
        this.audioTrackPublications.forEach(
            (track) =>
                (track.track instanceof RemoteAudioTrack || track.track instanceof LocalAudioTrack) && track.track.setAudioContext(ctx),
        );
    }

    protected addTrackPublication(publication: TrackPublication) {
        // forward publication driven events
        publication.on(TrackEvent.Muted, () => {
            this.emit(ParticipantEvent.TrackMuted, publication);
        });

        publication.on(TrackEvent.Unmuted, () => {
            this.emit(ParticipantEvent.TrackUnmuted, publication);
        });

        const pub = publication;
        if (pub.track) {
            pub.track.sid = publication.trackSid;
        }

        this.trackPublications.set(publication.trackSid, publication);
        switch (publication.kind) {
            case Track.Kind.Audio:
                this.audioTrackPublications.set(publication.trackSid, publication);
                break;
            case Track.Kind.Video:
                this.videoTrackPublications.set(publication.trackSid, publication);
                break;
            default:
                break;
        }
    }
}

export type ParticipantEventCallbacks = {
    trackPublished: (publication: RemoteTrackPublication) => void;
    trackSubscribed: (track: RemoteTrack, publication: RemoteTrackPublication) => void;
    trackSubscriptionFailed: (trackSid: string, reason?: SubscriptionError) => void;
    trackUnpublished: (publication: RemoteTrackPublication) => void;
    trackUnsubscribed: (track: RemoteTrack, publication: RemoteTrackPublication) => void;
    trackMuted: (publication: TrackPublication) => void;
    trackUnmuted: (publication: TrackPublication) => void;
    localTrackPublished: (publication: LocalTrackPublication) => void;
    localTrackUnpublished: (publication: LocalTrackPublication) => void;
    participantMetadataChanged: (prevMetadata: string | undefined, participant?: any) => void;
    participantNameChanged: (name: string) => void;
    dataReceived: (payload: Uint8Array, kind: DataPacket_Kind) => void;
    isSpeakingChanged: (speaking: boolean) => void;
    connectionQualityChanged: (connectionQuality: ConnectionQuality) => void;
    trackStreamStateChanged: (
        publication: RemoteTrackPublication,
        streamState: Track.StreamState,
    ) => void;
    trackSubscriptionPermissionChanged: (
        publication: RemoteTrackPublication,
        status: TrackPublication.PermissionStatus,
    ) => void;
    mediaDevicesError: (error: Error) => void;
    audioStreamAcquired: () => void;
    participantPermissionsChanged: (prevPermissions?: ParticipantPermission) => void;
    trackSubscriptionStatusChanged: (
        publication: RemoteTrackPublication,
        status: TrackPublication.SubscriptionStatus,
    ) => void;
};