// 🍎 iPhone-iOS-XMD PREMIUM - Economy.js - 25 ECONOMY CMDS
module.exports = {
  name: "economy",
  alias: ["economy","balance","bal","wallet","daily","claim","work","job","rob","stealmoney","pay","transfer","give","leaderboard","lb","rich","shop","buy","sell","inventory","inv","deposit","withdraw","bank","slot","gamble"],
  category: "economy",
  desc: "25 economy commands",
  async execute(m, { sock, prefix, args, command }) {
    const cmd = command.toLowerCase();
    const query = args.join(' ');
    if(!global.economy) global.economy = {};
    const user = m.sender;
    if(!global.economy[user]) global.economy[user] = { money: 1000, bank: 0, daily: 0, inventory: [] };
    const eco = global.economy[user];

    if(cmd === 'economy') return sock.sendMessage(m.chat, { text: `💰 *ECONOMY — 25 CMDS*\n\n💳 balance/bal/wallet\n🎁 daily/claim\n💼 work/job\n🔫 rob @user\n💸 pay/transfer/give @user amount\n🏆 leaderboard/lb/rich\n🛒 shop/buy/sell\n🎒 inventory/inv\n🏦 bank/deposit/withdraw\n🎰 slot/gamble\n\nYou have: $${eco.money}\nBank: $${eco.bank}\n🍎 iPhone-iOS-XMD` }, { quoted: m });

    let res = "";
    switch(cmd) {
      case 'balance': case 'bal': case 'wallet': case 'bank':
        res = `💰 *WALLET*\n\nUser: @${user.split('@')[0]}\nCash: $${eco.money}\nBank: $${eco.bank}\nTotal: $${eco.money+eco.bank}`; break;
      case 'daily': case 'claim':
        if(Date.now()-eco.daily < 86400000) res = `⏰ Daily already claimed! Wait ${Math.ceil((86400000-(Date.now()-eco.daily))/3600000)}h`;
        else { eco.money+=1000; eco.daily=Date.now(); res=`🎁 Daily claimed! +$1000\nNew: $${eco.money}`; } break;
      case 'work': case 'job':
        const earn = Math.floor(Math.random()*500)+100; eco.money+=earn; res=`💼 Worked! Earned $${earn}\nBalance: $${eco.money}`; break;
      case 'rob': case 'stealmoney':
        const target = m.mentionedJid?.[0]; if(!target) return m.reply(`Use: ${prefix}rob @user`); if(!global.economy[target]) global.economy[target]={money:1000,bank:0}; const stolen = Math.floor(Math.random()*Math.min(500,global.economy[target].money)); global.economy[target].money-=stolen; eco.money+=stolen; res=`🔫 Robbed @${target.split('@')[0]}! Got $${stolen}`; break;
      case 'pay': case 'transfer': case 'give':
        const payTarget = m.mentionedJid?.[0]; const amount = parseInt(args[1]); if(!payTarget||!amount) return m.reply(`Use: ${prefix}pay @user 100`); if(eco.money<amount) return m.reply(`Not enough!`); eco.money-=amount; if(!global.economy[payTarget]) global.economy[payTarget]={money:1000,bank:0}; global.economy[payTarget].money+=amount; res=`💸 Paid $${amount} to @${payTarget.split('@')[0]}`; break;
      case 'deposit': eco.money-=parseInt(query)||100; eco.bank+=parseInt(query)||100; res=`🏦 Deposited $${query}\nBank: $${eco.bank}`; break;
      case 'withdraw': eco.bank-=parseInt(query)||100; eco.money+=parseInt(query)||100; res=`🏦 Withdrew $${query}\nCash: $${eco.money}`; break;
      case 'leaderboard': case 'lb': case 'rich':
        const sorted = Object.entries(global.economy).sort((a,b)=> (b[1].money+b[1].bank)-(a[1].money+a[1].bank)).slice(0,5); res=`🏆 *RICH LIST*\n\n${sorted.map((u,i)=>`${i+1}. @${u[0].split('@')[0]} - $${u[1].money+u[1].bank}`).join('\n')}`; break;
      case 'shop': res=`🛒 *SHOP*\n1. Laptop - $5000 - buy laptop\n2. Phone - $1000 - buy phone\n3. Car - $20000 - buy car\nUse ${prefix}buy <item>`; break;
      case 'buy': eco.inventory.push(query); res=`✅ Bought ${query}!`; break;
      case 'inventory': case 'inv': res=`🎒 *INVENTORY*\n${eco.inventory.join('\n')||'Empty'}`; break;
      case 'slot': case 'gamble': const bet=parseInt(query)||100; if(eco.money<bet) return m.reply(`Not enough`); if(Math.random()>0.5){eco.money+=bet; res=`🎰 Won! +$${bet}\nBal: $${eco.money}`;} else {eco.money-=bet; res=`🎰 Lost! -$${bet}\nBal: $${eco.money}`;} break;
      default: res=`💰 Economy: ${cmd}`;
    }
    await sock.sendMessage(m.chat, { text: res+`\n\n🍎 iPhone-iOS-XMD`, mentions: [user, ...(m.mentionedJid||[])] }, { quoted: m });
  }
};
