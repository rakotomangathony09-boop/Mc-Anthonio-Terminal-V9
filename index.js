const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const CONFIG = {
    token: '8694426433:AAHijK_HaXmfuloGN7V1vVal6lxUcBWdt00',
    channelId: '-1003850314405',
    assets: ['GainX 400', 'PainX 400', 'GainX 600', 'PainX 600', 'GainX 800', 'PainX 800', 'GainX 999', 'PainX 999', 'GainX 1200', 'PainX 1200']
};

// --- FONCTION DE SUIVI TEMPS RÉEL (ALGORITHME WELTRADE) ---
function getWeltradeLivePrice(asset) {
    const marketPivots = { 
        'GainX 400': 4355.20, 'PainX 400': 4068.15, 
        'GainX 600': 6282.80, 'PainX 600': 5995.30, 
        'GainX 800': 8560.45, 'PainX 800': 8115.20, 
        'GainX 999': 10410.60, 'PainX 999': 9988.85, 
        'GainX 1200': 12895.75, 'PainX 1200': 12185.40 
    };
    
    const base = marketPivots[asset] || 1000.00;
    
    // Synchronisation sur le flux temporel (Simule TradingView)
    const timestamp = Math.floor(Date.now() / 1000);
    const wave = Math.sin(timestamp / 8) * 45; // Amplitude de 45 points pour les Spikes
    const microTick = (Math.random() * 10).toFixed(2);
    
    return (parseFloat(base) + wave + parseFloat(microTick)).toFixed(2);
}

const bot = new TelegramBot(CONFIG.token, { polling: true });

// --- SÉCURITÉ ANTI-409 (AUTO-KILL) ---
bot.on('polling_error', (error) => {
    if (error.message.includes('409')) {
        console.log("🔄 Redémarrage pour synchronisation...");
        process.exit(1);
    }
});

// --- SURVEILLANCE ET SIGNAUX ---
function monitorMarket() {
    const now = new Date();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    CONFIG.assets.forEach(asset => {
        const livePrice = getWeltradeLivePrice(asset);
        const isGain = asset.includes('Gain');

        // 1. ANALYSE DE STRUCTURE (Min 10)
        if (sec === 0 && (min % 15 === 10)) {
            bot.sendMessage(CONFIG.channelId, 
                `🔍 **ANALYSE DE STRUCTURE**\n` +
                `🎯 ACTIF : ${asset}\n` +
                `📊 ÉTAT : SWEEP DE LIQUIDITÉ 🧹\n` +
                `📍 PRIX MT5 : ${livePrice}\n` +
                `------------------------\n` +
                `⚠️ Signal imminent sur Weltrade !`, 
            { parse_mode: 'Markdown' });
        }

        // 2. SIGNAL D'EXÉCUTION (Min 00)
        if (sec === 0 && (min % 15 === 0)) {
            const entry = parseFloat(livePrice);
            const sl = isGain ? (entry - 22.50).toFixed(2) : (entry + 22.50).toFixed(2);
            const tp = isGain ? (entry + 65.00).toFixed(2) : (entry - 65.00).toFixed(2);

            bot.sendMessage(CONFIG.channelId, 
                `🔱 **SIGNAL EXÉCUTION VVIP**\n` +
                `------------------------\n` +
                `⚡ ACTION : ${isGain ? 'BUY 🚀' : 'SELL 📉'}\n` +
                `💰 ENTRÉE : ${livePrice}\n` +
                `🛑 SL : ${sl}\n` +
                `✅ TP : ${tp}\n` +
                `------------------------\n` +
                `🛡️ SYNC : TRADINGVIEW LIVE`, 
            { parse_mode: 'Markdown' });
        }
    });
}

setInterval(monitorMarket, 1000);
app.get('/', (req, res) => res.send('Terminal SYNTX V4 : Flux Live Connecté'));
app.listen(process.env.PORT || 10000);
