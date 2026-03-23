import { RuntimeCycleResult } from './runtimeService';

export interface RuntimeMemoryEntry {
  id: string;
  cycle: RuntimeCycleResult;
}

export interface RuntimeMemorySummary {
  entries: number;
  waitCount: number;
  armedCount: number;
  pauseCount: number;
  blockedCount: number;
}

const MAX_MEMORY = 30;
const memory: RuntimeMemoryEntry[] = [];

function buildId(cycle: RuntimeCycleResult): string {
  return `${cycle.status.updatedAt}-${cycle.signal.action}-${cycle.snapshot.lastPrice}`;
}

export function recordRuntimeCycle(cycle: RuntimeCycleResult): RuntimeMemoryEntry[] {
  const id = buildId(cycle);

  if (memory[0]?.id === id) {
    return memory;
  }

  memory.unshift({ id, cycle });

  if (memory.length > MAX_MEMORY) {
    memory.length = MAX_MEMORY;
  }

  return memory;
}

export function getRuntimeMemory(): RuntimeMemoryEntry[] {
  return memory;
}

export function getRuntimeMemorySummary(): RuntimeMemorySummary {
  return {
    entries: memory.length,
    waitCount: memory.filter((entry) => entry.cycle.signal.action === 'wait').length,
    armedCount: memory.filter((entry) => entry.cycle.status.state === 'ARMED').length,
    pauseCount: memory.filter((entry) => entry.cycle.status.state === 'PAUSE').length,
    blockedCount: memory.filter((entry) => entry.cycle.guardrailReasons.length > 0).length,
  };
}
