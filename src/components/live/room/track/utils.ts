import {AudioCaptureOptions, CreateLocalTracksOptions, VideoCaptureOptions} from "@/components/live/room/track/options";
import {AudioTrack} from "@/components/live/room/track/types";
import {sleep} from "@/components/live/room/utils";

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


export function getNewAudioContext(): AudioContext | void {
    const AudioContext =
        // @ts-ignore
        typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (AudioContext) {
        return new AudioContext({latencyHint: 'interactive'});
    }
}