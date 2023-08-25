'use strict';

import { restoreStore } from './chromeStoreApi';
import { downloadedAtStorage } from './chromeStoreApi/downloadedAt';
import { downloadedLinksStorage } from './chromeStoreApi/downloadedLinks';
import { initialLinksStorage } from './chromeStoreApi/initialLinks';
import {
  MessageResponse,
  MessageType,
  TUpadatedMessage,
  TUpdateErrorMessage,
} from './messages/types';
import './popup.css';
import { TLink } from './store';

(function () {
  restoreStore();
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  // const counterStorage = {
  //   get: (cb: (count: number) => void) => {
  //     chrome.storage.sync.get(['count'], (result) => {
  //       cb(result.count);
  //     });
  //   },
  //   set: (value: number, cb: () => void) => {
  //     chrome.storage.sync.set(
  //       {
  //         count: value,
  //       },
  //       () => {
  //         cb();
  //       }
  //     );
  //   },
  // };
  const updateLinkDisplay = (link: TLink | undefined) => {
    // const area = document.getElementById('related-urls') as HTMLTextAreaElement;
    // if (link) {
    //   area.value = link.related.join('\n');
    // } else {
    //   area.value = 'No links found';
    // }

    const linksContainer = document.getElementById(
      'links-container'
    ) as HTMLDivElement;

    // remove all children
    while (linksContainer.firstChild) {
      linksContainer.removeChild(linksContainer.firstChild);
    }

    const linksList = document.createElement('ul');
    linksList.classList.add('links-list');
    linksContainer.appendChild(linksList);

    link?.related.forEach((link) => {
      const li = document.createElement('li');
      li.classList.add('link-item');
      const a = document.createElement('a');
      a.classList.add('link');
      a.onclick = (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: link });
      };
      // a.href = link;
      // a.target = '_blank';
      a.innerText = link;
      li.appendChild(a);
      linksList.appendChild(li);
    });

    if (!link) {
      const li = document.createElement('li');
      li.classList.add('link-item');
      li.innerText = 'No links found';
      linksList.appendChild(li);
    }
  };
  // get current url
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    console.log('url: ', url);
    const domainPart = url?.split('/')[2].replace('www.', '').trim();
    console.log('domainPart: ', domainPart);
    document.getElementById('domain')!.innerHTML = domainPart!;

    const summaryLinks: TLink[] = [];

    initialLinksStorage.get((links: TLink[]) => {
      summaryLinks.push(...links);
      // get downloaded links
      downloadedLinksStorage.get((links: TLink[]) => {
        summaryLinks.push(...links);
        console.log('downloadedLinksStorage: ', links);
        console.log('summaryLinks: ', summaryLinks);
        console.log('domainPart: ', domainPart);

        // find link with domainPart
        const link = summaryLinks.find((link) => domainPart === link.domain);
        console.log('link: ', link);
        updateLinkDisplay(link);
      });
    });
  });

  // function setupCounter(initialValue = 0) {
  //   document.getElementById('counter')!.innerHTML = initialValue.toString();

  //   document.getElementById('incrementBtn')!.addEventListener('click', () => {
  //     updateCounter({
  //       type: 'INCREMENT',
  //     });
  //   });

  //   document.getElementById('decrementBtn')!.addEventListener('click', () => {
  //     updateCounter({
  //       type: 'DECREMENT',
  //     });
  //   });
  // }

  // function updateCounter({ type }: { type: string }) {
  //   counterStorage.get((count: number) => {
  //     let newCount: number;

  //     if (type === 'INCREMENT') {
  //       newCount = count + 1;
  //     } else if (type === 'DECREMENT') {
  //       newCount = count - 1;
  //     } else {
  //       newCount = count;
  //     }

  //     counterStorage.set(newCount, () => {
  //       document.getElementById('counter')!.innerHTML = newCount.toString();

  //       // Communicate with content script of
  //       // active tab by sending a message
  //       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //         const tab = tabs[0];

  //         chrome.tabs.sendMessage(
  //           tab.id!,
  //           {
  //             type: 'COUNT',
  //             payload: {
  //               count: newCount,
  //             },
  //           },
  //           (response) => {
  //             console.log('Current count value passed to contentScript file');
  //           }
  //         );
  //       });
  //     });
  //   });
  // }

  // function restoreCounter() {
  //   // Restore count value
  //   counterStorage.get((count: number) => {
  //     if (typeof count === 'undefined') {
  //       // Set counter value as 0
  //       counterStorage.set(0, () => {
  //         setupCounter(0);
  //       });
  //     } else {
  //       setupCounter(count);
  //     }
  //   });
  // }

  // document.addEventListener('DOMContentLoaded', restoreCounter);

  // // Communicate with background file by sending a message
  // chrome.runtime.sendMessage(
  //   {
  //     type: 'GREETINGS',
  //     payload: {
  //       message: 'Hello, my name is Pop. I am from Popup.',
  //     },
  //   },
  //   (response) => {
  //     console.log(response.message);
  //   }
  // );

  const updateLastUpdated = () => {
    const lastUpdated = document.getElementById(
      'downloadedAt'
    ) as HTMLSpanElement;
    downloadedAtStorage.get((downloadedAt: number) => {
      lastUpdated.innerText = `Last updated: ${new Date(
        downloadedAt
      ).toLocaleString()}`;
    });
  };

  document.getElementById('update-links')!.addEventListener('click', () => {
    chrome.runtime.sendMessage(
      {
        type: MessageType.CHECK_FOR_UPDATE,
      },
      async (response: TUpadatedMessage | TUpdateErrorMessage) => {
        if (!response) return;
        console.log('response: ', response);

        if (response.type === MessageResponse.UPDATED) {
          console.log('fetched links: ', response.payload);
          // save links to storage
          downloadedLinksStorage.set(response.payload, () => {
            console.log('links saved to storage');

            downloadedAtStorage.set(Date.now(), () => {
              console.log('downloadedAt updated');
              updateLastUpdated();
              initialLinksStorage.get((links: TLink[]) => {
                const domainPart = document.getElementById('domain')!.innerHTML;
                const link = [...links, ...response.payload].find(
                  (link) => domainPart === link.domain
                );
                updateLinkDisplay(link);
              });
            });
          });
          // update downloadedAt
        }
        if (response.type === MessageResponse.UPDATE_ERROR) {
          console.log('error: ', response.reason);
        }

        // console.log('CHECK_FOR_UPDATE response:', response.message);
      }
    );
  });

  // ask background script to check update if time is more than 1 hour
  downloadedAtStorage.get((downloadedAt: number) => {
    // log time downloadedAt
    console.log('downloadedAt: ', new Date(downloadedAt));
    updateLastUpdated();
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    if (now - downloadedAt > oneHour) {
      chrome.runtime.sendMessage(
        {
          type: MessageType.CHECK_FOR_UPDATE,
        },
        (response: TUpadatedMessage | TUpdateErrorMessage) => {
          // if (!response) return;
          console.log('response: ', response);

          if (response.type === MessageResponse.UPDATED) {
            console.log('fetched links: ', response.payload);
            // save links to storage
            initialLinksStorage.set(response.payload, () => {
              console.log('links saved to storage');
            });
            // update downloadedAt
            downloadedAtStorage.set(now, () => {
              console.log('downloadedAt updated');
            });
          }
          if (response.type === MessageResponse.UPDATE_ERROR) {
            console.log('error: ', response.reason);
          }

          // console.log('CHECK_FOR_UPDATE response:', response.message);
        }
      );
    }
  });
})();
