import {Track} from "@/components/live/room/track/Track";

/**
 * @experimental
 */
export type ProcessorOptions<T extends Track.Kind> = {
    kind: T;
    track: MediaStreamTrack;
    element?: HTMLMediaElement;
    audioContext?: AudioContext;
};

/**
 * @experimental
 */
export interface AudioProcessorOptions extends ProcessorOptions<Track.Kind.Audio> {
    audioContext: AudioContext;
}

/**
 * @experimental
 */
export interface VideoProcessorOptions extends ProcessorOptions<Track.Kind.Video> {
}

export interface TrackProcessor<T extends Track.Kind, U extends ProcessorOptions<T> = ProcessorOptions<T>> {
    name: string;
    init: (opts: ProcessorOptions<T>) => void;
    restart: (opts: U) => Promise<void>;
    destroy: () => Promise<void>;
    processedTrack: MediaStreamTrack;
    onPublish?: MediaStreamTrack;
    onUnpublish?: () => Promise<void>;
}