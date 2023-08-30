chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (!message) return;

  const { type, data } = message;
  if (type === 'SEND_TO_WEBHOOK') {
    await fetch('', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
});
