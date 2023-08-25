'use strict';

import {
  MessageResponse,
  MessageType,
  TCheckForUpdate,
} from './messages/types';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log('background request: ', request);
//   if (request.type === 'GREETINGS') {
//     const message: string = `Hi ${
//       sender.tab ? 'Con' : 'Pop'
//     }, my name is Bac. I am from Background. It's great to hear from you.`;

//     // Log message coming from the `request` parameter
//     console.log(request.payload.message);
//     // Send a response message
//     sendResponse({
//       message,
//     });
//   }
// });
// function sendMessage(tabId, request) {
//   return new Promise((resolve, reject) => {
//     chrome.tabs.sendMessage(tabId, request, (response) => {
//       if (response.success) {
//         resolve(response);
//       } else {
//         reject(response);
//       }
//     });
//   });
// }

chrome.runtime.onMessage.addListener(
  (message: TCheckForUpdate, sender, senderResponse) => {
    console.log('background request: ', { sender, message });

    switch (message.type) {
      case MessageType.CHECK_FOR_UPDATE:
        fetch('https://pastebin.com/raw/kiZZzQAV')
          .then((response) => response.json())
          .then((links) => {
            console.log('links: ', links);
            senderResponse({
              type: MessageResponse.UPDATED,
              payload: links,
            });
          })
          .catch((error) => {
            console.log('error: ', error);
            senderResponse({
              type: MessageResponse.UPDATE_ERROR,
              reason: error,
            });
          });
        break;
      default:
        console.log('default');
        break;
    }
    return true;
  }
);