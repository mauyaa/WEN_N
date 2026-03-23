import { BrainCircuit } from 'lucide-react';
import { WENNPredictionResponse } from '../hooks/useWennPrediction';

interface WennPredictionPanelProps {
  data: WENNPredictionResponse | null;
  loading?: boolean;
  error?: string | null;
}

function toneForBias(bias?: 'bullish' | 'bearish' | 'neutral') {
  switch (bias) {
    case 'bullish':
      return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    case 'bearish':
      return 'text-red-400 border-red-500/20 bg-red-500/10';
    default:
      return 'text-white/70 border-white/10 bg-white/5';
  }
}

export function WennPredictionPanel({ data, loading, error }: WennPredictionPanelProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-widest">Prediction Bias</h3>
        </div>
        <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${toneForBias(data?.prediction.bias)}`}>
          {loading ? 'Forecasting' : data?.prediction.bias || 'Unavailable'}
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-bold">
          {error}
        </div>
      ) : null}

      {data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Symbol</p>
              <p className="mt-2 text-lg font-black text-white">{data.prediction.symbol}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Timeframe</p>
              <p className="mt-2 text-lg font-black text-white">{data.prediction.timeframe}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Confidence</p>
              <p className="mt-2 text-lg font-black text-white">{Math.round(data.prediction.confidence * 100)}%</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Invalidation</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">{data.prediction.invalidation}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Risk Note</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">{data.prediction.riskNote}</p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Reasons</p>
            <div className="space-y-3">
              {data.prediction.reasons.map((reason) => (
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
