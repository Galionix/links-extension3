import { TLink } from '../store';

export const downloadedLinksStorage = {
  get: (cb: (links: TLink[]) => void) => {
    chrome.storage.sync.get(['downloadedLinks'], (result) => {
      cb(result.downloadedLinks);
    });
  },
  set: (value: TLink[], cb: () => void) => {
    chrome.storage.sync.set(
      {
        downloadedLinks: value,
      },
      () => {
        cb();
      }
    );
  },
};
