require('dotenv').config();

module.exports = {
  ownerNumber: process.env.OWNER_NUMBER || '2348071569915',
  ownerName: process.env.OWNER_NAME || 'Simon Tech Inc',
  owners: (process.env.OWNER_NUMBER || '2348071569915').split(',').map(n => n.trim().replace(/[^0-9]/g, '')),

  botName: process.env.BOT_NAME || 'iPhone-iOS-XMD',
  prefix: process.env.PREFIX || '.',
  botNumber: process.env.BOT_NUMBER || '2348071569915',

  timezone: process.env.TIME_ZONE || 'Africa/Lagos',
  sessionName: 'session',
  packname: process.env.PACKNAME || 'Simon Tech Inc',
  author: process.env.AUTHOR || 'Simon Tech Inc',

  PORT: process.env.PORT || 3000
};
