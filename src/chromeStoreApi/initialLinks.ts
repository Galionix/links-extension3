import { TLink } from '../store';

export const initialLinksStorage = {
  get: (cb: (links: TLink[]) => void) => {
    chrome.storage.sync.get(['initialLinks'], (result) => {
      cb(result.initialLinks);
    });
  },
  set: (value: TLink[], cb: () => void) => {
    chrome.storage.sync.set(
      {
        initialLinks: value,
      },
      () => {
        cb();
      }
    );
  },
};
