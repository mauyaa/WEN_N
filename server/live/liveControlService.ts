import { evaluateLiveModeGuards, LiveModeGuardReport } from './liveModeGuards';

export interface LiveControlStatus {
  mode: 'paper' | 'live_blocked';
  canActivateLive: boolean;
  guardReport: LiveModeGuardReport;
}

export function getLiveControlStatus(): LiveControlStatus {
  const guardReport = evaluateLiveModeGuards();

  return {
    mode: guardReport.liveEligible ? 'paper' : 'live_blocked',
    canActivateLive: guardReport.liveEligible,
    guardReport,
  };
}
