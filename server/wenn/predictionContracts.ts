export type PredictionBias = 'bullish' | 'bearish' | 'neutral';

export interface PredictionInputContext {
  symbol: string;
  timeframe: string;
  structureLabel?: 'orderly' | 'mixed' | 'chaotic';
  momentumLabel?: 'bullish' | 'bearish' | 'neutral';
  volatilityLabel?: 'compressed' | 'normal' | 'expanded';
  patternType?: string;
  marketState?: string;
  guardrailBlocked?: boolean;
}

export interface PredictionReport {
  symbol: string;
  timeframe: string;
  bias: PredictionBias;
  confidence: number;
  horizon: string;
  reasons: string[];
  invalidation: string;
  riskNote: string;
}
