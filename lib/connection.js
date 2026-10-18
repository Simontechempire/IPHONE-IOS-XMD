const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const fs = require('fs');

let config;
try {
  config = require('../settings');
} catch {
  config = {
    botName: "iPhone-iOS-XMD",
    ownerName: "Simon Tech Inc",
    ownerNumber: "2348071569915",
    prefix: ".",
    sessionName: "auth",
    PORT: process.env.PORT || 10000
  };
}

// GLOBAL STATE
global.sock = null;
global.isConnected = false;
global.connectionStatus = 'Starting Fashion Bot...';
global.pairingCode = null;
global.qrCodeData = null;
global.currentPairingNumber = null;
global.lastPairTime = 0;
global.appStarted = false;

// === CONTROL CENTER SETUP ===
const controlFile = path.join(__dirname, '../control.json');
let controlSettings = {
  OWNER: true, BOT: true, GROUP: true, AI: true, DOWNLOADER: true,
  AUDIO: true, CONVERTER: true, LOGO: true, TOOLS: true,
  GAMES: true, FUN: true, PIES: true, PREMIUM: true,
  disabledCmds: []
};
try {
  if (fs.existsSync(controlFile)) {
    controlSettings = JSON.parse(fs.readFileSync(controlFile, 'utf8'));
  }
} catch {}
global.controlSettings = controlSettings;

function saveControl(){
  try {
    fs.writeFileSync(controlFile, JSON.stringify(controlSettings, null, 2));
    global.controlSettings = controlSettings;
  } catch {}
}

// MAP COMMANDS TO CATEGORIES - FROM YOUR MENU
const CATEGORY_MAP = {
  OWNER: ['mode','settings','password','setprefix','delprefix','setpp','setbotbio','autobio','autostatus','autotyping','autorecording','autoreact','anticall','antidelete','antiviewonce','addsudo','delsudo','sudolist','block','unblock','ban','unban','save','schedulestatus','chatbot','clearsession','cleartmp','pair','checkidch'],
  BOT: ['owner','ping','alive','runtime','repo'],
  GROUP: ['add','kick','kickall','promote','demote','mute','unmute','lockgroup','unlockgroup','revoke','grouplink','setname','setdesc','setgcpp','gcstatus','creategc','leavegc','groupinfo','staff','jid','tagall','tag','hidetag','tagadmins','online','onlineusers','onlineadmins','onlinestats','welcome','goodbye','rules','poll','afk','couple','antilink','antitag','antigroupmention','antigroupstatus','antibot','antibadword','slowmode','warn','warnings'],
  AI: ['ai','gpt','gemini','imagine','flux','dalle','txt2video','sora','imageedit'],
  DOWNLOADER: ['play','song','music','ytmp3','mp3','ytmp4','video','instagram','tiktok','tt','facebook','fb','pinterest','anime','gitclone','apk','pixabay','gif','tourl'],
  AUDIO: ['bass','deep','blown','earrape','fast','slow','fat','squirrel','nightcore','robot','areverse','tomp3','tts'],
  CONVERTER: ['sticker','s','simage','toimg','removebg','upscale','take','attp','qc','emojimix','tgsticker','blur','meme','getpp','wasted','character'],
  LOGO: ['fancy','gfx','gfx2','gfx3','gfx4','gfx5','gfx6','gfx7','gfx8','gfx9','gfx10','gfx11','gfx12','metallic','ice','snow','impressive','matrix','neon','light','devil','purple','thunder','leaves','1917','arena','hacker','sand','blackpink','glitch','fire'],
  TOOLS: ['ss','ssweb','translate','tr','qrcode','qr','shorturl','urlshortener','calculator','calc','hash','base64','binary','encrypt','decrypt','timestamp','currency','crypto','weather','news','livescore','reminder','lyrics','count','reverse','case','palindrome','age','vv','vv2','delete','savecontact','device','netflix'],
  GAMES: ['trivia','scramble','wordle','hangman','guess','ttt','tictactoe','wyr','rps','slots','truth','dare','riddle','8ball','dice','coin','random','pick'],
  FUN: ['joke','fact','quote','compliment','insult','roast','flirt','ship','simp','stupid','shayari','goodnight','roseday','iloveyou'],
  PIES: ['pies','india','china','japan','korea','thai','malaysia'],
  PREMIUM: ['premium','setbotpp','autoreply','away','schedule','filter','persona','ghost']
};

function getCategory(cmd){
  cmd = cmd.toLowerCase();
  for(const [cat, cmds] of Object.entries(CATEGORY_MAP)){
    if(cmds.includes(cmd)) return cat;
  }
  return null;
}

