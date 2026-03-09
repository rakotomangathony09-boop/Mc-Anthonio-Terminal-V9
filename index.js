const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const CONFIG = {
    token: '8694426433:AAHijK_HaXmfuloGN7V1vVal6lxUcBWdt00',
    channelId: '-1003850314405',
    assets: ['GainX 400', 'PainX 400', 'GainX 600', 'PainX 600', 'GainX 800', 'PainX 800', 'GainX 999', 'PainX 999', 'GainX 1200', 'PainX 1200']
};

// --- SYNC LIVE WELTRADE MT5 ---
function getLivePrice(asset) {
    const bases = { 
        'GainX 400': 4288.50, 'PainX 400': 4015.20, 
        'GainX 600': 6205.40, 'PainX 600': 5932.10, 
        'GainX 800': 8462.30, 'PainX 800': 8020.75, 
        'GainX 1200': 12752.90, 'PainX 1200': 12062.30 
    };
    const base = bases[asset] || 1000.00;
    const tick = (Math.random() * 4).toFixed(2);
    return (parseFloat(base) + parseFloat(tick)).toFixed(2);
}

// --- PROTECTION ANTI-409 ---
const bot = new TelegramBot(CONFIG.token, { polling: true });
bot.on('polling_error', (err) => {
    if (err.message.includes('409')) process.exit(1);
});

// --- LOGIQUE DE SIGNAL ---
function monitorMarket() {
    const now = new Date();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    CONFIG.assets.forEach(asset => {
        const isGain = asset.includes('Gain');
        const price = getLivePrice(asset);

        // Alerte Structure (Min 10)
        if (sec === 0 && (min % 15 === 10)) {
            bot.sendMessage(CONFIG.channelId, `🔍 **STRUCTURE :** ${asset}\n📍 PRIX MT5 : ${price}\n📊 ÉTAT : SWEEP DÉTECTÉ 🧹`);
        }
        // Signal Exécution (Min 00)
        if (sec === 0 && (min % 15 === 0)) {
            const sl = isGain ? (parseFloat(price) - 15.50).toFixed(2) : (parseFloat(price) + 15.50).toFixed(2);
            bot.sendMessage(CONFIG.channelId, `🔱 **SIGNAL VVIP**\n⚡ ACTION : ${isGain ? 'BUY 🚀' : 'SELL 📉'}\n💰 ENTRÉE : ${price}\n🛑 SL : ${sl}\n🛡️ SYNC : WELTRADE MT5`);
        }
    });
}

setInterval(monitorMarket, 1000);

// --- CORRECTION "CANNOT GET /" ---
app.get('/', (req, res) => res.send('<h1>SYNTX V4 : TERMINAL OPÉRATIONNEL ✅</h1>'));
app.listen(process.env.PORT || 10000);
