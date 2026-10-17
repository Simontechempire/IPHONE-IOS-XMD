// 🍎 iPhone-iOS-XMD PREMIUM - Anti.js - 24 ANTI CMDS
module.exports = {
  name: "anti",
  alias: ["antilink","antispam","antibot","antitag","antimention","antiflood","anticall","antiforward","antisticker","antiimage","antivideo","antiaudio","antidocument","antivirtex","antibadword","anticaps","antidelete","antiedit","antimedia","antipoll","antigroupmention","antichannel","antipromote","antidemote"],
  category: "moderation",
  desc: "24 anti commands",

  async execute(m, { sock, prefix, args, command, isAdmin, config }) {
    const cmd = command.toLowerCase();
    const query = args.join(' ').toLowerCase();
    if (!m.isGroup) return m.reply("❌ Group only!");
    if (!isAdmin) return m.reply("❌ Admin only!");
    
    if(!config.moderation) config.moderation = {};
    if(!config.moderation[m.chat]) config.moderation[m.chat] = {};
    const mod = config.moderation[m.chat];
    
    const isOn = query === 'on';
    const isOff = query === 'off';

    if(cmd === 'anti') {
      return await sock.sendMessage(m.chat, { text: `🛡️ *ANTI — 24 COMMANDS*\n\n.antilink on/off\n.antispam on/off\n.antibot on/off\n.antitag on/off\n.antimention on/off\n.antiflood on/off\n.anticall on/off\n.antiforward on/off\n.antisticker on/off\n.antiimage on/off\n.antivideo on/off\n.antiaudio on/off\n.antidocument on/off\n.antivirtex on/off\n.antibadword on/off\n.anticaps on/off\n.antidelete on/off\n.antiedit on/off\n.antimedia on/off\n.antipoll on/off\n.antigroupmention on/off\n.antichannel on/off\n.antipromote on/off\n.antidemote on/off\n\nUse: ${prefix}antilink on\n🍎 iPhone-iOS-XMD` }, { quoted: m });
    }

    const key = cmd; // e.g antilink
    mod[key] = isOn ? true : isOff ? false : !mod[key];
    
    await sock.sendMessage(m.chat, { text: `${mod[key] ? '✅' : '❌'} *${cmd.toUpperCase()}* ${mod[key] ? 'ENABLED' : 'DISABLED'}\n\nGroup: ${m.chat}\n\n🍎 iPhone-iOS-XMD` }, { quoted: m });
  }
};
