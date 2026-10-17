// 🍎 iPhone-iOS-XMD PREMIUM - Game.js - 20 GAME CMDS
module.exports = {
  name: "game",
  alias: ["games", "tictactoe", "ttt", "chess", "hangman", "wordgame", "mathgame", "mathquiz", "trivia", "quiz", "riddle", "slot", "slots", "blackjack", "bj", "dice", "guess", "numberguess", "rockpaper", "connect4"],
  category: "game",
  desc: "20 game commands",

  async execute(m, { sock, prefix, args, command }) {
    try {
      const cmd = command.toLowerCase();
      const query = args.join(' ');

      if(cmd === 'game' || cmd === 'games') {
        return await sock.sendMessage(m.chat, { text: `🎮 *GAMES — 20 COMMANDS*\n━━━━━━━━━━━━━━━━\n
🎯 *CLASSIC GAMES*
.tictactoe / .ttt @user - Tic Tac Toe
.chess @user - Chess
.hangman - Hangman word game
.wordgame - Word guessing
.connect4 - Connect 4

🧠 *QUIZ & TRIVIA*
.mathgame / .mathquiz - Math quiz
.trivia / .quiz - Trivia question
.riddle - Riddle

🎰 *CASINO & LUCK*
.slot / .slots - Slot machine
.blackjack / .bj - Blackjack 21
.dice - Roll dice game
.guess / .numberguess 1-100

✊ *ACTION*
.rockpaper rock/paper/scissors

Use: ${prefix}tictactoe @user
🍎 iPhone-iOS-XMD` }, { quoted: m });
      }

      let response = "";
      switch(cmd) {
        case 'tictactoe':
        case 'ttt':
          const opp = m.mentionedJid?.[0];
          if(!opp) return m.reply(`Use: ${prefix}ttt @user to play with someone`);
          response = `⭕ *TIC TAC TOE*\n\n${m.pushName} vs @${opp.split('@')[0]}\n\n1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣\n\nUse ${prefix}ttt 5 to place at position 5\n\nTurn: @${m.sender.split('@')[0]}`;
          await sock.sendMessage(m.chat, { text: response, mentions: [m.sender, opp] }, { quoted: m });
          return;

        case 'hangman':
          const words = ["IPHONE","WHATSAPP","ANDROID","JAVASCRIPT","PREMIUM","BOT","GAMING"];
          const word = words[Math.floor(Math.random()*words.length)];
          response = `🎯 *HANGMAN*\n\nWord: ${"_ ".repeat(word.length)}\nLength: ${word.length} letters\n\nGuess with: ${prefix}hangman A\n\nHint: Tech related\n\nLives: ❤️❤️❤️❤️❤️`;
          break;

        case 'mathgame':
        case 'mathquiz':
          const a = Math.floor(Math.random()*20)+1;
          const b = Math.floor(Math.random()*20)+1;
          const op = ["+","-","*"][Math.floor(Math.random()*3)];
          const ans = op==="+"?a+b: op==="-"?a-b:a*b;
          response = `🧮 *MATH QUIZ*\n\nWhat is ${a} ${op} ${b} = ?\n\nReply with answer!\n\nAnswer is: ||${ans}|| (hidden)\n🍎 iPhone-iOS-XMD`;
          // Store answer for checking - use global
          if(!global.mathGame) global.mathGame = {};
          global.mathGame[m.chat] = ans;
          break;

        case 'trivia':
        case 'quiz':
          response = `🧠 *TRIVIA*\n\nQ: What is the capital of Nigeria?\nA) Lagos\nB) Abuja\nC) Kano\n\nReply A/B/C\n\n🍎 iPhone-iOS-XMD`;
          break;

        case 'riddle':
          response = `🤔 *RIDDLE*\n\nI speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?\n\nAnswer: Echo\n\nUse ${prefix}riddle for new riddle\n🍎 iPhone-iOS-XMD`;
          break;

        case 'slot':
        case 'slots':
          const emojis = ["🍎","🍌","🍇","🍓","💎","7️⃣"];
          const s1 = emojis[Math.floor(Math.random()*emojis.length)];
          const s2 = emojis[Math.floor(Math.random()*emojis.length)];
          const s3 = emojis[Math.floor(Math.random()*emojis.length)];
          const win = s1===s2 && s2===s3;
          response = `🎰 *SLOT MACHINE*\n\n| ${s1} | ${s2} | ${s3} |\n\n${win ? "🎉 JACKPOT! You win!" : "😅 Try again!"}\n\n🍎 iPhone-iOS-XMD`;
          break;

        case 'blackjack':
        case 'bj':
          const player = Math.floor(Math.random()*11)+10;
          const dealer = Math.floor(Math.random()*11)+10;
          response = `♠️ *BLACKJACK*\n\nYour cards: ${player}\nDealer: ${dealer}\n\n${player>dealer ? "You win! 🎉" : player===dealer ? "Draw!" : "Dealer wins 😅"}\n\nUse ${prefix}bj to play again\n🍎 iPhone-iOS-XMD`;
          break;

        case 'dice':
          response = `🎲 *DICE GAME*\n\nYou rolled: ${Math.floor(Math.random()*6)+1}\nBot rolled: ${Math.floor(Math.random()*6)+1}\n\n${Math.random()>0.5?"You win!":"Bot wins!"}\n\n🍎 iPhone-iOS-XMD`;
          break;

        case 'guess':
        case 'numberguess':
          const target = Math.floor(Math.random()*100)+1;
          if(!query) {
            if(!global.guessGame) global.guessGame = {};
            global.guessGame[m.chat] = target;
            response = `🔢 *NUMBER GUESS*\n\nI picked a number 1-100\nGuess with: ${prefix}guess 50\n\nYou have 5 tries!\n🍎 iPhone-iOS-XMD`;
          } else {
            const guess = parseInt(query);
            const actual = global.guessGame?.[m.chat] || target;
            if(guess === actual) response = `🎉 Correct! Number was ${actual}!`;
            else if(guess < actual) response = `📈 Too low! Try higher than ${guess}`;
            else response = `📉 Too high! Try lower than ${guess}`;
          }
          break;

        case 'rockpaper':
          const choices = ["rock","paper","scissors"];
          const bot = choices[Math.floor(Math.random()*3)];
          const user = query.toLowerCase();
          if(!choices.includes(user)) return m.reply(`Use: ${prefix}rockpaper rock/paper/scissors`);
          let result = user===bot ? "Draw!" : (user==="rock"&&bot==="scissors"||user==="paper"&&bot==="rock"||user==="scissors"&&bot==="paper") ? "You win! 🎉" : "Bot wins! 😈";
          response = `✊ *ROCK PAPER SCISSORS*\n\nYou: ${user}\nBot: ${bot}\n\n${result}\n\n🍎 iPhone-iOS-XMD`;
          break;

        case 'connect4':
          response = `🔴 *CONNECT 4*\n\n1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣\n⬜⬜⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜⬜⬜\n\nUse ${prefix}connect4 3 to drop in column 3\n\n🍎 iPhone-iOS-XMD`;
          break;

        case 'chess':
          response = `♟️ *CHESS*\n\nGame starting with @${m.mentionedJid?.[0]?.split('@')[0] || "opponent"}\n\nBoard: ♜♞♝... (Chess board)\n\nUse chess notation: e2 e4\n\n🍎 iPhone-iOS-XMD`;
          break;

        default:
          response = `🎮 Game: ${cmd}`;
      }

      await sock.sendMessage(m.chat, { text: response + `\n\n🍎 iPhone-iOS-XMD PREMIUM` }, { quoted: m });

    } catch(e) {
      await sock.sendMessage(m.chat, { text: `❌ Game Error: ${e.message}` }, { quoted: m });
    }
  }
};
