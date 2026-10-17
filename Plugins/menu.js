// 🍎 iPhone-iOS-XMD PREMIUM - menu.js - PLUGINS
const os = require('os');
const moment = require('moment-timezone');

module.exports = {
  name: "menu",
  alias: ["allmenu", "help", "list", "commands"],
  category: "general",
  desc: "Show all 500 commands",

  async execute(m, { sock, prefix, config }) {
    try {
      // 🍎 DYNAMIC VALUES - YOUR REQUIREMENTS
      const userNumber = m.sender.split('@')[0]; // user number
      const userName = m.pushName || "Premium User"; // user name on wa
      const botMode = config?.mode || "public"; // public or private
      const botPrefix = prefix || "."; // .
      const platform = os.platform(); // show platform
      const pluginsCount = 500; // Plugins
      const botVersion = config?.version || "Premium v3.0.0"; // bot version
      
      // Runtime / Speed / Uptime
      const uptimeSec = process.uptime();
      const h = Math.floor(uptimeSec / 3600);
      const mi = Math.floor((uptimeSec % 3600) / 60);
      const s = Math.floor(uptimeSec % 60);
      const runtime = `${h}h ${mi}m ${s}s`;
      const speed = runtime;
      
      // Date - pair date - Africa/Lagos
      const date = moment.tz('Africa/Lagos').format('DD/MM/YYYY');
      const time = moment.tz('Africa/Lagos').format('HH:mm:ss');

      // YOUR EXACT HEADER
      const header = `╭───『 *🍎 iPhone-iOS-XMD PREMIUM* 』
│ 👑 mode   : ${botMode}
│ 📞 Number : ${userNumber}
│ 📌 Prefix : ${botPrefix}
│ 📱 Platform: ${platform}
│ ⏱️ Runtime : ${speed}
│ 🔤 Prefix  : ${botPrefix}
│ 📊 User   : ${userName}
│ 📅 Date    : ${date}
│ 🕐 Time    : ${time}
│ ⏳ Uptime  : ${speed}
│ 🔌 Plugins : ${pluginsCount} 🍎
│ 📦 Version : ${botVersion}
╰────────────────────
`;

      const menuBody = `
🍎 iPhone-iOS-XMD — 500 COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI — 40
.ai .ask .chat .gpt .gemini .claude .grok .deepseek .copilot .metaai .perplexity .blackbox .aicode .codeai .debugai .explaincode .fixcode .convertcode .reviewcode .aimage .imagine .aiedit .analyze .vision .describe .summarize .rewrite .paraphrase .grammar .translateai .aistudy .aitutor .aiexplain .ainews .aisearch .aifact .aiquiz .aistory .aipoem .aivoice
━━━━━━━━━━━━━━━━━━━━━━━━
📥 DOWNLOAD — 35
.play .song .video .ytmp3 .ytmp4 .ytaudio .ytvideo .ytsearch .ytdl .tiktok .ttdl .tiktokvideo .tiktokaudio .instagram .igdl .igreel .igstory .facebook .fbdl .twitter .xdl .pinterest .pindl .spotify .spotifydl .soundcloud .mediafire .gdrive .githubdl .apk .apkdl .capcut .threads .redditdl .directdl
━━━━━━━━━━━━━━━━━━━━━━━━
🔍 SEARCH — 25
.google .search .websearch .imagesearch .yts .spotifysearch .tiktoksearch .igsearch .github .githubsearch .wiki .wikipedia .dictionary .define .meaning .news .technews .movie .imdb .anime .manga .pinterestsearch .apksearch .lyricssearch .weather
━━━━━━━━━━━━━━━━━━━━━━━━
🎨 IMAGE — 35
.sticker .s .take .steal .toimg .tosticker .circle .crop .resize .rotate .flip .blur .sharpen .grayscale .sepia .invert .brightness .contrast .pixelate .cartoon .sketch .animefilter .removebg .changebg .upscale .enhance .remini .compressimg .imginfo .qrimage .wanted .poster .logo .wallpaper .avatar
━━━━━━━━━━━━━━━━━━━━━━━━
🎧 AUDIO — 30
.toaudio .tomp3 .voice .tts .bass .treble .volume .speed .slow .fast .reverseaudio .nightcore .deepvoice .robotvoice .echo .reverb .chipmunk .vocal .instrumental .trim .joinaudio .audioinfo .compressaudio .normalize .fadein .fadeout .pitch .lowpitch .highpitch .voicenote
━━━━━━━━━━━━━━━━━━━━━━━━
🎬 VIDEO — 25
.tovideo .tomp4 .togif .reversevideo .slowvideo .fastvideo .mutevideo .videotoaudio .trimvideo .cropvideo .rotatevideo .compressvideo .videoquality .videoinfo .addaudio .addtext .thumbnail .extractframe .gif .gifsticker .loopvideo .videofilter .videoblur .videogif .videosticker
━━━━━━━━━━━━━━━━━━━━━━━━
👥 GROUP — 50
.add .kick .remove .promote .demote .admins .members .tagall .hidetag .tagadmin .tagme .groupinfo .grouplink .revoke .invite .accept .setname .setdesc .setgcpp .delgcpp .open .close .mute .unmute .lock .unlock .welcome .goodbye .setwelcome .setgoodbye .resetwelcome .resetgoodbye .warn .unwarn .warnings .resetwarn .kickwarn .poll .vote .groupstats .inactive .active .listonline .adminonly .groupmode .approve .reject .requests .cancelinvite .groupsettings
━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ MODERATION — 30
.antilink .antispam .antibot .antitag .antimention .antiflood .anticall .antiforward .antisticker .antiimage .antivideo .antiaudio .antidocument .antivirtex .antibadword .anticaps .antidelete .antiedit .antimedia .antipoll .antigroupmention .antichannel .antipromote .antidemote .filter .addfilter .delfilter .filters .whitelist .blacklist
━━━━━━━━━━━━━━━━━━━━━━━━
⚡ AUTO — 25
.autoread .autotyping .autorecord .autoonline .autostatus .autoviewstatus .autolikestatus .autoreactstatus .autoreact .autoreply .autosticker .autodownload .autoai .autotranslate .autowelcome .autogoodbye .autobio .autoblock .autounblock .autosave .autoclean .autobackup .autoforward .autorespond .autopresence
━━━━━━━━━━━━━━━━━━━━━━━━
🧰 TOOLS — 40
.calc .calculator .qr .readqr .shorturl .expandurl .ss .screenshot .website .ping .speed .runtime .uptime .time .date .calendar .timer .stopwatch .reminder .reminders .cancelreminder .note .notes .delnote .ipinfo .whois .dns .base64 .encode .decode .binary .hex .uuid .password .random .count .wordcount .charcount .readmore .fetch
━━━━━━━━━━━━━━━━━━━━━━━━
📱 WHATSAPP — 25
.getpp .getbio .getname .getnumber .getjid .getid .savecontact .vcard .forward .copy .delete .edit .react .unreact .pin .unpin .star .unstar .disappear .chatinfo .msginfo .quoted .getquoted .statusinfo .profile
━━━━━━━━━━━━━━━━━━━━━━━━
📡 CHANNEL — 20
.channelinfo .channelid .channelcreate .channeldelete .channelfollow .channelunfollow .channelmute .channelunmute .channelreact .channelinvite .channeladmins .channelsettings .channelname .channeldesc .channelpp .channelstats .channelpost .channeldeletepost .channeleditpost .channellist
━━━━━━━━━━━━━━━━━━━━━━━━
🧩 PLUGIN — 20
.plugins .plugin .install .uninstall .enable .disable .reload .reloadplugin .plugininfo .pluginlist .pluginsearch .pluginupdate .updateplugins .pluginstats .plugincount .pluginhelp .pluginconfig .resetplugin .exportplugin .importplugin
━━━━━━━━━━━━━━━━━━━━━━━━
👑 OWNER — 40
.owner .ownerinfo .setowner .addowner .delowner .owners .ban .unban .banlist .block .unblock .blocklist .broadcast .bc .bcgc .restart .shutdown .reconnect .update .botupdate .join .leave .leaveall .mode .public .private .self .setprefix .setbotname .setbotbio .setbotpp .delbotpp .setstatus .setmenu .clearchats .clearsession .backup .restore .logs .botstats
━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ SETTINGS — 20
.settings .config .prefix .language .setlang .timezone .settimezone .theme .settheme .menuimage .setmenuimage .menutype .setmenutype .readmode .presence .reactmode .downloadmode .aimode .resetsettings .defaultsettings
━━━━━━━━━━━━━━━━━━━━━━━━
📊 SYSTEM — 20
.alive .health .status .info .botinfo .version .platform .server .cpu .ram .memory .storage .network .latency .process .database .dbsize .connections .sessions .dashboard
━━━━━━━━━━━━━━━━━━━━━━━━
🎭 FUN — 20
.joke .fact .quote .riddle .truth .dare .8ball .coinflip .dice .rate .ship .choose .pick .randomnumber .randomemoji .meme .trivia .question .challenge .funny
━━━━━━━━━━━━━━━━━━━━━━━━
🎮 GAMES — 20
.tictactoe .ttt .rps .hangman .quiz .mathquiz .wordgame .scramble .guess .numberguess .chess .checkers .connect4 .memorygame .puzzle .snake .2048 .rpg .adventure .leaderboard
━━━━━━━━━━━━━━━━━━━━━━━━
📝 TEXT — 20
.fancy .font .uppercase .lowercase .capitalize .reverse .repeat .space .removeemoji .addemoji .texttoemoji .binarytext .morse .unmorse .textlogo .ascii .quoteimg .fakequote .caption .cleantext
━━━━━━━━━━━━━━━━━━━━━━━━
📚 PRODUCTIVITY — 20
.todo .addtodo .deltodo .todos .cleartodo .schedule .tasks .addtask .deltask .done .focus .translate .summarizer .pdftext .ocr .scan .extracttext .texttopdf .csv .json
━━━━━━━━━━━━━━━━━━━━━━━━
🔐 PRIVACY — 10
.privacy .lastseen .onlineprivacy .profileprivacy .statusprivacy .readreceipts .groupprivacy .callprivacy .privacycheck .security
━━━━━━━━━━━━━━━━━━━━━━━━
💎 PREMIUM — 10
.premium .premiuminfo .addpremium .delpremium .premiumlist .checkpremium .plan .upgrade .expiry .subscription
━━━━━━━━━━━━━━━━━━━━━━━━
🍎 TOTAL: 500 COMMAND 
⚡ iPhone-iOS-XMD
👑 Powered by Simon Tech`;

      await sock.sendMessage(m.chat, { text: header + menuBody }, { quoted: m });
      
    } catch (e) {
      console.log(e);
    }
  }
};
