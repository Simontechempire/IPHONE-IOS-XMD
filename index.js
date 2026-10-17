/**
 * iPhone-iOS-XMD
 * Multi-Device WhatsApp Bot by Simon Tech Inc
 * Owner: 2348071569915
 */

const fs = require('fs');
const path = require('path');
const { startConnection } = require('./lib/connection');
const config = require('./settings');

// ===== 🍎 LOAD ALL PLUGINS FROM /plugins =====
global.plugins = new Map();
global.config = config;

function loadPlugins() {
  const pluginsPath = path.join(__dirname, 'plugins');
  if(!fs.existsSync(pluginsPath)) {
    console.log("❌ /plugins folder not found!");
    return;
  }
  const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'));
  global.plugins.clear();
  console.log(`\n🍎 ===== LOADING ${files.length} PLUGINS FROM /plugins =====`);
  
  for (const file of files) {
    try {
      const fp = path.join(pluginsPath, file);
      delete require.cache[require.resolve(fp)];
      const plugin = require(fp);
      
      if(!plugin.name || !plugin.execute) {
        console.log(`⚠️ SKIP ${file} - no name/execute`);
        continue;
      }
      
      const allCmds = [plugin.name, ...(plugin.alias || [])];
      allCmds.forEach(cmd => {
        global.plugins.set(cmd.toLowerCase(), plugin);
      });
      
      console.log(`✅ ${file} → ${plugin.name}`);
    } catch(e) {
      console.log(`❌ ${file} failed: ${e.message}`);
    }
  }
  console.log(`🔥 TOTAL COMMANDS LOADED: ${global.plugins.size}\n`);
}

loadPlugins();

console.log(`\n🚀 Starting ${config.botName}...`);
console.log(`👑 Owner  : ${config.ownerName} (${config.ownerNumber})`);
console.log(`📌 Prefix : ${config.prefix}`);
console.log(`🌐 Dashboard will run on port ${config.PORT}\n`);

startConnection().catch(err => {
  console.error('Failed to start bot:', err);
  process.exit(1);
});
