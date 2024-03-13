import RemoteAudioTrack from "@/components/live/room/track/RemoteAudioTrack";
import LocalAudioTrack from "@/components/live/room/track/LocalAudioTrack";
import RemoteVideoTrack from "@/components/live/room/track/RemoteVideoTrack";
import LocalVideoTrack from "@/components/live/room/track/LocalVideoTrack";

export type AudioTrack = RemoteAudioTrack | LocalAudioTrack;
export type VideoTrack = RemoteVideoTrack | LocalVideoTrack;

export type AdaptiveStreamSettings = {
    /**
     * 设置自定义像素密度，默认为1
     * 当在超高清屏幕上播放视频时，此设置
     * 让我们考虑一下这些屏幕的 devicePixelRatio。
     * 将其设置为“screen”以使用屏幕的实际像素密度
     * 注意：这可能会显着增加人们消耗的带宽
     * 在高清屏幕上流式传输。
     */
    pixelDensity?: number | 'screen';
    /**
     * 如果为 true，则切换到另一个选项卡时视频会暂停。
     * 默认为 true。
     */
    pauseVideoInBackground?: boolean;
};

export interface ReplaceTrackOptions {
    userProviderTrack?: boolean;
    stopProcessor?: boolean;
}