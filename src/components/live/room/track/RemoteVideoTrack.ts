import RemoteTrack from "@/components/live/room/track/RemoteTrack";
import {computeBitrate, VideoReceiverStats} from "@/components/live/room/stats";
import {
    getDevicePixelRatio,
    getIntersectionObserver,
    getResizeObserver,
    isWeb,
    ObservableMediaElement
} from "@/components/live/room/utils";
import {AdaptiveStreamSettings} from "@/components/live/room/track/types";
import {attachToElement, detachTrack, Track} from "@/components/live/room/track/Track";
import log from "@/components/live/logger";
import CriticalTimers from "@/components/live/timers";
import {TrackEvent} from "@/components/live/room/LiveEvents";

const REACTION_DELAY = 100;

export default class RemoteVideoTrack extends RemoteTrack {
    private prevStats?: VideoReceiverStats;

    private elementInfos: ElementInfo[] = [];

    private adaptiveStreamSettings?: AdaptiveStreamSettings;

    private lastVisible?: boolean;

    private lastDimensions?: Track.Dimensions;

    private isObserved: boolean = false;

    constructor(
        mediaTrack: MediaStreamTrack,
        sid: string,
        receiver?: RTCRtpReceiver,
        adaptiveStreamSettings?: AdaptiveStreamSettings,
    ) {
        super(mediaTrack, sid, Track.Kind.Video, receiver);
        this.adaptiveStreamSettings = adaptiveStreamSettings;
    }

    get isAdaptiveStream(): boolean {
        return this.adaptiveStreamSettings !== undefined;
    }

    get mediaStreamTrack() {
        if (this.isAdaptiveStream && !this.isObserved) {
            log.warn(
                'When using adaptiveStream, you need to use remoteVideoTrack.attach() to add the track to a HTMLVideoElement, otherwise your video tracks might never start',
            );
        }
        return this._mediaStreamTrack;
    }

    setMuted(muted: boolean) {
        super.setMuted(muted);

        this.attachedElements.forEach((element) => {
            // detach or attach
            if (muted) {
                detachTrack(this._mediaStreamTrack, element);
            } else {
                attachToElement(this._mediaStreamTrack, element);
            }
        });
    }

    attach(): HTMLMediaElement;
    attach(element: HTMLMediaElement): HTMLMediaElement;
    attach(element?: HTMLMediaElement): HTMLMediaElement {
        if (!element) {
            element = super.attach();
        } else {
            super.attach(element);
        }

        // It's possible attach is called multiple times on an element. When that's
        // the case, we'd want to avoid adding duplicate elementInfos
        if (
            this.adaptiveStreamSettings &&
            this.elementInfos.find((info) => info.element === element) === undefined
        ) {
            const elementInfo = new HTMLElementInfo(element);
            this.observeElementInfo(element);
        }
        return element;
    }

    /**
     * 观察自适应流式传输时 ElementInfo 的变化。
     * @参数元素信息
     * @内部的
     */
    observeElementInfo(elementInfo: ElementInfo) {
        if (
            this.adaptiveStreamSettings &&
            this.elementInfos.find((info) => info === elementInfo) === undefined
        ) {
            elementInfo.handleResize = () => {
                this.debouncedHandleResize();
            };
            elementInfo.handleVisibilityChanged = () => {
                this.updateVisibility();
            };
            this.elementInfos.push(elementInfo);
            elementInfo.observe();
            // 触发第一个调整大小更新周期
            // 如果选项卡处于后台，则初始调整大小事件不会触发，直到
            // 该选项卡第一次成为焦点。
            this.debouncedHandleResize();
            this.updateVisibility();
            this.isObserved = true;
        } else {
            log.warn('visibility resize observer not triggered');
        }
    }

    /**
     * 停止观察 ElementInfo 的变化。
     * @参数元素信息
     * @内部的
     */
    stopObservingElementInfo(elementInfo: ElementInfo) {
        if (!this.isAdaptiveStream) {
            log.warn('stopObservingElementInfo ignored');
            return;
        }
        const stopElementInfos = this.elementInfos.filter((info) => info === elementInfo);
        for (const info of stopElementInfos) {
            info.stopObserving();
        }
        this.elementInfos = this.elementInfos.filter((info) => info !== elementInfo);
        this.updateVisibility();
    }

