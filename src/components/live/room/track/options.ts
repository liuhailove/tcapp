import {Track} from "@/components/live/room/track/Track";


export interface TrackPublishDefaults {
    /**
     * 摄像机轨迹的编码参数
     */
    videoEncoding?: VideoEncoding;

    /**
     * @实验
     */
    backupCodec?: true | false | { codec: BackupVideoCodec; encoding: VideoEncoding };

    /**
     * 屏幕共享轨道的编码参数
     */
    screenShareEncoding?: VideoEncoding;

    /**
     * 编解码器，默认为vp8； 对于 svc 编解码器，自动启用 vp8
     * 作为备份。 （待定）
     */
    videoCodec?: VideoCodec;

    /**
     * 最大音频比特率，默认为 [[AudioPresets.music]]
     * @deprecated 使用 `audioPreset` 代替
     */
    audioBitrate?: number;

    /**
     * 应使用哪种音频预设来发布（音频）曲目
     * 默认为 [[AudioPresets.music]]
     */
    audioPreset?: AudioPreset;

    /**
     * dtx（音频不连续传输），默认为单声道轨道启用。
     */
    dtx?: boolean;

    /**
     * red（冗余音频数据），默认情况下为单声道轨道启用。
     */
    red?: boolean;

    /**
     * 立体声音轨。 默认值由捕获通道数决定。
     */
    forceStereo?: boolean;

    /**
     * 使用联播，默认为true。
     * 使用联播时，TcApp 将发布最多三个版本的流
     * 在不同的分辨率下。
     */
    simulcast?: boolean;

    /**
     * svc 编解码器的可扩展模式，默认为“L3T3”。
     * 对于 svc 编解码器，联播已禁用。
     */
    scalabilityMode?: ScalabilityMode;

    /**
     * 除了原始层之外，最多还可以发布两个额外的联播层
     * Track.
     * 留空时，默认为 h180、h360。
     * 如果使用 SVC 编解码器（VP9 或 AV1），则该字段无效。
     *
     * 要发布总共三个图层，您需要指定：
     * {
     * videoEncoding: {...}, // 主层的编码
     * videoSimulcastLayers: [
     *   VideoPresets.h540,
     *   VideoPresets.h216,
     *],
     * }
     */
    videoSimulcastLayers?: Array<VideoPreset>;

    /**
     * 屏幕轨道的自定义视频联播层
     * 注意：图层需要按质量从最低到最高的顺序排列
     */
    screenShareSimulcastLayers?: Array<VideoPreset>;

    /**
     * 对于本地轨道，当轨道在某些平台上静音（或暂停）时，停止底层 MediaStreamTrack，此选项对于禁用麦克风录音指示器是必要的。
     * 注意：启用此功能并连接 BT 设备后，它们将在配置文件之间转换（例如 HFP 到 A2DP），并且播放时会出现明显的差异。
     *
     * 默认为假
     */
    stopMicTrackOnMute?: boolean;
}

/**
 * 发布曲目时的选项
 */
export interface TrackPublishOptions extends TrackPublishDefaults {
    /**
     * 设置音轨名称
     */
    name?: string;

    /**
     * 音轨来源、摄像机、麦克风或屏幕
     */
    source?: Track.Source;
}

export interface CreateLocalTracksOptions {
    /**
     * 音轨选项，true 则使用默认值创建。 如果不应创建音频则为 false
     * 默认为真
     */
    audio?: boolean | AudioCaptureOptions;

    /**
     * 视频轨道选项，正确创建默认值。 如果不应创建视频，则为 false
     * 默认为真
     */
    video?: boolean | VideoCaptureOptions;
}

export interface VideoCaptureOptions {
    /**
     * 指定设备 ID 或设备数组的 ConstrainDOMString 对象
     * 可接受和/或必需的 ID。
     */
    deviceId?: ConstrainDOMString;

    /**
     * 可接受和/或要求的一个饰面或一组饰面。
     */
    facingMode?: 'user' | 'environment' | 'left' | 'right';

    resolution?: VideoResolution;
}

export interface ScreenShareCaptureOptions {

    /**
     * true 捕获共享音频。 浏览器对屏幕共享中音频捕获的支持有限：https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#browser_compatibility
     */
    audio?: boolean | AudioCaptureOptions;

    /** 采集分辨率，默认为全高清 */
    resolution?: VideoResolution;

    /** 一个 CaptureController 对象实例，包含可用于进一步操作捕获会话（如果包含）的方法。 */
    controller?: unknown; // TODO replace type with CaptureController once it lands in TypeScript

    /** 指定浏览器是否应允许用户选择当前选项卡进行捕获 */
    selfBrowserSurface?: 'include' | 'exclude';

    /** specifies whether the browser should display a control to allow the user to dynamically switch the shared tab during screen-sharing. */
    surfaceSwitching?: 'include' | 'exclude';

    /** 指定浏览器是否应显示控件以允许用户在屏幕共享期间动态切换共享选项卡。 */
    systemAudio?: 'include' | 'exclude';

    /**
     * 实验性选项，用于控制捕获选项卡时选项卡中播放的音频是否继续从用户的本地扬声器播放。
     */
    suppressLocalAudioPlayback?: boolean;
}

export interface AudioCaptureOptions {
    /**
     * 指定是否首选和/或需要自动增益控制
     */
    autoGainControl?: ConstrainBoolean;

