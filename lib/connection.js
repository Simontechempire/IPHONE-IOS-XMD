const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
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

global.sock = null;
global.isConnected = false;
global.connectionStatus = 'Starting Fashion Bot...';
global.pairingCode = null;
global.qrCodeData = null;
global.currentPairingNumber = null;
global.lastPairTime = 0;
global.appStarted = false;

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
        uptime: process.uptime()
      });
    });

    app.post('/api/pair', async (req, res) => {
      try {
        let phone = (req.body.phone || '').toString().replace(/[^0-9]/g, '');
        if (!phone || phone.length < 10) {
          return res.json({ success: false, message: 'Enter valid number e.g 2348071569915' });
        }
        if (!global.sock) {
          return res.json({ success: false, message: 'Bot still starting... wait 5 sec' });
        }
        if (global.isConnected) {
          return res.json({ success: false, message: 'Bot already linked!' });
        }
        const now = Date.now();
        if (global.pairingCode && (now - global.lastPairTime) < 60000) {
          return res.json({ success: true, code: global.pairingCode, phone: global.currentPairingNumber });
        }
        if ((now - global.lastPairTime) < 5000) {
          return res.json({ success: false, message: `Wait ${Math.ceil((5000 - (now - global.lastPairTime))/1000)}s` });
        }
        global.lastPairTime = now;
        console.log(chalk.yellow(`\n📲 FAST PAIR for: ${phone}...`));
        const code = await global.sock.requestPairingCode(phone);
        global.pairingCode = code;
        global.currentPairingNumber = phone;
        global.connectionStatus = `CODE: ${code}`;
        console.log(chalk.green.bold(`\n╔════════════════════════════╗`));
        console.log(chalk.green.bold(`║  CODE   : ${code.padEnd(16)}║`));
        console.log(chalk.green.bold(`╚════════════════════════════╝\n`));
        res.json({ success: true, code, phone });
      } catch (err) {
        console.error(chalk.red('Pair error:'), err.message);
        global.lastPairTime = 0;
        res.json({ success: false, message: err.message });
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
    app.listen(PORT, () => {
      console.log(chalk.cyan.bold(`\n🌐 Fashion Dashboard → http://localhost:${PORT}\n`));
    });
    global.appStarted = true;
  }

  async function initBaileys() {
    const { state, saveCreds } = await useMultiFileAuthState(`./${config.sessionName}`);

    // ===== FAST VERSION - NO fetchLatestBaileysVersion() =====
    const sock = makeWASocket({
      version: [2, 3000, 1023223821], // FIXED FAST VERSION - no network fetch!
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.ubuntu('Chrome'),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
      },
      markOnlineOnConnect: false, // FASTER - don't mark online immediately
      generateHighQualityLinkPreview: false, // FASTER
      syncFullHistory: false,
      connectTimeoutMs: 20000, // 20s not 60s - FASTER
      keepAliveIntervalMs: 10000,
      defaultQueryTimeoutMs: 0,
      retryRequestDelayMs: 500,
    });

    global.sock = sock;
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'connecting') {
        global.connectionStatus = 'Connecting FAST...';
        console.log(chalk.yellow(`⏳ ${global.connectionStatus}`));
      }
      if (connection === 'open') {
        global.isConnected = true;
        global.connectionStatus = 'Fashion Bot Online ✅';
        global.pairingCode = null;
        console.log(chalk.green.bold(`\n✅ ${config.botName} LINKED IN SECONDS!`));
        console.log(chalk.green.bold(`🍎 ${global.plugins?.size || 0} PLUGINS READY!\n`));
      }
      if (connection === 'close') {
        global.isConnected = false;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.log(chalk.red(`❌ Closed: ${statusCode}`));
        if (shouldReconnect) {
          global.connectionStatus = 'Reconnecting in 2s...';
          setTimeout(() => initBaileys(), 2000); // 2s not 3s - FASTER
        } else {
          global.connectionStatus = 'Logged out';
          try { fs.rmSync(`./${config.sessionName}`, { recursive: true, force: true }); } catch {}
          setTimeout(() => initBaileys(), 2000);
        }
      }
    });

    console.log(chalk.green(`✅ Using ${global.plugins?.size || 0} commands`));
    
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      const m = messages[0];
      if (!m?.message || m.key.fromMe) return;
      const text = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || '';
      if (!text.startsWith(config.prefix)) return;
      const args = text.slice(config.prefix.length).trim().split(/ +/);
      const cmdName = args.shift().toLowerCase();
      const plugin = global.plugins?.get(cmdName);
      if (!plugin) return;
      try {
        const senderNum = m.key.remoteJid?.split('@')[0] || "";
        const isOwner = config.ownerNumber.includes(senderNum);
        m.body = text; m.text = text; m.sender = m.key.remoteJid; m.pushName = m.pushName || "User";
        await plugin.execute(m, { sock, prefix: config.prefix, args, command: cmdName, isOwner, config, plugins: global.plugins });
      } catch (e) {
        console.log(chalk.red(`❌ ${cmdName}: ${e.message}`));
      }
    });
  }

  await initBaileys();
}

module.exports = { startConnection };
