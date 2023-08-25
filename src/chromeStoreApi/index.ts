import { linksStore } from '../store';
import { downloadedAtStorage } from './downloadedAt';
import { downloadedLinksStorage } from './downloadedLinks';
import { initialLinksStorage } from './initialLinks';

export const restoreStore = async () => {
  downloadedAtStorage.get((downloadedAt) => {
    if (!downloadedAt) {
      downloadedAtStorage.set(linksStore.downloadedAt.getTime(), () => {});
    }
  });

  initialLinksStorage.get((initialLinks) => {
    if (!initialLinks) {
      initialLinksStorage.set(linksStore.initialLinks, () => {});
    }
  });

  downloadedLinksStorage.get((downloadedLinks) => {
    if (!downloadedLinks) {
      downloadedLinksStorage.set(linksStore.downloadedLinks, () => {});
    }
  });
};
