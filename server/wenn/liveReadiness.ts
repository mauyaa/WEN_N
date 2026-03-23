export interface ReadinessCheck {
  key: string;
  label: string;
  status: 'ready' | 'partial' | 'blocked';
  detail: string;
}

export interface LiveReadinessReport {
  mode: 'research-paper';
  summary: string;
  checks: ReadinessCheck[];
}

export function getLiveReadinessReport(): LiveReadinessReport {
  const checks: ReadinessCheck[] = [
    {
      key: 'market_stream',
      label: 'Market Stream',
      status: 'partial',
      detail: 'Realtime market updates exist in parts of the app, but WENN runtime still uses mock snapshot generation in the research path.',
    },
    {
      key: 'deposit_flow',
      label: 'Deposit Flow',
      status: 'blocked',
      detail: 'Deposit flow is simulated and not connected to a real funding source.',
    },
    {
      key: 'account_connection',
      label: 'Account Connection',
      status: 'blocked',
      detail: 'No authenticated exchange account selection and reconciliation layer is active yet.',
    },
    {
      key: 'execution_engine',
      label: 'Execution Engine',
      status: 'blocked',
      detail: 'Research runtime exists, but real exchange order placement and fill reconciliation are not wired.',
    },
    {
      key: 'reporting',
      label: 'Reporting',
      status: 'partial',
      detail: 'Open positions and history surfaces exist, but they are not yet sourced from real exchange fills.',
    },
    {
      key: 'risk_controls',
      label: 'Risk Controls',
      status: 'partial',
      detail: 'WENN runtime guardrails and pause logic exist, but live trading kill-switch enforcement is not complete.',
    },
  ];

  return {
    mode: 'research-paper',
    summary: 'WENN has a strong research foundation, but live trading readiness is not yet complete.',
    checks,
  };
}
