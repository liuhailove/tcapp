/**
 * 可以用平台特定实现覆盖的计时器
 * 确保他们被触发。 这些应该在关键的时候使用
 * 定时器准时触发。
 */

export default class CriticalTimers {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    static setTimeout = (...args: Parameters<typeof setTimeout>) => setTimeout(...args);

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    static setInternal = (...args: Parameters<typeof setInterval>) => setInterval(...args);

    static clearTimeout = (...args: Parameters<typeof clearTimeout>) => clearTimeout(...args);

    static clearInterval = (...args: Parameters<typeof clearInterval>) => clearInterval(...args);
}