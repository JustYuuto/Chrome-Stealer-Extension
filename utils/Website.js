const init = (data) => {
  if (
    !data ||
    !data.webPattern
  ) return;
  if (!data.webPattern.test(window.location.href)) return;
  console.log('matches');
};

module.exports.init = init;
