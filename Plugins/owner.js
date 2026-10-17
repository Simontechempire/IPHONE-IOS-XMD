const { runtime } = require('../lib/functions');

module.exports = {
  commands: {
    owner: async (sock, msg, config) => {
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${config.ownerName}
ORG:Simon Tech Inc
TEL;type=CELL;type=VOICE;waid=\( {config.ownerNumber}:+ \){config.ownerNumber}
END:VCARD`;
      await sock.sendMessage(msg.from, {
        contacts: {
          displayName: config.ownerName,
          contacts: [{ vcard }]
        }
      }, { quoted: msg });
    },

    info: async (sock, msg, config) => {
      const text = `
*${config.botName} Information*

• Name      : ${config.botName}
• Owner     : ${config.ownerName}
• Number    : ${config.ownerNumber}
• Prefix    : ${config.prefix}
• Platform  : Multi-Device
• Compatible: iPhone / iOS / Android
• Version   : 1.0.0
• Creator   : Simon Tech Inc
      `.trim();
      await msg.reply(text);
    },

    runtime: async (sock, msg, config) => {
      await msg.reply(`⏱️ *Runtime*\n${runtime(process.uptime())}`);
    },

    uptime: async (sock, msg, config) => {
      await msg.reply(`⏱️ *Uptime*\n${runtime(process.uptime())}`);
    }
  }
};
