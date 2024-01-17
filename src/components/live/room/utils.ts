// 分隔符
import {ClientInfo, ClientInfo_SDK} from "@/components/live/protocol/tc_models_pb";
import {protocolVersion, version} from "@/components/live/version";
import {DetectableBrowser, getBrowser} from "@/components/live/utils/browserParser";

const separator = '|';

export const ddExtensionURI =
    'https://aomediacodec.github.io/av1-rtp-spec/#dependency-descriptor-rtp-header-extension';

export function unpackStreamId(packed: string): string[] {
    const parts = packed.split(separator);
    if (parts.length > 1) {
        return [parts[0], packed.substr(parts[0].length + 1)];
    }
    return [packed, ''];
}

export async function sleep(duration: number): Promise<void> {
    return new Promise((resolve => setTimeout(resolve, duration)));
}

export function supportsTransceiver() {
    return 'addTransceiver' in RTCPeerConnection.prototype;
}

export function supportsAddTrack() {
    return 'addTrack' in RTCPeerConnection.prototype;
}

export function supportsAdaptiveStream() {
    return typeof ResizeObserver !== undefined && typeof IntersectionObserver !== undefined;
}

export function supportsDynacast() {
    return supportsTransceiver();
}

export function supportsAV1(): boolean {
    if (!('getCapabilities' in RTCRtpSender)) {
        return false;
    }

    const capabilities = RTCRtpSender.getCapabilities('video');
    let hasAV1 = false;
    if (capabilities) {
        for (const codec of capabilities.codecs) {
            if (codec.mimeType === 'video/AV1') {
                hasAV1 = true;
                break;
            }
        }
    }
    return hasAV1;
}

export function supportsVP9(): boolean {
    if (!('getCapabilities' in RTCRtpSender)) {
        // 从技术上讲，FireFox 支持 VP9，但 SVC 发布已损坏
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1633876
        return false;
    }
    const capabilities = RTCRtpSender.getCapabilities('video');
    let hasVP9 = false;
    if (capabilities) {
        for (const codec of capabilities.codecs) {
            if (codec.mimeType === 'video/VP9') {
                hasVP9 = true;
                break;
            }
        }
    }
    return hasVP9;
}

export function isSVCCodec(codec?: string): boolean {
    return codec === 'av1' || codec === 'vp9';
}

export function supportsSetSinkId(elm?: HTMLMediaElement): boolean {
    if (!document) {
        return false;
    }
    if (!elm) {
        elm = document.createElement('audio');
    }
    return 'setSinkId' in elm;
}

const setCodecPreferencesVersions: Record<DetectableBrowser, string> = {
    Chrome: '100',
    Safari: '15',
    Firefox: '100',
};

export function supportsSetCodecPreferences(transceiver: RTCRtpTransceiver): boolean {
    if (!isWeb()) {
        return false;
    }
    if (!('setCodecPreferences' in transceiver)) {
        return false;
    }
    const browser = getBrowser();
    if (!browser?.name || !browser.version) {
        // version is required
        return false;
    }
    const v = setCodecPreferencesVersions[browser.name]
    if (v) {
        return compareVersions(browser.version, v) >= 0;
    }
    return false;
}

export function isBrowserSupported() {
    return supportsTransceiver() || supportsAddTrack();
}

export function isFireFox(): boolean {
    return getBrowser()?.name === 'Firefox';
}

export function isChromiumBased(): boolean {
    return getBrowser()?.name === 'Chrome';
}

export function isSafari(): boolean {
    return getBrowser()?.name === 'Safari';
}

export function isMobile(): boolean {
    if (!isWeb()) {
        return false;
    }
    return /Tablet|iPad|Mobile|Android|BlackBerry/.test(navigator.userAgent);
}

export function isWeb(): boolean {
    return typeof document !== 'undefined';
}

export function isReactNative(): boolean {
    // navigator.product is deprecated on browsers, but will be set appropriately for react-native.
    return navigator.product == 'ReactNative';
}

