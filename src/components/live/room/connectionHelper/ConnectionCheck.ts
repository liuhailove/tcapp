import {EventEmitter} from "events";
import TypedEmitter from "typed-emitter/rxjs";
import {
    Checker,
    CheckInfo,
    CheckStatus,
    InstantiableCheck
} from "@/components/live/room/connectionHelper/checks/Checker";
import {WebSocketCheck} from "@/components/live/room/connectionHelper/checks/websocket";
import {WebRTCCheck} from "@/components/live/room/connectionHelper/checks/webrtc";
import {TURNCheck} from "@/components/live/room/connectionHelper/checks/turn";
import {ReconnectCheck} from "@/components/live/room/connectionHelper/checks/reconnect";
import {PublishAudioCheck} from "@/components/live/room/connectionHelper/checks/publishAudio";
import {PublishVideoCheck} from "@/components/live/room/connectionHelper/checks/publishVideo";

export type{CheckInfo, CheckStatus};

export class ConnectionCheck extends (EventEmitter as new () => TypedEmitter<ConnectionCheckCallbacks>) {
    token: string;

    url: string;

    private checkResults: Map<number, CheckInfo> = new Map<number, CheckInfo>();

    constructor(url: string, token: string) {
        super();
        this.url = url;
        this.token = token;
    }

    private getNextCheckId() {
        const nextId = this.checkResults.size;
        this.checkResults.set(nextId, {
            logs: [],
            status: CheckStatus.IDLE,
            name: '',
            description: '',
        });
        return nextId;
    }

    private updateCheck(checkId: number, info: CheckInfo) {
        this.checkResults.set(checkId, info);
        this.emit('checkUpdate', checkId, info);
    }

    isSuccess() {
        return Array.from(this.checkResults.values()).every((r) => r.status !== CheckStatus.FAILED);
    }

    getResults() {
        return Array.from(this.checkResults.values());
    }

    async createAndRunCheck<T extends Checker>(check: InstantiableCheck<T>) {
        const checkId = this.getNextCheckId();
        const test = new check(this.url, this.token);
        const handleUpdate = (info: CheckInfo) => {
            this.updateCheck(checkId, info);
        };
        test.on('update', handleUpdate);
        const result = await test.run();
        test.off('update', handleUpdate);
        return result;
    }

    async checkWebsocket() {
        return this.createAndRunCheck(WebSocketCheck);
    }

    async checkWebRTC() {
        return this.createAndRunCheck(WebRTCCheck);
    }

    async checkTURN() {
        return this.createAndRunCheck(TURNCheck);
    }

    async checkReconnect() {
        return this.createAndRunCheck(ReconnectCheck);
    }

    async checkPublishAudio() {
        return this.createAndRunCheck(PublishAudioCheck);
    }

    async checkPublishVideo() {
        return this.createAndRunCheck(PublishVideoCheck);
    }
}

type ConnectionCheckCallbacks = {
    checkUpdate: (id: number, info: CheckInfo) => void;
};