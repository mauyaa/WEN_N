import { Layers3 } from 'lucide-react';
import { WennCommandBundle } from '../hooks/useWennCommandBundle';

interface WennRegimePanelProps {
  bundle: WennCommandBundle | null;
}

function toneForRegime(regime?: string) {
  switch (regime) {
    case 'markup':
      return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    case 'markdown':
      return 'text-red-400 border-red-500/20 bg-red-500/10';
    case 'accumulation':
      return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
    case 'distribution':
      return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
    default:
      return 'text-white/70 border-white/10 bg-white/5';
  }
}

export function WennRegimePanel({ bundle }: WennRegimePanelProps) {
  const regime = bundle?.regime;

  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Layers3 className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-widest">Market Regime</h3>
        </div>
        <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${toneForRegime(regime?.regime)}`}>
          {regime?.regime || 'Unavailable'}
        </div>
      </div>

      {regime ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Confidence</p>
              <p className="mt-2 text-lg font-black text-white">{Math.round(regime.confidence * 100)}%</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Timeframe</p>
              <p className="mt-2 text-lg font-black text-white">{regime.timeframe}</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Caution</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">{regime.caution}</p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Reasons</p>
            <div className="space-y-3">
              {regime.reasons.map((reason) => (
                <div key={reason} className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold text-white/80">
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
