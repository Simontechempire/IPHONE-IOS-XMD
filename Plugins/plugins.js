// 🍎 iPhone-iOS-XMD PREMIUM - Plugins.js - PLUGIN MANAGER
const fs = require('fs');
const path = require('path');
module.exports = {
  name: "plugins",
  alias: ["plugin","plugins","pluginlist","install","uninstall","delplugin","removeplugin","getplugin","saveplugin","listplugin","pluginslist","addplugin"],
  category: "owner",
  desc: "Plugin manager",
  async execute(m, { sock, prefix, args, command, isOwner }) {
    const cmd = command.toLowerCase();
    const pluginsDir = './plugins';
    if(!isOwner && ['install','uninstall','delplugin','removeplugin','addplugin','saveplugin'].includes(cmd)) return m.reply("❌ Owner only!");

    if(cmd==='plugins' || cmd==='plugin' || cmd==='pluginlist' || cmd==='listplugin' || cmd==='pluginslist') {
      try {
        const files = fs.readdirSync(pluginsDir).filter(f=>f.endsWith('.js'));
        return await sock.sendMessage(m.chat, { text:`🔌 *PLUGINS LIST (${files.length})*\n\n${files.map((f,i)=>`${i+1}. ${f} - ${fs.statSync(path.join(pluginsDir,f)).size} bytes`).join('\n')}\n\nUse:\n${prefix}getplugin <name> - Get plugin code\n${prefix}install <name> - Install (reply code)\n${prefix}delplugin <name> - Delete\n\n🍎 iPhone-iOS-XMD` }, { quoted: m });
      } catch(e) { return m.reply(`Error: ${e.message}`); }
    }

    if(cmd==='getplugin') {
      const name = args[0]; if(!name) return m.reply(`Use: ${prefix}getplugin Ai`); 
      try { const code = fs.readFileSync(path.join(pluginsDir, name.endsWith('.js')?name:name+'.js'), 'utf8'); await sock.sendMessage(m.chat, { text: code.slice(0,4000) }, { quoted: m }); } catch(e) { m.reply(`Not found: ${name}`); }
      return;
    }

    if(cmd==='delplugin' || cmd==='removeplugin' || cmd==='uninstall') {
      const name = args[0]; if(!name) return m.reply(`Use: ${prefix}delplugin Ai`); 
      try { fs.unlinkSync(path.join(pluginsDir, name.endsWith('.js')?name:name+'.js')); await sock.sendMessage(m.chat, { text:`✅ Plugin ${name} deleted!\nRestart bot to apply.` }, { quoted: m }); } catch(e) { m.reply(`Error: ${e.message}`); }
      return;
    }

    if(cmd==='install' || cmd==='addplugin' || cmd==='saveplugin') {
      const name = args[0]; if(!name) return m.reply(`Use: ${prefix}install PluginName (reply to code)`); 
      const code = m.quoted?.text || args.slice(1).join(' '); if(!code) return m.reply(`Reply to plugin code with ${prefix}install <name>`); 
      try { fs.writeFileSync(path.join(pluginsDir, name.endsWith('.js')?name:name+'.js'), code); await sock.sendMessage(m.chat, { text:`✅ Plugin ${name} installed!\nRestart bot.` }, { quoted: m }); } catch(e) { m.reply(`Error: ${e.message}`); }
      return;
    }
  }
};
