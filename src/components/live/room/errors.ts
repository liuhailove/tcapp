export class TcError extends Error {
    code: number;

    constructor(code: number, message?: string) {
        super(message || 'an error has occured');
        this.code = code;
    }
}

export const enum ConnectionErrorReason {
    NotAllowed,
    ServerUnreachable,
    InternalError,
    Cancelled,
}

export class ConnectionError extends TcError {
    status?: number;

    reason?: ConnectionErrorReason;

    constructor(message?: string, reason?: ConnectionErrorReason, status?: number) {
        super(1, message);
        this.status = status;
        this.reason = reason;
    }
}

export class DeviceUnsupportedError extends TcError {
    constructor(message?: string) {
        super(21, message ?? 'device is unsupported');
    }
}

export class TrackInvalidError extends TcError {
    constructor(message?: string) {
        super(20, message ?? 'track is invalid');
    }
}

export class UnsupportedServer extends TcError {
    constructor(message?: string) {
        super(10, message ?? 'unsupported server');
    }
}

export class UnexpectedConnectionState extends TcError {
    constructor(message?: string) {
        super(12, message ?? 'unexpected connection state');
    }
}

export class NegotiationError extends TcError {
    constructor(message?: string) {
        super(13, message ?? 'unable to negotiate');
    }
}

export class PublishDataError extends TcError {
    constructor(message?: string) {
        super(13, message ?? 'unable to publish data');
    }
}

export enum MediaDeviceFailure {
    // 用户拒绝权限
    PermissionDenied = 'PermissionDenied',
    // 设备不可用
    NotFound = 'NotFound',
    // 设备正在使用中。 在 Windows 上，一次只能有一个选项卡访问设备。
    DeviceInUse = 'DeviceInUse',
    Other = 'Other',
}

export namespace MediaDeviceFailure {
    export function getFailure(error: any): MediaDeviceFailure | undefined {
        if (error && 'name' in error) {
            if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                return MediaDeviceFailure.NotFound;
            }
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                return MediaDeviceFailure.PermissionDenied;
            }
            if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                return MediaDeviceFailure.DeviceInUse;
            }
            return MediaDeviceFailure.Other;
        }
    }
}