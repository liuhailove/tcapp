import {RoomConnectOptions, RoomOptions} from "@/components/live/options";
import {EventEmitter} from "events";
import TypedEventEmitter from "typed-emitter";

type LogMessage = {
    level: 'info' | 'waring' | 'error';
    message: string;
};

export enum CheckStatus {
    IDLE,
    RUNNING,
    SKIPPED,
    SUCCESS,
    FAILED
}

export type CheckInfo = {
    name: string,
    logs: Array<LogMessage>;
    status: CheckStatus;
    description: string;
};

export interface CheckerOptions {
    errorsAsWarnings?: boolean;
    roomOptions?: RoomOptions;
    connectOptions?: RoomConnectOptions;
}

export abstract class Checker extends (EventEmitter as new () => TypedEventEmitter<CheckerCallbacks>) {
  protected url:string;

  protected token:string;

  // TODO
  room:Room;

}

export type InstantiableCheck<T extends Checker> = {
    new(url: string, token: string, options?: CheckerOptions): T;
};
type CheckerCallbacks = {
    update: (info: CheckInfo) => void;
};