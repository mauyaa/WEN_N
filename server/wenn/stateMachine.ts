import { RuntimeState } from './types';

const allowedTransitions: Record<RuntimeState, RuntimeState[]> = {
  BOOT: ['SCAN', 'PAUSE', 'STOP'],
  SCAN: ['WAIT', 'ARMED', 'PAUSE', 'STOP'],
  WAIT: ['SCAN', 'PAUSE', 'STOP'],
  ARMED: ['MANAGE', 'WAIT', 'PAUSE', 'STOP'],
  MANAGE: ['COOLDOWN', 'PAUSE', 'STOP'],
  COOLDOWN: ['SCAN', 'PAUSE', 'STOP'],
  PAUSE: ['SCAN', 'STOP'],
  STOP: [],
};

export function canTransition(from: RuntimeState, to: RuntimeState): boolean {
  return allowedTransitions[from].includes(to);
}

export function nextStateOrThrow(from: RuntimeState, to: RuntimeState): RuntimeState {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid WENN state transition: ${from} -> ${to}`);
  }

  return to;
}
