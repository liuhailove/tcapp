import {
    AudioCaptureOptions,
    AudioPresets,
    ScreenSharePresets,
    TrackPublishDefaults, VideoCaptureOptions,
    VideoPresets
} from "@/components/live/room/track/options";
import {InternalRoomConnectOptions, InternalRoomOptions} from "@/components/live/options";
import DefaultReconnectPolicy from "@/components/live/room/DefaultReconnectPolicy";

export const defaultVideoCodec = 'vp8';

export const publishDefaults: TrackPublishDefaults = {
    audioPreset: AudioPresets.music,
    dtx: true,
    red: true,
    forceStereo: false,
    simulcast: true,
    screenShareEncoding: ScreenSharePresets.h1080fps15.encoding,
    stopMicTrackOnMute: false,
    videoCodec: defaultVideoCodec,
    backupCodec: true,
} as const;

export const audioDefaults: AudioCaptureOptions = {
    autoGainControl: true,
    echoCancellation: true,
    noiseSuppression: true,
};

export const videoDefaults: VideoCaptureOptions = {
    resolution: VideoPresets.h720.resolution,
};

export const roomOptionDefaults: InternalRoomOptions = {
    adaptiveStream: false,
    dynacast: false,
    stopLocalTrackOnUnpublish: true,
    reconnectPolicy: new DefaultReconnectPolicy(),
    disconnectOnPageLeave: true,
    webAudioMix: true,
} as const;

export const roomConnectOptionDefaults: InternalRoomConnectOptions = {
    autoSubscribe: true,
    maxRetries: 1,
    peerConnectionTimeout: 15_000,
    websocketTimeout: 15_000,
} as const;

