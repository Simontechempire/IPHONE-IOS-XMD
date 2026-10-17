// 🍎 iPhone-iOS-XMD PREMIUM - Auto.js - ALL 25 AUTO CMDS IN ONE FILE

module.exports = {
  name: "auto",
  alias: ["autoread", "autotyping", "autorecord", "autoonline", "autostatus", "autoviewstatus", "autolikestatus", "autoreactstatus", "autoreact", "autoreply", "autosticker", "autodownload", "autoai", "autotranslate", "autowelcome", "autogoodbye", "autobio", "autoblock", "autounblock", "autosave", "autoclean", "autobackup", "autoforward", "autorespond", "autopresence"],
  category: "auto",
  desc: "25 auto commands in one file",

  async execute(m, { sock, prefix, args, command, config, isOwner }) {
    try {
      const cmd = command.toLowerCase();
      const query = args.join(' ').toLowerCase();
      
      if (!isOwner && !['auto'].includes(cmd)) {
        // Allow owner only for auto settings
        // return await sock.sendMessage(m.chat, { text: `❌ Owner only!` }, { quoted: m });
      }

      let response = "";
      const isOn = query === 'on' || query === 'true' || query === '1' || query === 'enable';
      const isOff = query === 'off' || query === 'false' || query === '0' || query === 'disable';

      switch(cmd) {
        case 'auto':
          response = `⚡ *AUTO — 25 COMMANDS*\n━━━━━━━━━━━━━━━━\n
🤖 *PRESENCE & READ*
.autoread on/off - Auto read messages
.autotyping on/off - Auto typing
.autorecord on/off - Auto recording
.autoonline on/off - Always online
.autopresence on/off - Auto presence

📱 *STATUS*
.autostatus on/off - Auto status view
.autoviewstatus on/off - Auto view status
.autolikestatus on/off - Auto like status
.autoreactstatus on/off - Auto react status

⚡ *AUTO ACTIONS*
.autoreact on/off - Auto react to msgs
.autoreply on/off - Auto reply
.autosticker on/off - Auto sticker
.autodownload on/off - Auto download
.autoai on/off - Auto AI reply
.autotranslate on/off - Auto translate

👋 *WELCOME*
.autowelcome on/off - Auto welcome
.autogoodbye on/off - Auto goodbye
.autobio on/off - Auto bio update

🛡️ *SECURITY & STORAGE*
.autoblock on/off - Auto block
.autounblock on/off - Auto unblock
.autosave on/off - Auto save contacts
.autoclean on/off - Auto clean chats
.autobackup on/off - Auto backup

🔗 *FORWARD*
.autoforward on/off - Auto forward
.autorespond on/off - Auto respond

Use: ${prefix}autoread on/off
Current mode: Check config
🍎 iPhone-iOS-XMD`;
          break;

        case 'autoread':
          config.autoRead = isOn ? true : isOff ? false : !config.autoRead;
          response = `📖 Autoread: ${config.autoRead ? '✅ ON' : '❌ OFF'}\nBot will ${config.autoRead ? '' : 'not '}auto read messages`;
          break;

        case 'autotyping':
          config.autoTyping = isOn ? true : isOff ? false : !config.autoTyping;
          response = `⌨️ Autotyping: ${config.autoTyping ? '✅ ON' : '❌ OFF'}\nBot will show typing...`;
          break;

        case 'autorecord':
          config.autoRecord = isOn ? true : isOff ? false : !config.autoRecord;
          response = `🎙️ Autorecord: ${config.autoRecord ? '✅ ON' : '❌ OFF'}\nBot will show recording...`;
          break;

        case 'autoonline':
          config.autoOnline = isOn ? true : isOff ? false : !config.autoOnline;
          response = `🟢 Autoonline: ${config.autoOnline ? '✅ ON' : '❌ OFF'}\nBot will always appear online`;
          break;

        case 'autostatus':
        case 'autoviewstatus':
          config.autoViewStatus = isOn ? true : isOff ? false : !config.autoViewStatus;
          response = `👁️ Autoview Status: ${config.autoViewStatus ? '✅ ON' : '❌ OFF'}\nBot will auto view all statuses`;
          break;

        case 'autolikestatus':
          config.autoLikeStatus = isOn ? true : isOff ? false : !config.autoLikeStatus;
          response = `❤️ Autolike Status: ${config.autoLikeStatus ? '✅ ON' : '❌ OFF'}\nBot will auto like statuses`;
          break;

        case 'autoreactstatus':
          config.autoReactStatus = isOn ? true : isOff ? false : !config.autoReactStatus;
          response = `😍 Autoreact Status: ${config.autoReactStatus ? '✅ ON' : '❌ OFF'}\nBot will auto react to statuses`;
          break;

        case 'autoreact':
          config.autoReact = isOn ? true : isOff ? false : !config.autoReact;
          response = `😀 Autoreact: ${config.autoReact ? '✅ ON' : '❌ OFF'}\nBot will auto react to messages with emoji`;
          break;

        case 'autoreply':
        case 'autorespond':
          config.autoReply = isOn ? true : isOff ? false : !config.autoReply;
          response = `💬 Autoreply: ${config.autoReply ? '✅ ON' : '❌ OFF'}\nBot will auto reply when mentioned`;
          break;

        case 'autosticker':
          config.autoSticker = isOn ? true : isOff ? false : !config.autoSticker;
          response = `🎨 Autosticker: ${config.autoSticker ? '✅ ON' : '❌ OFF'}\nBot will auto convert images to sticker`;
          break;

        case 'autodownload':
          config.autoDownload = isOn ? true : isOff ? false : !config.autoDownload;
          response = `📥 Autodownload: ${config.autoDownload ? '✅ ON' : '❌ OFF'}\nBot will auto download status media`;
          break;

        case 'autoai':
          config.autoAI = isOn ? true : isOff ? false : !config.autoAI;
          response = `🤖 AutoAI: ${config.autoAI ? '✅ ON' : '❌ OFF'}\nBot will auto reply with AI`;
          break;

        case 'autotranslate':
          config.autoTranslate = isOn ? true : isOff ? false : !config.autoTranslate;
          response = `🌍 Autotranslate: ${config.autoTranslate ? '✅ ON' : '❌ OFF'}\nBot will auto translate messages`;
          break;

        case 'autowelcome':
          config.autoWelcome = isOn ? true : isOff ? false : !config.autoWelcome;
          response = `👋 Autowelcome: ${config.autoWelcome ? '✅ ON' : '❌ OFF'}\nBot will welcome new members`;
          break;

        case 'autogoodbye':
          config.autoGoodbye = isOn ? true : isOff ? false : !config.autoGoodbye;
          response = `👋 Autogoodbye: ${config.autoGoodbye ? '✅ ON' : '❌ OFF'}\nBot will say goodbye when member leaves`;
          break;

        case 'autobio':
          config.autoBio = isOn ? true : isOff ? false : !config.autoBio;
          response = `📝 Autobio: ${config.autoBio ? '✅ ON' : '❌ OFF'}\nBot will auto update bio with time/runtime`;
          if(config.autoBio) {
            const bio = `🍎 iPhone-iOS-XMD | ${new Date().toLocaleTimeString()} | Premium`;
            await sock.updateProfileStatus(bio);
          }
          break;

        case 'autoblock':
          config.autoBlock = isOn ? true : isOff ? false : !config.autoBlock;
          response = `🚫 Autoblock: ${config.autoBlock ? '✅ ON' : '❌ OFF'}\nBot will auto block calls/spam`;
          break;

        case 'autounblock':
          config.autoUnblock = isOn ? true : isOff ? false : !config.autoUnblock;
          response = `✅ Autounblock: ${config.autoUnblock ? '✅ ON' : '❌ OFF'}`;
          break;

        case 'autosave':
          config.autoSave = isOn ? true : isOff ? false : !config.autoSave;
          response = `💾 Autosave: ${config.autoSave ? '✅ ON' : '❌ OFF'}\nBot will auto save contacts`;
          break;

        case 'autoclean':
          config.autoClean = isOn ? true : isOff ? false : !config.autoClean;
          response = `🧹 Autoclean: ${config.autoClean ? '✅ ON' : '❌ OFF'}\nBot will auto clean old chats`;
          break;

        case 'autobackup':
          config.autoBackup = isOn ? true : isOff ? false : !config.autoBackup;
          response = `💾 Autobackup: ${config.autoBackup ? '✅ ON' : '❌ OFF'}\nBot will auto backup database daily`;
          break;

        case 'autoforward':
          config.autoForward = isOn ? true : isOff ? false : !config.autoForward;
          response = `↗️ Autoforward: ${config.autoForward ? '✅ ON' : '❌ OFF'}\nBot will auto forward messages`;
          break;

        case 'autopresence':
          config.autoPresence = isOn ? true : isOff ? false : !config.autoPresence;
          response = `👁️ Autopresence: ${config.autoPresence ? '✅ ON' : '❌ OFF'}\nOptions: typing, recording, online`;
          break;

        default:
          response = `⚡ Auto command: ${cmd}`;
      }

      // 💾 SAVE CONFIG - Add your save logic here
      // fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

      await sock.sendMessage(m.chat, { text: response + `\n\n🍎 iPhone-iOS-XMD PREMIUM\nUse ${prefix}auto for all list` }, { quoted: m });

    } catch (e) {
      console.log(e);
      await sock.sendMessage(m.chat, { text: `❌ Auto Error: ${e.message}` }, { quoted: m });
    }
  }
};
