import { WennResearchSurface } from './WennResearchSurface';
import { WennReasonLedger } from './WennReasonLedger';
import { WennMarketHealthPanel } from './WennMarketHealthPanel';
import { useWennRuntime } from '../hooks/useWennRuntime';

export function WennControlRoom() {
  const { cycle, loading, error } = useWennRuntime();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">WENN Control Room</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Knowing when.</h2>
          <p className="mt-4 max-w-3xl text-sm md:text-base font-bold text-white/50 leading-relaxed">
            A private BTC-first research core designed to read quality, refuse noise, and escalate only when structure deserves attention.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
          {loading ? 'Runtime syncing' : cycle?.status.state || 'Runtime pending'}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <WennResearchSurface />
        </div>
        <div className="space-y-8">
          <WennMarketHealthPanel cycle={cycle} />
          <WennReasonLedger cycle={cycle} />
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-bold">
          {error}
        </div>
      ) : null}
    </div>
  );
}
