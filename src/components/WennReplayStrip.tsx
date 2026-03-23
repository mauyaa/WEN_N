import { RotateCcw } from 'lucide-react';
import { WennCycleMemoryEntry } from '../hooks/useWennCycleMemory';

interface WennReplayStripProps {
  history: WennCycleMemoryEntry[];
}

function toneForState(state: string): string {
  switch (state) {
    case 'SCAN':
      return 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400';
    case 'ARMED':
      return 'bg-orange-500/15 border-orange-500/20 text-orange-400';
    case 'PAUSE':
      return 'bg-red-500/15 border-red-500/20 text-red-400';
    case 'WAIT':
      return 'bg-white/5 border-white/10 text-white/70';
    default:
      return 'bg-white/5 border-white/10 text-white/60';
  }
}

export function WennReplayStrip({ history }: WennReplayStripProps) {
  return (
    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center gap-3">
        <RotateCcw className="w-5 h-5 text-orange-500" />
        <h3 className="text-sm font-black uppercase tracking-widest">Replay Strip</h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {history.length === 0 ? (
          <div className="px-4 py-3 rounded-2xl border border-dashed border-white/10 text-sm font-bold text-white/30 whitespace-nowrap">
            No runtime memory yet
          </div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className={`min-w-[180px] p-4 rounded-2xl border whitespace-nowrap ${toneForState(entry.cycle.status.state)}`}
            >
              <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">
                {entry.cycle.status.state}
              </div>
              <div className="text-sm font-black mb-1">{entry.cycle.signal.action}</div>
              <div className="text-[11px] font-bold opacity-80">{entry.cycle.status.marketState}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
