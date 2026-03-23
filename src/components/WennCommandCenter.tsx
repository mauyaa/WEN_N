import { WennDeepControlRoom } from './WennDeepControlRoom';
import { WennOperationalStatusPanel } from './WennOperationalStatusPanel';
import { useWennOperationalStatus } from '../hooks/useWennOperationalStatus';

export function WennCommandCenter() {
  const { report, loading, error } = useWennOperationalStatus();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <WennDeepControlRoom />
        </div>
        <div>
          <WennOperationalStatusPanel report={report} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
