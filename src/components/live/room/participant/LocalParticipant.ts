import Participant from "@/components/live/room/participant/Participant";
import LocalTrackPublication from "@/components/live/room/track/LocalTrackPublication";
import RTCEngine from "@/components/live/room/RTCEngine";
import {Track} from "@/components/live/room/track/Track";
import LocalTrack from "@/components/live/room/track/LocalTrack";
import {ParticipantTrackPermission} from "@/components/live/room/participant/ParticipantTrackPermission";
import {InternalRoomOptions} from "@/components/live/options";
import {Future, isFireFox, isSafari, isSVCCodec, supportsAV1, supportsVP9} from "@/components/live/room/utils";
import {EngineEvent, ParticipantEvent, TrackEvent} from "@/components/live/room/LiveEvents";
import log from "@/components/live/logger";
import {
    AudioCaptureOptions,
    BackupVideoCodec,
    CreateLocalTracksOptions,
    isCodecEqual,
    ScreenShareCaptureOptions,
    ScreenSharePresets,
    TrackPublishOptions,
    VideoCaptureOptions,
    VideoPresets
} from "@/components/live/room/track/options";
import {DeviceUnsupportedError, TrackInvalidError, UnexpectedConnectionState} from "@/components/live/room/errors";
import {constraintsForOptions, mergeDefaultOptions} from "@/components/live/room/track/utils";
import {
    computeTrackBackupEncodings,
    computeVideoEncodings,
    mediaTrackLocalTrack
} from "@/components/live/room/participant/publishUtils";
import LocalVideoTrack, {videoLayersFromEncodings} from "@/components/live/room/track/LocalVideoTrack";
import LocalAudioTrack from "@/components/live/room/track/LocalAudioTrack";
import {
    AddTrackRequest,
    DataChannelInfo,
    SignalTarget,
    TrackPublishedResponse
} from "@/components/live/protocol/tc_rtc_pb";
import {DataPacket, DataPacket_Kind} from "@/components/live/protocol/tc_models_pb";
import {DataPublishOptions} from "@/components/live/room/types";
import RemoteParticipant from "@/components/live/room/participant/RemoteParticipant";


export default class LocalParticipant extends Participant {
    audioTracks: Map<string, LocalTrackPublication>;

    videoTracks: Map<string, LocalTrackPublication>;

    /** map of track sid => all published tracks */
    tracks: Map<string, LocalTrackPublication>;

    engine: RTCEngine;

    private pendingPublishing = new Set<Track.Source>();

    private pendingPublishPromises = new Map<LocalTrack, Promise<LocalTrackPublication>>();

    private cameraError: Error | undefined;

    private microphoneError: Error | undefined;

    private participantTrackPermissions: Array<ParticipantTrackPermission> = [];

    private allParticipantsAllowedToSubscribe: boolean = true;

    // keep a pointer to room options
    private roomOptions: InternalRoomOptions;

    private reconnectFuture?: Future<void>;

    constructor(sid: string, identity: string, engine: RTCEngine, options: InternalRoomOptions) {
        super(sid, identity);
        this.audioTracks = new Map<string, LocalTrackPublication>();
        this.videoTracks = new Map<string, LocalTrackPublication>();
        this.tracks = new Map<string, LocalTrackPublication>();
        this.engine = engine;
        this.roomOptions = options;
        this.setupEngine(engine);
    }

    get lastCameraError(): Error | undefined {
        return this.cameraError;
    }

    get lastMicrophoneError(): Error | undefined {
        return this.microphoneError;
    }

    getTrack(source: Track.Source): LocalTrackPublication | undefined {
        const track = super.getTrack(source);
        if (track) {
            return track as LocalTrackPublication;
        }
    }

    getTrackByName(name: string): LocalTrackPublication | undefined {
        const track = super.getTrackByName(name);
        if (track) {
            return track as LocalTrackPublication;
        }
    }

    setupEngine(engine: RTCEngine) {
        this.engine = engine;
        this.engine.client.onRemoteMuteChanged = (trackSid: string, muted: boolean) => {
            const pub = this.tracks.get(trackSid);
            if (!pub || !pub.track) {
                return;
            }
            if (muted) {
                pub.mute();
            } else {
                pub.unmute();
            }
        };

        this.engine.client.onSubscribedQualityUpdate = this.handleSubscribedQualityUpdate;

        this.engine.onLocalTrackUnpublished = this.handleLocalTrackUnpublished;

        this.engine
            .on(EngineEvent.Connected, this.handleReconnected)
            .on(EngineEvent.Restarted, this.handleReconnected)
            .on(EngineEvent.Resumed, this.handleReconnected)
            .on(EngineEvent.Restarting, this.handleReconnecting)
            .on(EngineEvent.Resuming, this.handleReconnecting)
            .on(EngineEvent.Disconnected, this.handleDisconnected);
    }