export function isCloud(serverUrl: URL) {
    return serverUrl.hostname.endsWith(".tc.cloud");
}

function getTCReactNativeInfo(): TcReactNativeInfo | undefined {
    // 仅为 React Native 定义的全局。
    // @ts-ignore
    if (global && global.TCReactNativeGlobal) {
        // @ts-ignore
        return global.TCReactNativeGlobal as TCReactNativeInfo;
    }
}

export function getReactNativeOs(): string | undefined {
    if (!isReactNative()) {
        return undefined;
    }

    let info = getTCReactNativeInfo();
    if (info) {
        return info.platform;
    }

    return undefined;
}

export function getDevicePixelRatio(): number {
    if (isWeb()) {
        return window.devicePixelRatio;
    }

    if (isReactNative()) {
        let info = getTCReactNativeInfo();
        if (info) {
            return info.devicePixelRatio;
        }
    }

    return 1;
}

export function compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.');
    const parts2 = v2.split('.');
    const k = Math.min(parts1.length, parts2.length);
    for (let i = 0; i < k; ++i) {
        const p1 = parseInt(parts1[i], 10);
        const p2 = parseInt(parts2[i], 10);
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
        if (i === k - 1 && p1 === p2) return 0;
    }
    if (v1 === '' && v2 !== '') {
        return -1;
    } else if (v2 === '') {
        return 1;
    }
    return parts1.length == parts2.length ? 0 : parts1.length < parts2.length ? -1 : 1;
}

function roDispatchCallback(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
        (entry.target as ObservableMediaElement).handleResize(entry);
    }
}

function ioDispatchCallback(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
        (entry.target as ObservableMediaElement).handleVisibilityChanged(entry);
    }
}

let resizeObserver: ResizeObserver | null = null;

export const getResizeObserver = () => {
    if (!resizeObserver) {
        resizeObserver = new ResizeObserver(roDispatchCallback);
    }
    return resizeObserver;
}

let intersectionObserver: IntersectionObserver | null = null;
export const getIntersectionObserver = () => {
    if (!intersectionObserver) {
        intersectionObserver = new IntersectionObserver(ioDispatchCallback, {
            root: null,
            rootMargin: '0px',
        });
    }
    return intersectionObserver;
}

export interface ObservableMediaElement extends HTMLMediaElement {
    handleResize: (entry: ResizeObserverEntry) => void;
    handleVisibilityChanged: (entry: IntersectionObserverEntry) => void;
}

export function getClientInfo(): ClientInfo {
    const info = ClientInfo.fromJson({
        sdk: ClientInfo_SDK.JS,
        protocol: protocolVersion,
        version,
    });

    if (isReactNative()) {
        info.os = getReactNativeOs() ?? '';
    }
    return info;
}

let emptyVideoStreamTrack: MediaStreamTrack | undefined;

export function getEmptyVideoStreamTrack() {
    if (!emptyVideoStreamTrack) {
        emptyVideoStreamTrack = createDummyVideoStreamTrack();
    }
    return emptyVideoStreamTrack;
}

export function createDummyVideoStreamTrack(
    width: number = 16,
    height: number = 16,
    enabled: boolean = false,
    paintContent: boolean = false,
) {
    const canvas = document.createElement('canvas');
    // 画布大小默认设置为 16，因为电子应用程序似乎会因较小的值而失败
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx?.fillRect(0, 0, canvas.width, canvas.height);
    if (paintContent && ctx) {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'grey';
        ctx.fill();
    }
    // @ts-ignore
    const dummyStream = canvas.captureStream();
    const [dummyTrack] = dummyStream.getTracks();
    if (!dummyStream) {
        throw Error('Could not get empty media stream video track');
    }
    dummyTrack.enabled = enabled;

    return dummyTrack;
}

let emptyAudioStreamTrack: MediaStreamTrack | undefined;

