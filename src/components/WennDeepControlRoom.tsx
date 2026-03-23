import { WennMarketHealthPanel } from './WennMarketHealthPanel';
import { WennOperatorBrief } from './WennOperatorBrief';
import { WennReasonLedger } from './WennReasonLedger';
import { WennReplayStrip } from './WennReplayStrip';
import { WennMemorySummary } from './WennMemorySummary';
import { WennRuntimePanel } from './WennRuntimePanel';
import { useWennCycleMemory } from '../hooks/useWennCycleMemory';

export function WennDeepControlRoom() {
  const { latest, history, summary, loading, error } = useWennCycleMemory();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">WENN Deep Control Room</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Discipline over noise.</h2>
          <p className="mt-4 max-w-3xl text-sm md:text-base font-bold text-white/50 leading-relaxed">
            A replay-aware BTC-first research cockpit built to observe quality, remember context, and refuse low-trust conditions.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
          {loading ? 'Memory syncing' : latest?.status.state || 'Memory pending'}
        </div>
      </div>

      <WennReplayStrip history={history} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <WennRuntimePanel cycle={latest} loading={loading} error={error} />
          <WennOperatorBrief cycle={latest} />
        </div>
        <div className="space-y-8">
          <WennMarketHealthPanel cycle={latest} />
          <WennReasonLedger cycle={latest} />
          <WennMemorySummary summary={summary} />
        </div>
      </div>
    </div>
  );
}
