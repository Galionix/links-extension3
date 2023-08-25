export const downloadedAtStorage = {
  get: (cb: (downloadedAt: number) => void) => {
    chrome.storage.sync.get(['downloadedAt'], (result) => {
      cb(result.downloadedAt);
    });
  },
  set: (value: number, cb: () => void) => {
    chrome.storage.sync.set(
      {
        downloadedAt: value,
      },
      () => {
        cb();
      }
    );
  },
};
