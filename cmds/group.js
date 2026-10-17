module.exports = {
  commands: {
    tagall: async (sock, msg, config) => {
      if (!msg.isGroup) return msg.reply('Only for groups');
      if (!msg.isOwner) return msg.reply('❌ Owner only');

      try {
        const metadata = await sock.groupMetadata(msg.from);
        const participants = metadata.participants;
        let text = `🔔 *Tag All by \( {config.ownerName}*\n\n \){msg.q || 'Hello everyone!'}\n\n`;
        for (const p of participants) {
          text += `@${p.id.split('@')[0]}\n`;
        }
        await sock.sendMessage(msg.from, {
          text,
          mentions: participants.map(p => p.id)
        }, { quoted: msg });
      } catch (e) {
        await msg.reply('Failed to tag all');
      }
    },

    hidetag: async (sock, msg, config) => {
      if (!msg.isGroup) return msg.reply('Only for groups');
      if (!msg.isOwner) return msg.reply('❌ Owner only');

      try {
        const metadata = await sock.groupMetadata(msg.from);
        const mentions = metadata.participants.map(p => p.id);
        await sock.sendMessage(msg.from, {
          text: msg.q || 'Hidden tag',
          mentions
        }, { quoted: msg });
      } catch (e) {
        await msg.reply('Failed');
      }
    },

    kick: async (sock, msg, config) => {
      if (!msg.isGroup) return msg.reply('Only for groups');
      if (!msg.isOwner) return msg.reply('❌ Owner only');
      if (!msg.mentionedJid.length) return msg.reply('Tag the user to kick');

      try {
        await sock.groupParticipantsUpdate(msg.from, msg.mentionedJid, 'remove');
        await msg.reply('✅ User kicked');
      } catch (e) {
        await msg.reply('Failed (bot must be admin)');
      }
    },

    promote: async (sock, msg, config) => {
      if (!msg.isGroup) return msg.reply('Only for groups');
      if (!msg.isOwner) return msg.reply('❌ Owner only');
      if (!msg.mentionedJid.length) return msg.reply('Tag the user');

      try {
        await sock.groupParticipantsUpdate(msg.from, msg.mentionedJid, 'promote');
        await msg.reply('✅ User promoted');
      } catch (e) {
        await msg.reply('Failed (bot must be admin)');
      }
    },

    demote: async (sock, msg, config) => {
      if (!msg.isGroup) return msg.reply('Only for groups');
      if (!msg.isOwner) return msg.reply('❌ Owner only');
      if (!msg.mentionedJid.length) return msg.reply('Tag the user');

      try {
        await sock.groupParticipantsUpdate(msg.from, msg.mentionedJid, 'demote');
        await msg.reply('✅ User demoted');
      } catch (e) {
        await msg.reply('Failed (bot must be admin)');
      }
    }
  }
};
