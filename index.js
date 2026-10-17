sock.ev.on('messages.upsert', async ({ messages }) => {
  try {
    let m = messages[0];
    if(!m.message || m.key.fromMe) return;
    
    const { serialize } = require('./Serialize');
    m = await serialize(m, sock);
    
    const body = m.body || m.text || "";
    if(!body) return;
    
    const prefix = config.prefix || ".";
    if(!body.startsWith(prefix)) return;
    
    const args = body.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();
    if(!command) return;
    
    const plugin = global.plugins?.get(command);
    if(!plugin) {
      console.log(`❌ Command not found: ${command}`);
      return;
    }
    
    console.log(`🍎 EXEC: ${command} | From: ${m.pushName || m.sender}`);
    
    const isOwner = config.ownerNumber.includes(m.sender.split('@')[0]) || config.ownerNumber.includes(m.sender);
    
    await plugin.execute(m, {
      sock,
      prefix,
      args,
      command,
      isOwner,
      config,
      plugins: global.plugins
    });
    
  } catch(e) {
    console.error("Handler Error:", e);
  }
});
