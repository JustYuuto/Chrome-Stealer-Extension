const waitForElement = (selector) => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) return resolve(document.querySelector(selector));

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
};

const wait = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = {
  waitForElement, wait
};
