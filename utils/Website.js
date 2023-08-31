const init = (data) => {
  if (
    !data ||
    !data.webPattern
  ) return;
  if (!isMatching(data.webPattern)) return;

  if (data.urlsMatches && data.urlsMatches.length > 0) {
    data.urlsMatches.forEach(match => {
      if (!match || !match.path || !match.run) return;
      match.getSelector = (selector) => data.selectors && data.selectors[selector];
      if (pathMatches(match.path)) match.run();
    });
    let oldUrl = window.location.pathname;
    const observer = new MutationObserver(() => {
      let _ = oldUrl;
      oldUrl = window.location.pathname;
      if (_ === window.location.pathname) return;
      const match = data.urlsMatches.find(match => pathMatches(match.path));
      if (!match) return;
      match.getSelector = (selector) => data.selectors && data.selectors[selector];
      match.run();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
};

const pathMatches = (path) => {
  if (path instanceof RegExp) {
    return path.test(window.location.pathname);
  } else if (typeof path === 'string') {
    return window.location.pathname === path;
  } else if (typeof path === 'object' && 'entries' in path) {
    return path.map(p => pathMatches(p)).filter(p => !!p).length > 0;
  }
};

const isMatching = (regex) => {
  if (!regex || !(regex instanceof RegExp)) return;
  return regex.test(window.location.href);
};

module.exports.init = init;
