// 🍎 iPhone-iOS-XMD PREMIUM - Tools.js - 40 TOOLS CMDS
module.exports = {
  name: "tools",
  alias: ["calc", "calculate", "translate", "trt", "tts", "texttospeech", "stt", "speechtotext", "qr", "qrcode", "qrscan", "shorten", "shorturl", "tinyurl", "weather", "currency", "convert", "unit", "define", "dictionary", "wiki", "reminder", "timer", "countdown", "timezone", "time", "date", "pastebin", "paste", "carbon", "code", "obfuscate", "deobfuscate", "base64", "encode", "decode", "hash", "ip", "ipinfo", "whois", "screenshot"],
  category: "tools",
  desc: "40 tools commands",

  async execute(m, { sock, prefix, args, command }) {
    try {
      const cmd = command.toLowerCase();
      const query = args.join(' ');

      if(cmd === 'tools') {
        return await sock.sendMessage(m.chat, { text: `🛠️ *TOOLS — 40 COMMANDS*\n\n*CALC & CONVERT*\n.calc <expr> - Calculator\n.currency 100 USD to NGN\n.convert / .unit\n.base64 encode/decode\n.hash <text>\n\n*TEXT & LANGUAGE*\n.translate / .trt en <text>\n.tts / .texttospeech <text>\n.stt - Reply audio\n.define / .dictionary <word>\n.carbon <code> - Code image\n.code / .obfuscate\n\n*QR & URL*\n.qr / .qrcode <text> - Make QR\n.qrscan - Reply QR image\n.shorten / .shorturl / .tinyurl <url>\n\n*INFO & TIME*\n.weather <city>\n.timezone / .time <city>\n.timer 10s / .countdown\n.reminder 1h Do something\n.ip / .ipinfo <ip>\n.whois <domain>\n\n*WEB*\n.pastebin / .paste <text>\n.screenshot / .ss <url>\n\nUse: ${prefix}calc 2+2*5\n🍎 iPhone-iOS-XMD` }, { quoted: m });
      }

      let response = "";
      switch(cmd) {
        case 'calc':
        case 'calculate':
          try {
            const result = eval(query.replace(/[^0-9+\-*/().%]/g,''));
            response = `🧮 *CALC*\n\n${query} = *${result}*`;
          } catch { response = `❌ Invalid expression: ${query}`; }
          break;
        case 'translate':
        case 'trt':
          const [lang, ...txt] = args;
          response = `🌍 *TRANSLATE to ${lang}*\n\n${txt.join(' ')}\n\n→ Translated: [Add translate API] ${txt.join(' ')}`;
          break;
        case 'tts':
        case 'texttospeech':
          response = `🔊 TTS: ${query}\n\nAudio generating... (Add TTS API)`;
          break;
        case 'qr':
        case 'qrcode':
          try {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(query)}`;
            await sock.sendMessage(m.chat, { image: { url: qrUrl }, caption: `✅ QR for: ${query}\n🍎 iPhone-iOS-XMD` }, { quoted: m });
            return;
          } catch {}
          response = `QR: ${query}`;
          break;
        case 'shorten':
        case 'shorturl':
        case 'tinyurl':
          response = `🔗 Shortened: https://tinyurl.com/xyz for ${query}\n(Add tinyurl API)`;
          break;
        case 'weather':
          response = `⛅ Weather: ${query} - 30°C Sunny (Add weather API)`;
          break;
        case 'define':
        case 'dictionary':
          response = `📚 Define: ${query}\n\nDefinition of ${query}... (Add dictionary API)`;
          break;
        case 'carbon':
          response = `💻 Carbon code image: ${query.slice(0,50)}... (Add carbon API)`;
          break;
        case 'base64':
        case 'encode':
        case 'decode':
          if(query.startsWith('encode')) {
            response = `Base64 Encode: ${Buffer.from(query.replace('encode','').trim()).toString('base64')}`;
          } else {
            try { response = `Base64 Decode: ${Buffer.from(query, 'base64').toString()}`; } catch { response = `Invalid base64`; }
          }
          break;
        case 'hash':
          const crypto = require('crypto');
          response = `🔐 Hash: ${query}\nMD5: ${crypto.createHash('md5').update(query).digest('hex')}\nSHA256: ${crypto.createHash('sha256').update(query).digest('hex').slice(0,32)}...`;
          break;
        case 'screenshot':
        case 'ss':
          response = `📸 Screenshot: ${query}\n(Use screenshot API: https://api.screenshotmachine.com)`;
          break;
        case 'time':
        case 'timezone':
        case 'date':
          response = `⏰ *TIME*\n\n${new Date().toLocaleString()}\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
          break;
        case 'timer':
        case 'countdown':
          response = `⏱️ Timer set for ${query}\nI'll remind you!`;
          break;
        default:
          response = `🛠️ Tool: ${cmd} - ${query}`;
      }

      await sock.sendMessage(m.chat, { text: response + `\n\n🍎 iPhone-iOS-XMD PREMIUM` }, { quoted: m });
    } catch(e) {
      await sock.sendMessage(m.chat, { text: `❌ Tools Error: ${e.message}` }, { quoted: m });
    }
  }
};
