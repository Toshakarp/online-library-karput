const queue: (() => Promise<void>)[] = [];
let isProcessing = false;
const intervalMs = 1000;

const processQueue = async () => {
  if (isProcessing) return;
  isProcessing = true;

  while (queue.length > 0) {
    const task = queue.shift();
    if (task) {
      await task();
      if (queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }
  }

  isProcessing = false;
};

export const rateLimiterUtil = {
  enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      processQueue();
    });
  },
};