    private handleReconnecting = () => {
        if (!this.reconnectFuture) {
            this.reconnectFuture = new Future<void>();
        }
    };

    private handleReconnected = () => {
        this.reconnectFuture?.resolve?.();
        this.reconnectFuture = undefined;
        this.updateTrackSubscriptionPermissions();
    };

    private handleDisconnected = () => {
        if (this.reconnectFuture) {
            this.reconnectFuture.promise.catch((e) => log.warn(e));
            this.reconnectFuture?.reject?.('Got disconnected during reconnection attempt');
            this.reconnectFuture = undefined;
        }
    };

    /**
     * Sets and updates the metadata of the local participant.
     * Note: this requires `canUpdateOwnMetadata` permission encoded in the token.
     * @param metadata
     */
    setMetadata(metadata: string) {
        super.setMetadata(metadata);
        this.engine.client.sendUpdateLocalMetadata(metadata, this.name ?? '');
    }

    /**
     * Sets and updates the name of the local participant.
     * Note: this requires `canUpdateOwnMetadata` permission encoded in the token.
     * @param metadata
     */
    setName(name: string): void {
        super.setName(name);
        this.engine.client.sendUpdateLocalMetadata(this.metadata ?? '', name);
    }

    /**
     * Enable or disable a participant's camera track.
     *
     * If a track has already published, it'll mute or unmute the track.
     * Resolves with a `LocalTrackPublication` instance if successful and `undefined` otherwise
     */
    setCameraEnabled(
        enabled: boolean,
        options?: VideoCaptureOptions,
        publishOptions?: TrackPublishOptions,
    ): Promise<LocalTrackPublication | undefined> {
        return this.setTrackEnabled(Track.Source.Camera, enabled, options, publishOptions);
    }

    /**
     * Enable or disable a participant's microphone track.
     *
     * If a track has already published, it'll mute or unmute the track.
     * Resolves with a `LocalTrackPublication` instance if successful and `undefined` otherwise
     */
    setMicrophoneEnabled(
        enabled: boolean,
        options?: AudioCaptureOptions,
        publishOptions?: TrackPublishOptions,
    ): Promise<LocalTrackPublication | undefined> {
        return this.setTrackEnabled(Track.Source.Microphone, enabled, options, publishOptions);
    }

    /**
     * Start or stop sharing a participant's screen
     * Resolves with a `LocalTrackPublication` instance if successful and `undefined` otherwise
     */
    setScreenShareEnabled(
        enabled: boolean,
        options?: ScreenShareCaptureOptions,
        publishOptions?: TrackPublishOptions,
    ): Promise<LocalTrackPublication | undefined> {
        return this.setTrackEnabled(Track.Source.ScreenShare, enabled, options, publishOptions);
    }

    /**
     * Enable or disable publishing for a track by source. This serves as a simple
     * way to manage the common tracks (camera, mic, or screen share).
     * Resolves with LocalTrackPublication if successful and void otherwise
     */
    private async setTrackEnabled(
        source: Extract<Track.Source, Track.Source.Camera>,
        enabled: boolean,
        options?: VideoCaptureOptions,
        publishOptions?: TrackPublishOptions,
    ): Promise<LocalTrackPublication | undefined>;
    private async setTrackEnabled(
        source: Extract<Track.Source, Track.Source.Microphone>,
        enabled: boolean,
        options?: AudioCaptureOptions,
        publishOptions?: TrackPublishOptions,
    ): Promise<LocalTrackPublication | undefined>;
    private async setTrackEnabled(
        source: Extract<Track.Source, Track.Source.ScreenShare>,
        enabled: boolean,
        options?: ScreenShareCaptureOptions,
        publishOptions?: TrackPublishOptions,
    ): Promise<LocalTrackPublication | undefined>;