    /**
     * 可接受和/或要求的通道数或通道数范围
     */
    channelCount?: ConstrainULong;

    /**
     * 指定设备 ID 或设备数组的 ConstrainDOMString 对象
     * 可接受和/或必需的 ID。
     */
    deviceId?: ConstrainDOMString;

    /**
     * 回声消除是否是首选和/或必需的
     */
    echoCancellation?: ConstrainBoolean;

    /**
     * 可接受和/或要求的延迟或延迟范围。
     */
    latency?: ConstrainDouble;

    /**
     * 是否首选和/或需要噪声抑制。
     */
    noiseSuppression?: ConstrainBoolean;

    /**
     * 可接受和/或要求的采样率或采样率范围。
     */
    sampleRate?: ConstrainULong;

    /**
     * 可接受和/或要求的样本量或样本量范围。
     */
    sampleSize?: ConstrainULong;
}

export interface AudioOutputOptions {
    /**
     * 输出音频的deviceId
     *
     * 仅在支持 `setSinkId` 的浏览器上受支持
     */
    deviceId?: string;
}

/**
 * 视频分辨率
 */
export interface VideoResolution {
    width: number;
    height: number;
    frameRate?: number;
    aspectRatio?: number;
}

export interface VideoEncoding {
    maxBitrate: number;
    maxFramerate?: number;
    priority?: RTCPriorityType;
}

/**
 * 视频预设
 */
export class VideoPreset {
    encoding: VideoEncoding;

    width: number;

    height: number;

    constructor(
        width: number,
        height: number,
        maxBitrate: number,
        maxFramerate?: number,
        priority?: RTCPriorityType,
    ) {
        this.width = width;
        this.height = height;
        this.encoding = {
            maxBitrate,
            maxFramerate,
            priority,
        };
    }

    get resolution(): VideoResolution {
        return {
            width: this.width,
            height: this.height,
            frameRate: this.encoding.maxFramerate,
            aspectRatio: this.width / this.height,
        };
    }
}

export interface AudioPreset {
    maxBitrate: number;
    priority?: RTCPriorityType;
}

const codecs = ['vp8', 'h264', 'vp9', 'av1'] as const;
const backupCodecs = ['vp8', 'h264'] as const;

export type VideoCodec = (typeof codecs)[number];

export type BackupVideoCodec = (typeof backupCodecs)[number];

export function isBackupCodec(codec: string): codec is BackupVideoCodec {
    return !!backupCodecs.find((backup) => backup === codec);
}

export function isCodecEqual(c1: string | undefined, c2: string | undefined): boolean {
    return (
        c1?.toLowerCase().replace(/audio\/|video\//y, '') ===
        c2?.toLowerCase().replace(/audio\/|video\//y, '')
    );
}

/**
 * svc的可扩展模式，现在仅支持l3t3。
 */
export type ScalabilityMode = 'L3T3' | 'L3T3_KEY';

export namespace AudioPresets {
    export const telephone: AudioPreset = {
        maxBitrate: 12_000,
    };
    export const speech: AudioPreset = {
        maxBitrate: 20_000,
    };
    export const music: AudioPreset = {
        maxBitrate: 32_000,
    };
    export const musicStereo: AudioPreset = {
        maxBitrate: 48_000,
    };
    export const musicHighQuality: AudioPreset = {
        maxBitrate: 64_000,
    };
    export const musicHighQualityStereo: AudioPreset = {
        maxBitrate: 96_000,
    };
}

/**
 * 视频分辨率/编码的健全预设
 */
export const VideoPresets = {
    h90: new VideoPreset(160, 90, 60_000, 15),
    h180: new VideoPreset(320, 180, 120_000, 15),
    h216: new VideoPreset(384, 216, 180_000, 15),
    h360: new VideoPreset(640, 360, 300_000, 20),
    h540: new VideoPreset(960, 540, 600_000, 25),
    h720: new VideoPreset(1280, 720, 1_700_000, 30),
    h1080: new VideoPreset(1920, 1080, 3_000_000, 30),
    h1440: new VideoPreset(2560, 1440, 5_000_000, 30),
    h2160: new VideoPreset(3840, 2160, 8_000_000, 30),
} as const;

/**
 * 四乘三预设
 */
export const VideoPresets43 = {
    h120: new VideoPreset(160, 120, 80_000, 15),
    h180: new VideoPreset(240, 180, 100_000, 15),
    h240: new VideoPreset(320, 240, 150_000, 15),
    h360: new VideoPreset(480, 360, 225_000, 20),
    h480: new VideoPreset(640, 480, 300_000, 20),
    h540: new VideoPreset(720, 540, 450_000, 25),
    h720: new VideoPreset(960, 720, 1_500_000, 30),
    h1080: new VideoPreset(1440, 1080, 2_500_000, 30),
    h1440: new VideoPreset(1920, 1440, 3_500_000, 30),
} as const;

export const ScreenSharePresets = {
    h360fps3: new VideoPreset(640, 360, 200_000, 3, 'medium'),
    h720fps5: new VideoPreset(1280, 720, 400_000, 5, 'medium'),
    h720fps15: new VideoPreset(1280, 720, 1_000_000, 15, 'medium'),
    h1080fps15: new VideoPreset(1920, 1080, 1_500_000, 15, 'medium'),
    h1080fps30: new VideoPreset(1920, 1080, 3_000_000, 30, 'medium'),
} as const;
