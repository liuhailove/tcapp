import {EventEmitter} from 'events';

import {
    ConnectionQuality as ProtoQuality,
    DataPacket_Kind, ParticipantPermission,
    SubscriptionError
} from '@/components/live/protocol/tc_models_pb';
import TypedEmitter from "typed-emitter/rxjs";
import RemoteTrack from "@/components/live/room/track/RemoteTrack";
import LocalTrack from "@/components/live/room/track/LocalTrack";
import {Track} from "@/components/live/room/track/Track";
import {TrackPublishOptions} from "@/components/live/room/track/options";
import {TrackPublication} from "@/components/live/room/track/TrackPublication";

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

export default class Participant extends (EventEmitter as new () => TypedEmitter<ParticipantEventCallback>) {

}

export type ParticipantEventCallback = {
    trackPublished: (publication: RemoteTrackPublication) => void;
    trackSubscribed: (track: RemoteTrack, publication: RemoteTrackPublication) => void;
    trackSubscriptionFailed: (trackSid: string, reason?: SubscriptionError) => void;
    trackUnpublished: (publication: RemoteTrackPublication) => void;
    trackUnsubscribed: (track: RemoteTrack, publication: RemoteTrackPublication) => void;
    tractMuted: (publication: TrackPublication) => void;
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
    participantPermissionsChanged: (prevPermissions?: ParticipantPermission) => void;
    trackSubscriptionStatusChanged: (
        publication: RemoteTrackPublication,
        status: TrackPublication.SubscriptionStatus,
    ) => void;
};