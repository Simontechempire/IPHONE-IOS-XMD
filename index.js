/**
 * iPhone-iOS-XMD
 * Multi-Device WhatsApp Bot by Simon Tech Inc
 * Owner: 2348071569915
 */

const { startConnection } = require('./lib/connection');
const config = require('./settings');

console.log(`\n🚀 Starting ${config.botName}...`);
console.log(`👑 Owner  : \( {config.ownerName} ( \){config.ownerNumber})`);
console.log(`📌 Prefix : ${config.prefix}`);
console.log(`🌐 Dashboard will run on port ${config.PORT}\n`);

startConnection().catch(err => {
  console.error('Failed to start bot:', err);
  process.exit(1);
});
