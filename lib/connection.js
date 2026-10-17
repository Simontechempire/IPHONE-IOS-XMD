const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const fs = require('fs');

let config;
try { config = require('../settings'); } catch {
  config = { botName: "iPhone-iOS-XMD", ownerNumber: "2348071569915", prefix: ".", sessionName: "auth", PORT: process.env.PORT || 10000 };
}

global.sock = null;
global.isConnected = false;
global.connectionStatus = 'Starting...';
global.pairingCode = null;
global.lastPairTime = 0;
global.appStarted = false;

async function startConnection() {
  // EXPRESS - RUN ONCE
  if (!global.appStarted) {
    const app = express();
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public')));

    app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
    app.get('/api/status', (req, res) => res.json({ status: global.connectionStatus, isConnected: global.isConnected, pairingCode: global.pairingCode }));

    app.post('/api/pair', async (req, res) => {
      try {
        let phone = req.body.phone.replace(/[^0-9]/g, '');
        console.log(`\n[PAIR] Trying ${phone}...`);

        if (!global.sock) return res.json({ success: false, message: 'Bot not ready, wait 20 sec' });
        if (global.isConnected) return res.json({ success: false, message: 'Already linked!' });

        // Allow retry every 10 sec
        if (Date.now() - global.lastPairTime < 10000 && global.pairingCode) {
          return res.json({ success: true, code: global.pairingCode });
        }

        global.lastPairTime = Date.now();
        let code = await global.sock.requestPairingCode(phone);
        global.pairingCode = code;
        
        console.log(chalk.green.bold(`\n============================`));
        console.log(chalk.green.bold(`  CODE: ${code}`));
        console.log(chalk.green.bold(`  PHONE: ${phone}`));
        console.log(chalk.green.bold(`============================\n`));
        
        return res.json({ success: true, code: code });
      } catch (e) {
        console.log(chalk.red(`PAIR ERROR: ${e.message}`));
        global.lastPairTime = 0;
        return res.json({ success: false, message: e.message });
      }
    });

    app.listen(process.env.PORT || 10000, '0.0.0.0', () => {
      console.log(chalk.green(`\n🌐 Dashboard live\n`));
    });
    global.appStarted = true;
  }

  // BAILEYS - SIMPLE AND FAST
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  
  const sock = makeWASocket({
    version: [2, 3000, 1015901307],
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS('Desktop'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
    },
    markOnlineOnConnect: true,
    syncFullHistory: false,
  });

  global.sock = sock;
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    console.log(`[STATUS] ${connection}`);

    if (connection === 'connecting') {
      global.connectionStatus = 'Connecting...';
    }
    if (connection === 'open') {
      global.isConnected = true;
      global.connectionStatus = '✅ LINKED!';
      global.pairingCode = null;
      console.log(chalk.green.bold(`\n✅✅✅ LINKED SUCCESSFULLY ✅✅✅\n`));
    }
    if (connection === 'close') {
      global.isConnected = false;
      let reason = lastDisconnect?.error?.output?.statusCode;
      console.log(chalk.red(`Closed: ${reason}`));
      if (reason !== DisconnectReason.loggedOut) {
        console.log('Reconnecting in 3s...');
        setTimeout(startConnection, 3000);
      } else {
        console.log('Logged out, deleting session');
        try { fs.rmSync(config.sessionName, { recursive: true, force: true }); } catch {}
        setTimeout(startConnection, 3000);
      }
    }
  });

  // PLUGINS - SIMPLE
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const m = messages[0];
    if (!m?.message || m.key.fromMe) return;
    const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
    if (!text.startsWith(config.prefix)) return;
    const args = text.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const plugin = global.plugins?.get(cmd);
    if (!plugin) return;
    try {
      m.body = text;
      await plugin.execute(m, { sock, args, command: cmd, config, plugins: global.plugins });
    } catch (e) { console.log(e.message); }
  });
}

module.exports = { startConnection };
