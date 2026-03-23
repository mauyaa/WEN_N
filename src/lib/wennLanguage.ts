export type WennTone = 'neutral' | 'positive' | 'warning' | 'danger';

export const wennStateCopy = {
  BOOT: {
    label: 'Boot',
    short: 'Initializing research core',
    long: 'WENN is validating its environment, warming its internal state, and checking whether it can trust the stream.',
    tone: 'neutral',
  },
  SCAN: {
    label: 'Scan',
    short: 'Reading the market',
    long: 'WENN is observing structure, volatility, and quality before allowing itself to care about the move.',
    tone: 'positive',
  },
  WAIT: {
    label: 'Wait',
    short: 'No clean candidate',
    long: 'WENN sees movement, but not enough clarity. Patience is currently the highest-quality action.',
    tone: 'neutral',
  },
  ARMED: {
    label: 'Armed',
    short: 'Candidate forming',
    long: 'Structure is improving. WENN is interested, but it still requires confirmation before escalation.',
    tone: 'warning',
  },
  MANAGE: {
    label: 'Manage',
    short: 'Supervising active context',
    long: 'WENN is monitoring the tracked setup and staying strict about deterioration or completion.',
    tone: 'positive',
  },
  COOLDOWN: {
    label: 'Cooldown',
    short: 'Resetting after activity',
    long: 'WENN is deliberately quiet to reduce chatter and avoid low-quality immediate re-entry behavior.',
    tone: 'neutral',
  },
  PAUSE: {
    label: 'Pause',
    short: 'Guardrails are active',
    long: 'WENN has found a reason not to trust the moment. It is holding back until quality returns.',
    tone: 'danger',
  },
  STOP: {
    label: 'Stop',
    short: 'Runtime halted',
    long: 'WENN has been stopped manually or by a severe system concern. No further action should occur.',
    tone: 'danger',
  },
} as const;

export const wennMarketStateCopy = {
  trend_up: {
    label: 'Trend Up',
    summary: 'Constructive higher-timeframe alignment with upward pressure.',
  },
  trend_down: {
    label: 'Trend Down',
    summary: 'Downward structure dominates. WENN should stay defensive unless rules explicitly allow bearish tracking.',
  },
  range: {
    label: 'Range',
    summary: 'The market is moving, but not resolving. Patience is preferred over excitement.',
  },
  breakout_building: {
    label: 'Breakout Building',
    summary: 'Pressure may be forming, but WENN should not confuse tension with confirmation.',
  },
  high_volatility: {
    label: 'High Volatility',
    summary: 'Conditions are expanding too aggressively for normal-quality research behavior.',
  },
  invalid: {
    label: 'Invalid',
    summary: 'Data quality or structure confidence is too weak to take seriously.',
  },
} as const;

export const wennActionCopy = {
  wait: {
    label: 'Wait',
    summary: 'Do nothing. Let quality come to the system.',
  },
  paper_long_candidate: {
    label: 'Paper Long Candidate',
    summary: 'A bullish research candidate is forming under BTC-first rules.',
  },
  paper_short_candidate: {
    label: 'Paper Short Candidate',
    summary: 'A bearish research candidate is forming, but only under explicit rules.',
  },
  hold_simulated_position: {
    label: 'Hold Simulated Position',
    summary: 'Maintain the current tracked context without escalation.',
  },
  reduce_simulated_position: {
    label: 'Reduce Simulated Position',
    summary: 'The environment is degrading and tracked exposure should be reduced.',
  },
  exit_simulated_position: {
    label: 'Exit Simulated Position',
    summary: 'The tracked context has completed or invalidated.',
  },
  pause_system: {
    label: 'Pause System',
    summary: 'Guardrails or health checks are strong enough to suspend action.',
  },
} as const;

export function getWennToneClasses(tone: WennTone): string {
  switch (tone) {
    case 'positive':
      return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    case 'warning':
      return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
    case 'danger':
      return 'text-red-400 border-red-500/20 bg-red-500/10';
    default:
      return 'text-white/70 border-white/10 bg-white/5';
  }
}
