import {AdaptiveStreamSettings} from "@/components/live/room/track/types";
import {
    AudioCaptureOptions,
    AudioOutputOptions,
    TrackPublishDefaults,
    VideoCaptureOptions
} from "@/components/live/room/track/options";
import {ReconnectPolicy} from "@/components/live/room/ReconnectPolicy";
import {E2EEOptions} from "@/components/live/e2ee/types";

export interface WebAudioSettings {
    audioContext: AudioContext;
}

/**
 * @internal
 */
export interface InternalRoomOptions {
    /**
     * AdaptiveStream 让 TcApp 自动管理订阅视频轨道的质量，以优化带宽和 CPU。
     * 当附加的视频元素可见时，它将根据附加的最大视频元素的大小选择适当的分辨率。
     *
     * 当没有视频元素可见时，会暂时暂停
     * 数据流动，直到它们再次可见。
     */
    adaptiveStream: AdaptiveStreamSettings | boolean;

    /**
     * 启用 Dynacast，默认关闭。 Dynacast 可以动态暂停任何订阅者未使用的视频层，
     * 从而显着减少发布 CPU 和带宽的使用。
     */
    dynacast: boolean;

    /**
     * 捕获用户音频时使用的默认选项
     */
    audioCaptureDefaults?: AudioCaptureOptions;

    /**
     * 捕获用户视频时使用的默认选项
     */
    videoCaptureDefaults?: VideoCaptureOptions;

    /**
     * 发布曲目时使用的默认选项
     */
    publishDefaults?: TrackPublishDefaults;

    /**
     * 房间音频输出
     */
    audioOutput?: AudioOutputOptions;

    /**
     * 本地曲目在未发布时是否应该停止。 默认为 true
     * 如果您希望手动清理未发布的本地曲目，请将其设置为 false。
     */
    stopLocalTrackOnUnpublish: boolean;

    /**
     * 尝试重新连接时使用的策略
     */
    reconnectPolicy: ReconnectPolicy;

    /**
     * 指定sdk是否自动断开房间连接
     * 关于“pagehide”和“beforeunload”事件
     */
    disconnectOnPageLeave: boolean;

    /**
     * @内部的
     * 实验标志，在发送信令消息之前引入延迟
     */
    expSignalLatency?: number;

    /**
     * @内部的
     * @实验
     * 实验标志，混合网络音频中的所有音轨
     */
    webAudioMix: boolean | WebAudioSettings;

    /**
     * @experimental
     */
    e2ee?: E2EEOptions;

    loggerName?: string;
}

/**
 * 创建新房间时的选项
 */
export interface RoomOptions extends Partial<InternalRoomOptions> {
}

export interface InternalRoomConnectOptions {

    /** 加入后自动订阅房间曲目，默认为 true */
    autoSubscribe: boolean;

    /** PeerConnection建立的时间，默认15s */
    peerConnectionTimeout: number;

    /**
     * 用于覆盖任何 RTCConfiguration 选项。
     */
    rtcConfig?: RTCConfiguration;

    /**
     * @已弃用
     * 只发布模式
     */
    publishOnly?: string;

    /** 指定允许初始加入连接重试的频率（仅适用于服务器不可访问的情况）*/
    maxRetries: number;

    /** amount of time for Websocket connection to be established, defaults to 15s */
    websocketTimeout: number;
}

/**
 * Room.connect() 的选项
 */
export interface RoomConnectOptions extends Partial<InternalRoomConnectOptions> {
}