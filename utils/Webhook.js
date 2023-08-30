const send = async (data) => {
  await fetch('', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

const sendEmbed = (embed) => {
  if (!embed || typeof embed !== 'object') return;
  embed.timestamp = Date.now();
  send({
    embeds: [embed]
  });
};

const code = (s) => `\`\`${s}\`\``;

const formatFields = (fields) => fields.map(f => ({ name: f[0], value: f[1], inline: typeof f[2] !== 'undefined' ? f[2] : false }));

module.exports = {
  send, sendEmbed, code, formatFields
};
