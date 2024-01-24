import {Checker} from "@/components/live/room/connectionHelper/checks/Checker";
import {SignalClient} from "@/components/live/api/SignalClient";

export class WebSocketCheck extends Checker {
    get description(): string {
        return 'Connecting to signal connection via WebSocket';
    }

    protected async perform(): Promise<void> {
        if (this.url.startsWith('ws:') || this.url.startsWith('http:')) {
            this.appendWarning('Server is insecure, clients may block connections to it');
        }

        let signalClient = new SignalClient();
        const joinRes = await signalClient.join(this.url, this.token, {
            autoSubscribe: true,
            maxRetries: 0,
        });
        this.appendWarning(`Connected to server, version ${joinRes.serverVersion}.`);
        await signalClient.close();
    }
}
