import { useContext } from 'react';
import { AppContext } from '../App';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogOut, User as UserIcon, Bot, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const { firebaseUser, user } = useContext(AppContext);

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              <Bot className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                WENN
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">Pro Trading Bot</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {firebaseUser && (
              <>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-white/60">Live Market</span>
                </div>
                
                {/* System Status */}
          <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">WENN Core</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Operational</span>
              </div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Latency</span>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">14ms</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Balance</p>
                    <p className="text-sm font-bold text-white">${user?.balance.toLocaleString()}</p>
                  </div>
                  
                  <button
                    onClick={() => signOut(auth)}
                    className="p-2.5 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10 group"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
