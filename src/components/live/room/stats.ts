export const monitorFrequency = 2000;

// 发送者和接收者的关键统计信息
interface SenderStats {
    // 发送的数据包数量
    packetsSent?: number;

    /**
     * 发送的字节数
     */
    bytesSent?: number;

    /**
     * 远程感知到的抖动
     */
    jitter?: number;

    /**
     * 远程报告丢失的数据包
     */
    packetsLost?: number;

    /**
     * 远程报告RTT
     */
    roundTripTime?: number;

    /**
     * 出站流ID
     */
    streamId?: string;

    timestamp: number;
}

export interface AudioSenderStats extends SenderStats {
    type: 'audio';
}

export interface VideoSenderStats extends SenderStats {
    type: 'video';

    firCount: number;

    pliCount: number;

    nackCount: number;

    rid: string;

    frameWidth: number;

    frameHeight: number;

    framesSent: number;

    // bandwidth, cpu, other, none
    qualityLimitationReason: string;

    qualityLimitationResolutionChanges: number;

    retransmittedPacketsSent: number;
}

interface ReceiverStats {
    jitterBufferDelay?: number;

    /**
     * 远程报告丢失的数据包
     */
    packetsLost?: number;

    /**
     * 发送的数据包数量
     */
    packetsReceived?: number;

    bytesReceived?: number;

    streamId?: string;

    jitter?: number;

    timestamp: number;
}

export interface AudioReceiverStats extends ReceiverStats {
    type: 'audio';

    concealedSamples?: number;

    concealmentEvents?: number;

    silentConcealedSamples?: number;

    silentConcealmentEvents?: number;

    totalAudioEnergy?: number;

    totalSamplesDuration?: number;
}

export interface VideoReceiverStats extends ReceiverStats {
    type: 'video';

    framesDecoded: number;

    framesDropped: number;

    framesReceived: number;

    frameWidth?: number;

    frameHeight?: number;

    firCount?: number;

    pliCount?: number;

    nackCount?: number;

    decoderImplementation?: string;

    mimeType?: string;
}

export function computeBitrate<T extends ReceiverStats | SenderStats>(
    currentStats: T,
    prevStats?: T,
): number {
    if (!prevStats) {
        return 0;
    }
    let bytesNow: number | undefined;
    let bytesPrev: number | undefined;
    if ('bytesReceived' in currentStats) {
        bytesNow = (currentStats as ReceiverStats).bytesReceived;
        bytesPrev = (prevStats as ReceiverStats).bytesReceived;
    } else if ('bytesSent' in currentStats) {
        bytesNow = (currentStats as SenderStats).bytesSent;
        bytesPrev = (prevStats as SenderStats).bytesSent;
    }
    if (
        bytesNow === undefined ||
        bytesPrev === undefined ||
        currentStats.timestamp === undefined ||
        prevStats.timestamp === undefined
    ) {
        return 0;
    }
    return ((bytesNow - bytesPrev) * 8 * 1000) / (currentStats.timestamp - prevStats.timestamp);
}
