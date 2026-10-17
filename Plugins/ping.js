module.exports = {
  commands: {
    ping: async (sock, msg, config) => {
      const start = Date.now();
      await msg.reply('🏓 Pinging...');
      const end = Date.now();
      await msg.reply(`🏓 *Pong!*\nSpeed: *${end - start} ms*`);
    }
  }
};
