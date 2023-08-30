const send = async (data) => {
  await chrome.runtime.sendMessage({
    type: 'SEND_TO_WEBHOOK',
    data
  });
};

const sendEmbed = (embed) => {
  if (!embed || typeof embed !== 'object') return;
  embed.timestamp = new Date();
  send({
    embeds: [embed]
  });
};

const code = (s) => `\`\`${s}\`\``;

const formatFields = (fields) => fields.map(f => ({ name: f[0], value: f[1], inline: typeof f[2] !== 'undefined' ? f[2] : false }));

module.exports = {
  send, sendEmbed, code, formatFields
};
