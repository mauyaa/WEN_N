import { OHLCVCandle } from './dataContracts';

export interface CandleObservationRequest {
  symbol: string;
  timeframe: string;
  candles: OHLCVCandle[];
}

export interface CandleObservationReport {
  symbol: string;
  timeframe: string;
  summary: string;
  structureLabel: 'orderly' | 'mixed' | 'chaotic';
  momentumLabel: 'bullish' | 'bearish' | 'neutral';
  volatilityLabel: 'compressed' | 'normal' | 'expanded';
  confidence: number;
  observations: string[];
  warnings: string[];
}