    private async setTrackEnabled(
        source: Track.Source,
        enabled: true,
        options?: VideoCaptureOptions | AudioCaptureOptions | ScreenShareCaptureOptions,
        publishOptions?: TrackPublishOptions,
    ) {
        log.debug('setTrackEnabled', {source, enabled});
        let track = this.getTrack(source);
        if (enabled) {
            if (track) {
                await track.unmute();
            } else {
                let localTracks: Array<LocalTrack> | undefined;
                if (this.pendingPublishing.has(source)) {
                    log.info('skipping duplicate published source', {source});
                    // no-op it's already been requested
                    return;
                }
                this.pendingPublishing.add(source);
                try {
                    switch (source) {
                        case Track.Source.Camera:
                            localTracks = await this.createTracks({
                                video: (options as VideoCaptureOptions | undefined) ?? true,
                            });
                            break;
                        case Track.Source.Microphone:
                            localTracks = await this.createTracks({
                                audio: (options as AudioCaptureOptions | undefined) ?? true,
                            });
                            break;
                        case Track.Source.ScreenShare:
                            localTracks = await this.createScreenTracks({
                                ...(options as ScreenShareCaptureOptions | undefined),
                            });
                            break;
                        default:
                            throw new TrackInvalidError(source);
                    }
                    const publishPromises: Array<Promise<LocalTrackPublication>> = [];
                    for (const localTrack of localTracks) {
                        log.info('publishing track', {localTrack});
                        publishPromises.push(this.publishTrack(localTrack, publishOptions));
                    }
                    const publishedTracks = await Promise.all(publishPromises);
                    // for screen share publications including audio, this will only return the screen share publication, not the screen share audio one
                    // revisit if we want to return an array of tracks instead for v2
                    [track] = publishedTracks;
                } catch (e) {
                    if (e instanceof Error && !(e instanceof TrackInvalidError)) {
                        this.emit(ParticipantEvent.MediaDevicesError, e);
                    }
                    throw e;
                } finally {
                    this.pendingPublishing.delete(source);
                }
            }
        } else if (track && track.track) {
            // screenshare cannot be muted, unpublish instead
            if (source === Track.Source.ScreenShare) {
                track = await this.unpublishTrack(track.track);
                const screenAudioTrack = this.getTrack(Track.Source.ScreenShareAudio);
                if (screenAudioTrack && screenAudioTrack.track) {
                    this.unpublishTrack(screenAudioTrack.track);
                }
            } else {
                await track.mute();
            }
        }
        return track;
    }

    /**
     * Publish both camera and microphone at the same time. This is useful for
     * displaying a single Permission Dialog box to the end user.
     */
    async enableCameraAndMicrophone() {
        if (
            this.pendingPublishing.has(Track.Source.Camera) ||
            this.pendingPublishing.has(Track.Source.Microphone)
        ) {
            // no-op it's already been requested
            return;
        }

        this.pendingPublishing.add(Track.Source.Camera);
        this.pendingPublishing.add(Track.Source.Microphone);
        try {
            const tracks: LocalTrack[] = await this.createTracks({
                audio: true,
                video: true,
            });

            await Promise.all(tracks.map((track) => this.publishTrack(track)));
        } finally {
            this.pendingPublishing.delete(Track.Source.Camera);
            this.pendingPublishing.delete(Track.Source.Microphone);
        }
    }

    /**
     * Create local camera and/or microphone tracks
     * @param options
     * @returns
     */
    async createTracks(options?: CreateLocalTracksOptions): Promise<LocalTrack[]> {
        const opts = mergeDefaultOptions(
            options,
            this.roomOptions?.audioCaptureDefaults,
            this.roomOptions?.videoCaptureDefaults,
        );

        const constraints = constraintsForOptions(opts);
        let stream: MediaStream | undefined;
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
            if (err instanceof Error) {
                if (constraints.audio) {
                    this.microphoneError = err;
                }
                if (constraints.video) {
                    this.cameraError = err;
                }
            }

            throw err;
        }

        if (constraints.audio) {
            this.microphoneError = undefined;
        }
        if (constraints.video) {
            this.cameraError = undefined;
        }

