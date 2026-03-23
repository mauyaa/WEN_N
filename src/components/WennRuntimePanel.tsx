import { AlertTriangle, Bot, Radar, ShieldCheck, PauseCircle } from 'lucide-react';
import { WennRuntimeCycle } from '../lib/wennRuntimeApi';

interface WennRuntimePanelProps {
  cycle: WennRuntimeCycle | null;
  loading?: boolean;
  error?: string | null;
}

function stateTone(state?: string) {
  switch (state) {
    case 'ARMED':
      return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
    case 'WAIT':
      return 'text-white/70 border-white/10 bg-white/5';
    case 'PAUSE':
      return 'text-red-500 border-red-500/20 bg-red-500/10';
    case 'SCAN':
      return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
    default:
      return 'text-white/60 border-white/10 bg-white/5';
  }
}

export function WennRuntimePanel({ cycle, loading, error }: WennRuntimePanelProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-widest">WENN Runtime Core</h3>
        </div>
        <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${stateTone(cycle?.status.state)}`}>
          {loading ? 'SYNCING' : cycle?.status.state || 'NO DATA'}
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-bold">
          {error}
        </div>
      ) : null}

      {!cycle && !loading && !error ? (
        <div className="p-8 rounded-3xl border border-dashed border-white/10 text-center text-white/30 font-bold uppercase tracking-widest">
          Runtime feed not connected yet
        </div>
      ) : null}

      {cycle ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Market State</span>
              <p className="mt-2 text-lg font-black text-white">{cycle.status.marketState}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Action</span>
              <p className="mt-2 text-lg font-black text-orange-500">{cycle.signal.action}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Confidence</span>
              <p className="mt-2 text-lg font-black text-white">{Math.round(cycle.signal.confidence * 100)}%</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">BTC Price</span>
              <p className="mt-2 text-lg font-black text-white">
                ${cycle.snapshot.lastPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Radar className="w-4 h-4 text-orange-500" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Decision Reasons</h4>
              </div>
              <div className="space-y-3">
                {cycle.signal.reasons.map((reason) => (
                  <div key={reason} className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold text-white/80">
                    {reason}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Guardrails</h4>
              </div>
              <div className="space-y-3">
                {cycle.guardrailReasons.length === 0 ? (
                  <div className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-400">
                    No active anti-manipulation block
                  </div>
                ) : (
                  cycle.guardrailReasons.map((reason) => (
                    <div key={reason} className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-400 flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4" />
                      {reason}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Feed Freshness</span>
              <p className="mt-2 text-base font-black text-white">{cycle.snapshot.feedFreshnessMs} ms</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">ATR</span>
              <p className="mt-2 text-base font-black text-white">{cycle.snapshot.atr.toFixed(2)}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Volume Ratio</span>
              <p className="mt-2 text-base font-black text-white">{cycle.snapshot.volumeRatio.toFixed(2)}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-start gap-4">
            <PauseCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">WENN Note</p>
              <p className="text-sm font-bold text-white/80 leading-relaxed">{cycle.status.note}</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
