const config = require('../settings');

async function serialize(sock, m) {
  if (!m) return null;

  const msg = { ...m };
  msg.sock = sock;
  msg.key = m.key;
  msg.from = m.key.remoteJid;
  msg.fromMe = m.key.fromMe;
  msg.id = m.key.id;
  msg.isGroup = msg.from.endsWith('@g.us');
  msg.sender = msg.isGroup ? (m.key.participant || m.participant || msg.from) : msg.from;
  msg.senderNumber = (msg.sender || '').replace(/@s\.whatsapp\.net|@lid|@g\.us/g, '');
  msg.pushName = m.pushName || 'User';

  const message = m.message || {};
  msg.body = message.conversation ||
             message.extendedTextMessage?.text ||
             message.imageMessage?.caption ||
             message.videoMessage?.caption ||
             message.buttonsResponseMessage?.selectedButtonId ||
             message.listResponseMessage?.singleSelectReply?.selectedRowId ||
             message.templateButtonReplyMessage?.selectedId ||
             '';

  msg.text = msg.body;
  msg.prefix = config.prefix;
  msg.isCmd = msg.body.startsWith(config.prefix);
  msg.command = msg.isCmd ? msg.body.slice(config.prefix.length).trim().split(/\s+/)[0].toLowerCase() : '';
  msg.args = msg.body.trim().split(/\s+/).slice(1);
  msg.q = msg.args.join(' ');
  msg.quoted = message.extendedTextMessage?.contextInfo?.quotedMessage || null;
  msg.mentionedJid = message.extendedTextMessage?.contextInfo?.mentionedJid || [];

  msg.isOwner = config.owners.some(num => msg.senderNumber.includes(num));

  msg.reply = async (text, options = {}) => {
    return sock.sendMessage(msg.from, { text, ...options }, { quoted: m });
  };

  return msg;
}

module.exports = { serialize };
