const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const config = require('../settings');
const { serialize } = require('./serialize');
const { loadCommands } = require('./functions');

const usePairingCode = process.argv.includes('--pairing-code');
const useQR = process.argv.includes('--qr');

global.pairingCode = null;
global.qrCodeData = null;
global.isConnected = false;
global.connectionStatus = 'Starting bot...';
global.lastUpdate = Date.now();

async function startConnection() {
  const app = express();
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
      hasQR: !!global.qrCodeData,
      timestamp: global.lastUpdate
    });
  });

  app.get('/api/qr', async (req, res) => {
    if (!global.qrCodeData) return res.json({ qr: null });
    try {
      const qrImage = await QRCode.toDataURL(global.qrCodeData, {
        width: 300,
        margin: 2
      });
      res.json({ qr: qrImage });
    } catch (e) {
      res.json({ qr: null });
    }
  });

  const port = config.PORT || 3000;
  app.listen(port, () => {
    console.log(chalk.cyan(`\n🌐 Web Dashboard is live!`));
    console.log(chalk.cyan(`   → http://localhost:${port}`));
    console.log(chalk.cyan(`   (On Render/Railway use your public URL)\n`));
  });

  const { state, saveCreds } = await useMultiFileAuthState(`./${config.sessionName}`);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
    },
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    getMessage: async () => undefined
  });

  // ========== REAL PAIRING CODE ==========
  if ((usePairingCode || !useQR) && !sock.authState.creds.registered) {
    const phoneNumber = config.botNumber.replace(/[^0-9]/g, '');

    setTimeout(async () => {
      try {
        console.log(chalk.yellow(`\n⏳ Generating pairing code for ${phoneNumber}...`));
        const code = await sock.requestPairingCode(phoneNumber);

        global.pairingCode = code;
        global.connectionStatus = 'Enter Pairing Code on WhatsApp';
        global.lastUpdate = Date.now();

        console.log(chalk.green.bold(`\n=================================`));
        console.log(chalk.green.bold(`   PAIRING CODE →  ${code}`));
        console.log(chalk.green.bold(`=================================\n`));
        console.log(chalk.cyan(`1. Open WhatsApp`));
        console.log(chalk.cyan(`2. Linked Devices`));
        console.log(chalk.cyan(`3. Link with phone number instead`));
        console.log(chalk.cyan(`4. Enter code: ${code}\n`));
      } catch (err) {
        console.error(chalk.red('Pairing code error:'), err.message);
        global.connectionStatus = 'Failed to generate code';
      }
    }, 3000);
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      global.qrCodeData = qr;
      global.connectionStatus = 'Scan the QR Code';
      global.lastUpdate = Date.now();

      if (useQR) {
        console.log(chalk.yellow('\n📱 Scan this QR Code:\n'));
        qrcodeTerminal.generate(qr, { small: true });
      }
    }

    if (connection === 'open') {
      global.isConnected = true;
      global.connectionStatus = 'Bot is Online ✅';
      global.pairingCode = null;
      global.qrCodeData = null;
      global.lastUpdate = Date.now();

      console.log(chalk.green.bold(`\n✅ ${config.botName} is ONLINE!`));
      console.log(chalk.cyan(`👑 Owner  : ${config.ownerName}`));
      console.log(chalk.cyan(`📞 Number : ${config.ownerNumber}`));
      console.log(chalk.cyan(`📌 Prefix : ${config.prefix}\n`));
    }

    if (connection === 'close') {
      global.isConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      global.connectionStatus = shouldReconnect ? 'Reconnecting...' : 'Logged Out';
      global.lastUpdate = Date.now();

      if (shouldReconnect) {
        setTimeout(() => startConnection(), 4000);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  const commands = await loadCommands();
  console.log(chalk.green(`✅ Loaded ${commands.size} commands\n`));

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const m = messages[0];
    if (!m.message) return;

    try {
      const msg = await serialize(sock, m);
      if (!msg || !msg.isCmd) return;
      const cmd = commands.get(msg.command);
      if (cmd) await cmd(sock, msg, config);
    } catch (err) {
      console.error(err);
    }
  });

  return sock;
}

module.exports = { startConnection };
