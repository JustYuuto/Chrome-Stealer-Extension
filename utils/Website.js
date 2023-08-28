const init = (data) => {
  if (
    !data ||
    !data.webPattern
  ) return;
  if (!isMatching(data.webPattern)) return;
  console.log('matches');
};

const isMatching = (regex) => {
  if (!regex || !(regex instanceof RegExp)) return;
  return regex.test(window.location.href);
};

module.exports.init = init;
