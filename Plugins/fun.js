// 🍎 iPhone-iOS-XMD PREMIUM - Fun.js - 30 FUN CMDS
module.exports = {
  name: "fun",
  alias: ["joke", "jokes", "meme", "memes", "quote", "quotes", "fact", "facts", "truth", "dare", "truthordare", "tod", "8ball", "ask", "flip", "coinflip", "roll", "dice", "rps", "rockpaperscissors", "love", "lovecalc", "ship", "compatibility", "gaycheck", "iq", "handsome", "beautiful", "stupid", "rank"],
  category: "fun",
  desc: "30 fun commands",

  async execute(m, { sock, prefix, args, command }) {
    try {
      const cmd = command.toLowerCase();
      const query = args.join(' ');
      
      if(cmd === 'fun') {
        return await sock.sendMessage(m.chat, { text: `🎉 *FUN — 30 COMMANDS*\n\n*JOKES & MEMES*\n.joke / .jokes\n.meme / .memes\n.quote / .quotes\n.fact / .facts\n\n*GAMES*\n.truth / .dare / .tod\n.8ball / .ask <question>\n.flip / .coinflip\n.roll / .dice\n.rps rock/paper/scissors\n\n*LOVE & SHIP*\n.love / .lovecalc @user @user\n.ship @user @user\n.compatibility\n\n*FUN CHECK*\n.gay / .gaycheck @user\n.iq / .handsome / .beautiful / .stupid @user\n.rank - Group rank\n\nUse: ${prefix}joke\n🍎 iPhone-iOS-XMD` }, { quoted: m });
      }

      let response = "";
      const randomPercent = () => Math.floor(Math.random()*100)+1;

      switch(cmd) {
        case 'joke':
        case 'jokes':
          response = `😂 *JOKE*\n\nWhy did the programmer quit his job?\nBecause he didn't get arrays! 😂\n\n🍎 iPhone-iOS-XMD`;
          break;
        case 'meme':
        case 'memes':
          response = `😂 *MEME*\n\nSending meme...`;
          try {
            const memeUrl = `https://i.imgflip.com/random`;
            await sock.sendMessage(m.chat, { image: { url: `https://meme-api.com/gimme` }, caption: `😂 Random Meme\n🍎 iPhone-iOS-XMD` }, { quoted: m });
            return;
          } catch {}
          break;
        case 'quote':
        case 'quotes':
          response = `💬 *QUOTE*\n\n"The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb\n\n🍎 iPhone-iOS-XMD`;
          break;
        case 'fact':
        case 'facts':
          response = `🧠 *FACT*\n\nHoney never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible!\n\n🍎 iPhone-iOS-XMD`;
          break;
        case 'truth':
          response = `🤔 *TRUTH*\n\nWhat is your biggest secret? 😏\n\n🍎 iPhone-iOS-XMD`;
          break;
        case 'dare':
          response = `😈 *DARE*\n\nSend a voice note saying "I love iPhone-iOS-XMD" 😂\n\n🍎 iPhone-iOS-XMD`;
          break;
        case 'truthordare':
        case 'tod':
          response = Math.random()>0.5 ? `🤔 TRUTH: What is your crush name?` : `😈 DARE: Change your DP to bot logo for 1 hour`;
          break;
        case '8ball':
        case 'ask':
          const answers = ["Yes!", "No!", "Maybe", "Definitely!", "Ask again", "Absolutely not!", "For sure!", "I doubt it"];
          response = `🎱 *8BALL*\n\nQ: ${query}\nA: ${answers[Math.floor(Math.random()*answers.length)]}\n\n🍎 iPhone-iOS-XMD`;
          break;
        case 'flip':
        case 'coinflip':
          response = `🪙 *COINFLIP*\n\nResult: ${Math.random()>0.5 ? "Heads 🪙" : "Tails 🪙"}\n\n🍎 iPhone-iOS-XMD`;
          break;
        case 'roll':
        case 'dice':
          response = `🎲 *DICE*\n\nYou rolled: ${Math.floor(Math.random()*6)+1} 🎲\n\n🍎 iPhone-iOS-XMD`;
          break;
        case 'rps':
        case 'rockpaperscissors':
          const choices = ["rock","paper","scissors"];
          const bot = choices[Math.floor(Math.random()*3)];
          response = `✊ *RPS*\n\nYou: ${query || "rock"}\nBot: ${bot}\nResult: ${query===bot?"Draw!": (query==="rock"&&bot==="scissors"||query==="paper"&&bot==="rock"||query==="scissors"&&bot==="paper")?"You win! 🎉":"Bot wins! 😈"}`;
          break;
        case 'love':
        case 'lovecalc':
        case 'ship':
        case 'compatibility':
          const users = m.mentionedJid || [];
          const target1 = users[0]?.split('@')[0] || "You";
          const target2 = users[1]?.split('@')[0] || "Bot";
          const percent = randomPercent();
          response = `❤️ *LOVE CALC*\n\n${target1} ❤️ ${target2}\n\nCompatibility: ${percent}%\n${percent>80?"Perfect match! 💕":percent>50?"Good! 😊":"Hmm, maybe not 😅"}\n\n🍎 iPhone-iOS-XMD`;
          break;
        case 'gay':
        case 'gaycheck':
          const gayTarget = m.mentionedJid?.[0]?.split('@')[0] || m.sender.split('@')[0];
          response = `🌈 *GAY CHECK*\n\n@${gayTarget} is ${randomPercent()}% gay! 🌈\n\n😂 Just for fun!\n🍎 iPhone-iOS-XMD`;
          await sock.sendMessage(m.chat, { text: response, mentions: [m.mentionedJid?.[0] || m.sender] }, { quoted: m });
          return;
        case 'iq':
          response = `🧠 *IQ CHECK*\n\n@${m.mentionedJid?.[0]?.split('@')[0] || m.sender.split('@')[0]} IQ is ${randomPercent()+50}!\n\n${randomPercent()>80?"Genius! 🧠":"Average 😅"}`;
          break;
        case 'handsome':
        case 'beautiful':
        case 'stupid':
          response = `😍 *${cmd.toUpperCase()} CHECK*\n\n@${m.mentionedJid?.[0]?.split('@')[0] || m.sender.split('@')[0]} is ${randomPercent()}% ${cmd}!\n\n🍎 iPhone-iOS-XMD`;
          await sock.sendMessage(m.chat, { text: response, mentions: [m.mentionedJid?.[0] || m.sender] }, { quoted: m });
          return;
        case 'rank':
          response = `🏆 *GROUP RANK*\n\nTop active members:\n1. @${m.sender.split('@')[0]} - 100 msgs\n2. User2 - 80 msgs\n3. User3 - 60 msgs\n\nYour rank: #1 🔥\n\n🍎 iPhone-iOS-XMD`;
          break;
        default:
          response = `🎉 Fun: ${cmd}`;
      }

      await sock.sendMessage(m.chat, { text: response + `\n\n🍎 iPhone-iOS-XMD PREMIUM` }, { quoted: m });
    } catch(e) {
      await sock.sendMessage(m.chat, { text: `❌ Fun Error: ${e.message}` }, { quoted: m });
    }
  }
};
