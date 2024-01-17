import {Track} from "@/components/live/room/track/Track";

export type ProcessorOptions<T extends Track.Kind> = {
    kind: T;
    track: MediaStreamTrack;
    element?: HTMLMediaElement;
};

export interface TrackProcessor<T extends Track.Kind> {
    name: string;
    init: (opts: ProcessorOptions<T>) => void;
    destroy: () => Promise<void>;
    processedTrack: MediaStreamTrack;
}