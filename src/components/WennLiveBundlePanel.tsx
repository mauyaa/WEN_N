import { ShieldCheck } from 'lucide-react';
import { WennLiveBundle } from '../hooks/useWennLiveBundle';

interface WennLiveBundlePanelProps {
  bundle: WennLiveBundle | null;
  loading?: boolean;
  error?: string | null;
}

export function WennLiveBundlePanel({ bundle, loading, error }: WennLiveBundlePanelProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-widest">Live Bundle</h3>
        </div>
        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
          {loading ? 'Syncing' : bundle?.snapshot?.mode || 'Unavailable'}
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-bold">
          {error}
        </div>
      ) : null}

      {bundle ? (
        <>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Mode</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">{bundle.controls.mode}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Connected Account</p>
              <p className="mt-2 text-lg font-black text-white">{bundle.snapshot.account?.label || bundle.snapshot.account?.accountId}</p>
            </div>
            <div className="p-5 rounded-3xl bg-black/30 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Reconciliation</p>
              <p className="mt-2 text-lg font-black text-white">{bundle.reconciliation.healthy ? 'Healthy' : 'Mismatch'}</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Guard Summary</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">{bundle.controls.guardReport.summary}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
