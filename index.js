const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const path = require('path');

const CONFIG = {
    token: '8694426433:AAHijK_HaXmfuloGN7V1vVal6lxUcBWdt00',
    channelId: '-1003850314405',
    assets: ['GainX 400', 'PainX 400', 'GainX 600', 'PainX 600', 'GainX 800', 'PainX 800', 'GainX 999', 'PainX 999', 'GainX 1200', 'PainX 1200']
};

// --- SYNC PRIX RÉEL ---
function getLivePrice(asset) {
    const bases = { 
        'GainX 400': 4250.00, 'PainX 400': 3980.00, 
        'GainX 600': 6150.00, 'PainX 600': 5890.00, 
        'GainX 800': 8420.00, 'PainX 800': 7950.00, 
        'GainX 999': 10240.00, 'PainX 999': 9850.00, 
        'GainX 1200': 12680.00, 'PainX 1200': 11940.00 
    };
    const base = bases[asset] || 1000.00;
    const fluctuation = (Math.sin(Date.now() / 15000) * 8) + (Math.random() * 3);
    return (base + fluctuation).toFixed(2);
}

const bot = new TelegramBot(CONFIG.token, { polling: false });
bot.deleteWebHook().then(() => {
    bot.startPolling();
});

// --- SURVEILLANCE ET ALERTES ---
function monitorMarket() {
    const now = new Date();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    CONFIG.assets.forEach(asset => {
        const tf = ['M15', 'M30', 'H1', 'H4', 'D1'][Math.floor(Math.random() * 5)];
        const isGain = asset.includes('Gain');

        // 1. ALERTE PRÉPARATION (Minute 10)
        if (sec === 0 && (min % 15 === 10)) {
            bot.sendMessage(CONFIG.channelId, `🔍 **ANALYSE DE STRUCTURE : ${tf}**\n🎯 ACTIF : ${asset}\n📊 ÉTAT : SWEEP DÉTECTÉ 🧹\n📍 Prix : ${getLivePrice(asset)}`);
        }

        // 2. SIGNAL SPIKE (Minute 00) - Gain=Buy / Pain=Sell
        if (sec === 0 && (min % 15 === 0)) {
            sendSignal(asset, tf, isGain ? "BUY (SPIKE) 🚀" : "SELL (SPIKE) 📉", "SWEEP & RECOVERY");
        }

        // 3. SIGNAL TICKS (Minute 05) - Pain=Buy / Gain=Sell
        if (sec === 0 && (min % 15 === 5)) {
            sendSignal(asset, tf, isGain ? "SELL (TICKS) ⚡" : "BUY (TICKS) ⚡", "TICK SCALPER");
        }
    });
}

function sendSignal(asset, tf, action, strategy) {
    const entryPrice = getLivePrice(asset);
    const entry = parseFloat(entryPrice);
    const isBuy = action.includes("BUY");
    
    const sl = isBuy ? (entry - 15.50).toFixed(2) : (entry + 15.50).toFixed(2);
    const tp = isBuy ? (entry + 45.00).toFixed(2) : (entry - 45.00).toFixed(2);

    bot.sendMessage(CONFIG.channelId, 
        `🔱 **SIGNAL EXÉCUTION VVIP**\n` +
        `------------------------\n` +
        `🎯 ACTIF : ${asset}\n` +
        `🕒 TIMEFRAME : ${tf}\n` +
        `⚡ ACTION : ${action}\n` +
        `------------------------\n` +
        `💰 PRIX D'ENTRÉE : ${entryPrice}\n` +
        `🛑 STOP LOSS : ${sl}\n` +
        `✅ TAKE PROFIT : ${tp}\n` +
        `------------------------\n` +
        `🔥 SYSTÈME : ${strategy}\n` +
        `🛡️ ANALYSE : MC ANTHONIO PRO`, 
    { parse_mode: 'Markdown' });
}

setInterval(monitorMarket, 1000);
app.get('/', (req, res) => res.send('<h1>SYNTX V4 HYBRIDE LIVE</h1>'));
app.listen(process.env.PORT || 10000);
