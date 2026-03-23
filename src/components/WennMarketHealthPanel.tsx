import { Activity, ShieldCheck, Waves } from 'lucide-react';
import { WennRuntimeCycle } from '../lib/wennRuntimeApi';

interface WennMarketHealthPanelProps {
  cycle: WennRuntimeCycle | null;
}

function getHealthLabel(cycle: WennRuntimeCycle | null): string {
  if (!cycle) return 'Unknown';
  if (cycle.status.marketState === 'invalid') return 'Untrusted';
  if (cycle.status.marketState === 'high_volatility') return 'Dislocated';
  if (cycle.guardrailReasons.length > 0) return 'Guarded';
  if (cycle.status.marketState === 'range') return 'Neutral';
  return 'Usable';
}

function getHealthToneClasses(cycle: WennRuntimeCycle | null): string {
  if (!cycle) return 'text-white/60 border-white/10 bg-white/5';
  if (cycle.status.marketState === 'invalid') return 'text-red-400 border-red-500/20 bg-red-500/10';
  if (cycle.status.marketState === 'high_volatility') return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
  if (cycle.guardrailReasons.length > 0) return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
  return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
}

export function WennMarketHealthPanel({ cycle }: WennMarketHealthPanelProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-widest">Market Health</h3>
        </div>
        <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${getHealthToneClasses(cycle)}`}>
          {getHealthLabel(cycle)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Waves className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Regime</span>
          </div>
          <p className="text-sm font-black text-white">{cycle?.status.marketState || 'unknown'}</p>
        </div>
        <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Feed Freshness</span>
          </div>
          <p className="text-sm font-black text-white">{cycle ? `${cycle.snapshot.feedFreshnessMs} ms` : 'unknown'}</p>
        </div>
        <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Guardrails</span>
          </div>
          <p className="text-sm font-black text-white">{cycle ? `${cycle.guardrailReasons.length} active` : 'unknown'}</p>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Interpretation</p>
        <p className="text-sm font-bold text-white/80 leading-relaxed">
          {cycle
            ? cycle.guardrailReasons.length > 0
              ? 'WENN is seeing reasons to stay defensive. Suspicious or unstable conditions should not be chased.'
              : cycle.status.marketState === 'range'
                ? 'The market is moving without resolving. Patience is currently more valuable than action.'
                : 'Conditions are orderly enough for research-grade observation and selective escalation.'
            : 'Market health will appear once the runtime feed is connected.'}
        </p>
      </div>
    </div>
  );
}
