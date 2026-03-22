import { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Plus, ArrowUpRight, TrendingUp, Wallet, ArrowRightLeft, Coins, X, QrCode, Copy, CheckCircle2, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export function Dashboard() {
  const { user } = useContext(AppContext);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAddFunds = async () => {
    if (!user) return;
    setIsDepositing(true);
    
    // Simulate real blockchain confirmation
    setTimeout(async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          balance: user.balance + 1000
        });
        setIsDepositing(false);
        setShowDepositModal(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }, 3000);
  };

  const copyAddress = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Live Market Ticker */}
      <div className="w-full py-3 bg-white/5 border-y border-white/10 overflow-hidden whitespace-nowrap relative rounded-3xl">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-12"
        >
          {['BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'DOT', 'LINK', 'UNI', 'AVAX', 'MATIC'].map(coin => (
            <div key={coin} className="flex items-center gap-3">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{coin}/USDT</span>
              <span className="text-sm font-black text-white">$65,234.12</span>
              <span className="text-[10px] font-black text-emerald-500">+2.45%</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {['BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'DOT', 'LINK', 'UNI', 'AVAX', 'MATIC'].map(coin => (
            <div key={`${coin}-2`} className="flex items-center gap-12">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{coin}/USDT</span>
              <span className="text-sm font-black text-white">$65,234.12</span>
              <span className="text-[10px] font-black text-emerald-500">+2.45%</span>
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Balance Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-3 p-10 rounded-[48px] bg-gradient-to-br from-orange-500 to-orange-600 text-black relative overflow-hidden shadow-2xl shadow-orange-500/20 group"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-black/40 mb-2">Total Portfolio Value</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-7xl font-black tracking-tighter">
                    ${user?.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <span className="text-xl font-black text-black/40">USDT</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-3xl bg-black/10 flex items-center justify-center backdrop-blur-md">
                <Wallet className="w-8 h-8" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => setShowDepositModal(true)}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-black text-white hover:bg-black/80 transition-all group/btn"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Add Funds</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/10 border border-black/5 hover:bg-white/20 transition-all group/btn">
                <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Earn More</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/10 border border-black/5 hover:bg-white/20 transition-all group/btn">
                <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                  <ArrowRightLeft className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Transfer</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Macro Intelligence Panel */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-8 rounded-[48px] bg-white/5 border border-white/10 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-8">
              <Globe className="w-5 h-5 text-orange-500" />
              <h3 className="text-xs font-black uppercase tracking-widest">Macro Intelligence</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">DXY Index</span>
                <span className="text-sm font-black text-white">104.20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">CPI (YoY)</span>
                <span className="text-sm font-black text-emerald-500">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Interest Rate</span>
                <span className="text-sm font-black text-white">5.50%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">SPX 500</span>
                <span className="text-sm font-black text-emerald-500">5,241.53</span>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">WENN INSIGHT</p>
              <p className="text-[11px] text-white/60 leading-relaxed italic">
                "DXY showing weakness at resistance. Bullish for BTC/ETH liquidity."
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[48px] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">18.5% APY</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">WENN STAKING</h3>
            <p className="text-xs text-white/40 font-medium leading-relaxed mb-6">
              Lock your assets in the Wenn Liquidity Pool for professional grade yields.
            </p>
            <button className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10">
              STAKE NOW
            </button>
          </motion.div>
        </div>
      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDepositModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 shadow-2xl"
            >
              <button 
                onClick={() => setShowDepositModal(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-10">
                <h3 className="text-3xl font-black tracking-tighter mb-2">DEPOSIT FUNDS</h3>
                <p className="text-white/40 font-medium">Transfer from Binance or any Web3 Wallet</p>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col items-center">
                  <div className="p-6 bg-white rounded-3xl mb-6">
                    <QrCode className="w-32 h-32 text-black" />
                  </div>
                  <div className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group">
                    <code className="text-xs text-white/60 font-mono truncate mr-4">
                      0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                    </code>
                    <button 
                      onClick={copyAddress}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-white/40" />}
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                  <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-2">Network Selection</p>
                  <p className="text-sm text-white/60">Ensure you use the <span className="text-white font-bold">ERC-20</span> or <span className="text-white font-bold">BEP-20</span> network for this deposit.</p>
                </div>

                <button
                  onClick={handleAddFunds}
                  disabled={isDepositing}
                  className="w-full py-6 bg-orange-500 text-black font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isDepositing ? (
                    <>
                      <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                      Confirming on Blockchain...
                    </>
                  ) : (
                    "I'VE SENT THE FUNDS"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

