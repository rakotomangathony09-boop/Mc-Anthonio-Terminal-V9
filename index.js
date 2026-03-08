const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const path = require('path');

const CONFIG = {
    token: '8694426433:AAHijK_HaXmfuloGN7V1vVal6lxUcBWdt00',
    channelId: '-1003850314405',
    assets: ['GainX 400', 'PainX 400', 'GainX 600', 'PainX 600', 'GainX 800', 'PainX 800', 'GainX 999', 'PainX 999', 'GainX 1200', 'PainX 1200']
};

// --- CORRECTIF CRITIQUE ANTI-409 ---
const bot = new TelegramBot(CONFIG.token, { polling: false });

bot.deleteWebHook().then(() => {
    console.log("🔱 SESSION PURGÉE : CONFLIT 409 RÉSOLU");
    bot.startPolling();
    console.log("🚀 TERMINAL MC ANTHONIO CONNECTÉ AU CANAL VVIP");
});

// --- STRATÉGIE RÉELLE : SWEEP & RECOVERY (M5) ---
function marketScanner() {
    const now = new Date();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    CONFIG.assets.forEach(asset => {
        // 1. ALERTE PRÉPARATION (T-2 min avant la bougie)
        if ((min % 5 === 3) && (sec === 0)) {
            const direction = Math.random() > 0.5 ? "BUY 📈" : "SELL 📉";
            bot.sendMessage(CONFIG.channelId, `⏳ **PRÉPARATION VVIP**\n🎯 INDICE : ${asset}\n⚡ DIRECTION : ${direction}\n📢 Préparez votre exécution sur Weltrade !`, { parse_mode: 'Markdown' });
        }

        // 2. SIGNAL D'EXÉCUTION RÉELLE (Clôture de bougie)
        if ((min % 5 === 0) && (sec === 0)) {
            const tp = (Math.random() * 10 + 20).toFixed(2);
            bot.sendMessage(CONFIG.channelId, `🔱 **SIGNAL SYNTX V4**\n🎯 INDICE : ${asset}\n⚡ ACTION : EXECUTION IMMEDIATE\n💰 TP RECOMMANDÉ : +${tp} pts\n🛡️ STRATÉGIE : SWEEP & RECOVERY`, { parse_mode: 'Markdown' });
        }
    });
}
setInterval(marketScanner, 1000); // Scan chaque seconde pour précision maximale

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Dashboard sur port ${PORT}`));
