export interface LiveModeCheck {
  key: string;
  passed: boolean;
  detail: string;
}

export interface LiveModeGuardReport {
  liveEligible: boolean;
  checks: LiveModeCheck[];
  summary: string;
}

export function evaluateLiveModeGuards(): LiveModeGuardReport {
  const checks: LiveModeCheck[] = [
    {
      key: 'connected_account',
      passed: false,
      detail: 'A real authenticated exchange account has not been connected yet.',
    },
    {
      key: 'funding_truth',
      passed: false,
      detail: 'Balances still need to be sourced from a real exchange account for live mode.',
    },
    {
      key: 'execution_truth',
      passed: false,
      detail: 'Real order placement, status tracking, and fill reconciliation are not yet wired.',
    },
    {
      key: 'risk_controls',
      passed: false,
      detail: 'Live-only kill switch and hard live guard enforcement still need implementation.',
    },
  ];

  return {
    liveEligible: checks.every((check) => check.passed),
    checks,
    summary: 'Live mode should remain blocked until account truth, execution truth, and live safety controls are complete.',
  };
}
