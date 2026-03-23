import { getLiveSnapshotReport } from './liveService';
import { getLiveControlStatus } from './liveControlService';
import { reconcileLiveState } from './reconciliation';

export interface LiveBundle {
  snapshot: Awaited<ReturnType<typeof getLiveSnapshotReport>>;
  controls: ReturnType<typeof getLiveControlStatus>;
  reconciliation: ReturnType<typeof reconcileLiveState>;
}

export async function buildLiveBundle(): Promise<LiveBundle> {
  const snapshot = await getLiveSnapshotReport();
  const controls = getLiveControlStatus();

  const reconciliation = reconcileLiveState({
    localOrders: snapshot.openOrders,
    exchangeOrders: snapshot.openOrders,
    localPositions: snapshot.openPositions,
    exchangePositions: snapshot.openPositions,
    localFills: snapshot.recentFills,
    exchangeFills: snapshot.recentFills,
  });

  return {
    snapshot,
    controls,
    reconciliation,
  };
}
