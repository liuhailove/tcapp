import {
    AudioCaptureOptions,
    AudioPresets,
    ScreenSharePresets,
    TrackPublishDefaults, VideoCaptureOptions,
    VideoPresets
} from "@/components/live/room/track/options";
import {InternalRoomConnectOptions, InternalRoomOptions} from "@/components/live/options";
import viteConfig from "../../../../vite.config";
import DefaultReconnectPolicy from "@/components/live/room/DefaultReconnectPolicy";

export const publishDefaults: TrackPublishDefaults = {
    /**
     * @deprecated
     */
    audioBitrate: AudioPresets.music.maxBitrate,
    audioPreset: AudioPresets.music,
    dtx: true,
    red: true,
    forceStereo: false,
    simulcast: true,
    screenShareEncoding: ScreenSharePresets.h1080fps15.encoding,
    stopMicTrackOnMute: false,
    videoCodec: 'vp8',
    backupCodec: {codec: 'vp8', encoding: VideoPresets.h540.encoding},
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
    expWebAudioMix: false,
} as const;

export const roomConnectOptionDefaults: InternalRoomConnectOptions = {
    autoSubscribe: true,
    maxRetries: 1,
    peerConnectionTimeout: 15_000,
} as const;

