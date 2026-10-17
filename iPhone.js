const config = require('./settings');

module.exports = {
  name: config.botName,
  owner: config.ownerName,
  number: config.ownerNumber,
  prefix: config.prefix,
  version: '1.0.0',
  platform: 'Multi-Device (iOS Compatible)',
  description: 'Powerful WhatsApp Multi-Device Bot optimized for iPhone / iOS users by Simon Tech Inc',
  maxCommands: 500
};
