/**
 *
 * @param {string|Element} selector
 * @param {(e: Event) => void} event
 */
const onFormSubmit = (selector = 'type[input="submit"]', event) => {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  element.addEventListener('click', event);
};

module.exports = {
  onFormSubmit
};
