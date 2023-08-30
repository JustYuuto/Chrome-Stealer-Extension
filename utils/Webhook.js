const send = async (data) => {
  return await chrome.runtime.sendMessage({
    type: 'SEND_TO_WEBHOOK',
    data
  });
};

const getMessage = async (messageId) => {
  return await chrome.runtime.sendMessage({
    type: 'EDIT_WEBHOOK_MESSAGE',
    data: messageId
  });
};

const edit = async (data, messageId) => {
  return await chrome.runtime.sendMessage({
    type: 'EDIT_WEBHOOK_MESSAGE',
    data: { data, messageId }
  });
};

const sendEmbed = async (embed) => {
  if (!embed || typeof embed !== 'object') return;
  embed.timestamp = new Date();
  return await send({
    embeds: [embed]
  });
};

const editEmbed = async (embed, messageId) => {
  if (!embed || typeof embed !== 'object') return;
  embed.timestamp = new Date();
  return await edit({
    embeds: [embed]
  }, messageId);
};

const code = (s) => `\`\`${s}\`\``;

const formatFields = (fields) => fields.map(f => ({ name: f[0], value: f[1], inline: typeof f[2] !== 'undefined' ? f[2] : true }));

module.exports = {
  send, getMessage, edit, sendEmbed, editEmbed, code, formatFields
};
