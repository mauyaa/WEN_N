export type MarketRegime =
  | 'accumulation'
  | 'markup'
  | 'distribution'
  | 'markdown'
  | 'transition'
  | 'unclear';

export interface RegimeInputContext {
  symbol: string;
  timeframe: string;
  momentumLabel?: 'bullish' | 'bearish' | 'neutral';
  structureLabel?: 'orderly' | 'mixed' | 'chaotic';
  volatilityLabel?: 'compressed' | 'normal' | 'expanded';
  marketState?: string;
  patternType?: string;
  volumeRatio?: number;
  guardrailBlocked?: boolean;
  sentimentLabel?: 'fear' | 'neutral' | 'greed';
}

export interface RegimeReport {
  symbol: string;
  timeframe: string;
  regime: MarketRegime;
  confidence: number;
  reasons: string[];
  caution: string;
}
