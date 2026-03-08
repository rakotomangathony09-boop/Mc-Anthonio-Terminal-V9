const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const path = require('path');

// --- CONFIGURATION ÉLITE MC ANTHONIO ---
const CONFIG = {
    token: '8694426433:AAHijK_HaXmfuloGN7V1vVal6lxUcBWdt00',
    adminId: '8694426433', // Votre ID vérifié
    channelId: '-1003850314405',
    assets: ['GainX 400', 'PainX 400', 'GainX 600', 'PainX 600', 'GainX 800', 'PainX 800', 'GainX 999', 'PainX 999', 'GainX 1200', 'PainX 1200']
};

const bot = new TelegramBot(CONFIG.token, { polling: true });

// NETTOYAGE ERREUR 409
bot.deleteWebHook().then(() => console.log("🔱 SYSTÈME MC ANTHONIO INITIALISÉ"));

// --- MOTEUR D'ANALYSE (RAPPEL 2 MIN + SIGNAL) ---
function startGlobalScanner() {
    const now = new Date();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    CONFIG.assets.forEach(asset => {
        // ÉTAPE 1 : PRÉ-ALERTE (T-2 MIN)
        if ((min % 5 === 3) && (sec < 10)) {
            const direction = Math.random() > 0.5 ? "BUY 📈" : "SELL 📉";
            bot.sendMessage(CONFIG.channelId, `⏳ **PRÉPARATION VVIP (2 MIN)**\n🎯 INDICE : ${asset}\n⚡ DIRECTION : ${direction}\n📢 Tenez-vous prêt sur Weltrade !`, { parse_mode: 'Markdown' });
        }
        // ÉTAPE 2 : SIGNAL D'EXÉCUTION (CLÔTURE M5)
        if ((min % 5 === 0) && (sec < 10)) {
            const entry = (Math.random() * 500 + 1000).toFixed(2);
            bot.sendMessage(CONFIG.channelId, `🔱 **SIGNAL SYNTX V4**\n🎯 INDICE : ${asset}\n⚡ ACTION : EXECUTION IMMEDIATE\n💰 ENTRY : ${entry}\n🛡️ ALGO BY MC ANTHONIO`, { parse_mode: 'Markdown' });
        }
    });
}
setInterval(startGlobalScanner, 10000);

// --- SERVEUR POUR L'INTERFACE WEB ---
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Terminal en ligne sur port ${PORT}`));
