// 🍎 iPhone-iOS-XMD PREMIUM - Settings.js - ALL SETTINGS CMDS IN ONE FILE

module.exports = {
  name: "settings",
  alias: ["setting", "set", "config", "botsetting", "botsettings", "groupsetting", "groupsettings", "prefix", "setprefix", "botname", "setbotname", "ownername", "setownername", "botbio", "setbio", "setpp", "setbotpp", "mode", "setmode", "public", "private", "self", "status", "botstatus", "autostatus", "chatbot", "setwelcome", "setgoodbye", "setmenu", "menuconfig", "antidelete", "autodelete"],
  category: "settings",
  desc: "30 settings commands",

  async execute(m, { sock, prefix, args, command, isOwner, isAdmin, config }) {
    try {
      const cmd = command.toLowerCase();
      const query = args.join(' ');
      const isOn = query === 'on' || query === 'enable' || query === 'true';
      const isOff = query === 'off' || query === 'disable' || query === 'false';

      if(cmd === 'settings' || cmd === 'setting' || cmd === 'config') {
        return await sock.sendMessage(m.chat, { text: `⚙️ *SETTINGS — 30 COMMANDS*\n━━━━━━━━━━━━━━━━\n
🤖 *BOT SETTINGS*
.prefix / .setprefix <new> - Change prefix
.botname / .setbotname <name> - Bot name
.ownername / .setownername <name> - Owner name
.botbio / .setbio <bio> - Bot bio
.setpp / .setbotpp - Reply image to set bot PP
.mode / .setmode public/private/self
.public / .private / .self - Quick mode
.status / .botstatus - Bot status
.autostatus - Auto status config

👥 *GROUP SETTINGS*
.setwelcome <msg> - Welcome msg
.setgoodbye <msg> - Goodbye msg
.groupsetting - Show group settings

🎨 *MENU & APPEARANCE*
.setmenu <type> - Menu type (v1/v2/v3/button)
.menuconfig - Menu settings

🛡️ *PRIVACY & DELETE*
.antidelete on/off
.autodelete on/off - Auto delete bot msgs
.chatbot on/off

Use: ${prefix}setprefix !
Current prefix: ${prefix}
Mode: ${config.mode || "public"}
🍎 iPhone-iOS-XMD` }, { quoted: m });
      }

      let response = "";

      switch(cmd) {
        case 'prefix':
        case 'setprefix':
          if(!isOwner) return m.reply("❌ Owner only!");
          if(!query) return await sock.sendMessage(m.chat, { text: `Current prefix: ${prefix}\nUse: ${prefix}setprefix !` }, { quoted: m });
          config.prefix = query;
          response = `✅ Prefix changed: ${prefix} → ${query}\n\nNow use: ${query}menu`;
          break;

        case 'botname':
        case 'setbotname':
          if(!isOwner) return m.reply("❌ Owner only!");
          if(!query) return m.reply(`Use: ${prefix}setbotname iPhone-iOS-XMD`);
          config.botName = query;
          response = `✅ Bot name: ${query}`;
          break;

        case 'ownername':
        case 'setownername':
          if(!isOwner) return m.reply("❌ Owner only!");
          config.ownerName = query;
          response = `✅ Owner name: ${query}`;
          break;

        case 'botbio':
        case 'setbio':
        case 'botstatus':
        case 'status':
          if(!isOwner) return m.reply("❌ Owner only!");
          if(!query) return m.reply(`Use: ${prefix}setbio My bio text`);
          await sock.updateProfileStatus(query);
          config.bio = query;
          response = `✅ Bot bio updated:\n${query}`;
          break;

        case 'setpp':
        case 'setbotpp':
          if(!isOwner) return m.reply("❌ Owner only!");
          if(!m.quoted && !m.message.imageMessage) return m.reply(`Reply image with ${prefix}setpp to set bot profile pic`);
          await sock.sendMessage(m.chat, { text: `🖼️ Setting bot PP...` }, { quoted: m });
          try {
            const { downloadMediaMessage } = require('@whiskeysockets/baileys');
            const buffer = await downloadMediaMessage(m.quoted || m, 'buffer', {});
            await sock.updateProfilePicture(sock.user.id, buffer);
            response = `✅ Bot PP updated!`;
          } catch(e) { response = `❌ Failed: ${e.message}`; }
          break;

        case 'mode':
        case 'setmode':
          if(!isOwner) return m.reply("❌ Owner only!");
          if(!['public','private','self'].includes(query.toLowerCase())) {
            return m.reply(`Use: ${prefix}setmode public/private/self\nCurrent: ${config.mode || "public"}`);
          }
          config.mode = query.toLowerCase();
          response = `✅ Mode set to: ${config.mode.toUpperCase()}\n\nPublic = Everyone can use\nPrivate = Only owner/group\nSelf = Only owner`;
          break;

        case 'public':
          if(!isOwner) return m.reply("❌ Owner only!");
          config.mode = 'public';
          response = `✅ Bot is now PUBLIC - Everyone can use! 🌍`;
          break;

        case 'private':
          if(!isOwner) return m.reply("❌ Owner only!");
          config.mode = 'private';
          response = `✅ Bot is now PRIVATE - Only owner & admins! 🔒`;
          break;

        case 'self':
          if(!isOwner) return m.reply("❌ Owner only!");
          config.mode = 'self';
          response = `✅ Bot is now SELF - Only owner! 👑`;
          break;

        case 'autostatus':
          if(!isOwner) return m.reply("❌ Owner only!");
          config.autoStatus = isOn ? true : isOff ? false : !config.autoStatus;
          response = `✅ Autostatus: ${config.autoStatus ? 'ON' : 'OFF'}`;
          break;

        case 'chatbot':
          config.chatbot = isOn ? true : isOff ? false : !config.chatbot;
          response = `🤖 Chatbot: ${config.chatbot ? '✅ ON - Bot will chat' : '❌ OFF'}`;
          break;

        case 'setwelcome':
          if(!m.isGroup) return m.reply("❌ Group only!");
          if(!isAdmin) return m.reply("❌ Admin only!");
          if(!query) return m.reply(`Use: ${prefix}setwelcome Welcome @user to @group! 👋\n\nTags: @user @group @desc`);
          if(!config.welcome) config.welcome = {};
          config.welcome[m.chat] = query;
          response = `✅ Welcome set for this group:\n\n${query}\n\nTags: @user = new member, @group = group name`;
          break;

        case 'setgoodbye':
          if(!m.isGroup) return m.reply("❌ Group only!");
          if(!isAdmin) return m.reply("❌ Admin only!");
          if(!config.goodbye) config.goodbye = {};
          config.goodbye[m.chat] = query;
          response = `✅ Goodbye set:\n${query}`;
          break;

        case 'setmenu':
          if(!isOwner) return m.reply("❌ Owner only!");
          if(!query) return m.reply(`Use: ${prefix}setmenu v1/v2/v3/button/image\nCurrent: ${config.menuType || "v1"}`);
          config.menuType = query.toLowerCase();
          response = `✅ Menu type: ${config.menuType}\n\nv1 = Text list\nv2 = Button\nv3 = Image + text\nbutton = Buttons\nimage = Image menu`;
          break;

        case 'menuconfig':
          response = `⚙️ Menu config:\nType: ${config.menuType || "v1"}\nBotName: ${config.botName || "iPhone-iOS-XMD"}\nPrefix: ${config.prefix || "."}\nMode: ${config.mode || "public"}`;
          break;

        case 'antidelete':
          if(!isOwner) return m.reply("❌ Owner only!");
          config.antidelete = isOn ? true : isOff ? false : !config.antidelete;
          response = `🗑️ Antidelete: ${config.antidelete ? '✅ ON - Bot will show deleted msgs' : '❌ OFF'}`;
          break;

        case 'autodelete':
          config.autoDelete = isOn ? true : isOff ? false : !config.autoDelete;
          response = `🗑️ Autodelete: ${config.autoDelete ? 'ON' : 'OFF'}\nBot msgs will auto delete after time`;
          break;

        case 'groupsetting':
        case 'groupsettings':
          if(!m.isGroup) return m.reply("❌ Group only!");
          try {
            const meta = await sock.groupMetadata(m.chat);
            response = `⚙️ *GROUP SETTINGS*\n\nName: ${meta.subject}\nMembers: ${meta.participants.length}\nAnnounce: ${meta.announce ? "Closed" : "Open"}\nRestrict: ${meta.restrict ? "Locked" : "Unlocked"}\n\nWelcome: ${config.welcome?.[m.chat] ? "Set" : "Default"}\nGoodbye: ${config.goodbye?.[m.chat] ? "Set" : "Default"}`;
          } catch { response = `Group settings error`; }
          break;

        case 'botsetting':
        case 'botsettings':
          response = `⚙️ *BOT SETTINGS*\n\nName: ${config.botName || "iPhone-iOS-XMD"}\nPrefix: ${config.prefix || prefix}\nMode: ${config.mode || "public"}\nOwner: ${config.ownerName || "Owner"}\nMenu: ${config.menuType || "v1"}\nAutoread: ${config.autoRead ? "ON" : "OFF"}\nWelcome: ${config.autoWelcome ? "ON" : "OFF"}\n\n🍎 iPhone-iOS-XMD`;
          break;

        default:
          response = `⚙️ Settings: ${cmd}`;
      }

      // Save config (add your fs logic)
      // fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

      await sock.sendMessage(m.chat, { text: response + `\n\n🍎 iPhone-iOS-XMD PREMIUM` }, { quoted: m });

    } catch(e) {
      await sock.sendMessage(m.chat, { text: `❌ Settings Error: ${e.message}` }, { quoted: m });
    }
  }
};
