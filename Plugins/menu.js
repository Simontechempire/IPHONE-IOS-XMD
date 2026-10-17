const { runtime } = require('../lib/functions');

module.exports = {
  commands: {
    menu: async (sock, msg, config) => {
      const text = `
╭───『 *${config.botName}* 』
│ 👑 Owner : ${config.ownerName}
│ 📞 Number: ${config.ownerNumber}
│ 📌 Prefix: ${config.prefix}
│ 📱 Platform: Multi-Device (iOS)
│ ⏱️ Runtime: ${runtime(process.uptime())}
│ 📦 Commands: 500+ Ready
╰────────────────────

*「 GENERAL 」*
• ${config.prefix}menu
• ${config.prefix}ping
• ${config.prefix}runtime
• ${config.prefix}owner
• ${config.prefix}info

*「 GROUP 」*
• ${config.prefix}tagall
• ${config.prefix}hidetag
• ${config.prefix}kick @user
• ${config.prefix}promote @user
• ${config.prefix}demote @user

*「 DOWNLOAD 」*
• ${config.prefix}ytmp3 <url>
• ${config.prefix}ytmp4 <url>

Powered by *Simon Tech Inc*
      `.trim();
      await msg.reply(text);
    },
    help: async (sock, msg, config) => {
      await module.exports.commands.menu(sock, msg, config);
    },
    list: async (sock, msg, config) => {
      await module.exports.commands.menu(sock, msg, config);
    }
  }
};
