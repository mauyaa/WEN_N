import { WennDeepControlRoom } from './WennDeepControlRoom';
import { WennOperationalStatusPanel } from './WennOperationalStatusPanel';
import { WennPredictionPanel } from './WennPredictionPanel';
import { WennRegimePanel } from './WennRegimePanel';
import { useWennCommandBundle } from '../hooks/useWennCommandBundle';

export function WennUnifiedCommandCenter() {
  const { bundle, loading, error } = useWennCommandBundle();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">WENN Unified Command Center</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">One system. One view.</h2>
          <p className="mt-4 max-w-3xl text-sm md:text-base font-bold text-white/50 leading-relaxed">
            A unified BTC-first research console that merges runtime state, regime interpretation, prediction bias, replay memory, and operational readiness.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
          {loading ? 'Console syncing' : bundle?.cycle?.status?.state || 'Console pending'}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <WennDeepControlRoom />
        </div>
        <div className="space-y-8">
          <WennPredictionPanel data={bundle ? { insights: bundle.insights, prediction: bundle.prediction } : null} loading={loading} error={error} />
          <WennRegimePanel bundle={bundle} />
          <WennOperationalStatusPanel report={bundle?.readiness || null} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
