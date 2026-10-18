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

async function startConnection() {
  // --- EXPRESS SERVER - START ONLY ONCE ---
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

    // FIXED PAIRING - NO MORE LOGGING HANG
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
        // If code exists and less than 50 sec, return same code (don't invalidate)
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
        console.log(chalk.yellow(`👉 You have 60 seconds to enter it in WhatsApp!`));
        console.log(chalk.gray(`   WhatsApp → Linked Devices → Link with phone number`));

        const code = await global.sock.requestPairingCode(phone);

        global.pairingCode = code;
        global.currentPairingNumber = phone;
        global.connectionStatus = `CODE: ${code} - Enter it in WhatsApp NOW!`;

        console.log(chalk.green.bold(`\n╔════════════════════════════╗`));
        console.log(chalk.green.bold(`║  CODE   : ${code.padEnd(16)}║`));
        console.log(chalk.green.bold(`║  NUMBER : ${phone.padEnd(16)}║`));
        console.log(chalk.green.bold(`╚════════════════════════════╝`));
        console.log(chalk.cyan.bold(`   Waiting for you to enter code on iPhone...\n`));

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
      try {
        if (global.sock) await global.sock.logout();
      } catch {}
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

  // --- BAILEYS CORE - SEPARATED FROM EXPRESS ---
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
        // This is the "logging" message you see - it's NORMAL, waiting for you
        global.connectionStatus = global.pairingCode ? `Waiting for you to enter code ${global.pairingCode} in WhatsApp...` : 'Connecting to WhatsApp...';
        console.log(chalk.yellow(`⏳ ${global.connectionStatus}`));
      }

      if (connection === 'open') {
        global.isConnected = true;
        global.connectionStatus = 'Fashion Bot Online ✅';
        global.pairingCode = null;
        global.qrCodeData = null;
        console.log(chalk.green.bold(`\n✅ ${config.botName} LINKED SUCCESSFULLY!\n`));
      }

      if (connection === 'close') {
        global.isConnected = false;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        
        console.log(chalk.red(`❌ Closed: ${statusCode} - ${lastDisconnect?.error?.message}`));

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

    // Load commands
    try {
      const functionsPath = path.join(__dirname, 'functions.js');
      if (fs.existsSync(functionsPath)) {
        const { loadCommands } = require('./functions');
        const commands = await loadCommands();
        console.log(chalk.green(`✅ Loaded ${commands.size} commands`));
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
          if (type !== 'notify') return;
          const m = messages[0];
          if (!m?.message || m.key.fromMe) return;
          const text = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || '';
          if (!text.startsWith(config.prefix)) return;
          const args = text.slice(config.prefix.length).trim().split(/ +/);
          const cmdName = args.shift().toLowerCase();
          const cmd = commands.get(cmdName);
          if (cmd) {
            try { await cmd(sock, m, config, args); } catch (e) {}
          }
        });
      }
    } catch (e) {}
  }

  await initBaileys();
}

module.exports = { startConnection };
