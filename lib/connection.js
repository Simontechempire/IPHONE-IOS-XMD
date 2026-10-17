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

// Try to load settings, if not exist use default
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

async function startConnection() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '../public')));

  // --- ROUTES ---
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

  // REAL 8-DIGIT PAIRING CODE GENERATOR
  app.post('/api/pair', async (req, res) => {
    try {
      let phone = (req.body.phone || '').toString().replace(/[^0-9]/g, '');

      // Validation
      if (!phone || phone.length < 10 || phone.length > 15) {
        return res.json({ success: false, message: 'Enter valid number with country code e.g 2348071569915' });
      }

      if (!global.sock) {
        return res.json({ success: false, message: 'Fashion Bot is starting... wait 5 seconds and try again' });
      }

      if (global.isConnected) {
        return res.json({ success: false, message: 'Bot already connected! Delete auth folder to pair new number' });
      }

      // Anti-spam: 10 sec cooldown
      const now = Date.now();
      if (now - global.lastPairTime < 10000) {
        return res.json({ success: false, message: `Wait ${Math.ceil((10000 - (now - global.lastPairTime))/1000)}s before generating again` });
      }
      global.lastPairTime = now;

      console.log(chalk.hex('#00d2ff').bold(`\n💎 Fashion Request → ${phone}`));
      console.log(chalk.gray(`⏳ Generating real pairing code from WhatsApp server...`));

      const code = await global.sock.requestPairingCode(phone);

      global.pairingCode = code;
      global.currentPairingNumber = phone;
      global.connectionStatus = `Code ready for ${phone}`;

      console.log(chalk.hex('#f6d365').bold(`\n╔════════════════════════════╗`));
      console.log(chalk.hex('#f6d365').bold(`║  NUMBER : ${phone.padEnd(16)}║`));
      console.log(chalk.hex('#00ff88').bold(`║  CODE   : ${code.padEnd(16)}║`));
      console.log(chalk.hex('#f6d365').bold(`╚════════════════════════════╝\n`));

      res.json({ success: true, code, phone, message: 'Fashion pairing code generated' });

    } catch (err) {
      console.error(chalk.red('Pair error:'), err.message);
      
      let msg = err.message || 'Failed';
      if (msg.includes('rate')) msg = 'Too many requests - WhatsApp blocked for 5 mins, try later';
      if (msg.includes('not-authorized')) msg = 'Number not valid on WhatsApp';
      
      res.json({ success: false, message: msg });
    }
  });

  // Optional: Logout route for fashion dashboard
  app.post('/api/logout', async (req, res) => {
    try {
      if (global.sock) await global.sock.logout();
      try { fs.rmSync(`./${config.sessionName}`, { recursive: true, force: true }); } catch {}
      global.isConnected = false;
      global.connectionStatus = 'Logged out - Ready to pair';
      res.json({ success: true });
    } catch (e) {
      res.json({ success: false, message: e.message });
    }
  });

  const PORT = config.PORT || process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(chalk.cyan.bold(`\n🌐 Fashion Dashboard Live → http://localhost:${PORT}`));
    console.log(chalk.gray(`   Themes: iOS Blue / Gold Luxury / Midnight`));
    console.log(chalk.gray(`   Enter phone on website to get real 8-digit code\n`));
  });

  // --- BAILEYS CONNECTION ---
  const { state, saveCreds } = await useMultiFileAuthState(`./${config.sessionName}`);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS('Safari'), // iPhone fashion = Safari
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    defaultQueryTimeoutMs: undefined,
  });

  global.sock = sock;

  // Connection updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      global.qrCodeData = qr;
      global.connectionStatus = 'Scan QR (or use pairing code)';
    }

    if (connection === 'open') {
      global.isConnected = true;
      global.connectionStatus = 'Fashion Bot Online ✅';
      global.pairingCode = null;
      global.qrCodeData = null;
      console.log(chalk.green.bold(`\n✅ ${config.botName} - FASHION EDITION ONLINE!\n`));
      console.log(chalk.hex('#00d2ff')(`   Owner: ${config.ownerName} (${config.ownerNumber})`));
      console.log(chalk.hex('#f6d365')(`   Prefix: ${config.prefix}\n`));
    }

    if (connection === 'close') {
      global.isConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        global.connectionStatus = 'Reconnecting...';
        console.log(chalk.yellow('⚠️ Connection lost, reconnecting in 4s...'));
        setTimeout(() => startConnection(), 4000);
      } else {
        global.connectionStatus = 'Logged out - Delete auth to re-pair';
        console.log(chalk.red('❌ Logged out. Delete auth folder.'));
        try { fs.rmSync(`./${config.sessionName}`, { recursive: true, force: true }); } catch {}
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Load commands safely
  try {
    const functionsPath = path.join(__dirname, 'functions.js');
    if (fs.existsSync(functionsPath)) {
      const { loadCommands } = require('./functions');
      const commands = await loadCommands();
      console.log(chalk.green(`✅ Loaded ${commands.size} fashion commands`));

      sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const m = messages[0];
        if (!m?.message) return;
        if (m.key.fromMe) return;

        const text = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || '';
        if (!text.startsWith(config.prefix)) return;

        const args = text.slice(config.prefix.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();
        const cmd = commands.get(cmdName);
        if (cmd) {
          try { await cmd(sock, m, config, args); } catch (e) { console.log(`Cmd error ${cmdName}:`, e.message); }
        }
      });
    }
  } catch (e) {
    console.log(chalk.gray('No commands folder - running in pairing-only mode'));
  }

  return sock;
}

module.exports = { startConnection };
