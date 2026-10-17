// 🍎 iPhone-iOS-XMD PREMIUM - Moderation.js - ALL 30 MOD CMDS IN ONE FILE

module.exports = {
  name: "moderation",
  alias: ["antilink", "antispam", "antibot", "antitag", "antimention", "antiflood", "anticall", "antiforward", "antisticker", "antiimage", "antivideo", "antiaudio", "antidocument", "antivirtex", "antibadword", "anticaps", "antidelete", "antiedit", "antimedia", "antipoll", "antigroupmention", "antichannel", "antipromote", "antidemote", "filter", "addfilter", "delfilter", "filters", "whitelist", "blacklist"],
  category: "moderation",
  desc: "30 moderation commands in one file",

  async execute(m, { sock, prefix, args, command, isAdmin, isBotAdmin, config }) {
    try {
      const cmd = command.toLowerCase();
      const query = args.join(' ').toLowerCase();
      
      if (!m.isGroup) return await sock.sendMessage(m.chat, { text: `❌ Group only!` }, { quoted: m });
      if (!isAdmin) return await sock.sendMessage(m.chat, { text: `❌ Admin only!` }, { quoted: m });

      const isOn = query === 'on' || query === 'enable' || query === 'true' || query === '1';
      const isOff = query === 'off' || query === 'disable' || query === 'false' || query === '0';

      // Initialize group config
      if(!config.moderation) config.moderation = {};
      if(!config.moderation[m.chat]) config.moderation[m.chat] = {};

      const mod = config.moderation[m.chat];

      let response = "";

      switch(cmd) {
        case 'moderation':
          response = `🛡️ *MODERATION — 30 COMMANDS*\n━━━━━━━━━━━━━━━━\n
🔗 *ANTI LINK & SPAM*
.antilink on/off - Delete links
.antispam on/off - Anti spam
.antibot on/off - Anti bot
.antiflood on/off - Anti flood
.antivirtex on/off - Anti virtex

🚫 *ANTI MEDIA*
.antisticker on/off - No stickers
.antiimage on/off - No images
.antivideo on/off - No videos
.antiaudio on/off - No audio
.antidocument on/off - No docs
.antimedia on/off - No media
.antipoll on/off - No polls
.antiforward on/off - No forward

💬 *ANTI TAG & MENTION*
.antitag on/off - No tagall
.antimention on/off - No mention
.antigroupmention on/off - No group mention
.antichannel on/off - No channel

📞 *ANTI CALL & ADMIN*
.anticall on/off - Anti call
.antipromote on/off - Anti promote
.antidemote on/off - Anti demote

🔤 *ANTI WORDS*
.antibadword on/off - Bad words
.anticaps on/off - Anti caps
.antidelete on/off - Anti delete
.antiedit on/off - Anti edit

🛠️ *FILTERS*
.filter / .addfilter word | response
.delfilter word
.filters - List filters
.whitelist add/remove
.blacklist add/remove

Use: ${prefix}antilink on/off
🍎 iPhone-iOS-XMD`;
          break;

        // 🔗 ANTI LINK
        case 'antilink':
          mod.antilink = isOn ? true : isOff ? false : !mod.antilink;
          response = `🔗 Antilink: ${mod.antilink ? '✅ ON' : '❌ OFF'}\nBot will delete all links and kick`;
          break;

        case 'antispam':
          mod.antispam = isOn ? true : isOff ? false : !mod.antispam;
          response = `🚫 Antispam: ${mod.antispam ? '✅ ON' : '❌ OFF'}\nMax 5 messages in 10 sec`;
          break;

        case 'antibot':
          mod.antibot = isOn ? true : isOff ? false : !mod.antibot;
          response = `🤖 Antibot: ${mod.antibot ? '✅ ON' : '❌ OFF'}\nBot will kick other bots`;
          break;

        case 'antitag':
          mod.antitag = isOn ? true : isOff ? false : !mod.antitag;
          response = `📢 Antitag: ${mod.antitag ? '✅ ON' : '❌ OFF'}\nNo tagall allowed`;
          break;

        case 'antimention':
          mod.antimention = isOn ? true : isOff ? false : !mod.antimention;
          response = `👤 Antimention: ${mod.antimention ? '✅ ON' : '❌ OFF'}\nNo mention spam`;
          break;

        case 'antiflood':
          mod.antiflood = isOn ? true : isOff ? false : !mod.antiflood;
          response = `🌊 Antiflood: ${mod.antiflood ? '✅ ON' : '❌ OFF'}\nMax messages limit`;
          break;

        case 'anticall':
          mod.anticall = isOn ? true : isOff ? false : !mod.anticall;
          response = `📞 Anticall: ${mod.anticall ? '✅ ON' : '❌ OFF'}\nBot will block callers`;
          break;

        case 'antiforward':
          mod.antiforward = isOn ? true : isOff ? false : !mod.antiforward;
          response = `↗️ Antiforward: ${mod.antiforward ? '✅ ON' : '❌ OFF'}\nNo forwarded messages`;
          break;

        case 'antisticker':
          mod.antisticker = isOn ? true : isOff ? false : !mod.antisticker;
          response = `🎨 Antisticker: ${mod.antisticker ? '✅ ON' : '❌ OFF'}\nNo stickers allowed`;
          break;

        case 'antiimage':
          mod.antiimage = isOn ? true : isOff ? false : !mod.antiimage;
          response = `🖼️ Antiimage: ${mod.antiimage ? '✅ ON' : '❌ OFF'}\nNo images allowed`;
          break;

        case 'antivideo':
          mod.antivideo = isOn ? true : isOff ? false : !mod.antivideo;
          response = `🎬 Antivideo: ${mod.antivideo ? '✅ ON' : '❌ OFF'}\nNo videos allowed`;
          break;

        case 'antiaudio':
          mod.antiaudio = isOn ? true : isOff ? false : !mod.antiaudio;
          response = `🎧 Antiaudio: ${mod.antiaudio ? '✅ ON' : '❌ OFF'}\nNo audio/voice notes`;
          break;

        case 'antidocument':
          mod.antidocument = isOn ? true : isOff ? false : !mod.antidocument;
          response = `📄 Antidocument: ${mod.antidocument ? '✅ ON' : '❌ OFF'}\nNo documents`;
          break;

        case 'antivirtex':
          mod.antivirtex = isOn ? true : isOff ? false : !mod.antivirtex;
          response = `💣 Antivirtex: ${mod.antivirtex ? '✅ ON' : '❌ OFF'}\nNo virtex/bug messages`;
          break;

        case 'antibadword':
          mod.antibadword = isOn ? true : isOff ? false : !mod.antibadword;
          response = `🤬 Antibadword: ${mod.antibadword ? '✅ ON' : '❌ OFF'}\nFilter bad words\nAdd word: ${prefix}addfilter badword | warning`;
          break;

        case 'anticaps':
          mod.anticaps = isOn ? true : isOff ? false : !mod.anticaps;
          response = `🔠 Anticaps: ${mod.anticaps ? '✅ ON' : '❌ OFF'}\nNo caps spam (e.g., HELLO!!!)`;
          break;

        case 'antidelete':
          mod.antidelete = isOn ? true : isOff ? false : !mod.antidelete;
          response = `🗑️ Antidelete: ${mod.antidelete ? '✅ ON' : '❌ OFF'}\nBot will show deleted messages`;
          break;

        case 'antiedit':
          mod.antiedit = isOn ? true : isOff ? false : !mod.antiedit;
          response = `✏️ Antiedit: ${mod.antiedit ? '✅ ON' : '❌ OFF'}\nBot will show edited messages`;
          break;

        case 'antimedia':
          mod.antimedia = isOn ? true : isOff ? false : !mod.antimedia;
          response = `📱 Antimedia: ${mod.antimedia ? '✅ ON' : '❌ OFF'}\nNo media allowed at all`;
          break;

        case 'antipoll':
          mod.antipoll = isOn ? true : isOff ? false : !mod.antipoll;
          response = `📊 Antipoll: ${mod.antipoll ? '✅ ON' : '❌ OFF'}\nNo polls allowed`;
          break;

        case 'antigroupmention':
          mod.antigroupmention = isOn ? true : isOff ? false : !mod.antigroupmention;
          response = `👥 Antigroupmention: ${mod.antigroupmention ? '✅ ON' : '❌ OFF'}\nNo group mentions`;
          break;

        case 'antichannel':
          mod.antichannel = isOn ? true : isOff ? false : !mod.antichannel;
          response = `📡 Antichannel: ${mod.antichannel ? '✅ ON' : '❌ OFF'}\nNo channel forwards`;
          break;

        case 'antipromote':
          mod.antipromote = isOn ? true : isOff ? false : !mod.antipromote;
          response = `👑 Antipromote: ${mod.antipromote ? '✅ ON' : '❌ OFF'}\nNo one can promote (except owner)`;
          break;

        case 'antidemote':
          mod.antidemote = isOn ? true : isOff ? false : !mod.antidemote;
          response = `👑 Antidemote: ${mod.antidemote ? '✅ ON' : '❌ OFF'}\nNo one can demote`;
          break;

        // 🛠️ FILTERS
        case 'filter':
        case 'addfilter':
          if(!args.join(' ').includes('|')) return await sock.sendMessage(m.chat, { text: `Use: ${prefix}addfilter badword | Don't use bad word!\n\nExample: ${prefix}addfilter hello | Hi there! 👋` }, { quoted: m });
          const [word, resp] = args.join(' ').split('|').map(s=>s.trim());
          if(!mod.filters) mod.filters = {};
          mod.filters[word.toLowerCase()] = resp;
          response = `✅ Filter added:\nWord: ${word}\nResponse: ${resp}`;
          break;

        case 'delfilter':
          if(!query) return await sock.sendMessage(m.chat, { text: `Use: ${prefix}delfilter word` }, { quoted: m });
          if(mod.filters && mod.filters[query]) {
            delete mod.filters[query];
            response = `✅ Filter deleted: ${query}`;
          } else {
            response = `❌ Filter not found: ${query}`;
          }
          break;

        case 'filters':
          const filters = mod.filters ? Object.keys(mod.filters) : [];
          response = `📝 *FILTERS LIST - ${filters.length}*\n\n${filters.map(f=>`• ${f} → ${mod.filters[f]}`).join('\n') || "No filters"}\n\nAdd: ${prefix}addfilter word | response`;
          break;

        case 'whitelist':
          const wlAction = args[0];
          const wlNum = args[1] || m.quoted?.sender;
          if(!mod.whitelist) mod.whitelist = [];
          if(wlAction === 'add' && wlNum) {
            mod.whitelist.push(wlNum);
            response = `✅ Whitelisted: ${wlNum}`;
          } else if(wlAction === 'remove' && wlNum) {
            mod.whitelist = mod.whitelist.filter(n=>n!==wlNum);
            response = `✅ Removed from whitelist: ${wlNum}`;
          } else {
            response = `📋 *WHITELIST - ${mod.whitelist.length}*\n\n${mod.whitelist.join('\n') || "Empty"}\n\nUse: ${prefix}whitelist add @user`;
          }
          break;

        case 'blacklist':
          const blAction = args[0];
          const blNum = args[1] || m.quoted?.sender;
          if(!mod.blacklist) mod.blacklist = [];
          if(blAction === 'add' && blNum) {
            mod.blacklist.push(blNum);
            response = `🚫 Blacklisted: ${blNum}`;
          } else if(blAction === 'remove' && blNum) {
            mod.blacklist = mod.blacklist.filter(n=>n!==blNum);
            response = `✅ Removed from blacklist: ${blNum}`;
          } else {
            response = `🚫 *BLACKLIST - ${mod.blacklist.length}*\n\n${mod.blacklist.join('\n') || "Empty"}\n\nUse: ${prefix}blacklist add @user`;
          }
          break;

        default:
          response = `🛡️ Moderation: ${cmd}`;
      }

      await sock.sendMessage(m.chat, { text: response + `\n\n🍎 iPhone-iOS-XMD PREMIUM\n🛡️ Moderation Active` }, { quoted: m });

    } catch (e) {
      console.log(e);
      await sock.sendMessage(m.chat, { text: `❌ Moderation Error: ${e.message}` }, { quoted: m });
    }
  }
};
