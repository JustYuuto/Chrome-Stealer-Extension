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
      if (urlMatches) match.run();
    });
  }
};

const isMatching = (regex) => {
  if (!regex || !(regex instanceof RegExp)) return;
  return regex.test(window.location.href);
};

module.exports.init = init;
