export type PatternDirection = 'bullish' | 'bearish';

export type PatternType =
  | 'bullish_engulfing'
  | 'bearish_engulfing'
  | 'shooting_star'
  | 'evening_star'
  | 'dark_cloud_cover'
  | 'demand_rejection'
  | 'supply_rejection';

export interface PatternMatch {
  type: PatternType;
  direction: PatternDirection;
  symbol: string;
  timeframe: string;
  timestamp: number;
  confidence: number;
  reasons: string[];
}

export interface SupplyDemandZone {
  type: 'supply' | 'demand';
  symbol: string;
  timeframe: string;
  startPrice: number;
  endPrice: number;
  createdAt: number;
  touchCount: number;
  strength: number;
}

export interface PatternContextBundle {
  symbol: string;
  timeframe: string;
  pattern?: PatternMatch;
  nearbyZone?: SupplyDemandZone;
  volumeRatio?: number;
  marketState?: string;
  guardrailBlocked?: boolean;
}
