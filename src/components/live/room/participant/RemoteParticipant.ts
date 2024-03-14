import Participant, {ParticipantEventCallbacks} from "@/components/live/room/participant/Participant";
import RemoteTrackPublication from "@/components/live/room/track/RemoteTrackPublication";
import {SignalClient} from "@/components/live/api/SignalClient";
import {AudioOutputOptions} from "@/components/live/room/track/options";
import {ParticipantInfo, SubscriptionError} from "@/components/live/protocol/tc_models_pb";
import {ParticipantEvent, TrackEvent} from "@/components/live/room/LiveEvents";
import {UpdateSubscription, UpdateTrackSettings} from "@/components/live/protocol/tc_rtc_pb";
import log from "@/components/live/logger";
import {TrackPublication} from "@/components/live/room/track/TrackPublication";
import RemoteTrack from "@/components/live/room/track/RemoteTrack";
import {Track} from "@/components/live/room/track/Track";
import RemoteAudioTrack from "@/components/live/room/track/RemoteAudioTrack";
import {AdaptiveStreamSettings} from "@/components/live/room/track/types";
import RemoteVideoTrack from "@/components/live/room/track/RemoteVideoTrack";
import {LoggerOptions} from "@/components/live/room/types";
import {getLogContextFromTrack} from "@/components/live/room/track/utils";

export default class RemoteParticipant extends Participant {
    audioTrackPublications: Map<string, RemoteTrackPublication>;

    videoTrackPublications: Map<string, RemoteTrackPublication>;

    trackPublications: Map<string, RemoteTrackPublication>;

    signalClient: SignalClient;

    private volumeMap: Map<Track.Source, number>;

    // private volume?: number;
    //
    // private audioContext?: AudioContext;

    private audioOutput?: AudioOutputOptions;

    static fromParticipantInfo(signalClient: SignalClient, pi: ParticipantInfo): RemoteParticipant {
        return new RemoteParticipant(signalClient, pi.sid, pi.identity, pi.name, pi.metadata);
    }

    constructor(
        signalClient: SignalClient,
        sid: string,
        identity?: string,
        name?: string,
        metadata?: string,
        loggerOptions?: LoggerOptions
    ) {
        super(sid, identity || '', name, metadata, loggerOptions);
        this.signalClient = signalClient;
        this.trackPublications = new Map<string, RemoteTrackPublication>();
        this.audioTrackPublications = new Map<string, RemoteTrackPublication>();
        this.videoTrackPublications = new Map<string, RemoteTrackPublication>();
        this.volumeMap = new Map();
    }

    protected addTrackPublication(publication: RemoteTrackPublication) {
        super.addTrackPublication(publication);

        // register action events
        publication.on(TrackEvent.UpdateSettings, (settings: UpdateTrackSettings) => {
            this.log.debug('send update settings', {
                ...this.logContext,
                ...getLogContextFromTrack(publication),
            });
            this.signalClient.sendUpdateTrackSettings(settings);
        });
        publication.on(TrackEvent.UpdateSubscription, (sub: UpdateSubscription) => {
            sub.participantTracks.forEach((pt) => {
                pt.participantSid = this.sid;
            });
            this.signalClient.sendUpdateSubscription(sub);
        });
        publication.on(
            TrackEvent.SubscriptionPermissionChanged,
            (status: TrackPublication.PermissionStatus) => {
                this.emit(ParticipantEvent.TrackSubscriptionPermissionChanged, publication, status);
            },
        );
        publication.on(
            TrackEvent.SubscriptionStatusChanged,
            (status: TrackPublication.SubscriptionStatus) => {
                this.emit(ParticipantEvent.TrackSubscriptionStatusChanged, publication, status);
            },
        );
        publication.on(TrackEvent.Subscribed, (track: RemoteTrack) => {
            this.emit(ParticipantEvent.TrackSubscribed, track, publication);
        });
        publication.on(TrackEvent.Unsubscribed, (previousTrack: RemoteTrack) => {
            this.emit(ParticipantEvent.TrackUnsubscribed, previousTrack, publication);
        });
        publication.on(TrackEvent.SubscriptionFailed, (error: SubscriptionError) => {
            this.emit(ParticipantEvent.TrackSubscriptionFailed, publication.trackSid, error);
        });
    }

