export type Coin = 'BTC' | 'ETH' | 'SOL';
export type TradeType = 'LONG' | 'SHORT';

export interface User {
  uid: string;
  email: string | null;
  balance: number;
  isTradingEnabled: boolean;
  createdAt?: any;
  role?: string;
}

export interface Position {
  id: string;
  userId: string;
  coin: Coin;
  type: TradeType;
  entryPrice: number;
  amount: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  openedAt: any;
}

export interface TradeHistory {
  id: string;
  userId: string;
  coin: Coin;
  type: TradeType;
  entryPrice: number;
  exitPrice: number;
  profit: number;
  stopLoss?: number;
  takeProfit?: number;
  closedAt: any;
}

export interface MarketData {
  coin: Coin;
  price: number;
  change24h: number;
  rsi?: number;
  macd?: number;
  sentiment?: number; // -1 to 1
  onChainFlow?: 'INFLOW' | 'OUTFLOW' | 'NEUTRAL';
  fundingRate?: number;
  openInterest?: number;
  liquidationPrice?: number;
}

export interface AgentAnalysis {
  agent: 'TECHNICAL' | 'SENTIMENT' | 'RISK' | 'EXECUTIONER';
  insight: string;
  confidence: number;
  timestamp: string;
}

export interface WennIntelligence {
  thought: string;
  action: 'OPEN_LONG' | 'OPEN_SHORT' | 'CLOSE_POSITION' | 'HOLD';
  coin: Coin;
  reason: string;
  stopLoss?: number;
  takeProfit?: number;
  agents: AgentAnalysis[];
  consensusScore: number; // 0 to 1
  macroContext: {
    dxy: number;
    cpi: string;
    interestRate: string;
  };
}
