import { WennFinalCommandCenter } from './WennFinalCommandCenter';
import { WennLiveSnapshotPanel } from './WennLiveSnapshotPanel';
import { useWennLiveSnapshot } from '../hooks/useWennLiveSnapshot';

export function WennCompleteCommandCenter() {
  const { snapshot, loading, error } = useWennLiveSnapshot();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">WENN Complete Command Center</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Research shell with account truth.</h2>
          <p className="mt-4 max-w-3xl text-sm md:text-base font-bold text-white/50 leading-relaxed">
            The promoted operator surface for runtime state, prediction, regime, readiness, replay memory, and paper/live account truth.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
          {loading ? 'Account syncing' : snapshot?.mode || 'Account pending'}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <WennFinalCommandCenter />
        </div>
        <div>
          <WennLiveSnapshotPanel snapshot={snapshot} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
