import { Wallet } from 'lucide-react';
import { WennLiveSnapshot } from '../hooks/useWennLiveSnapshot';

interface WennLiveSnapshotPanelProps {
  snapshot: WennLiveSnapshot | null;
  loading?: boolean;
  error?: string | null;
}

export function WennLiveSnapshotPanel({ snapshot, loading, error }: WennLiveSnapshotPanelProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-widest">Account Truth</h3>
        </div>
        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
          {loading ? 'Syncing' : snapshot?.mode || 'Unavailable'}
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-bold">
          {error}
        </div>
      ) : null}

      {snapshot ? (
        <>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Connected Account</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">
              {snapshot.account.label || snapshot.account.accountId} · {snapshot.provider}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snapshot.balances.map((balance) => (
              <div key={balance.asset} className="p-5 rounded-3xl bg-black/30 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{balance.asset}</p>
                <p className="mt-2 text-lg font-black text-white">{balance.total}</p>
                <p className="text-sm font-bold text-white/50">Free: {balance.free}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Open Orders</p>
              <p className="mt-2 text-lg font-black text-white">{snapshot.openOrders.length}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Open Positions</p>
              <p className="mt-2 text-lg font-black text-white">{snapshot.openPositions.length}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Recent Fills</p>
              <p className="mt-2 text-lg font-black text-white">{snapshot.recentFills.length}</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
