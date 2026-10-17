// 🍎 iPhone-iOS-XMD PREMIUM - General.js
module.exports = {
  name: "general",
  alias: ["general","ping","runtime","uptime","speed","botinfo","info","status","owner","menu","help","list","allmenu"],
  category: "general",
  desc: "General commands",
  async execute(m, { sock, prefix, command }) {
    const cmd = command.toLowerCase();
    if(cmd==='ping' || cmd==='speed') {
      const start = Date.now();
      await sock.sendMessage(m.chat, { text: `🏓 Ping...` }, { quoted: m });
      const end = Date.now();
      return await sock.sendMessage(m.chat, { text: `🍎 *PING*\n\nSpeed: ${end-start}ms\nUptime: ${process.uptime().toFixed(2)}s\n\n🍎 iPhone-iOS-XMD` }, { quoted: m });
    }
    if(cmd==='runtime' || cmd==='uptime') {
      const up = process.uptime();
      const h = Math.floor(up/3600), min = Math.floor((up%3600)/60), s = Math.floor(up%60);
      return await sock.sendMessage(m.chat, { text: `⏰ *RUNTIME*\n\n${h}h ${min}m ${s}s\n\n🍎 iPhone-iOS-XMD` }, { quoted: m });
    }
    if(cmd==='botinfo' || cmd==='info' || cmd==='status') {
      return await sock.sendMessage(m.chat, { text: `🤖 *BOT INFO*\n\nName: iPhone-iOS-XMD\nVersion: PREMIUM\nPlugins: ${global.plugins.size}\nOwner: ${global.config?.ownerName || "Owner"}\n\n🍎 iPhone-iOS-XMD` }, { quoted: m });
    }
    // menu is handled by your Menu.js
  }
};
