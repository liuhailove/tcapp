import {Mutex} from "@/components/live/room/utils";

type QueueTask<T> = () => PromiseLike<T>;

enum QueueTskStatus {
    'WAITING',
    'RUNNING',
    'COMPLETED'
}

type QueueTaskInfo = {
    id: number;
    enqueuedAt: number;
    executedAt?: number;
    status: QueueTskStatus;
};

export class AsyncQueue {
    private pendingTask: Map<number, QueueTaskInfo>;

    private taskMutex: Mutex;

    private nextTaskIndex: number;

    constructor() {
        this.pendingTask = new Map();
        this.taskMutex = new Mutex();
        this.nextTaskIndex = 0;
    }

    async run<T>(task: QueueTask<T>) {
        const taskInfo: QueueTaskInfo = {
            id: this.nextTaskIndex++,
            enqueuedAt: Date.now(),
            status: QueueTskStatus.WAITING,
        };
        this.pendingTask.set(taskInfo.id, taskInfo);
        const unlock = await this.taskMutex.lock();
        try {
            taskInfo.executedAt = Date.now();
            taskInfo.status = QueueTskStatus.RUNNING;
            return await task();
        } finally {
            taskInfo.status = QueueTskStatus.COMPLETED;
            this.pendingTask.delete(taskInfo.id);
            unlock();
        }
    }

    async flush() {
        return this.run(async () => {
        });
    }

    snapshot() {
        return Array.from(this.pendingTask.values());
    }
}