    getTrackPublicationBySid(source: Track.Source): RemoteTrackPublication | undefined {
        const track = super.getTrackPublicationBySid(source);
        if (track) {
            return track as RemoteTrackPublication;
        }
    }

    /**
     * sets the volume on the participant's microphone track
     * if no track exists the volume will be applied when the microphone track is added
     */
    setVolume(
        volume: number,
        source: Track.Source.Microphone | Track.Source.ScreenShareAudio = Track.Source.Microphone,
    ) {
        this.volumeMap.set(source, volume);
        const audioPublication = this.getTrackPublicationBySid(Track.Source.Microphone);
        if (audioPublication && audioPublication.track) {
            (audioPublication.track as RemoteAudioTrack).setVolume(volume);
        }
    }

    /**
     * gets the volume on the participant's microphone track
     */
    getVolume(
        source: Track.Source.Microphone | Track.Source.ScreenShareAudio = Track.Source.Microphone,
    ) {
        const audioPublication = this.getTrackPublicationBySid(Track.Source.Microphone);
        if (audioPublication && audioPublication.track) {
            return (audioPublication.track as RemoteAudioTrack).getVolume();
        }
        return this.volumeMap.get(source);
    }

    addSubscribedMediaTrack(
        mediaTrack: MediaStreamTrack,
        sid: Track.SID,
        mediaStream: MediaStream,
        receiver?: RTCRtpReceiver,
        adaptiveStreamSettings?: AdaptiveStreamSettings,
        triesLeft?: number,
    ) {
        // find the track publication
        // it's possible for the media track to arrive before participant info
        let publication = this.getTrackPublicationBySid(sid);

        // it's also possible that the browser didn't honor our original track id
        // FireFox would use its own local uuid instead of server track id
        if (!publication) {
            if (!sid.startsWith('TR')) {
                // find the first track that matches type
                this.trackPublications.forEach((p) => {
                    if (!publication && mediaTrack.kind === p.kind.toString()) {
                        publication = p;
                    }
                });
            }
        }

        // when we couldn't locate the track, it's possible that the metadata hasn't
        // yet arrived. Wait a bit longer for it to arrive, or fire an error
        if (!publication) {
            if (triesLeft === 0) {
                log.error('could not find published track', {participant: this.sid, trackSid: sid});
                this.emit(ParticipantEvent.TrackSubscriptionFailed, sid);
                return;
            }

            if (triesLeft === undefined) {
                triesLeft = 20;
            }
            setTimeout(() => {
                this.addSubscribedMediaTrack(
                    mediaTrack,
                    sid,
                    mediaStream,
                    receiver,
                    adaptiveStreamSettings,
                    triesLeft! - 1,
                );
            }, 150);
            return;
        }

        if (mediaTrack.readyState === 'ended') {
            this.log.error(
                'unable to subscribe because MediaStreamTrack is ended. Do not call MediaStreamTrack.stop()',
                {...this.logContext, ...getLogContextFromTrack(publication)},
            );
            this.emit(ParticipantEvent.TrackSubscriptionFailed, sid);
            return;
        }

        const isVideo = mediaTrack.kind === 'video';
        let track: RemoteTrack;
        if (isVideo) {
            track = new RemoteVideoTrack(mediaTrack, sid, receiver, adaptiveStreamSettings);
        } else {
            track = new RemoteAudioTrack(mediaTrack, sid, receiver, this.audioContext, this.audioOutput);
        }

        // set track info
        track.source = publication.source;
        // keep publication's muted status
        track.isMuted = publication.isMuted;
        track.setMediaStream(mediaStream);
        track.start();

        publication.setTrack(track);
        // set participant volume on new microphone tracks
        if (this.volumeMap.has(publication.source) && track instanceof RemoteAudioTrack) {
            track.setVolume(this.volumeMap.get(publication.source!));
        }
        return publication;
    }

