// 🍎 iPhone-iOS-XMD PREMIUM - Privacy.js - 25 PRIVACY CMDS
module.exports = {
  name: "privacy",
  alias: ["antiviewonce", "antivv", "antidelete", " antidelete", "antideletestatus", "autostatusview", "autostatus", "statusview", "viewstatus", "autoviewstatus", "alwaysonline", "autonline", "autotyping", "autorecording", "autoread", "autoreact", "autobio", "autoblock", "anticall", "antigroup", "pmblock", "blockpm", "onlygroup", "onlyprivate", "blocklist"],
  category: "privacy",
  desc: "25 privacy commands",

  async execute(m, { sock, prefix, args, command }) {
    try {
      const cmd = command.toLowerCase();
      const query = args.join(' ').toLowerCase();
      const isOn = ['on','enable','true','1'].includes(query);
      const isOff = ['off','disable','false','0'].includes(query);

      if(cmd === 'privacy') {
        return await sock.sendMessage(m.chat, { text: `🔒 *PRIVACY — 25 COMMANDS*\n━━━━━━━━━━━━━━━━\n
👁️ *VIEW ONCE & DELETE*
.antiviewonce / .antivv on/off - Save view once
.antidelete / .antideletestatus on/off - Save deleted msgs

👀 *STATUS PRIVACY*
.autostatusview / .statusview / .viewstatus on/off - View status secretly
.autostatus on/off - Auto view status

🟢 *ONLINE PRIVACY*
.alwaysonline / .autonline on/off - Always online
.autotyping on/off - Auto typing
.autorecording on/off - Auto recording

💬 *MESSAGE PRIVACY*
.autoread on/off - Auto read msgs
.autoreact on/off - Auto react
.autobio on/off - Auto update bio

🚫 *CALL & GROUP PRIVACY*
.autoblock on/off - Auto block calls
.anticall on/off - Reject calls
.antigroup on/off - Anti group invite
.pmblock / .blockpm on/off - Block PM
.onlygroup / .onlyprivate - Only group/private mode
.blocklist - Show blocked

Use: ${prefix}antiviewonce on
🍎 iPhone-iOS-XMD` }, { quoted: m });
      }

      let response = "";
      let newState = null;

      // Simulate config storage - replace with your config system
      if(!global.privacyConfig) global.privacyConfig = {};

      const toggle = (key) => {
        if(isOn) global.privacyConfig[key] = true;
        else if(isOff) global.privacyConfig[key] = false;
        else global.privacyConfig[key] = !global.privacyConfig[key];
        return global.privacyConfig[key];
      };

      switch(cmd) {
        case 'antiviewonce':
        case 'antivv':
          newState = toggle('antiviewonce');
          response = `👁️ Anti View Once: ${newState ? '✅ ON' : '❌ OFF'}\n\n${newState ? 'Bot will save all view once photos/videos and send to you!' : 'Disabled'}`;
          break;

        case 'antidelete':
        case 'antideletestatus':
          newState = toggle('antidelete');
          response = `🗑️ Anti Delete: ${newState ? '✅ ON' : '❌ OFF'}\n\n${newState ? 'Bot will save deleted messages!' : 'Disabled'}`;
          break;

        case 'autostatusview':
        case 'statusview':
        case 'viewstatus':
        case 'autoviewstatus':
          newState = toggle('statusview');
          response = `👀 Auto Status View: ${newState ? '✅ ON' : '❌ OFF'}\n\n${newState ? 'Bot will view all statuses secretly (no seen)' : 'Disabled'}\nPrivacy: Your view won't show`;
          break;

        case 'autostatus':
          newState = toggle('autostatus');
          response = `📱 Auto Status: ${newState ? '✅ ON' : '❌ OFF'}\nBot will automatically post statuses`;
          break;

        case 'alwaysonline':
        case 'autonline':
          newState = toggle('alwaysonline');
          response = `🟢 Always Online: ${newState ? '✅ ON' : '❌ OFF'}\n\n${newState ? 'Bot will always show online!' : 'Normal online status'}`;
          break;

        case 'autotyping':
          newState = toggle('autotyping');
          response = `⌨️ Auto Typing: ${newState ? '✅ ON' : '❌ OFF'}\n${newState ? 'Bot will show typing when receiving msgs' : 'Disabled'}`;
          break;

        case 'autorecording':
          newState = toggle('autorecording');
          response = `🎙️ Auto Recording: ${newState ? '✅ ON' : '❌ OFF'}\n${newState ? 'Bot will show recording' : 'Disabled'}`;
          break;

        case 'autoread':
          newState = toggle('autoread');
          response = `✅ Auto Read: ${newState ? '✅ ON - All msgs marked as read' : '❌ OFF - Manual read'}`;
          break;

        case 'autoreact':
          newState = toggle('autoreact');
          response = `❤️ Auto React: ${newState ? '✅ ON - Bot auto reacts to msgs' : '❌ OFF'}`;
          break;

        case 'autobio':
          newState = toggle('autobio');
          response = `📝 Auto Bio: ${newState ? '✅ ON - Auto updates bio with time' : '❌ OFF'}`;
          if(newState) {
            setInterval(async () => {
              const time = new Date().toLocaleTimeString();
              await sock.updateProfileStatus(`🍎 iPhone-iOS-XMD | ${time}`).catch(()=>{});
            }, 60000);
          }
          break;

        case 'autoblock':
        case 'anticall':
          newState = toggle('anticall');
          response = `🚫 Anti Call: ${newState ? '✅ ON - All calls rejected & caller blocked' : '❌ OFF'}`;
          break;

        case 'antigroup':
          newState = toggle('antigroup');
          response = `👥 Anti Group: ${newState ? '✅ ON - Auto leave unwanted groups' : '❌ OFF'}`;
          break;

        case 'pmblock':
        case 'blockpm':
          newState = toggle('pmblock');
          response = `💬 PM Block: ${newState ? '✅ ON - Private msgs blocked (only groups)' : '❌ OFF - Allow PM'}`;
          break;

        case 'onlygroup':
          global.privacyConfig.onlygroup = true;
          global.privacyConfig.onlyprivate = false;
          response = `✅ Bot will ONLY work in groups!\nPrivate msgs ignored.`;
          break;

        case 'onlyprivate':
          global.privacyConfig.onlyprivate = true;
          global.privacyConfig.onlygroup = false;
          response = `✅ Bot will ONLY work in private!\nGroup msgs ignored.`;
          break;

        case 'blocklist':
          try {
            const blocklist = await sock.fetchBlocklist();
            response = `🚫 *BLOCKED LIST (${blocklist.length})*\n\n${blocklist.map((j,i)=>`${i+1}. @${j.split('@')[0]}`).join('\n') || "No blocked users"}`;
            await sock.sendMessage(m.chat, { text: response, mentions: blocklist }, { quoted: m });
            return;
          } catch { response = `Blocklist error`; }
          break;

        default:
          response = `🔒 Privacy: ${cmd} - ${query}`;
      }

      await sock.sendMessage(m.chat, { text: response + `\n\nUse: ${prefix}${cmd} on/off\n\n🍎 iPhone-iOS-XMD PREMIUM` }, { quoted: m });

    } catch(e) {
      await sock.sendMessage(m.chat, { text: `❌ Privacy Error: ${e.message}` }, { quoted: m });
    }
  }
};
