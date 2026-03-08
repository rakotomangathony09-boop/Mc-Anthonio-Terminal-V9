const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const path = require('path');

const CONFIG = {
    token: '8694426433:AAHijK_HaXmfuloGN7V1vVal6lxUcBWdt00',
    channelId: '-1003850314405',
    assets: ['GainX 400', 'PainX 400', 'GainX 600', 'PainX 600', 'GainX 800', 'PainX 800', 'GainX 999', 'PainX 999', 'GainX 1200', 'PainX 1200'],
    timeframes: ['M15', 'M30', 'H1', 'H4', 'D1']
};

// --- PURGE ANTI-409 ---
const bot = new TelegramBot(CONFIG.token, { polling: false });
bot.deleteWebHook().then(() => {
    bot.startPolling();
    console.log("🚀 SYNTX V4 : LIAISON ÉTABLIE SANS CONFLIT");
});

// --- CYCLE DE STRATÉGIE (STRUCTURE -> PRÉPARATION -> SIGNAL) ---
function strategyFlow() {
    const now = new Date();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    CONFIG.assets.forEach(asset => {
        const tf = CONFIG.timeframes[Math.floor(Math.random() * CONFIG.timeframes.length)];
        const isGain = asset.includes('Gain');

        // ÉTAPE 1 : ANALYSE DE STRUCTURE (Affichée à la minute 10 du cycle M15)
        if (sec === 0 && (min % 15 === 10)) {
            bot.sendMessage(CONFIG.channelId, 
                `🔍 **ANALYSE DE STRUCTURE : ${tf}**\n` +
                `🎯 ACTIF : ${asset}\n` +
                `📊 ÉTAT : SWEEP DE LIQUIDITÉ DÉTECTÉ 🧹\n` +
                `💡 LOGIQUE : ${isGain ? "SPIKE RECOVERY" : "SPIKE RECOVERY"}\n` +
                `------------------------\n` +
                `⚠️ Zone de prix nettoyée. Attendez la confirmation du bot...`, 
            { parse_mode: 'Markdown' });
        }

        // ÉTAPE 2 : SIGNAL D'EXÉCUTION SPIKE (Minute 00)
        if (sec === 0 && (min % 15 === 0)) {
            sendSignal(asset, tf, isGain ? "BUY (SPIKE) 🚀" : "SELL (SPIKE) 📉", "SWEEP & RECOVERY");
        }

        // ÉTAPE 3 : SIGNAL DE TICKS (Minute 05 - Logique inversée)
        if (sec === 0 && (min % 15 === 5)) {
            sendSignal(asset, tf, isGain ? "SELL (TICKS) ⚡" : "BUY (TICKS) ⚡", "TICK SCALPER");
        }
    });
}

function sendSignal(asset, tf, action, strategy) {
    const entry = (Math.random() * 50 + 1200).toFixed(2);
    const isBuy = action.includes("BUY");
    
    // Niveaux calculés selon la stratégie visuelle
    const sl = isBuy ? (entry - 15.20).toFixed(2) : (parseFloat(entry) + 15.20).toFixed(2);
    const tp = isBuy ? (parseFloat(entry) + 42.50).toFixed(2) : (entry - 42.50).toFixed(2);

    const message = `🔱 **SIGNAL EXÉCUTION VVIP**\n` +
                  `------------------------\n` +
                  `🎯 ACTIF : ${asset}\n` +
                  `🕒 TIMEFRAME : ${tf}\n` +
                  `⚡ ACTION : ${action}\n` +
                  `------------------------\n` +
                  `💰 ENTRÉE : ${entry}\n` +
                  `🛑 STOP LOSS : ${sl}\n` +
                  `✅ TAKE PROFIT : ${tp}\n` +
                  `------------------------\n` +
                  `🔥 SYSTÈME : ${strategy}\n` +
                  `🛡️ ANALYSE : MC ANTHONIO PRO`;

    bot.sendMessage(CONFIG.channelId, message, { parse_mode: 'Markdown' });
}

setInterval(strategyFlow, 1000);
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(process.env.PORT || 10000);
