const init = (data) => {
  if (
    !data ||
    !data.webPattern
  ) return;
  if (!isMatching(data.webPattern)) return;

  if (data.urlsMatches && data.urlsMatches.length > 0) {
    data.urlsMatches.forEach(match => {
      if (!match || !match.path || !match.run) return;
      const urlMatches = typeof match.path === 'string' ?
        window.location.pathname === match.path :
        match.path.test(window.location.pathname);
      match.getSelector = (selector) => data.selectors && data.selectors[selector];
      if (urlMatches) match.run();
    });
    let oldUrl = window.location.pathname;
    const observer = new MutationObserver(() => {
      let _ = oldUrl;
      oldUrl = window.location.pathname;
      if (_ === window.location.pathname) return;
      const match = data.urlsMatches.find(match => {
        return typeof match.path === 'string' ?
          window.location.pathname === match.path :
          match.path.test(window.location.pathname);
      });
      match.getSelector = (selector) => data.selectors && data.selectors[selector];
      match.run();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
};

const isMatching = (regex) => {
  if (!regex || !(regex instanceof RegExp)) return;
  return regex.test(window.location.href);
};

module.exports.init = init;
