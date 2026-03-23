import { ScrollText } from 'lucide-react';
import { WennRuntimeCycle } from '../lib/wennRuntimeApi';

interface WennReasonLedgerProps {
  cycle: WennRuntimeCycle | null;
}

export function WennReasonLedger({ cycle }: WennReasonLedgerProps) {
  const reasons = cycle?.signal.reasons || [];
  const warnings = cycle?.signal.warnings || [];

  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center gap-3">
        <ScrollText className="w-5 h-5 text-orange-500" />
        <h3 className="text-sm font-black uppercase tracking-widest">Reason Ledger</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Decision Reasons</p>
          <div className="space-y-3">
            {reasons.length === 0 ? (
              <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold text-white/40">
                No reasons recorded yet
              </div>
            ) : (
              reasons.map((reason) => (
                <div key={reason} className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold text-white/80">
                  {reason}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Warnings</p>
          <div className="space-y-3">
            {warnings.length === 0 ? (
              <div className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-400">
                No warnings active
              </div>
            ) : (
              warnings.map((warning) => (
                <div key={warning} className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-400">
                  {warning}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
