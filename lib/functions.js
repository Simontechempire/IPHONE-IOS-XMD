const fs = require('fs-extra');
const path = require('path');

async function loadCommands() {
  const commands = new Map();

  const dirs = [
    path.join(__dirname, '../Plugins'),
    path.join(__dirname, '../cmds')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      try {
        const filePath = path.join(dir, file);
        delete require.cache[require.resolve(filePath)];
        const plugin = require(filePath);

        if (plugin.commands && typeof plugin.commands === 'object') {
          for (const [name, fn] of Object.entries(plugin.commands)) {
            if (typeof fn === 'function') {
              commands.set(name.toLowerCase(), fn);
            }
          }
        }
      } catch (e) {
        console.error(`Failed to load ${file}:`, e.message);
      }
    }
  }

  return commands;
}

function runtime(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

module.exports = { loadCommands, runtime };
