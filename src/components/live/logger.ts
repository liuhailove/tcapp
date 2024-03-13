import * as log from 'loglevel'

export enum LogLevel {
    trace = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    silent = 5,
}

export enum LoggerNames {
    Default = "tc",
    Room = "tc-room",
    Participant = "tc-participant",
    Track = "tc-track",
    Publication = "tc-track-publication",
    Engine = "tc-engine",
    Signal = "tc-signal",
    PCManager = "tc-pc-manager",
    PCTransport = "tc-pc-transport",
    E2EE = "tc-e2ee",
}

type LogLevelString = keyof typeof LogLevel;

export type StructuredLogger = {
    trace: (msg: string, context?: object) => void;
    debug: (msg: string, context?: object) => void;
    info: (msg: string, context?: object) => void;
    warn: (msg: string, context?: object) => void;
    error: (msg: string, context?: object) => void;
    getLevel: () => number;
}

const tcLogger = log.getLogger("tc")

tcLogger.setDefaultLevel(LogLevel.debug)

export default tcLogger as StructuredLogger

/**
 * @internal
 */
export function getLogger(name: string) {
    const logger = log.getLogger(name);
    logger.setDefaultLevel(tcLogger.getLevel());
    return logger as StructuredLogger;
}

export function setLogLevel(level: LogLevel | LogLevelString, loggerName?: LoggerNames) {
    if (loggerName) {
        log.getLogger(loggerName).setLevel(level);
    }
}
export type LogExtension = (level: LogLevel, msg: string, context?: object) => void;

/**
 * 使用它来连接日志记录功能，以允许将内部 TcApp 日志发送到第三方服务
 * 如果设置，浏览器日志将丢失其堆栈跟踪信息（请参阅 https://github.com/pimterry/loglevel#writing-plugins）
 */
export function setLogExtension(extension: LogExtension) {
    const originalFactory = tcLogger.methodFactory;

    tcLogger.methodFactory = (methodName, configLevel, loggerName) => {
        const rawMethod = originalFactory(methodName, configLevel, loggerName);

        const logLevel = LogLevel[methodName as LogLevelString];
        const needLog = logLevel >= configLevel && logLevel < LogLevel.silent;

        return (msg, context?: [msg: string, context: object]) => {
            if (context) {
                rawMethod(msg, context);
            } else {
                rawMethod(msg);
            }
            if (needLog) {
                extension(logLevel, msg, context);
            }
        };
    };
    // 请务必调用 setLevel 方法才能应用插件
    tcLogger.setLevel(tcLogger.getLevel());
}

export const workerLogger = log.getLogger('tc-e2ee') as StructuredLogger;