import { BarChart3 } from 'lucide-react';

interface WennMemorySummaryProps {
  summary: {
    entries: number;
    armedCount: number;
    pauseCount: number;
    blockedCount: number;
    waitCount: number;
  };
}

export function WennMemorySummary({ summary }: WennMemorySummaryProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-orange-500" />
        <h3 className="text-sm font-black uppercase tracking-widest">Memory Summary</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Entries</p>
          <p className="mt-2 text-2xl font-black text-white">{summary.entries}</p>
        </div>
        <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Wait Cycles</p>
          <p className="mt-2 text-2xl font-black text-white">{summary.waitCount}</p>
        </div>
        <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Armed Cycles</p>
          <p className="mt-2 text-2xl font-black text-orange-400">{summary.armedCount}</p>
        </div>
        <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Blocked Cycles</p>
          <p className="mt-2 text-2xl font-black text-red-400">{summary.blockedCount}</p>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Interpretation</p>
        <p className="text-sm font-bold text-white/80 leading-relaxed">
          WENN becomes stronger when wait quality stays high, blocked cycles remain explainable, and armed cycles appear only when the market earns attention.
        </p>
      </div>
    </div>
  );
}