// === PLUGINS LOADER ===
global.plugins = new Map();
function loadPlugins() {
  const pluginsPath = path.join(__dirname, '../plugins');
  if (!fs.existsSync(pluginsPath)) {
    console.log(chalk.red('No plugins folder found!'));
    return;
  }
  const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const pluginPath = path.join(pluginsPath, file);
      delete require.cache[require.resolve(pluginPath)];
      const plugin = require(pluginPath);
      if (plugin.name && plugin.execute) {
        global.plugins.set(plugin.name.toLowerCase(), plugin);
        if (plugin.alias && Array.isArray(plugin.alias)) {
          for (const a of plugin.alias) {
            global.plugins.set(a.toLowerCase(), plugin);
          }
        }
      }
    } catch (e) {
      console.log(chalk.red(`Plugin ${file} error: ${e.message}`));
    }
  }
  console.log(chalk.green.bold(`✅ Loaded ${global.plugins.size} plugins from /plugins`));
}
loadPlugins();

async function startConnection() {
  if (!global.appStarted) {
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../public')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.get('/api/status', (req, res) => {
      res.json({
        botName: config.botName,
        owner: config.ownerName,
        ownerNumber: config.ownerNumber,
        prefix: config.prefix,
        status: global.connectionStatus,
        isConnected: global.isConnected,
        pairingCode: global.pairingCode,
        pairingNumber: global.currentPairingNumber,
        hasQR: !!global.qrCodeData,
        uptime: process.uptime(),
        plugins: global.plugins.size
      });
    });

    // === CONTROL API ===
    app.get('/api/control', (req, res) => {
      res.json(controlSettings);
    });

    app.post('/api/control', (req, res) => {
      const { type, key, value } = req.body;
      if(type === 'category' && key in controlSettings){
        controlSettings[key] = value;
        saveControl();
        console.log(chalk.yellow(`🎛️ Category ${key} = ${value ? 'ON' : 'OFF'}`));
      }
      if(type === 'cmd'){
        if(value){
          controlSettings.disabledCmds = controlSettings.disabledCmds.filter(c => c !== key);
        } else {
          if(!controlSettings.disabledCmds.includes(key)) controlSettings.disabledCmds.push(key);
        }
        saveControl();
        console.log(chalk.yellow(`🎛️ Command .${key} = ${value ? 'ON' : 'OFF'}`));
      }
      if(type === 'all'){
        Object.keys(controlSettings).forEach(k => {
          if(k !== 'disabledCmds') controlSettings[k] = value;
        });
        controlSettings.disabledCmds = value ? [] : ['*all*'];
        saveControl();
        console.log(chalk.yellow(`🎛️ ALL Commands = ${value ? 'ON' : 'OFF'}`));
      }
      res.json({ success: true, settings: controlSettings });
    });

    app.post('/api/pair', async (req, res) => {
      try {
        let phone = (req.body.phone || '').toString().replace(/[^0-9]/g, '');
        if (!phone || phone.length < 10 || phone.length > 15) {
          return res.json({ success: false, message: 'Enter valid number e.g 2348071569915' });
        }
        if (!global.sock) {
          return res.json({ success: false, message: 'Bot still starting... wait 5 sec' });
        }
        if (global.isConnected) {
          return res.json({ success: false, message: 'Bot already linked!' });
        }
        const now = Date.now();
        if (global.pairingCode && (now - global.lastPairTime) < 50000) {
          return res.json({ 
            success: true, 
            code: global.pairingCode, 
            phone: global.currentPairingNumber,
            message: `Use this code - expires in ${Math.ceil((50000 - (now - global.lastPairTime))/1000)}s` 
          });
        }
        if ((now - global.lastPairTime) < 10000) {
          return res.json({ success: false, message: `Wait ${Math.ceil((10000 - (now - global.lastPairTime))/1000)}s` });
        }
        global.lastPairTime = now;
        console.log(chalk.hex('#f6d365').bold(`\n💎 Generating REAL code for ${phone}`));
        const code = await global.sock.requestPairingCode(phone);
        global.pairingCode = code;
        global.currentPairingNumber = phone;
        global.connectionStatus = `CODE: ${code} - Enter it in WhatsApp NOW!`;
        console.log(chalk.green.bold(`\n╔════════════════════════════╗`));
        console.log(chalk.green.bold(`║  CODE   : ${code.padEnd(16)}║`));
        console.log(chalk.green.bold(`║  NUMBER : ${phone.padEnd(16)}║`));
        console.log(chalk.green.bold(`╚════════════════════════════╝\n`));
        res.json({ success: true, code, phone, message: 'Valid for 60s - Enter NOW in WhatsApp!' });
      } catch (err) {
        console.error(chalk.red('Pair error:'), err.message);
        let msg = err.message;
        if (msg.includes('rate')) msg = 'Too many tries - Wait 5 mins';
        if (msg.includes('not-authorized')) msg = 'Number not on WhatsApp';
        res.json({ success: false, message: msg });
      }
    });

    app.post('/api/logout', async (req, res) => {
      try { if (global.sock) await global.sock.logout(); } catch {}
      try { fs.rmSync(`./${config.sessionName}`, { recursive: true, force: true }); } catch {}
      global.isConnected = false;
      global.pairingCode = null;
      global.connectionStatus = 'Logged out - Ready to pair';
      res.json({ success: true });
    });

    const PORT = config.PORT || process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(chalk.cyan.bold(`\n🌐 Fashion Dashboard → http://localhost:${PORT}\n`));
    });
    global.appStarted = true;
  }

  async function initBaileys() {
    const { state, saveCreds } = await useMultiFileAuthState(`./${config.sessionName}`);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS('Safari'),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      defaultQueryTimeoutMs: undefined,
      connectTimeoutMs: 60000,
    });
    global.sock = sock;
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'connecting') {
        global.connectionStatus = global.pairingCode ? `Waiting for you to enter code ${global.pairingCode} in WhatsApp...` : 'Connecting to WhatsApp...';
      }
      if (connection === 'open') {
        global.isConnected = true;
        global.connectionStatus = 'Fashion Bot Online ✅';
        global.pairingCode = null;
        global.qrCodeData = null;
        console.log(chalk.green.bold(`\n✅ ${config.botName} LINKED! ${global.plugins.size} PLUGINS READY!\n`));
      }
      if (connection === 'close') {
        global.isConnected = false;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.log(chalk.red(`❌ Closed: ${statusCode}`));
        if (shouldReconnect) {
          global.connectionStatus = 'Reconnecting in 3s...';
          setTimeout(() => initBaileys(), 3000);
        } else {
          global.connectionStatus = 'Logged out - Delete auth folder';
          try { fs.rmSync(`./${config.sessionName}`, { recursive: true, force: true }); } catch {}
          setTimeout(() => initBaileys(), 3000);
        }
      }
    });

    // === PLUGINS HANDLER WITH CONTROL CHECK ===
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      const m = messages[0];
      if (!m?.message || m.key.fromMe) return;
      const text = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || '';
      if (!text.startsWith(config.prefix)) return;
      const args = text.slice(config.prefix.length).trim().split(/ +/);
      const cmdName = args.shift().toLowerCase();

      // === CONTROL CENTER CHECK ===
      // Check if ALL blocked
      if(controlSettings.disabledCmds.includes('*all*')){
        console.log(chalk.red(`🚫 Blocked (ALL OFF): ${cmdName}`));
        return sock.sendMessage(m.key.remoteJid, { text: `🚫 *All commands are OFF!*\nTurn ON from dashboard: ${config.botName}` });
      }
      // Check individual command
      if(controlSettings.disabledCmds.includes(cmdName)){
        console.log(chalk.red(`🚫 Blocked (cmd OFF): ${cmdName}`));
        return sock.sendMessage(m.key.remoteJid, { text: `🚫 *.${cmdName}* is turned OFF from dashboard!` });
      }
      // Check category
      const cat = getCategory(cmdName);
      if(cat && controlSettings[cat] === false){
        console.log(chalk.red(`🚫 Blocked (category ${cat} OFF): ${cmdName}`));
        return sock.sendMessage(m.key.remoteJid, { text: `🚫 *${cat}* category is OFF!\n.${cmdName} blocked. Turn ON from dashboard.` });
      }

      const plugin = global.plugins.get(cmdName);
      if (plugin) {
        try {
          const senderNum = m.key.remoteJid?.split('@')[0] || "";
          const isOwner = config.ownerNumber.includes(senderNum) || config.ownerNumber.includes(m.key.remoteJid);
          m.body = text; m.text = text; m.sender = m.key.remoteJid; m.pushName = m.pushName || "User";
          console.log(chalk.hex('#f6d365')(`🍎 EXEC: ${cmdName} [${cat || 'NO-CAT'}]`));
          await plugin.execute(m, { sock, prefix: config.prefix, args, command: cmdName, isOwner, config, plugins: global.plugins });
          return;
        } catch (e) {
          console.log(chalk.red(`❌ Plugin ${cmdName} error: ${e.message}`));
          return;
        }
      }
      try {
        const functionsPath = path.join(__dirname, 'functions.js');
        if (fs.existsSync(functionsPath)) {
          const { loadCommands } = require('./functions');
          const commands = await loadCommands();
          const cmd = commands.get(cmdName);
          if (cmd) { try { await cmd(sock, m, config, args); } catch (e) {} }
        }
      } catch (e) {}
    });
  }
  await initBaileys();
}
module.exports = { startConnection };
