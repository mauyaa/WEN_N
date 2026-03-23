import { ShieldCheck } from 'lucide-react';
import { WENNOperationalReport } from '../hooks/useWennOperationalStatus';

interface WennOperationalStatusPanelProps {
  report: WENNOperationalReport | null;
  loading?: boolean;
  error?: string | null;
}

function toneClasses(status: 'ready' | 'partial' | 'blocked') {
  switch (status) {
    case 'ready':
      return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    case 'partial':
      return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
    case 'blocked':
      return 'text-red-400 border-red-500/20 bg-red-500/10';
  }
}

export function WennOperationalStatusPanel({ report, loading, error }: WennOperationalStatusPanelProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-widest">Operational Status</h3>
        </div>
        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
          {loading ? 'Checking' : report?.mode || 'Unavailable'}
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-bold">
          {error}
        </div>
      ) : null}

      {report ? (
        <>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Summary</p>
            <p className="text-sm font-bold text-white/80 leading-relaxed">{report.summary}</p>
          </div>

          <div className="space-y-3">
            {report.checks.map((check) => (
              <div key={check.key} className={`p-4 rounded-3xl border ${toneClasses(check.status)}`}>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-sm font-black">{check.label}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{check.status}</span>
                </div>
                <p className="text-sm font-bold opacity-90 leading-relaxed">{check.detail}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
