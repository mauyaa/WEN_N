import { ShieldAlert } from 'lucide-react';
import { WennLiveControlStatus } from '../hooks/useWennLiveControl';

interface WennLiveControlPanelProps {
  status: WennLiveControlStatus | null;
  loading?: boolean;
  error?: string | null;
}

export function WennLiveControlPanel({ status, loading, error }: WennLiveControlPanelProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-widest">Live Mode Control</h3>
        </div>
        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
          {loading ? 'Checking' : status?.mode || 'Unavailable'}
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-bold">
          {error}
        </div>
      ) : null}

      {status ? (
        <>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Summary</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">{status.guardReport.summary}</p>
          </div>

          <div className="space-y-3">
            {status.guardReport.checks.map((check) => (
              <div
                key={check.key}
                className={`p-4 rounded-3xl border ${check.passed ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-red-400 border-red-500/20 bg-red-500/10'}`}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-sm font-black">{check.key}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{check.passed ? 'ready' : 'blocked'}</span>
                </div>
                <p className="text-sm font-bold opacity-90 leading-relaxed">{check.detail}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
