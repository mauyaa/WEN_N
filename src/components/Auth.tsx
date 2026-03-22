import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Bot, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function Auth() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/40 mb-8 transform -rotate-6">
            <Bot className="text-black w-14 h-14" />
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white mb-4">
            WENN
          </h2>
          <p className="text-xl text-white/60 font-medium max-w-xs mx-auto leading-relaxed">
            The world's most intelligent autonomous trading bot.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 text-left">
          {[
            { icon: Zap, title: "Super Intelligent", desc: "Advanced market analysis and news processing." },
            { icon: ShieldCheck, title: "Secure Deposits", desc: "Integrated with Binance and top exchanges." },
            { icon: TrendingUp, title: "Pro Trading", desc: "Mastering the art of BTC, ETH, and SOL." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="p-2.5 bg-orange-500/10 rounded-xl">
                <feature.icon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{feature.title}</h3>
                <p className="text-sm text-white/40">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={handleGoogleLogin}
          className="w-full py-5 px-8 bg-white text-black font-black text-lg rounded-2xl hover:bg-orange-500 hover:text-black transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
        >
          GET STARTED NOW
        </motion.button>
        
        <p className="text-xs text-white/20 font-medium uppercase tracking-[0.2em]">
          Secure Web3 Authentication
        </p>
      </div>
    </div>
  );
}
