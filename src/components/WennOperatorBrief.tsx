import { ClipboardList } from 'lucide-react';
import { WennRuntimeCycle } from '../lib/wennRuntimeApi';

interface WennOperatorBriefProps {
  cycle: WennRuntimeCycle | null;
}

function buildBrief(cycle: WennRuntimeCycle | null): string {
  if (!cycle) return 'WENN has not produced a runtime brief yet.';
  if (cycle.guardrailReasons.length > 0) {
    return 'WENN is intentionally defensive. The system sees conditions that reduce trust and prefers restraint over reaction.';
  }
  if (cycle.signal.action === 'paper_long_candidate') {
    return 'WENN sees a research-grade bullish candidate. Attention is increasing, but discipline remains higher than urgency.';
  }
  if (cycle.signal.action === 'wait') {
    return 'WENN is observing movement without granting it authority. Waiting remains the highest-quality action.';
  }
  return cycle.status.note;
}

export function WennOperatorBrief({ cycle }: WennOperatorBriefProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-5">
      <div className="flex items-center gap-3">
        <ClipboardList className="w-5 h-5 text-orange-500" />
        <h3 className="text-sm font-black uppercase tracking-widest">Operator Brief</h3>
      </div>

      <div className="p-6 rounded-3xl bg-black/30 border border-white/5">
        <p className="text-sm font-bold text-white/80 leading-relaxed">{buildBrief(cycle)}</p>
      </div>
    </div>
  );
}
