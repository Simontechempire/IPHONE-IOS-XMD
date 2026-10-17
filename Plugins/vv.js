// 🍎 AUTO ANTI VIEW ONCE - Add in message handler
sock.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0];
  if(!m.message) return;
  
  const isViewOnce = m.message.viewOnceMessage || m.message.viewOnceMessageV2;
  if(isViewOnce) {
    // Check if autovv enabled
    if(config.autoViewOnce) {
      const buffer = await downloadMediaMessage(m, 'buffer', {});
      const ownerJid = config.ownerNumber + "@s.whatsapp.net";
      await sock.sendMessage(ownerJid, { 
        image: buffer, 
        caption: `👁️ *AUTO VV SAVED*\n\nFrom: ${m.pushName}\nChat: ${m.key.remoteJid}\n\n🍎 iPhone-iOS-XMD` 
      });
    }
  }
});
