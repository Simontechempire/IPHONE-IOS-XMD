// 🍎 iPhone-iOS-XMD PREMIUM - Premium.js - 20 PREMIUM CMDS
module.exports = {
  name: "premium",
  alias: ["premium","premiumlist","addpremium","delpremium","removepremium","vip","viplist","addvip","delvip","buypremium","price","rent","rentbot","joingroup","getgroup","premiumcheck","ispremium","sewapremium","sewa","donate"],
  category: "premium",
  desc: "20 premium",
  async execute(m, { sock, prefix, args, command, isOwner }) {
    const cmd = command.toLowerCase();
    if(!global.premium) global.premium = [];
    if(cmd==='premium') return sock.sendMessage(m.chat, { text:`💎 *PREMIUM — 20 CMDS*\n\n💎 premiumlist/vip/viplist - List\n👑 addpremium/delpremium @user\n💰 buypremium/price/donate\n🤖 rent/rentbot/sewa\n👥 joingroup/getgroup\n✅ premiumcheck/ispremium @user\n\nOwner only: addpremium/delpremium\n\nYour premium: ${global.premium.includes(m.sender)?'✅ YES':'❌ NO'}\n🍎 iPhone-iOS-XMD` }, { quoted: m });
    let res="";
    switch(cmd) {
      case 'premiumlist': case 'viplist': case 'vip':
        res = `💎 *PREMIUM LIST (${global.premium.length})*\n\n${global.premium.map((u,i)=>`${i+1}. @${u.split('@')[0]}`).join('\n')||'No premium users'}`; break;
      case 'addpremium': case 'addvip':
        if(!isOwner) return m.reply("❌ Owner only!"); const user = m.mentionedJid?.[0]||args[0]+'@s.whatsapp.net'; if(!user) return m.reply(`Use: ${prefix}addpremium @user`); global.premium.push(user); res=`✅ Added @${user.split('@')[0]} to premium!`; break;
      case 'delpremium': case 'removepremium': case 'delvip':
        if(!isOwner) return m.reply("❌ Owner only!"); const del = m.mentionedJid?.[0]; global.premium = global.premium.filter(u=>u!==del); res=`❌ Removed @${del.split('@')[0]} from premium`; break;
      case 'ispremium': case 'premiumcheck':
        const check = m.mentionedJid?.[0]||m.sender; res=`${global.premium.includes(check)?'✅ @'+check.split('@')[0]+' is PREMIUM 💎':'❌ @'+check.split('@')[0]+' not premium'}`; break;
      case 'buypremium': case 'price': case 'donate': case 'sewa': case 'sewapremium': case 'rent': case 'rentbot':
        res=`💎 *BUY PREMIUM*\n\n💰 Price:\n1 Month: $5 / ₦5000\nLifetime: $15 / ₦15000\nRent Bot: $10/month\n\n📞 Contact owner to buy\n💳 Payment: Paypal/Bank\n\nBenefits:\n✅ Unlimited downloads\n✅ Premium commands\n✅ No limit\n✅ Fast response\n\n🍎 iPhone-iOS-XMD`; break;
      default: res=`💎 Premium: ${cmd}`;
    }
    await sock.sendMessage(m.chat, { text: res+`\n\n🍎 iPhone-iOS-XMD PREMIUM`, mentions: [...global.premium, m.sender, ...(m.mentionedJid||[])] }, { quoted: m });
  }
};
