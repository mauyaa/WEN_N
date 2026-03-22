import * as admin from 'firebase-admin';
import WebSocket from 'ws';

// Initialize Firebase Admin with your project's credentials
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://<YOUR_FIREBASE_PROJECT_ID>.firebaseio.com'
});
const db = admin.firestore();

// Binance WebSocket API URLs
const BTC_URL = 'wss://stream.binance.com:9443/ws/btcusdt@trade';
const ETH_URL = 'wss://stream.binance.com:9443/ws/ethusdt@trade';
const SOL_URL = 'wss://stream.binance.com:9443/ws/solusdt@trade';

// Helper functions for technical indicators
function calculateRSI(data, period) {
    const gains = [];
    const losses = [];
    for (let i = 1; i < data.length; i++) {
        const change = data[i] - data[i - 1];
        if (change >= 0) {
            gains.push(change);
            losses.push(0);
        } else {
            losses.push(-change);
            gains.push(0);
        }
    }
    const avgGain = gains.reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function calculateMACD(data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    const emaShort = calculateEMA(data, shortPeriod);
    const emaLong = calculateEMA(data, longPeriod);
    const macd = emaShort.map((value, index) => value - emaLong[index]);
    const signal = calculateEMA(macd, signalPeriod);
    return { macd, signal, histogram: macd.map((value, index) => value - signal[index]) };
}

function calculateEMA(data, period) {
    const k = 2 / (period + 1);
    const ema = [data[0]]; // start with first data point
    for (let i = 1; i < data.length; i++) {
        ema.push((data[i] - ema[i - 1]) * k + ema[i - 1]);
    }
    return ema;
}

// WebSocket handler
function subscribeToMarketData() {
    const btcWs = new WebSocket(BTC_URL);
    const ethWs = new WebSocket(ETH_URL);
    const solWs = new WebSocket(SOL_URL);

    btcWs.on('message', (message) => handleMarketData('BTC', JSON.parse(message)));
    ethWs.on('message', (message) => handleMarketData('ETH', JSON.parse(message)));
    solWs.on('message', (message) => handleMarketData('SOL', JSON.parse(message)));
}

function handleMarketData(symbol, data) {
    const price = parseFloat(data.p);
    // Here we would aggregate data, calculate indicators and store it in Firestore
    console.log(`Price for ${symbol}: ${price}`);
    db.collection('marketData').add({
        symbol,
        price,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    // You can implement aggregation and indicators calculation here
}

subscribeToMarketData();
