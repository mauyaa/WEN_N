import { WennDeepControlRoom } from './WennDeepControlRoom';
import { WennOperatorStack } from './WennOperatorStack';
import { WennOperationalStatusPanel } from './WennOperationalStatusPanel';
import { useWennCommandBundle } from '../hooks/useWennCommandBundle';

export function WennFinalCommandCenter() {
  const { bundle, loading, error } = useWennCommandBundle();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">WENN Final Command Center</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Discipline. Context. Readiness.</h2>
          <p className="mt-4 max-w-3xl text-sm md:text-base font-bold text-white/50 leading-relaxed">
            The promoted BTC-first research console for runtime state, replay, prediction bias, regime context, and operational truth.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
          {loading ? 'Final shell syncing' : bundle?.cycle?.status?.state || 'Shell pending'}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <WennDeepControlRoom />
        </div>
        <div className="space-y-8">
          <WennOperatorStack bundle={bundle} loading={loading} error={error} />
          <WennOperationalStatusPanel report={bundle?.readiness || null} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
