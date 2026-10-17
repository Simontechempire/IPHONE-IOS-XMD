// 🍎 iPhone-iOS-XMD PREMIUM - ping.js - PLUGINS
const os = require('os');

module.exports = {
  name: "ping",
  alias: ["speed", "latency", "pong"],
  category: "system",
  desc: "Check bot speed and runtime",

  async execute(m, { sock, prefix, config }) {
    try {
      const start = Date.now();
      
      // Send initial message
      const msg = await sock.sendMessage(m.chat, { text: `🍎 *Pinging...* ⚡` }, { quoted: m });
      
      const end = Date.now();
      const latency = end - start;
      
      // 🍎 DYNAMIC VALUES
      const uptimeSec = process.uptime();
      const h = Math.floor(uptimeSec / 3600);
      const mi = Math.floor((uptimeSec % 3600) / 60);
      const s = Math.floor(uptimeSec % 60);
      const runtime = `${h}h ${mi}m ${s}s`;
      
      const platform = os.platform();
      const cpu = os.cpus()[0].model;
      const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const mode = config?.mode || "public";
      const version = config?.version || "Premium v3.0.0";

      const pingResult = `╭───『 *🍎 iPhone-iOS-XMD PREMIUM* 』
│ 📡 *PING RESULT*
│
│ ⚡ Speed   : ${latency}ms
│ ⏱️ Runtime : ${runtime}
│ ⏳ Uptime  : ${runtime}
│ 👑 Mode    : ${mode}
│ 📱 Platform: ${platform}
│ 💾 RAM     : ${ramUsed}MB / ${ramTotal}GB
│ 🔌 Plugins : 500 🍎
│ 📦 Version : ${version}
╰────────────────────

✅ *Bot is alive and fast!*
🍎 Powered by Simon Tech
⚡ iPhone-iOS-XMD`;

      // Edit the message with result
      await sock.sendMessage(m.chat, { text: pingResult, edit: msg.key });

    } catch (e) {
      console.log(e);
      await sock.sendMessage(m.chat, { text: `❌ Error: ${e.message}` }, { quoted: m });
    }
  }
};