    get hasMetadata(): boolean {
        return !!this.participantInfo;
    }

    getTrackPublicationBySid(sid: Track.SID): RemoteTrackPublication | undefined {
        return this.trackPublications.get(sid);
    }

    updateInfo(info: ParticipantInfo): boolean {
        if (!super.updateInfo(info)) {
            return false;
        }

        // we are getting a list of all available tracks, reconcile in here
        // and send out events for changes

        // reconcile track publications, publish events only if metadata is already there
        // i.e. changes since the local participant has joined
        const validTracks = new Map<string, RemoteTrackPublication>();
        const newTracks = new Map<string, RemoteTrackPublication>();

        info.tracks.forEach((ti) => {
            let publication = this.getTrackPublicationBySid(ti.sid);
            if (!publication) {
                // new publication
                const kind = Track.kindFromProto(ti.type);
                if (!kind) {
                    return;
                }
                publication = new RemoteTrackPublication(
                    kind,
                    ti,
                    this.signalClient.connectOptions?.autoSubscribe,
                    {loggerContextCb: () => this.logContext, loggerName: this.loggerOptions?.loggerName},
                );
                publication.updateInfo(ti);
                newTracks.set(ti.sid, publication);
                const existingTrackOfSource = Array.from(this.trackPublications.values()).find(
                    (publishedTrack) => publishedTrack.source === publication?.source,
                );
                if (existingTrackOfSource && publication.source !== Track.Source.Unknown) {
                    this.log.debug(
                        `received a second track publication for ${this.identity} with the same source: ${publication.source}`,
                        {
                            ...this.logContext,
                            oldTrack: getLogContextFromTrack(existingTrackOfSource),
                            newTrack: getLogContextFromTrack(publication),
                        },
                    );
                }
                this.addTrackPublication(publication);
            } else {
                publication.updateInfo(ti);
            }
            validTracks.set(ti.sid, publication);
        });

        // detect removed tracks
        this.trackPublications.forEach((publication) => {
            if (!validTracks.has(publication.trackSid)) {
                this.log.trace('detected removed track on remote participant, unpublishing', {
                    ...this.logContext,
                    ...getLogContextFromTrack(publication),
                });
                this.unpublishTrack(publication.trackSid, true);
            }
        });

        // always emit events for new publications, Room will not forward them unless it's ready
        newTracks.forEach((publication) => {
            this.emit(ParticipantEvent.TrackPublished, publication);
        });
        return true;
    }

    unpublishTrack(sid: Track.SID, sendUnpublish?: boolean) {
        const publication = <RemoteTrackPublication>this.trackPublications.get(sid);
        if (!publication) {
            return;
        }

        // also send unsubscribe, if track is actively subscribed
        const {track} = publication;
        if (track) {
            track.stop();
            publication.setTrack(undefined);
        }

        // remove track from maps only after unsubscribed has been fired
        this.trackPublications.delete(sid);

        // remove from the right type map
        switch (publication.kind) {
            case Track.Kind.Audio:
                this.audioTrackPublications.delete(sid);
                break;
            case Track.Kind.Video:
                this.videoTrackPublications.delete(sid);
                break;
            default:
                break;
        }

        if (sendUnpublish) {
            this.emit(ParticipantEvent.TrackUnpublished, publication);
        }
    }

    async setAudioOutput(output: AudioOutputOptions) {
        this.audioOutput = output;
        const promises: Promise<void>[] = [];
        this.audioTrackPublications.forEach((pub) => {
            if (pub.track instanceof RemoteAudioTrack) {
                promises.push(pub.track.setSinkId(output.deviceId ?? 'default'));
            }
        });
        await Promise.all(promises);
    }

    /** @internal */
    emit<E extends keyof ParticipantEventCallbacks>(
        event: E,
        ...args: Parameters<ParticipantEventCallbacks[E]>
    ): boolean {
        this.log.trace('participant event', {...this.logContext, event, args});
        return super.emit(event, ...args);
    }
}