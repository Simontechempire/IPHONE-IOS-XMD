// 🍎 iPhone-iOS-XMD PREMIUM - Creator.js - CREATOR / OWNER CONTACT
module.exports = {
  name: "creator",
  alias: ["creator","owner","creador","developer","dev","botowner","contactowner","myowner","ownercontact","reportowner"],
  category: "main",
  desc: "Bot creator",
  async execute(m, { sock, prefix, args, command, config }) {
    const cmd = command.toLowerCase();
    const ownerNumber = config?.ownerNumber || "2349166265317";
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${config?.ownerName || "iPhone-iOS-XMD Owner"} 🍎\nORG:iPhone-iOS-XMD PREMIUM;\nTEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\nEND:VCARD`;
    
    await sock.sendMessage(m.chat, { contacts: { displayName: config?.ownerName || "Owner", contacts: [{ vcard }] } }, { quoted: m });
    
    await sock.sendMessage(m.chat, { text:`👑 *BOT CREATOR*\n━━━━━━━━━━━━\n\n🤖 Bot: ${config?.botName || "iPhone-iOS-XMD"} 🍎\n👑 Owner: ${config?.ownerName || "Owner"}\n📞 Number: wa.me/${2349166265317}\n🌐 Channel https://whatsapp.com/channel/0029VbElMTUBPzjU6oxPoO3K\n💎 Premium: Contact owner\n\n📩 Report bug: Use ${prefix}owner + message\n\n🍎 iPhone-iOS-XMD PREMIUM` }, { quoted: m });
  }
};