    detach(): HTMLMediaElement[];
    detach(element: HTMLMediaElement): HTMLMediaElement;
    detach(element?: HTMLMediaElement): HTMLMediaElement | HTMLMediaElement[] {
        let detachedElements: HTMLMediaElement[] = [];
        if (element) {
            this.stopObservingElement(element);
            return super.detach(element);
        }
        detachedElements = super.detach();

        for (const e of detachedElements) {
            this.stopObservingElement(e);
        }

        return detachedElements;
    }

    getDecoderImplementation(): string | undefined {
        return this.prevStats?.decoderImplementation;
    }

    protected monitorReceiver = async () => {
        if (!this.receiver) {
            this._currentBitrate = 0;
            return;
        }
        const stats = await this.getReceiverStats();

        if (stats && this.prevStats && this.receiver) {
            this._currentBitrate = computeBitrate(stats, this.prevStats);
        }

        this.prevStats = stats;
    };

    private async getReceiverStats(): Promise<VideoReceiverStats | undefined> {
        if (!this.receiver || !this.receiver.getStats) {
            return;
        }

        const stats = await this.receiver.getStats();
        let receiverStats: VideoReceiverStats | undefined;
        stats.forEach((v) => {
            if (v.type === 'inbound-rtp') {
                receiverStats = {
                    type: 'video',
                    framesDecoded: v.framesDecoded,
                    framesDropped: v.framesDropped,
                    framesReceived: v.framesReceived,
                    packetsReceived: v.packetsReceived,
                    packetsLost: v.packetsLost,
                    frameWidth: v.frameWidth,
                    frameHeight: v.frameHeight,
                    pliCount: v.pliCount,
                    firCount: v.firCount,
                    nackCount: v.nackCount,
                    jitter: v.jitter,
                    timestamp: v.timestamp,
                    bytesReceived: v.bytesReceived,
                    decoderImplementation: v.decoderImplementation,
                };
            }
        });
        return receiverStats;
    }

    private stopObservingElement(element: HTMLMediaElement) {
        const stopElementInfos = this.elementInfos.filter((info) => info.element === element);
        for (const info of stopElementInfos) {
            info.stopObserving();
        }
        this.elementInfos = this.elementInfos.filter((info) => info.element !== element);
    }

    protected async handleAppVisibilityChanged() {
        await super.handleAppVisibilityChanged();
        if (!this.isAdaptiveStream) {
            return;
        }
        this.updateVisility();
    }

    private readonly debouncedHandleResize = debounce(() => {
        this.updateDimensions();
    }, REACTION_DELAY);

    private updateVisibility() {
        const lastVisibilityChange = this.elementInfos.reduce(
            (prev, info) => Math.max(prev, info.visibilityChangedAt || 0),
            0,
        );

        const backgroundPause = this.adaptiveStreamSettings?.pauseVideoInBackground ?? true // default to true
            ? this.isInBackground
            : false;
        const isPiPMode = this.elementInfos.some((info) => info.pictureInPicture);
        const isVisible = (this.elementInfos.some((info) => info.visible) && !backgroundPause) || isPiPMode;

        if (this.lastVisible === isVisible) {
            return;
        }

        if (!isVisible && Date.now() - lastVisibilityChange < REACTION_DELAY) {
            // delay hidden events
            CriticalTimers.setTimeout(() => {
                this.updateVisibility();
            }, REACTION_DELAY);
            return;
        }

        this.lastVisible = isVisible;
        this.emit(TrackEvent.VisibilityChanged, isVisible, this);
    }

