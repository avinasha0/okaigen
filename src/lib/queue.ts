type Job<T> = {
  id: string;
  data: T;
  resolve: () => void;
  reject: (err: Error) => void;
};

export class SimpleQueue<T> {
  private queue: Job<T>[] = [];
  private processing = false;
  private concurrency: number;

  constructor(
    private processor: (data: T) => Promise<void>,
    concurrency: number = 1
  ) {
    this.concurrency = concurrency;
  }

  async add(data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id: Math.random().toString(36).slice(2),
        data,
        resolve,
        reject,
      });
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const batch = this.queue.splice(0, this.concurrency);
    await Promise.all(
      batch.map(async (job) => {
        try {
          await this.processor(job.data);
          job.resolve();
        } catch (err) {
          job.reject(err instanceof Error ? err : new Error(String(err)));
        }
      })
    );

    this.processing = false;
    if (this.queue.length > 0) {
      setImmediate(() => this.process());
    }
  }
}
