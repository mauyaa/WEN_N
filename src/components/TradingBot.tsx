import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { AppContext } from '../App';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc, Timestamp, orderBy, limit } from 'firebase/firestore';
import { Position, TradeHistory, Coin, TradeType, MarketData, WennIntelligence } from '../types';
import { Play, Square, TrendingUp, TrendingDown, Clock, History, Zap, Bot, ArrowUpRight, ArrowDownRight, Activity, Terminal, Globe, Newspaper, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';
import { getWennIntelligence, getMarketNews } from '../services/geminiService';

const COINS: Coin[] = ['BTC', 'ETH', 'SOL'];
const INITIAL_PRICES: Record<Coin, number> = {
  BTC: 65000,
  ETH: 3500,
  SOL: 150
};

interface PricePoint {
  time: string;
  BTC: number;
  ETH: number;
  SOL: number;
}

export function TradingBot() {
  const { user } = useContext(AppContext);
  const [positions, setPositions] = useState<Position[]>([]);
  const [history, setHistory] = useState<TradeHistory[]>([]);
  const [prices, setPrices] = useState<Record<Coin, number>>(INITIAL_PRICES);
  const [marketMetrics, setMarketMetrics] = useState<Record<Coin, { change24h: number, volume24h: number, high24h: number, low24h: number }>>({
    BTC: { change24h: 0, volume24h: 0, high24h: 0, low24h: 0 },
    ETH: { change24h: 0, volume24h: 0, high24h: 0, low24h: 0 },
    SOL: { change24h: 0, volume24h: 0, high24h: 0, low24h: 0 }
  });
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [botThoughts, setBotThoughts] = useState<WennIntelligence[]>([]);
  const [news, setNews] = useState<{headline: string, impact: string, coin: string}[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin>('BTC');
  const [orderType, setOrderType] = useState<TradeType>('LONG');
  const [orderAmount, setOrderAmount] = useState<number>(100);
  const [orderLeverage, setOrderLeverage] = useState<number>(10);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);

  // Auto-close logic for SL/TP
  useEffect(() => {
    if (positions.length === 0) return;
    
    positions.forEach(async (pos) => {
      const currentPrice = prices[pos.coin];
      let shouldClose = false;
      let reason = '';

      if (pos.type === 'LONG') {
        if (pos.stopLoss && currentPrice <= pos.stopLoss) {
          shouldClose = true;
          reason = 'STOP_LOSS';
        } else if (pos.takeProfit && currentPrice >= pos.takeProfit) {
          shouldClose = true;
          reason = 'TAKE_PROFIT';
        }
      } else {
        if (pos.stopLoss && currentPrice >= pos.stopLoss) {
          shouldClose = true;
          reason = 'STOP_LOSS';
        } else if (pos.takeProfit && currentPrice <= pos.takeProfit) {
          shouldClose = true;
          reason = 'TAKE_PROFIT';
        }
      }

      if (shouldClose) {
        console.log(`Bot Auto-Closing ${pos.coin} ${pos.type} due to ${reason}`);
        await closePosition(pos, currentPrice);
      }
    });
  }, [prices, positions]);

  // Portfolio Stats
  const stats = useMemo(() => {
    if (history.length === 0) return { winRate: 0, totalProfit: 0, trades: 0 };
    const wins = history.filter(h => h.profit > 0).length;
    const totalProfit = history.reduce((acc, h) => acc + h.profit, 0);
    return {
      winRate: (wins / history.length) * 100,
      totalProfit,
      trades: history.length
    };
  }, [history]);

  // Fetch positions and history
  useEffect(() => {
    if (!user) return;

    const qPos = query(collection(db, 'positions'), where('userId', '==', user.uid));
    const unsubPos = onSnapshot(qPos, (snap) => {
      setPositions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Position)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'positions'));

    const qHist = query(collection(db, 'history'), where('userId', '==', user.uid), orderBy('closedAt', 'desc'), limit(10));
    const unsubHist = onSnapshot(qHist, (snap) => {
      setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as TradeHistory)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'history'));

    return () => {
      unsubPos();
      unsubHist();
    };
  }, [user?.uid]);

  // Real-time market data via Binance WebSocket
  useEffect(() => {
    const symbols = {
      BTC: 'btcusdt',
      ETH: 'ethusdt',
      SOL: 'solusdt'
    };

    const ws = new WebSocket('wss://stream.binance.com:9443/ws');
    
    ws.onopen = () => {
      const subscribeMsg = {
        method: 'SUBSCRIBE',
        params: Object.values(symbols).map(s => `${s}@ticker`),
        id: 1
      };
      ws.send(JSON.stringify(subscribeMsg));
      console.log('Connected to Binance Real-time Feed');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.e === '24hrTicker') {
        const coin = Object.keys(symbols).find(key => symbols[key as Coin] === data.s.toLowerCase()) as Coin;
        if (coin) {
          const newPrice = parseFloat(data.c);
          
          setPrices(prev => ({
            ...prev,
            [coin]: newPrice
          }));

          setMarketMetrics(prev => ({
            ...prev,
            [coin]: {
              change24h: parseFloat(data.P),
              volume24h: parseFloat(data.q),
              high24h: parseFloat(data.h),
              low24h: parseFloat(data.l)
            }
          }));

          if (coin === selectedCoin) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            setPriceHistory(prevHist => {
              const lastPoint = prevHist[prevHist.length - 1];
              const ema9 = lastPoint ? (newPrice * 0.2 + lastPoint.ema9 * 0.8) : newPrice;
              const ema21 = lastPoint ? (newPrice * 0.1 + lastPoint.ema21 * 0.9) : newPrice;
              
              const newHist = [...prevHist, { time: timeStr, [coin]: newPrice, ema9, ema21 }];
              return newHist.slice(-50); // Increased history for real data
            });
          }
        }
      }
    };

    ws.onerror = (err) => console.error('WebSocket Error:', err);
    ws.onclose = () => console.log('WebSocket Connection Closed');

    return () => ws.close();
  }, [selectedCoin]);

  // News cycle
  useEffect(() => {
    const fetchNews = async () => {
      const latestNews = await getMarketNews();
      setNews(latestNews);
    };
    fetchNews();
    const interval = setInterval(fetchNews, 15000); // More frequent news
    return () => clearInterval(interval);
  }, []);

  // Bot Logic: "Wenn" Intelligence
  useEffect(() => {
    if (!user?.isTradingEnabled || !user) return;

    const botInterval = setInterval(async () => {
      if (isBotThinking) return;
      setIsBotThinking(true);
      
      const marketData: MarketData[] = COINS.map(coin => ({
        coin,
        price: prices[coin],
        change24h: marketMetrics[coin].change24h,
        rsi: 50, // We could calculate this from history if needed
        macd: 0,
        sentiment: 0,
        onChainFlow: 'NEUTRAL'
      }));

      const intelligence = await getWennIntelligence(marketData, positions);
      setBotThoughts(prev => [intelligence, ...prev].slice(0, 8));

      // Multi-Agent Execution Logic
      // Only execute if confidence is high across key agents
      const technicalConf = intelligence.agents.find(a => a.agent === 'TECHNICAL')?.confidence || 0;
      const riskConf = intelligence.agents.find(a => a.agent === 'RISK')?.confidence || 0;
      
      if (intelligence.action === 'OPEN_LONG' || intelligence.action === 'OPEN_SHORT') {
        const type: TradeType = intelligence.action === 'OPEN_LONG' ? 'LONG' : 'SHORT';
        // Require high confidence and consensus
        if (positions.length < 5 && technicalConf > 0.8 && riskConf > 0.9 && intelligence.consensusScore > 0.8) { 
          await openPosition(
            intelligence.coin as Coin, 
            type, 
            undefined, 
            undefined, 
            intelligence.stopLoss, 
            intelligence.takeProfit
          );
        }
      } else if (intelligence.action === 'CLOSE_POSITION') {
        const posToClose = positions.find(p => p.coin === intelligence.coin);
        if (posToClose) {
          await closePosition(posToClose, prices[posToClose.coin]);
        }
      }

      setIsBotThinking(false);
    }, 4000); // 4 seconds for faster bot decisions

    return () => clearInterval(botInterval);
  }, [user?.isTradingEnabled, positions, prices, isBotThinking]);

  const toggleBot = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isTradingEnabled: !user.isTradingEnabled
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const openPosition = async (coin: Coin, type: TradeType, customAmount?: number, customLeverage?: number, sl?: number, tp?: number) => {
    if (!user) return;
    const amount = customAmount || user.balance * 0.1;
    const leverage = customLeverage || 10;
    try {
      await addDoc(collection(db, 'positions'), {
        userId: user.uid,
        coin,
        type,
        entryPrice: prices[coin],
        amount,
        leverage,
        stopLoss: sl || 0,
        takeProfit: tp || 0,
        openedAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'positions');
    }
  };

  const closePosition = async (pos: Position, exitPrice: number) => {
    if (!user) return;
    const pnl = pos.type === 'LONG' 
      ? (exitPrice - pos.entryPrice) / pos.entryPrice 
      : (pos.entryPrice - exitPrice) / pos.entryPrice;
    const profit = pos.amount * pnl * pos.leverage;

    try {
      await addDoc(collection(db, 'history'), {
        userId: user.uid,
        coin: pos.coin,
        type: pos.type,
        entryPrice: pos.entryPrice,
        exitPrice,
        profit,
        closedAt: Timestamp.now()
      });

      await updateDoc(doc(db, 'users', user.uid), {
        balance: user.balance + profit
      });

      await deleteDoc(doc(db, 'positions', pos.id));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'history/positions');
    }
  };

  const [orderBook, setOrderBook] = useState<{price: number, size: number, side: 'buy' | 'sell'}[]>([]);
  const [globalTrades, setGlobalTrades] = useState<{id: string, price: number, size: number, side: 'buy' | 'sell', time: string}[]>([]);
  const [agentLogs, setAgentLogs] = useState<{id: string, agent: string, log: string, time: string}[]>([]);

  // Margin Calculations
  const marginInfo = useMemo(() => {
    if (!user) return { used: 0, available: 0, ratio: 0 };
    const used = positions.reduce((acc, p) => acc + p.amount, 0);
    const available = user.balance - used;
    const ratio = user.balance > 0 ? (used / user.balance) * 100 : 0;
    return { used, available, ratio };
  }, [user, positions]);

  // Global trades simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPrice = prices[selectedCoin];
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const newTrade = {
        id: Math.random().toString(36).substring(7),
        price: currentPrice + (Math.random() - 0.5) * 5,
        size: Math.random() * 0.5,
        side,
        time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setGlobalTrades(prev => [newTrade, ...prev].slice(0, 15));
    }, 1500);
    return () => clearInterval(interval);
  }, [prices, selectedCoin]);

  // Agent logs simulation based on intelligence
  useEffect(() => {
    if (botThoughts.length === 0) return;
    const latest = botThoughts[0];
    const newLogs = latest.agents.map(a => ({
      id: Math.random().toString(36).substring(7),
      agent: a.agent,
      log: a.insight,
      time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }));
    setAgentLogs(prev => [...newLogs, ...prev].slice(0, 20));
  }, [botThoughts]);

  // Order book simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPrice = prices[selectedCoin];
      const newBook: {price: number, size: number, side: 'buy' | 'sell'}[] = [];
      
      for (let i = 0; i < 5; i++) {
        newBook.push({
          price: currentPrice + (Math.random() * 10),
          size: Math.random() * 2,
          side: 'sell'
        });
        newBook.push({
          price: currentPrice - (Math.random() * 10),
          size: Math.random() * 2,
          side: 'buy'
        });
      }
      setOrderBook(newBook.sort((a, b) => b.price - a.price));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedCoin, prices]);

  return (
    <div className="space-y-8">
      {/* Real-time Market Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 p-8 rounded-[40px] bg-white/5 border border-white/10 relative overflow-hidden shadow-2xl shadow-orange-500/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              {COINS.map(coin => (
                <button
                  key={coin}
                  onClick={() => setSelectedCoin(coin)}
                  className={`px-6 py-3 rounded-2xl font-black text-sm transition-all relative overflow-hidden group ${
                    selectedCoin === coin 
                    ? 'bg-orange-500 text-black' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {selectedCoin === coin && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-orange-400 mix-blend-overlay"
                    />
                  )}
                  {coin}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Available Margin</span>
                <span className="text-lg font-black text-white">${marginInfo.available.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Margin Ratio</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(marginInfo.ratio, 100)}%` }}
                      className={`h-full ${marginInfo.ratio > 80 ? 'bg-red-500' : marginInfo.ratio > 50 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                  <span className={`text-xs font-black ${marginInfo.ratio > 80 ? 'text-red-500' : 'text-white/60'}`}>{marginInfo.ratio.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Market Sentiment</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-red-500 uppercase">Fear</span>
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-emerald-500 opacity-20" />
                    <motion.div 
                      initial={{ left: '50%' }}
                      animate={{ left: `${40 + Math.random() * 20}%` }}
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_#fff]"
                    />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Greed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f97316' }}
                  cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedCoin} 
                  stroke="#f97316" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={300}
                  isAnimationActive={false} // Faster updates
                />
                <Area 
                  type="monotone" 
                  dataKey="ema9" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="transparent"
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="ema21" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fill="transparent"
                  isAnimationActive={false}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <XAxis dataKey="time" hide />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Price Overlay */}
            <div className="absolute top-0 left-0 pointer-events-none">
              <motion.div 
                key={prices[selectedCoin]}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-6xl font-black tracking-tighter text-white/90"
              >
                ${prices[selectedCoin].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black text-white/40 uppercase">EMA 9</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[10px] font-black text-white/40 uppercase">EMA 21</span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="mt-6 flex items-center gap-8 border-t border-white/5 pt-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">24h Change</span>
              <span className={`text-sm font-black ${marketMetrics[selectedCoin].change24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {marketMetrics[selectedCoin].change24h > 0 ? '+' : ''}{marketMetrics[selectedCoin].change24h.toFixed(2)}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">24h Volume</span>
              <span className="text-sm font-black text-white">
                ${(marketMetrics[selectedCoin].volume24h / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">24h High</span>
              <span className="text-sm font-black text-white">
                ${marketMetrics[selectedCoin].high24h.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">24h Low</span>
              <span className="text-sm font-black text-white">
                ${marketMetrics[selectedCoin].low24h.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Funding Rate</span>
              <span className="text-sm font-black text-emerald-500">
                0.0100%
              </span>
            </div>
          </div>
        </div>

        {/* Manual Terminal */}
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex flex-col justify-between group relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Manual Terminal</h3>
          </div>

          <div className="space-y-6">
            <div className="flex p-1 bg-white/5 rounded-2xl">
              <button 
                onClick={() => setOrderType('LONG')}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${orderType === 'LONG' ? 'bg-emerald-500 text-black' : 'text-white/40'}`}
              >
                Long
              </button>
              <button 
                onClick={() => setOrderType('SHORT')}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${orderType === 'SHORT' ? 'bg-red-500 text-black' : 'text-white/40'}`}
              >
                Short
              </button>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Amount (USDT)</span>
                <span className="text-[10px] font-black text-white/40">{orderAmount} USDT</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="1000" 
                step="10"
                value={orderAmount}
                onChange={(e) => setOrderAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Leverage</span>
                <span className="text-[10px] font-black text-white/40">{orderLeverage}x</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[5, 10, 20, 50].map(l => (
                  <button
                    key={l}
                    onClick={() => setOrderLeverage(l)}
                    className={`py-2 rounded-xl text-[10px] font-black border transition-all ${orderLeverage === l ? 'bg-orange-500 border-orange-500 text-black' : 'border-white/10 text-white/40 hover:border-white/20'}`}
                  >
                    {l}x
                  </button>
                ))}
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Est. Liquidation</span>
                  <span className="text-xs font-black text-red-500">
                    ${(orderType === 'LONG' 
                      ? prices[selectedCoin] * (1 - 1/orderLeverage) 
                      : prices[selectedCoin] * (1 + 1/orderLeverage)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 block">Stop Loss</span>
                <input 
                  type="number"
                  placeholder="SL Price"
                  value={stopLoss || ''}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-black text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 block">Take Profit</span>
                <input 
                  type="number"
                  placeholder="TP Price"
                  value={takeProfit || ''}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-black text-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <button 
              onClick={() => openPosition(selectedCoin, orderType, orderAmount, orderLeverage, stopLoss, takeProfit)}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${orderType === 'LONG' ? 'bg-emerald-500 text-black shadow-[0_10px_30px_rgba(16,185,129,0.3)]' : 'bg-red-500 text-black shadow-[0_10px_30px_rgba(239,68,68,0.3)]'}`}
            >
              Execute {orderType}
            </button>
          </div>
        </div>
      </div>

      {/* Bot Control & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Order Book & Depth */}
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Order Book</h3>
          </div>
          
          <div className="flex-1 space-y-1 font-mono text-[10px]">
            <div className="grid grid-cols-3 text-white/20 font-black uppercase tracking-tighter mb-2">
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Sum</span>
            </div>
            {orderBook.map((order, i) => (
              <div key={i} className="grid grid-cols-3 relative group cursor-crosshair">
                <div className={`absolute inset-y-0 right-0 opacity-10 transition-all ${order.side === 'buy' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${(order.size / 2) * 100}%` }} />
                <span className={`font-black ${order.side === 'buy' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-right text-white/60">{order.size.toFixed(4)}</span>
                <span className="text-right text-white/40">{(order.size * 1.5).toFixed(4)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-4 h-4 text-orange-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Recent Trades</h4>
            </div>
            <div className="space-y-2 h-48 overflow-hidden relative">
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#050505] to-transparent z-10" />
              {globalTrades.map((trade) => (
                <div key={trade.id} className="flex justify-between items-center text-[10px] font-mono">
                  <span className={trade.side === 'buy' ? 'text-emerald-500' : 'text-red-500'}>
                    {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-white/40">{trade.size.toFixed(4)}</span>
                  <span className="text-white/20">{trade.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 p-8 rounded-[40px] bg-white/5 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Win Rate</span>
              <span className="text-2xl font-black text-emerald-500">{stats.winRate.toFixed(1)}%</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Total PnL</span>
              <span className={`text-2xl font-black ${stats.totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Total Trades</span>
              <span className="text-2xl font-black text-white">{stats.trades}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Bot Status</p>
              <p className={`text-sm font-black ${user?.isTradingEnabled ? 'text-orange-500' : 'text-white/40'}`}>
                {user?.isTradingEnabled ? 'ACTIVE & SCANNING' : 'STANDBY'}
              </p>
            </div>
            <button
              onClick={toggleBot}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                user?.isTradingEnabled 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                : 'bg-orange-500 text-black shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:scale-[1.02]'
              }`}
            >
              {user?.isTradingEnabled ? 'Stop Bot' : 'Start Bot'}
            </button>
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-orange-500 text-black flex flex-col justify-between relative overflow-hidden group">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl"
          />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Current Balance</p>
            <h3 className="text-3xl font-black tracking-tighter">
              ${user?.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="relative z-10 flex items-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-black/20 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Real-time Sync</span>
          </div>
        </div>
      </div>

      {/* Intelligence & News Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Multi-Agent War Room */}
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-white/5 border border-white/10 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-black uppercase tracking-widest">WENN Multi-Agent War Room</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Consensus</span>
                <span className={`text-xs font-black ${botThoughts[0]?.consensusScore > 0.7 ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {Math.round((botThoughts[0]?.consensusScore || 0.85) * 100)}%
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">DXY Index</span>
                <span className="text-xs font-black text-white">{botThoughts[0]?.macroContext?.dxy || '104.20'}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">CPI (YoY)</span>
                <span className="text-xs font-black text-white">{botThoughts[0]?.macroContext?.cpi || '3.2%'}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {botThoughts[0]?.agents?.map((agent, idx) => (
              <motion.div
                key={agent.agent}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{agent.agent} AGENT</span>
                  <span className="text-[10px] font-black text-white/40">{Math.round(agent.confidence * 100)}% CONF</span>
                </div>
                <p className="text-xs font-bold text-white/80 leading-relaxed mb-2">{agent.insight}</p>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.confidence * 100}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {botThoughts.length === 0 ? (
                <div className="p-12 text-center text-white/10 font-medium uppercase tracking-widest flex flex-col items-center gap-4">
                  <Bot className="w-12 h-12 opacity-10" />
                  Initializing Multi-Agent Architecture...
                </div>
              ) : (
                botThoughts.map((thought, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/5 flex gap-4 group hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{thought.coin} Analysis</span>
                          <span className="text-[10px] font-black text-white/20">•</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${thought.action.includes('LONG') ? 'text-emerald-500' : thought.action.includes('SHORT') ? 'text-red-500' : 'text-white/40'}`}>
                            {thought.action}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">Just Now</span>
                      </div>
                      <p className="text-sm font-bold text-white mb-1 leading-snug">{thought.thought}</p>
                      <p className="text-xs text-white/40 leading-relaxed italic font-mono">
                        {">"} {thought.reason}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Order Book Simulation */}
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-5 h-5 text-white/40" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Live Order Book</h3>
          </div>
          
          <div className="flex-1 space-y-1 font-mono text-[10px]">
            <div className="grid grid-cols-3 text-white/20 font-black uppercase tracking-tighter mb-2">
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Sum</span>
            </div>
            {orderBook.map((order, i) => (
              <div key={i} className="grid grid-cols-3 relative group cursor-crosshair">
                <div className={`absolute inset-y-0 right-0 opacity-10 transition-all ${order.side === 'buy' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${(order.size / 2) * 100}%` }} />
                <span className={`font-black ${order.side === 'buy' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-right text-white/60">{order.size.toFixed(4)}</span>
                <span className="text-right text-white/40">{(order.size * 1.5).toFixed(4)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-4 h-4 text-orange-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Recent Trades</h4>
            </div>
            <div className="space-y-2 h-48 overflow-hidden relative">
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#050505] to-transparent z-10" />
              {globalTrades.map((trade) => (
                <div key={trade.id} className="flex justify-between items-center text-[10px] font-mono">
                  <span className={trade.side === 'buy' ? 'text-emerald-500' : 'text-red-500'}>
                    {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-white/40">{trade.size.toFixed(4)}</span>
                  <span className="text-white/20">{trade.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="w-5 h-5 text-white/40" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Market News</h3>
            </div>
            <div className="space-y-6">
              {news.map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.impact === 'BULLISH' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : item.impact === 'BEARISH' ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : 'bg-white/20'}`} />
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.coin}</span>
                  </div>
                  <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors leading-snug">
                    {item.headline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Terminal Logs */}
      <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">WENN Intelligence Terminal</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase">Live Feed</span>
            </div>
            <span className="text-[10px] font-black text-white/20 uppercase">v4.2.0-PRO</span>
          </div>
        </div>
        
        <div className="bg-black/40 rounded-3xl p-6 font-mono text-[11px] h-64 overflow-y-auto border border-white/5 relative">
          <div className="space-y-2">
            {agentLogs.length === 0 ? (
              <div className="text-white/10 italic">Waiting for agent synchronization...</div>
            ) : (
              agentLogs.map((log) => (
                <div key={log.id} className="flex gap-4 group">
                  <span className="text-white/20 shrink-0">[{log.time}]</span>
                  <span className={`shrink-0 font-black ${
                    log.agent === 'TECHNICAL' ? 'text-blue-400' :
                    log.agent === 'SENTIMENT' ? 'text-purple-400' :
                    log.agent === 'RISK' ? 'text-red-400' :
                    'text-orange-400'
                  }`}>
                    {log.agent}:
                  </span>
                  <span className="text-white/60 group-hover:text-white transition-colors">{log.log}</span>
                </div>
              ))
            )}
            <div className="h-4" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Positions & History */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Active Positions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-black uppercase tracking-widest">Open Positions</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40">
                {positions.length} Active
              </span>
              {positions.length > 0 && (
                <button 
                  onClick={() => positions.forEach(p => closePosition(p, prices[p.coin]))}
                  className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                >
                  Panic Close All
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {positions.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center text-center"
                >
                  <Bot className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-sm text-white/20 font-medium uppercase tracking-widest">No active trades</p>
                </motion.div>
              ) : (
                positions.map(pos => {
                  const currentPrice = prices[pos.coin];
                  const pnl = pos.type === 'LONG' 
                    ? (currentPrice - pos.entryPrice) / pos.entryPrice 
                    : (pos.entryPrice - currentPrice) / pos.entryPrice;
                  const isProfit = pnl >= 0;
                  const liqPrice = pos.type === 'LONG' 
                    ? pos.entryPrice * (1 - 1/pos.leverage) 
                    : pos.entryPrice * (1 + 1/pos.leverage);

                  return (
                    <motion.div
                      key={pos.id}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="p-6 rounded-[24px] bg-white/5 border border-white/10 flex flex-col gap-4 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pos.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {pos.type === 'LONG' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-lg">{pos.coin}</h4>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${pos.type === 'LONG' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                {pos.type} {pos.leverage}X
                              </span>
                            </div>
                            <p className="text-xs text-white/40 font-medium">Entry: ${pos.entryPrice.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-xl font-black ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                            {isProfit ? '+' : ''}{(pnl * 100 * pos.leverage).toFixed(2)}%
                          </p>
                          <p className="text-xs text-white/40 font-medium">
                            ${(pos.amount * pnl * pos.leverage).toFixed(2)} USD
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">SL</span>
                          <span className="text-xs font-black text-white/60">{pos.stopLoss ? `${pos.stopLoss.toLocaleString()}` : 'NONE'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">TP</span>
                          <span className="text-xs font-black text-white/60">{pos.takeProfit ? `${pos.takeProfit.toLocaleString()}` : 'NONE'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Liq.</span>
                          <span className="text-xs font-black text-red-500/60">${liqPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => closePosition(pos, currentPrice)}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        Market Close
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Trade History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-white/40" />
              <h3 className="text-lg font-black uppercase tracking-widest text-white/40">Past Positions</h3>
            </div>
          </div>

          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="p-12 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center text-center">
                <p className="text-sm text-white/20 font-medium uppercase tracking-widest text-center w-full">History is empty</p>
              </div>
            ) : (
              history.map(trade => (
                <div key={trade.id} className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{trade.coin} <span className="text-white/20 ml-1">{trade.type}</span></h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">
                        {trade.closedAt?.toDate().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${trade.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

