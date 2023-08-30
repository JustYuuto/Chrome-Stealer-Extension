chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (!message) return;

  const { type, data } = message;
  const webhook = require('../config').webhookUrl;

  if (type === 'SEND_TO_WEBHOOK') {
    const request = await fetch(webhook, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await request.json();
    sendResponse({ response: json });
  } else if (type === 'GET_WEBHOOK_MESSAGE') {
    const request = await fetch(`${webhook}/messages/${data}`);
    const json = await request.json();
    sendResponse({ response: json });
  } else if (type === 'EDIT_WEBHOOK_MESSAGE') {
    if (!data || !data.messageId || !data.data) return;
    const request = await fetch(`${webhook}/messages/${data.messageId}`, {
      method: 'PATCH',
      body: JSON.stringify(data.data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await request.json();
    sendResponse({ response: json });
  } else if (type === 'LOCAL_STORAGE_ITEM') {
    if (!sender.tab) return;
    const [script] = await chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: (data) => localStorage.getItem(data),
      world: 'MAIN',
      injectImmediately: true,
      args: [data]
    });
    sendResponse({
      response: script.result
    });
  }
});
