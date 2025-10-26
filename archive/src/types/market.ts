export interface MarketQuestion {
  id: string;
  question: string;
  description: string;
  category: MarketCategory;
  resolutionDate: string;
  resolutionSource: string;
  outcomeType: OutcomeType;
  options: MarketOption[];
  creator: string;
  createdAt: string;
  status: MarketStatus;
  volume: number;
  participants: number;
  fees: MarketFees;
}

export interface MarketOption {
  id: string;
  text: string;
  probability: number;
  volume: number;
}

export interface MarketFees {
  creationFee: number;
  tradingFee: number;
  resolutionFee: number;
}

export enum MarketCategory {
  SPORTS = 'sports',
  POLITICS = 'politics',
  ECONOMICS = 'economics',
  TECHNOLOGY = 'technology',
  CRYPTO = 'crypto',
  WEATHER = 'weather',
  ENTERTAINMENT = 'entertainment',
  OTHER = 'other'
}

export enum OutcomeType {
  BINARY = 'binary',
  CATEGORICAL = 'categorical',
  SCALAR = 'scalar'
}

export enum MarketStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled'
}

export interface CreateMarketForm {
  question: string;
  description: string;
  category: MarketCategory;
  resolutionDate: string;
  resolutionSource: string;
  outcomeType: OutcomeType;
  options: Omit<MarketOption, 'id' | 'probability' | 'volume'>[];
  fees: MarketFees;
}

export interface ResolutionSource {
  id: string;
  name: string;
  url: string;
  type: 'official' | 'news' | 'api' | 'manual';
  description: string;
}

export interface Trade {
  id: string;
  marketId: string;
  userId: string;
  optionId: string;
  type: TradeType;
  amount: number;
  shares: number;
  price: number;
  fee: number;
  timestamp: string;
  status: TradeStatus;
  txHash?: string;
}

export enum TradeType {
  BUY = 'buy',
  SELL = 'sell'
}

export enum TradeStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface Position {
  id: string;
  marketId: string;
  optionId: string;
  shares: number;
  averagePrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface OrderBook {
  optionId: string;
  bids: Order[];
  asks: Order[];
}

export interface Order {
  price: number;
  shares: number;
  total: number;
}