        return stream.getTracks().map((mediaStreamTrack) => {
            const isAudio = mediaStreamTrack.kind === 'audio';
            let trackOptions = isAudio ? options!.audio : options!.video;
            if (typeof trackOptions === 'boolean' || !trackOptions) {
                trackOptions = {};
            }
            let trackConstraints: MediaTrackConstraints | undefined;
            const conOrBool = isAudio ? constraints.audio : constraints.video;
            if (typeof conOrBool !== 'boolean') {
                trackConstraints = conOrBool;
            }
            const track = mediaTrackLocalTrack(mediaStreamTrack, trackConstraints);
            if (track.kind === Track.Kind.Video) {
                track.source = Track.Source.Camera;
            } else if (track.kind === Track.Kind.Audio) {
                track.source = Track.Source.Microphone;
            }
            track.mediaStream = stream;
            return track;
        });
    }

    /**
     * Creates a screen capture tracks with getDisplayMedia().
     * A LocalVideoTrack is always created and returned.
     * If { audio: true }, and the browser supports audio capture, a LocalAudioTrack is also created.
     */
    async createScreenTracks(options?: ScreenShareCaptureOptions): Promise<Array<LocalTrack>> {
        if (options === undefined) {
            options = {};
        }
        if (options.resolution === undefined) {
            options.resolution = ScreenSharePresets.h1080fps15.resolution;
        }

        let videoConstraints: MediaTrackConstraints | boolean = true;
        if (options.resolution) {
            if (isSafari()) {
                videoConstraints = {
                    width: {max: options.resolution.width},
                    height: {max: options.resolution.height},
                    frameRate: options.resolution.frameRate,
                };
            } else {
                videoConstraints = {
                    width: {ideal: options.resolution.width},
                    height: {ideal: options.resolution.height},
                    frameRate: options.resolution.frameRate,
                };
            }
        }

        if (navigator.mediaDevices.getDisplayMedia === undefined) {
            throw new DeviceUnsupportedError('getDisplayMedia not supported');
        }

        const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
            audio: options.audio ?? false,
            video: videoConstraints,
            // @ts-expect-error support for experimental display media features
            control: options.controller,
            selfBrowserSurface: options.selfBrowserSurface,
            surfaceSwitching: options.surfaceSwitching,
            systemAudio: options.systemAudio,
        });

        const tracks = stream.getVideoTracks();
        if (tracks.length == 0) {
            throw new TrackInvalidError('no video track found');
        }
        const screenVideo = new LocalVideoTrack(tracks[0], undefined, false);
        screenVideo.source = Track.Source.ScreenShare;
        const localTracks: Array<LocalVideoTrack> = [screenVideo];
        if (stream.getAudioTracks().length > 0) {
            const screenAudio = new LocalVideoTrack(stream.getAudioTracks()[0], undefined, false);
            screenAudio.source = Track.Source.ScreenShareAudio;
            localTracks.push(screenAudio);
        }
        return localTracks;
    }

    /**
     * Publish a new track to the room
     * @param track
     * @param options
     */
    async publishTrack(
        track: LocalTrack | MediaStreamTrack,
        options?: TrackPublishOptions,
    ): Promise<LocalTrackPublication> {
        await this.reconnectFuture?.promise;
        if (track instanceof LocalTrack && this.pendingPublishPromises.has(track)) {
            await this.pendingPublishPromises.get(track);
        }
        // convert raw media track into audio or video track
        if (track instanceof MediaStreamTrack) {
            switch (track.kind) {
                case 'audio':
                    track = new LocalAudioTrack(track, undefined, true);
                    break;
                case 'video':
                    track = new LocalVideoTrack(track, undefined, true);
                    break;
                default:
                    throw new TrackInvalidError(`unsupported MediaStreamTrack kind ${track.kind}`);
            }
        }

        // is it already published? if so skip
        let existingPublication: LocalTrackPublication | undefined;
        this.tracks.forEach((publication) => {
            if (!publication.track) {
                return;
            }
            if (publication.track === track) {
                existingPublication = <LocalTrackPublication>publication;
            }
        });

        if (existingPublication) {
            log.warn('track has already been published, skipping');
            return existingPublication;
        }

        const isStereo = options?.forceStereo ||
            ('channelCount' in track.mediaStreamTrack.getSettings() &&
                // @ts-ignore `channelCount` on getSettings() is currently only available for Safari, but is generally the best way to determine a stereo track https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/channelCount
                track.mediaStreamTrack.getSettings().channelCount === 2
            ) ||
            track.mediaStreamTrack.getConstraints().channelCount === 2;

        // disable dtx for stereo track if not enabled explicitly
        if (isStereo) {
            if (!options) {
                options = {};
            }
            if (options.dtx === undefined) {
                log.info(`Opus DTX will be disabled for stereo tracks by default. Enable them explicitly to make it work.`);
            }
            if (options.red === undefined) {
                log.info(`Opus RED will be disabled for stereo tracks by default. Enable them explicitly to make it work.`);
            }
            options.dtx ??= false;
            options.red ??= false;
        }
        const opts: TrackPublishOptions = {
            ...this.roomOptions.publishDefaults,
            ...options,
        };

        if (opts.source) {
            track.source = opts.source;
        }
        const publishPromise = this.publish(track, opts, options, isStereo);
        this.pendingPublishPromises.set(track, publishPromise);
        try {
            const publication = await publishPromise;
            return publication;
        } catch (e) {
            throw e;
        } finally {
            this.pendingPublishPromises.delete(track);
        }
    }

    private async publish(
        track: LocalTrack,
        opts: TrackPublishOptions,
        options: TrackPublishOptions | undefined,
        isStereo: boolean,
    ) {
        const existingTrackOfSource = Array.from(this.tracks.values()).find(
            (publishedTrack) => track instanceof LocalTrack && publishedTrack.source === track.source,
        );
        if (existingTrackOfSource && track.source !== Track.Source.Unknown) {
            try {
                // throw an Error in order to capture the stack trace
                throw Error(`publishing a second track with the same source: ${track.source}`);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    log.warn(e.message, {
                        oldTrack: existingTrackOfSource,
                        newTrack: track,
                        trace: e.stack,
                    });
                }
            }
        }
        if (opts.stopMicTrackOnMute && track instanceof LocalAudioTrack) {
            track.stopOnMute = true;
        }

        if (track.source === Track.Source.ScreenShare && isFireFox()) {
            // Firefox does not work well with simulcasted screen share
            // we frequently get no data on layer 0 when enabled
            opts.simulcast = false;
        }

        // require full AV1/VP9 SVC support prior to using it
        if (opts.videoCodec === 'av1' && !supportsAV1()) {
            opts.videoCodec = undefined;
        }
        if (opts.videoCodec === 'vp9' && !supportsVP9()) {
            opts.videoCodec = undefined;
        }

        // handle track actions
        track.on(TrackEvent.Muted, this.onTrackMuted);
        track.on(TrackEvent.Unmuted, this.onTrackUnmuted);
        track.on(TrackEvent.Ended, this.handleTrackEnded);
        track.on(TrackEvent.UpstreamPaused, this.onTrackUpstreamPaused);
        track.on(TrackEvent.UpstreamResumed, this.onTrackUpstreamResumed);

        // create track publication from track
        const req = AddTrackRequest.fromJson({
            // get local track id for use during publishing
            cid: track.mediaStreamTrack.id,
            name: options?.name,
            type: Track.kindFromProto(track.kind),
            muted: track.isMuted,
            source: Track.sourceToProto(track.source),
            disableDtx: !(opts.dtx ?? true);
            stereo: isStereo,
            disableRed: !(opts.red ?? true),
        });

        // compute encodings and layers for video
        let encodings: RTCRtpEncodingParameters[] | undefined;
        let simEncodings: RTCRtpEncodingParameters[] | undefined;
        if (track.kind === Track.Kind.Video) {
            let dims: Track.Dimensions = {
                width: 0,
                height: 0,
            };
            try {
                dims = await track.waitForDimensions();
            } catch (e) {
                // use defaults, it's quite painful for congestion control without simulcast
                // so using default dims according to publish settings
                const defaultRes = this.roomOptions.videoCaptureDefaults?.resolution ?? VideoPresets.h720.resolution;
                dims = {
                    width: defaultRes.width,
                    height: defaultRes.height,
                };
                // log failure
                log.error('could not determine track dimensions, using defaults', dims);
            }
            // width and height should be defined for video
            req.width = dims.width;
            req.height = dims.height;
            // for svc codecs, disable simulcast and use vp8 for backup codec
            if (track instanceof LocalVideoTrack) {
                if (isSVCCodec(opts.videoCodec)) {
                    // set scalabilityMode to 'L3T3_KEY' by default
                    opts.scalabilityMode = opts.scalabilityMode ?? 'L3T3_KEY';
                }


                // set up backup
                if (opts.videoCodec && options.backupCodec && opts.videoCodec !== opts.backupCodec.codec) {
                    const simOpts = {...opts};
                    simOpts.simulcast = true;
                    simEncodings = computeTrackBackupEncodings(track, opts.backupCodec.codec, simOpts);

                    req.simulcastCodecs = [
                        {
                            codec: opts.videoCodec,
                            cid: track.mediaStreamTrack.id,
                            enableSimulcastLayers: true,
                        },
                        {
                            codec: opts.backupCodec.codec,
                            cid: '',
                            enableSimulcastLayers: true,
                        },
                    ];
                } else if (opts.videoCodec) {
                    // pass codec info to sfu so it can prefer codec for the client which don't support
                    // setCodecPreferences
                    req.simulcastCodecs = [
                        {
                            codec: opts.videoCodec,
                            cid: track.mediaStreamTrack.id,
                            enableSimulcastLayers: opts.simulcast ?? false,
                        },
                    ];
                }
            }

            encodings = computeVideoEncodings(
                track.source === Track.Source.ScreenShare,
                dims.width,
                dims.height,
                encodings,
                isSVCCodec(opts.videoCodec),
            );
            req.layers = videoLayersFromEncodings(
                req.width,
                req.height,
                encodings,
                isSVCCodec(opts.videoCodec),
            );
        } else if (track.kind === Track.Kind.Audio) {
            encodings = [
                {
                    maxBitrate: opts.audioPreset?.maxBitrate ?? opts.audioBitrate,
                    priority: opts.audioPreset?.priority ?? 'high',
                    networkPriority: opts.audioPreset?.priority ?? 'high',
                },
            ];
        }

        if (!this.engine || this.engine.isClosed) {
            throw new UnexpectedConnectionState('cannot publish track wen not connected');
        }

        const ti = await this.engine.addTrack(req);
        let primaryCodecSupported = false;
        let backupCodecSupported = false;
        ti.codecs.forEach((c) => {
            if (isCodecEqual(c.mimeType, opts.videoCodec)) {
                primaryCodecSupported = true;
            } else if (opts.backupCodec && isCodecEqual(c.mimeType, opts.backupCodec.codec)) {
                backupCodecSupported = true;
            }
        });

        if (req.simulcastCodecs.length > 0) {
            if (!primaryCodecSupported && !backupCodecSupported) {
                throw Error('cannot publish track, codec not supported by server');
            }


            if (!primaryCodecSupported && opts.backupCodec) {
                const backupCodec = opts.backupCodec;
                opts = {...opts};
                log.debug(`primary codec ${opts.videoCodec} not supported, fallback to ${backupCodec.codec}`);
                opts.videoCodec = backupCodec.codec;
                opts.videoEncoding = backupCodec.encoding;
                encodings = simEncodings;
            }
        }
        const publication = new LocalTrackPublication(track.kind, ti, track);
        // save options for when it needs to be republished again
        publication.options = opts;
        track.sid = ti.sid;

        if (!this.engine.publisher) {
            throw new UnexpectedConnectionState('publisher is closed');
        }
        log.debug(`publishing ${track.kind} with encodings`, {encodings, trackInfo: ti});

        // store RTPSender
        track.sender = await this.engine.createSender(track, opts, encodings);

        if (track.codec && isSVCCodec(track.codec.toString()) && encodings && encodings[0]?.maxBitrate) {
            this.engine.publisher.setTrackCodecBitrate(
                req.cid,
                track.codec.toString(),
                encodings[0].maxBitrate / 1000,
            );
        }

        this.engine.negotiate();

        if (track instanceof LocalVideoTrack) {
            track.startMonitor(this.engine.client);
        } else {
            track.startMonitor();
        }

        this.addTrackPublication(publication);

        // send event for publication
        this.emit(ParticipantEvent.LocalTrackPublished, publication);
        return publication;
    }

    override get isLocal(): boolean {
        return true;
    }

    /** @internal
     * publish additional codec to existing track
     */
    async publishAdditionalCodecForTrack(
        track: LocalTrack | MediaStreamTrack,
        videoCodec: BackupVideoCodec,
        options?: TrackPublishOptions,
    ) {
        // is it not published? if so skip
        let existingPublication: LocalTrackPublication | undefined;
        this.tracks.forEach((publication) => {
            if (!publication.track) {
                return;
            }
            if (publication.track === track) {
                existingPublication = <LocalTrackPublication>publication;
            }
        });
        if (!existingPublication) {
            throw new TrackInvalidError('track is not published');
        }

        if (!(track instanceof LocalVideoTrack)) {
            throw new TrackInvalidError('track is not a video track');
        }

        const opts: TrackPublishOptions = {
            ...this.roomOptions?.publishDefaults,
            ...options
        };

        const encodings = computeTrackBackupEncodings(track, videoCodec, opts);
        if (!encodings) {
            log.info(`backup codec has been disabled, ignoring request to add additional codec for track`);
            return;
        }

        const simulcastTrack = track.addSimulcastTrack(videoCodec, encodings);
        const req = AddTrackRequest.fromJson({
            cid: simulcastTrack.mediaStreamTrack.id,
            type: Track.kindToProto(track.kind),
            muted: track.isMuted,
            source: Track.sourceToProto(track.source),
            sid: track.sid,
            simulcastCodecs: [
                {
                    codec: opts.videoCodec,
                    cid: simulcastTrack.mediaStreamTrack.id,
                    enableSimulcastLayers: opts.simulcast,
                },
            ],
        });
        req.layers = videoLayersFromEncodings(req.width, req.height, encodings);

        if (!this.engine || this.engine.isClosed) {
            throw new UnexpectedConnectionState('cannot publish track when not connected');
        }

        const ti = await this.engine.addTrack(req);

        const transceiverInit: RTCRtpTransceiverInit = {direction: 'sendonly'};
        if (encodings) {
            transceiverInit.sendEncodings = encodings;
        }
        await this.engine.createSimulcastSender(track, simulcastTrack, opts, encodings);

        this.engine.negotiate();
        log.debug(`published ${videoCodec} for track ${track.sid}`, {encodings, trackInfo: ti});
    }

    async unpublishTrack(
        track: LocalTrack | MediaStreamTrack,
        stopOnUnpublish?: boolean
    ): Promise<LocalTrackPublication | undefined> {
        // look through all published tracks to find the right ones
        const publication = this.getPublicationForTrack(track);

        log.debug('unpublising track', {track, method: 'unpublishTrack',});

        if (!publication || !publication.track) {
            log.warn('track was not unpublished because no publication was found',
                {
                    track,
                    method: 'unpublishTrack',
                }
            );
            return undefined;
        }

        track = publication.track;
        track.off(TrackEvent.Muted, this.onTrackMuted);
        track.off(TrackEvent.Unmuted, this.onTrackUnmuted);
        track.off(TrackEvent.Ended, this.handleTrackEnded);
        track.off(TrackEvent.UpstreamPaused, this.onTrackUpstreamPaused);
        track.off(TrackEvent.UpstreamResumed, this.onTrackUpstreamResumed);

        if (stopOnUnpublish === undefined) {
            stopOnUnpublish = this.roomOptions?.stopLocalTrackOnUnpublish ?? true;
        }
        if (stopOnUnpublish) {
            track.stop();
        }

        let negotiationNeeded = false;
        const trackSender = track.sender;
        track.sender = undefined;

        if (
            this.engine.publisher &&
            this.engine.publisher.pc.connectionState !== 'closed' &&
            trackSender
        ) {
            try {
                for (const transceiver of this.engine.publisher.pc.getTransceivers()) {
                    // if sender is not currently sending (after replaceTrack(null))
                    // removeTrack would have no effect.
                    // to ensure we end up successfully removing the track, manually set
                    // the transceiver to inactive
                    if (transceiver.sender === trackSender) {
                        transceiver.direction = 'inactive';
                        negotiationNeeded = true;
                    }
                }
                if (this.engine.removeTrack(trackSender)) {
                    negotiationNeeded = true;
                }
                if (track instanceof LocalVideoTrack) {
                    for (const [, trackInfo] of track.simulcastCodecs) {
                        if (trackInfo.sender) {
                            if (this.engine.removeTrack(trackInfo.sender)) {
                                negotiationNeeded = true;
                            }
                            trackInfo.sender = undefined;
                        }
                    }
                    track.simulcastCodecs.clear();
                }
            } catch (e) {
                log.warn('failed to unpublish track', {error: e, method: 'unpublishTrack'});
            }
        }

        // remove from our maps
        this.tracks.delete(publication.trackSid);
        switch (publication.kind) {
            case Track.Kind.Audio:
                this.audioTracks.delete(publication.trackSid);
                break;
            case Track.Kind.Video:
                this.videoTracks.delete(publication.trackSid);
                break;
            default:
                break;
        }

        this.emit(ParticipantEvent.LocalTrackUnpublished, publication);
        publication.setTrack(undefined);

        if (negotiationNeeded) {
            await this.engine.negotiate();
        }
        return publication;
    }

    async unpublishTracks(
        tracks: LocalTrack[] | MediaStreamTrack[],
    ): Promise<LocalTrackPublication[]> {
        const results = await Promise.all(tracks.map((track) => this.unpublishTrack(track)));
        return results.filter(
            (track) => track instanceof LocalTrackPublication,
        ) as LocalTrackPublication[];
    }

    async republishAllTracks(options?: TrackPublishOptions) {
        const localPubs: LocalTrackPublication[] = [];
        this.tracks.forEach((pub) => {
            if (pub.track) {
                if (options) {
                    pub.options = {...pub.options, ...options};
                }
                localPubs.push(pub);
            }
        });

        await Promise.all(
            localPubs.map(async (pub) => {
                const track = pub.track!;
                await this.unpublishTrack(track, false);
                await this.publishTrack(track, pub.options);
            }),
        );
    }

    /**
     * Publish a new data payload to the room. Data will be forwarded to each
     * participant in the room if the destination field in publishOptions is empty
     *
     * @param data Uint8Array of the payload. To send string data, use TextEncoder.encode
     * @param kind whether to send this as reliable or lossy.
     * For data that you need delivery guarantee (such as chat messages), use Reliable.
     * For data that should arrive as quickly as possible, but you are ok with dropped
     * packets, use Lossy.
     * @param publishOptions optionally specify a `topic` and `destination`
     */
    async publishData(
        data: Uint8Array,
        kind: DataPacket_Kind,
        publishOptions?: DataPublishOptions,
    ): Promise<void>;
    /**
     * Publish a new data payload to the room. Data will be forwarded to each
     * participant in the room if the destination argument is empty
     *
     * @param data Uint8Array of the payload. To send string data, use TextEncoder.encode
     * @param kind whether to send this as reliable or lossy.
     * For data that you need delivery guarantee (such as chat messages), use Reliable.
     * For data that should arrive as quickly as possible, but you are ok with dropped
     * packets, use Lossy.
     * @param destination the participants who will receive the message
     */
    async publishData(
        data: Uint8Array,
        kind: DataPacket_Kind,
        destination?: RemoteParticipant[] | string[],
    ): Promise<void>;

    async publishData(
        data: Uint8Array,
        kind: DataPacket_Kind,
        publishOptions: DataPublishOptions | RemoteParticipant[] | string[] = {},
    ) {
        const destination = Array.isArray(publishOptions)
            ? publishOptions
            : publishOptions?.destination;
        const destinationSids: string[] = [];

        const topic = !Array.isArray(publishOptions) ? publishOptions.topic : undefined;

        if (destination !== undefined) {
            destination.forEach((val: any) => {
                if (val instanceof RemoteParticipant) {
                    destinationSids.push(val.sid);
                } else {
                    destinationSids.push(val);
                }
            });
        }

        const packet: DataPacket = {
            kind,
            value: {
                case: 'user',
                user: {
                    participantSid: this.sid,
                    payload: data,
                    destinationSids: destinationSids,
                    topic,
                },
            },
        };

        await this.engine.sendDataPacket(packet, kind);
    }

    private getPublicationForTrack(
        track: LocalTrack | MediaStreamTrack,
    ): LocalTrackPublication | undefined {
        let publication: LocalTrackPublication | undefined;
        this.tracks.forEach((pub) => {
            const localTrack = pub.track;
            if (!localTrack) {
                return;
            }

            // this looks overly complicated due to this object tree
            if (track instanceof MediaStreamTrack) {
                if (localTrack instanceof LocalAudioTrack || localTrack instanceof LocalVideoTrack) {
                    if (localTrack.mediaStreamTrack === track) {
                        publication = <LocalTrackPublication>pub;
                    }
                } else if (track === localTrack) {
                    publication = <LocalTrackPublication>pub;
                }
            }
        });
        return publication;
    }

    publishedTracksInfo(): TrackPublishedResponse[] {
        const infos: TrackPublishedResponse[] = [];
        this.tracks.forEach((track: LocalTrackPublication) => {
            if (track.track !== undefined) {
                infos.push({
                    cid: track.track.mediaStreamID,
                    track: track.trackInfo,
                });
            }
        });
        return infos;
    }

    dataChannelsInfo(): DataChannelInfo[] {
        const infos: DataChannelInfo[] = [];
        const getInfo = (dc: RTCDataChannel | undefined, target: SignalTarget) => {
            if (dc?.id !== undefined && dc.id !== null) {
                infos.push({
                    label: dc.label,
                    id: dc.id,
                    target,
                });
            }
        };

        getInfo(this.engine.dataChannelForKind(DataPacket_Kind.LOSSY), SignalTarget.PUBLISHER);
        getInfo(this.engine.dataChannelForKind(DataPacket_Kind.RELIABLE), SignalTarget.PUBLISHER);
        getInfo(this.engine.dataChannelForKind(DataPacket_Kind.LOSSY, true), SignalTarget.SUBSCRIBER);

        getInfo(
            this.engine.dataChannelForKind(DataPacket_Kind.RELIABLE, true),
            SignalTarget.SUBSCRIBER,
        );
        return infos;
    }

}


