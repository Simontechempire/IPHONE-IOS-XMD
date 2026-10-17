module.exports = {
  commands: {
    ytmp3: async (sock, msg, config) => {
      if (!msg.q) return msg.reply(`Example:\n${config.prefix}ytmp3 https://youtube.com/watch?v=...`);
      await msg.reply('⏳ YouTube MP3 download ready for integration.');
    },

    ytmp4: async (sock, msg, config) => {
      if (!msg.q) return msg.reply(`Example:\n${config.prefix}ytmp4 https://youtube.com/watch?v=...`);
      await msg.reply('⏳ YouTube MP4 download ready for integration.');
    }
  }
};