export function getEmptyAudioStreamTrack() {
    if (!emptyAudioStreamTrack) {
        // implementation adapted from https://blog.mozilla.org/webrtc/warm-up-with-replacetrack/
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const dst = ctx.createMediaStreamDestination();
        oscillator.connect(dst);
        oscillator.start();
        [emptyAudioStreamTrack] = dst.stream.getAudioTracks();
        if (!emptyAudioStreamTrack) {
            throw Error('Could not get empty media stream audio track');
        }
        emptyAudioStreamTrack.enabled = false;
    }
    return emptyAudioStreamTrack;
}

export class Future<T> {
    promise: Promise<T>;

    resolve?: (arg: T) => void;

    reject?: (e: any) => void;

    onFinally?: () => void;

    constructor(
        futureBase?: (resolve: (arg: T) => void, reject: (e: any) => void) => void,
        onFinally?: () => void,
    ) {
        this.onFinally = onFinally;
        this.promise = new Promise<T>(async (resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            if (futureBase) {
                await futureBase(resolve, reject);
            }
        }).finally(() => this.onFinally?.());
    }
}

export type AudioAnalyserOptions = {

    /**
     * 如果设置为 true，分析器将使用基础媒体流轨道的克隆版本，该版本不会受到轨道静音的影响。
     * 在实现“看起来你静音，但试图说话”之类的情况时，对于本地轨道很有用。
     * 默认为假
     */
    cloneTrack?: boolean;
    /**
     * see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
     */
    fftSize?: number;
    /**
     * see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/smoothingTimeConstant
     */
    smoothingTimeConstant?: number;
    /**
     * see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/minDecibels
     */
    minDecibels?: number;
    /**
     * see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/maxDecibels
     */
    maxDecibels?: number;
};

/**
 * 创建并返回附加到所提供轨道的分析器网络音频节点。
 * 另外返回一个便捷方法“calculateVolume”以在该轨道上执行即时音量读数。
 * 调用返回的“cleanup”函数来关闭为此助手实例创建的audioContext
 */
export function createAudioAnalyser(
    track: LocalAudioTrack | RemoteAudioTrack,
    options?: AudioAnalyserOptions,
) {
    const opts = {
        cloneTrack: false,
        fftSize: 2048,
        smoothingTimeConstant: 0.8,
        minDecibels: -100,
        maxDecibels: -80,
        ...options,
    };
    const audioContext = getNewAudioContext();

    if (!audioContext) {
        throw new Error('Audio Context not supported on this browser');
    }
    const streamTrack = opts.cloneTrack ? track.mediaStreamTrack.clone() : track.mediaStreamTrack;
    const mediaStreamSource = audioContext.createMediaStreamSource(new MediaStream([streamTrack]))
    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = opts.minDecibels;
    analyser.maxDecibels = opts.maxDecibels;
    analyser.fftSize = opts.fftSize;
    analyser.smoothingTimeConstant = opts.smoothingTimeConstant;

    mediaStreamSource.connect(analyser);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    /**
     * 计算曲目的当前音量，范围为0到1
     */
    const calculateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (const amplitude of dataArray) {
            sum += Math.pow(amplitude / 255, 2);
        }
        const volume = Math.sqrt(sum / dataArray.length);
        return volume;
    };

    const cleanup = () => {
        audioContext.close();
        if (opts.cloneTrack) {
            streamTrack.stop();
        }
    };

    return {calculateVolume, analyser, cleanup};
}

export class Mutex {
    private _locking: Promise<void>;

    private _locks: number;

    constructor() {
        this._locking = Promise.resolve();
        this._locks = 0;
    }

    isLocked() {
        return this._locks > 0;
    }

    lock() {
        this._locks += 1;

        let unlockNext: () => void;

        const willLock = new Promise<void>(
            (resolve) =>
                (
                    unlockNext = () => {
                        this._locks -= 1;
                        resolve();
                    }
                )
        );

        const willUnlock = this._locking.then(() => unlockNext);

        this._locking = this._locking.then(() => willLock);

        return willUnlock;
    }

}