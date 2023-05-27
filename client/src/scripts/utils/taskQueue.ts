// runs asynchronous tasks
export class TaskQueue<T extends Function> {
    #tasks: T[] = []
    maxConcurrentTasks: number = 0;
    #currentTasks = 0;
    currentTotalTasks = 0;
    #onFullTasks: Function[] = [];
    #onAlmostFullTasks: Function[] = [];

    constructor(maxConcurrentTasks: number = 3) {
        this.maxConcurrentTasks = maxConcurrentTasks
    }

    enqueue(task: T) {
        this.currentTotalTasks++;
        if (this.#currentTasks < this.maxConcurrentTasks) {
            this.#doTask(task);
            return;
        }

        this.#tasks.push(task);
    }

    // Runs the task at the top of the queue
    dequeue() {
        if (this.#tasks.length == 0) {
            return;
        }

        this.#doTask(this.#tasks.shift() as T);
    }

    emitOnFull(fn: Function) {
        this.#onFullTasks.push(fn)
    }

    emitOnAlmostFull(fn: Function) {
        this.#onAlmostFullTasks.push(fn);
    }

    async #doTask(task: T) {
        this.#currentTasks++;
        // The place of the task in the running tasks
        const taskPlacement = this.#currentTasks;

        // Calls all on full tasks
        if (this.#currentTasks == this.maxConcurrentTasks) {
            this.#onFull();
        }

        try {
            await task()
        }
        catch (err) {
            console.error(`${task} in task queue at ${taskPlacement} failed with error: ${err}`)
        }
        finally {
            if (this.currentTotalTasks < this.maxConcurrentTasks) {
                this.#onAlmostFull();
            }

            this.currentTotalTasks--;
            this.#currentTasks--;
            this.dequeue();
        }
    }

    #onFull() {
        this.#onFullTasks.forEach(emit => emit());
    }

    #onAlmostFull() {
        this.#onAlmostFullTasks.forEach(emit => emit());
    }
}
