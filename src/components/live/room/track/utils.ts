import {
    AudioCaptureOptions,
    CreateLocalTracksOptions,
    ScreenShareCaptureOptions,
    VideoCaptureOptions, VideoCodec, videoCodecs
} from "@/components/live/room/track/options";
import {AudioTrack} from "@/components/live/room/track/types";
import {isSafari, sleep} from "@/components/live/room/utils";
import {TrackPublication} from "@/components/live/room/track/TrackPublication";
import {TrackPublishedResponse} from "@/components/live/protocol/tc_rtc_pb";
import {Track} from "@/components/live/room/track/Track";

export function mergeDefaultOptions(
    options?: CreateLocalTracksOptions,
    audioDefaults?: AudioCaptureOptions,
    videoDefaults?: VideoCaptureOptions,
): CreateLocalTracksOptions {
    const opts: CreateLocalTracksOptions = {
        ...options,
    };
    if (opts.audio === true) {
        opts.audio = {};
    }
    if (opts.video === true) {
        opts.video = {};
    }
    // 使用默认值
    if (opts.audio) {
        mergeObjectWithoutOverwriting(
            opts.audio as Record<string, unknown>,
            audioDefaults as Record<string, unknown>,
        );
    }
    if (opts.video) {
        mergeObjectWithoutOverwriting(
            opts.video as Record<string, unknown>,
            videoDefaults as Record<string, unknown>,
        );
    }
    return opts;
}

function mergeObjectWithoutOverwriting(
    mainObject: Record<string, unknown>,
    objectToMerge: Record<string, unknown>,
): Record<string, unknown> {
    Object.keys(objectToMerge).forEach((key) => {
        if (mainObject[key] === undefined) {
            mainObject[key] = objectToMerge[key];
        }
    });
    return mainObject;
}

export function constraintsForOptions(options: CreateLocalTracksOptions): MediaStreamConstraints {
    const constraints: MediaStreamConstraints = {};

    if (options.video) {
        // 默认video选项
        if (typeof options.video === 'object') {
            const videoOptions: MediaTrackConstraints = {};
            const target = videoOptions as Record<string, unknown>;
            const source = options.video as Record<string, unknown>;
            Object.keys(source).forEach((key) => {
                switch (key) {
                    case 'resolution':
                        // 展平 VideoResolution 字段
                        mergeObjectWithoutOverwriting(target, source.resolution as Record<string, unknown>);
                        break;
                    default:
                        target[key] = source[key];
                }
            });
            constraints.video = videoOptions;
        } else {
            constraints.video = options.video;
        }
    } else {
        constraints.video = false;
    }

    if (options.audio) {
        if (typeof options.audio === 'object') {
            constraints.audio = options.audio;
        } else {
            constraints.audio = true;
        }
    } else {
        constraints.audio = false;
    }
    return constraints;
}

/**
 * 此函数检测给定 [[Track]] 实例上的静音。 如果曲目似乎完全安静，则返回 true。
 * 参数：
 * 时间偏移：number
 */
export async function detectSilence(track: AudioTrack, timeOffset = 200): Promise<boolean> {
    const ctx = getNewAudioContext();
    if (ctx) {
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const source = ctx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));

        source.connect(analyser);
        await sleep(timeOffset);
        analyser.getByteTimeDomainData(dataArray);
        const someNoise = dataArray.some((sample) => sample !== 128 && sample !== 0);
        await ctx.close();
        return !someNoise;
    }
    return false;
}


/**
 * @internal
 */
export function getNewAudioContext(): AudioContext | void {
    const AudioContext =
        // @ts-ignore
        typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (AudioContext) {
        return new AudioContext({latencyHint: 'interactive'});
    }
}

/**
 * @internal
 */
export function kindToSource(kind: MediaDeviceKind) {
    if (kind === 'audioinput') {
        return Track.Source.Microphone;
    } else if (kind === 'videoinput') {
        return Track.Source.Camera;
    } else {
        return Track.Source.Unknown;
    }
}

/**
 * @internal
 */
export function sourceToKind(source: Track.Source): MediaDeviceKind | undefined {
    if (source === Track.Source.Microphone) {
        return 'audioinput';
    } else if (source === Track.Source.Camera) {
        return 'videoinput';
    } else {
        return undefined;
    }
}

/**
 * @internal
 */
export function screenCaptureToDisplayMediaStreamOptions(
    options: ScreenShareCaptureOptions,
): DisplayMediaStreamOptions {
    let videoConstraints: MediaTrackConstraints | boolean = options.video ?? true;
    // treat 0 as uncapped
    if (options.resolution && options.resolution.width > 0 && options.resolution.height > 0) {
        videoConstraints = typeof videoConstraints === 'boolean' ? {} : videoConstraints;
        if (isSafari()) {
            videoConstraints = {
                ...videoConstraints,
                width: {max: options.resolution.width},
                height: {max: options.resolution.height},
                frameRate: options.resolution.frameRate,
            };
        } else {
            videoConstraints = {
                ...videoConstraints,
                width: {ideal: options.resolution.width},
                height: {ideal: options.resolution.height},
                frameRate: options.resolution.frameRate,
            };
        }
    }

    return {
        audio: options.audio ?? false,
        video: videoConstraints,
        // @ts-expect-error support for experimental display media features
        controller: options.controller,
        selfBrowserSurface: options.selfBrowserSurface,
        surfaceSwitching: options.surfaceSwitching,
        systemAudio: options.systemAudio,
    };
}

export function mimeTypeToVideoCodecString(mimeType: string) {
    const codec = mimeType.split('/')[1].toLowerCase() as VideoCodec;
    if (!videoCodecs.includes(codec)) {
        throw Error(`Video codec not supported: ${codec}`);
    }
    return codec;
}

export function getTrackPublicationInfo<T extends TrackPublication>(
    tracks: T[],
): TrackPublishedResponse[] {
    const infos: TrackPublishedResponse[] = [];
    tracks.forEach((track: TrackPublication) => {
        if (track.track !== undefined) {
            infos.push(
                new TrackPublishedResponse({
                    cid: track.track.mediaStreamID,
                    track: track.trackInfo,
                })
            );
        }
    });
    return infos;
}

export function getLogContextFromTrack(track: Track | TrackPublication): Record<string, unknown> {
    if (track instanceof Track) {
        return {
            trackSid: track.sid;
            trackSource: track.source,
            trackMuted: track.isMuted,
            trackEnabled: track.mediaStreamTrack.enabled,
            trackKind: track.kind,
        };
    } else {
        return {
            trackSid: track.trackSid,
            trackName: track.trackName,
            track: track.track ? getLogContextFromTrack(track.track) : undefined,
            trackEnabled: track.isEnabled,
            trackEncrypted: track.isEncrypted,
            trackMimeType: track.mimeType,
        };
    }
}