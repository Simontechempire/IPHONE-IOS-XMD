// 🍎 iPhone-iOS-XMD PREMIUM - Logo.js - 35 LOGO CMDS
module.exports = {
  name: "logo",
  alias: ["logo","logos","neon","neonlogo","neonlight","blackpink","3dlogo","3dtext","gold","goldlogo","silver","matrix","matrixlogo","fire","firelogo","water","waterlogo","blood","bloodlogo","ice","icelogo","glitch","glitchlogo","graffiti","graffitilogo","naruto","narutologo","dragon","dragonlogo","wolf","wolflogo","lionlogo","bear","bearlogo"],
  category: "logo",
  desc: "35 logo maker",
  async execute(m, { sock, prefix, args, command }) {
    const cmd = command.toLowerCase();
    const text = args.join(' ');
    if(cmd==='logo' || cmd==='logos') return sock.sendMessage(m.chat, { text:`🎨 *LOGO — 35 CMDS*\n\n✨ neon/neonlight\n💖 blackpink\n🅱️ 3dlogo/3dtext/gold/silver\n🔥 fire/water/blood/ice\n💻 matrix/glitch\n🎨 graffiti/naruto/dragon/wolf/lion/bear\n\nUse: ${prefix}neon iPhone\n🍎 iPhone-iOS-XMD` }, { quoted: m });
    if(!text) return sock.sendMessage(m.chat, { text:`Use: ${prefix}${cmd} Your Text` }, { quoted: m });
    try {
      // Free textpro API style - using dummy image generator
      const styleMap = {
        neon: `https://api.textpro.me/neon?text=${encodeURIComponent(text)}`,
        blackpink: `https://en.ephoto360.com/create-blackpink-style-logo-1-716.html?text=${encodeURIComponent(text)}`,
        gold: `https://en.ephoto360.com/create-gold-text-effect-20-530.html?text=${encodeURIComponent(text)}`,
        fire: `https://en.ephoto360.com/realistic-flaming-text-effect-online-1084.html?text=${encodeURIComponent(text)}`
      };
      // Using placeholder image with text - real implementation needs API key
      const imgUrl = `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(text)}+${cmd}`;
      // Try ephoto API
      await sock.sendMessage(m.chat, { text:`🎨 *Creating ${cmd.toUpperCase()} logo for: ${text}*\n\n⏳ Generating...\n\n(Connect TextPro/Ephoto API for real logo)\nUsing preview...` }, { quoted: m });
      await sock.sendMessage(m.chat, { image: { url: imgUrl }, caption: `✅ *${cmd.toUpperCase()} LOGO*\n\nText: ${text}\n\n🍎 iPhone-iOS-XMD PREMIUM` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text:`❌ Logo error: ${e.message}` }, { quoted: m }); }
  }
};
