import { evaluateManipulationRisk } from './guardrails';
import { createMockBtcSnapshot } from './mockSnapshot';
import { buildCandidateSignal, buildRuntimeStatus, classifyMarketState, evaluateNextRuntimeState } from './runtime';
import { CandidateSignal, RuntimeState, RuntimeStatus } from './types';

export interface RuntimeCycleResult {
  snapshot: ReturnType<typeof createMockBtcSnapshot>;
  signal: CandidateSignal;
  status: RuntimeStatus;
  guardrailReasons: string[];
}

let currentState: RuntimeState = 'BOOT';

export function getRuntimeCycle(): RuntimeCycleResult {
  const snapshot = createMockBtcSnapshot();
  const marketState = classifyMarketState(snapshot);
  const manipulationRisk = evaluateManipulationRisk(snapshot);

  let signal = buildCandidateSignal(snapshot);

  if (manipulationRisk.blocked) {
    signal = {
      ...signal,
      action: marketState === 'invalid' ? 'pause_system' : 'wait',
      confidence: 0,
      reasons: [...signal.reasons, ...manipulationRisk.reasons],
      warnings: [...signal.warnings, 'anti_manipulation_guardrail_active'],
    };
  }

  if (currentState === 'BOOT') {
    currentState = 'SCAN';
  }

  currentState = evaluateNextRuntimeState(currentState, signal);

  const statusNote = manipulationRisk.blocked
    ? 'Guardrails active. WENN is refusing low-quality conditions.'
    : signal.action === 'paper_long_candidate'
      ? 'Candidate forming under research rules.'
      : 'No clean candidate. Standing by.';

  const status = buildRuntimeStatus(currentState, marketState, statusNote);

  return {
    snapshot,
    signal,
    status,
    guardrailReasons: manipulationRisk.reasons,
  };
}

export function getRuntimeStatusOnly(): RuntimeStatus {
  const snapshot = createMockBtcSnapshot();
  const marketState = classifyMarketState(snapshot);

  if (currentState === 'BOOT') {
    currentState = 'SCAN';
  }

  return buildRuntimeStatus(currentState, marketState, 'Runtime status check.');
}
