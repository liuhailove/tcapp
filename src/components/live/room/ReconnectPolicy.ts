/** 控制客户端的重新连接 */
export interface ReconnectPolicy {
    /** 检测到断开连接后调用
     *
     * @returns {number | null} 延迟下一次重新连接尝试的时间量（以毫秒为单位），“null”表示停止重试。
     */
    nextRetryDelayInMs(context: ReconnectContext): number | null;
}

export interface ReconnectContext {
    /**
     * 重新连接尝试失败的次数
     */
    readonly retryCount: number;

    /**
     * 自断开连接以来经过的时间（以毫秒为单位）。
     */
    readonly elapsedMs: number;

    /**
     * 重试的原因
     */
    readonly retryReason?: Error;

    readonly serverUrl?: string;
}