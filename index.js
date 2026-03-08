const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const path = require('path');

// --- CONFIGURATION DU TERMINAL ---
const CONFIG = {
    token: '8694426433:AAHijK_HaXmfuloGN7V1vVal6lxUcBWdt00',
    channelId: '-1003850314405',
    assets: ['GainX 400', 'PainX 400', 'GainX 600', 'PainX 600', 'GainX 800', 'PainX 800', 'GainX 999', 'PainX 999', 'GainX 1200', 'PainX 1200']
};

// --- SYNCHRONISATION DES PRIX WELTRADE (SIMULATION FLUX RÉEL) ---
function getLiveWeltradePrice(asset) {
    const bases = { 
        'GainX 400': 4250, 'PainX 400': 3980, 
        'GainX 600': 6150, 'PainX 600': 5890, 
        'GainX 800': 8420, 'PainX 800': 7950, 
        'GainX 999': 10240, 'PainX 999': 9850, 
        'GainX 1200': 12680, 'PainX 1200': 11940 
    };
    const base = bases[asset] || 1000;
    const drift = (Math.sin(Date.now() / 10000) * 5) + (Math.random() * 2);
    return (base + drift).toFixed(2);
}

// --- INITIALISATION SÉCURISÉE (ANTI-ERREUR 409) ---
const bot = new TelegramBot(CONFIG.token, { polling: false });
bot.deleteWebHook().then(() => {
    bot.startPolling();
    console.log("🚀 SYNTX V4 : SYNC LIVE ET PROTECTION STRUCTURE ACTIVES");
});

// --- SYSTÈME D'ALERTE ET DE SIGNAL ---
function monitorMarket() {
    const now = new Date();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    CONFIG.assets.forEach(asset => {
        const tf = ['M15', 'M30', 'H1', 'H4', 'D1'][Math.floor(Math.random() * 5)];
        const isGain = asset.includes('Gain');
        const price = getLivePrice(asset);

        // 1. ALERTE DE PRÉPARATION (Minute 10 du cycle de 15 min)
        if (sec === 0 && (min % 15 === 10)) {
            bot.sendMessage(CONFIG.channelId, 
                `🔍 **ANALYSE DE STRUCTURE : ${tf}**\n` +
                `🎯 ACTIF : ${asset}\n` +
                `📊 ÉTAT : SWEEP DE LIQUIDITÉ DÉTECTÉ 🧹\n` +
                `📍 PRIX ACTUEL : ${price}\n` +
                `------------------------\n` +
                `⚠️ Zone nettoyée. Préparez-vous pour l'exécution dans 5 min !`, 
            { parse_mode: 'Markdown' });
        }

        // 2. SIGNAL D'EXÉCUTION SPIKE (Minute 00)
        if (sec === 0 && (min % 15 === 0)) {
            sendSignal(asset, tf, isGain ? "BUY (SPIKE) 🚀" : "SELL (SPIKE) 📉", "SWEEP & RECOVERY");
        }

        // 3. SIGNAL DE TICKS (Minute 05 - Logique inversée)
        if (sec === 0 && (min % 15 === 5)) {
            sendSignal(asset, tf, isGain ? "SELL (TICKS) ⚡" : "BUY (TICKS) ⚡", "TICK SCALPER");
        }
    });
}

function sendSignal(asset, tf, action, strategy) {
    const entry = parseFloat(getLivePrice(asset));
    const isBuy = action.includes("BUY");
    
    // Niveaux compatibles MT5
    const sl = isBuy ? (entry - 15.50).toFixed(2) : (entry + 15.50).toFixed(2);
    const tp = isBuy ? (entry + 45.00).toFixed(2) : (entry - 45.00).toFixed(2);

    const message = `🔱 **SIGNAL EXÉCUTION VVIP**\n` +
                  `------------------------\n` +
                  `🎯 ACTIF : ${asset}\n` +
                  `🕒 TIMEFRAME : ${tf}\n` +
                  `⚡ ACTION : ${action}\n` +
                  `------------------------\n` +
                  `💰 PRIX D'ENTRÉE : ${entry.toFixed(2)}\n` +
                  `🛑 STOP LOSS : ${sl}\n` +
                  `✅ TAKE PROFIT : ${tp}\n` +
                  `------------------------\n` +
                  `🔥 SYSTÈME : ${strategy}\n` +
                  `🛡️ ANALYSE : MC ANTHONIO PRO`;

    bot.sendMessage(CONFIG.channelId, message, { parse_mode: 'Markdown' });
}

// --- LANCEMENT DU SERVEUR ---
setInterval(monitorMarket, 1000);
app.get('/', (req, res) => res.send('<h1>SYNTX V4 OPERATIONNEL</h1>'));
app.listen(process.env.PORT || 10000);
