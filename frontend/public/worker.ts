/* eslint-disable no-undef, no-unused-vars */

/**
 * Service worker utilities.
 * Inspired by https://github.com/deebloo/worker.
 */

export type $Worker = (fn: (event: MessageEvent) => void) => Worker;
export const $worker: $Worker = fn => {
  const blob: Blob = new Blob(['self.onmessage=', fn.toString(), ';'], {type: 'text/javascript'});
  const url: string = URL.createObjectURL(blob);
  const worker: Worker = new Worker(url);
  URL.revokeObjectURL(url);

  return worker;
};

export type $Run = (worker: Worker) => (data?: any) => Promise<MessageEvent>;
export const $run: $Run = worker => data => {
  worker.postMessage(data);

  return new Promise((resolve, reject) => {
    worker.onmessage = resolve;
    worker.onerror = reject;
  });
};
