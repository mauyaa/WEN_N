import { Telescope } from 'lucide-react';
import { WennCommandBundle } from '../hooks/useWennCommandBundle';

interface WennInsightsPanelProps {
  bundle: WennCommandBundle | null;
}

export function WennInsightsPanel({ bundle }: WennInsightsPanelProps) {
  const insights = bundle?.insights;

  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center gap-3">
        <Telescope className="w-5 h-5 text-orange-500" />
        <h3 className="text-sm font-black uppercase tracking-widest">Research Insights</h3>
      </div>

      {insights ? (
        <>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">AI Observation Summary</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">{insights.observation.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Structure</p>
              <p className="mt-2 text-lg font-black text-white">{insights.observation.structureLabel}</p>
            </div>
            <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Momentum</p>
              <p className="mt-2 text-lg font-black text-white">{insights.observation.momentumLabel}</p>
            </div>
            <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Volatility</p>
              <p className="mt-2 text-lg font-black text-white">{insights.observation.volatilityLabel}</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Pattern Note</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">{insights.note}</p>
          </div>
        </>
      ) : (
        <div className="p-5 rounded-3xl bg-white/5 border border-dashed border-white/10 text-sm font-bold text-white/30">
          Research insights are not available yet.
        </div>
      )}
    </div>
  );
}