    private updateDimensions() {
        let maxWidth = 0;
        let maxHeight = 0;
        for (const info of this.elementInfos) {
            const pixelDensity = this.adaptiveStreamSettings?.pixelDensity ?? 1;
            const pixelDensityValue = pixelDensity === 'screen' ? getDevicePixelRatio() : pixelDensity;
            const currentElementWidth = info.width() * pixelDensityValue;
            const currentElementHeight = info.height() * pixelDensity;
            if (currentElementWidth + currentElementHeight > maxWidth + maxHeight) {
                maxWidth = currentElementWidth
                maxHeight = currentElementHeight
            }
        }

        if (this.lastDimensions?.width === maxWidth && this.lastDimensions?.height === maxHeight) {
            return;
        }

        this.lastDimensions = {
            width: maxWidth,
            height: maxHeight,
        };

        this.emit(TrackEvent.VideoDimensionsChanged, this.lastDimensions, this);
    }
}

export interface ElementInfo {
    element: object;

    width(): number;

    height(): number;

    visible: boolean;
    pictureInPicture: boolean;
    visibilityChangedAt: number | undefined;

    handleResize?: () => void;
    handleVisibilityChanged?: () => void;

    observe(): void;

    stopObserving(): void;
}

class HTMLElementInfo implements ElementInfo {
    element: HTMLMediaElement;

    private isPiP: boolean;

    private isIntersecting: boolean;

    visibilityChangedAt: number | undefined;

    get visible(): boolean {
        return this.isPiP || this.isIntersecting;
    }

    get pictureInPicture(): boolean {
        return this.isPiP;
    }

    handleResize?: () => void;

    handleVisibilityChanged?: () => void;

    constructor(element: HTMLMediaElement, visible?: boolean) {
        this.element = element;
        this.isIntersecting = visible ?? isElementInViewport(element);
        this.isPiP = isWeb() && document.pictureInPictureElement === element;
        this.visibilityChangedAt = 0;
    }

    height(): number {
        return this.element.clientHeight;
    }

    observe(): void {
        // make sure we update the current visible state once we start to observe
        this.isIntersecting = isElementInViewport(this.element);
        this.isPiP = document.pictureInPictureElement === this.element;

        (this.element as ObservableMediaElement).handleResize = () => {
            this.handleResize?.();
        };
        (this.element as ObservableMediaElement).handleVisibilityChanged = this.onVisibilityChanged;

        getIntersectionObserver().observe(this.element);
        getResizeObserver().observe(this.element);
        (this.element as HTMLVideoElement).addEventListener('enterpictureinpicture', this.onEnterPiP);
        (this.element as HTMLVideoElement).addEventListener('leavepictureinpicture', this.onLeavePiP);
    }

    private onVisibilityChanged = (entry: IntersectionObserverEntry) => {
        const {target, isIntersecting} = entry;
        if (target === this.element) {
            this.isIntersecting = isIntersecting;
            this.visibilityChangedAt = Date.now();
            this.handleVisibilityChanged?.();
        }
    }

    private onEnterPiP = () => {
        this.isPiP = true;
        this.handleVisibilityChanged?.();
    }

    private onLeavePiP = () => {
        this.isPiP = false;
        this.handleVisibilityChanged?.();
    }

    stopObserving() {
        getIntersectionObserver()?.unobserve(this.element);
        getResizeObserver()?.unobserve(this.element);
        (this.element as HTMLVideoElement).removeEventListener(
            'enterpictureinpicture',
            this.onEnterPiP,
        );
        (this.element as HTMLVideoElement).removeEventListener(
            'leavepictureinpicture',
            this.onLeavePiP,
        )
    }

    width(): number {
        return this.element.clientWidth;
    }
}

// does not account for occlusion by other elements
function isElementInViewport(el: HTMLElement) {
    let top = el.offsetTop;
    let left = el.offsetLeft;
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const {hidden} = el;
    const {opacity, display} = getComputedStyle(el);

    while (el.offsetParent) {
        el = el.offsetParent as HTMLElement;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top < window.pageYOffset + window.innerHeight &&
        left < window.pageXOffset + window.innerWidth &&
        top + height > window.pageYOffset &&
        left + width > window.pageXOffset &&
        !hidden &&
        (opacity !== '' ? parseFloat(opacity) > 0 : true) &&
        display !== 'none'
    );
}