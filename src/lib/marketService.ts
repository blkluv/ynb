import { MarketQuestion, MarketOption, Trade, Position, TradeType } from '@/types/market';

// ===== UTILITY FUNCTIONS =====

// Generate realistic Solana transaction signature
function generateSolanaSignature(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  return Array.from({ length: 88 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

// LocalStorage helpers
function saveToLocalStorage(key: string, data: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`prismafy_${key}`, JSON.stringify(data));
  }
}

function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`prismafy_${key}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing localStorage:', e);
      }
    }
  }
  return defaultValue;
}

// Mock data storage (in production, this would be blockchain/API calls)
let markets: MarketQuestion[] = loadFromLocalStorage('markets', [
  {
    id: '1',
    question: 'Will Bitcoin reach $100,000 by December 31, 2024?',
    description: 'This market will resolve to YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange.',
    category: 'crypto' as any,
    resolutionDate: '2024-12-31T23:59:59Z',
    resolutionSource: 'https://www.coingecko.com/en/coins/bitcoin',
    outcomeType: 'binary' as any,
    options: [
      { id: 'yes', text: 'Yes', probability: 0.65, volume: 12500 },
      { id: 'no', text: 'No', probability: 0.35, volume: 8300 }
    ],
    creator: '0x1234...5678',
    createdAt: '2024-01-15T10:00:00Z',
    status: 'active' as any,
    volume: 20800,
    participants: 342,
    fees: { creationFee: 0.5, tradingFee: 0.5, resolutionFee: 1.0 }
  },
  {
    id: '2',
    question: 'Will AI replace 50% of software developers by 2030?',
    description: 'Market resolves YES if credible studies show AI has replaced at least 50% of traditional software development roles.',
    category: 'technology' as any,
    resolutionDate: '2030-12-31T23:59:59Z',
    resolutionSource: 'https://www.example.com/ai-study',
    outcomeType: 'binary' as any,
    options: [
      { id: 'yes', text: 'Yes', probability: 0.28, volume: 5200 },
      { id: 'no', text: 'No', probability: 0.72, volume: 13400 }
    ],
    creator: '0x2345...6789',
    createdAt: '2024-02-01T10:00:00Z',
    status: 'active' as any,
    volume: 18600,
    participants: 267,
    fees: { creationFee: 0.5, tradingFee: 0.5, resolutionFee: 1.0 }
  },
  {
    id: '3',
    question: 'Who will win the 2024 US Presidential Election?',
    description: 'Market resolves based on the official Electoral College results.',
    category: 'politics' as any,
    resolutionDate: '2024-11-06T23:59:59Z',
    resolutionSource: 'https://www.example.com/election-results',
    outcomeType: 'categorical' as any,
    options: [
      { id: 'dem', text: 'Democratic Candidate', probability: 0.52, volume: 15600 },
      { id: 'rep', text: 'Republican Candidate', probability: 0.46, volume: 13800 },
      { id: 'other', text: 'Other', probability: 0.02, volume: 600 }
    ],
    creator: '0x3456...7890',
    createdAt: '2024-01-20T10:00:00Z',
    status: 'active' as any,
    volume: 30000,
    participants: 521,
    fees: { creationFee: 0.5, tradingFee: 0.5, resolutionFee: 1.0 }
  }
]);

let trades: Trade[] = loadFromLocalStorage('trades', []);
let positions: Position[] = loadFromLocalStorage('positions', []);

export class MarketService {
  // Get all markets
  static async getMarkets(): Promise<MarketQuestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...markets];
  }

  // Get market by ID
  static async getMarket(id: string): Promise<MarketQuestion | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return markets.find(market => market.id === id) || null;
  }

  // Create new market
  static async createMarket(marketData: Omit<MarketQuestion, 'id' | 'createdAt' | 'status' | 'volume' | 'participants'>): Promise<MarketQuestion & { signature: string; explorerUrl: string }> {
    // Simulate blockchain transaction delay for market creation
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    const signature = generateSolanaSignature();
    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    
    const newMarket: MarketQuestion = {
      ...marketData,
      id: (markets.length + 1).toString(),
      createdAt: new Date().toISOString(),
      status: 'active' as any,
      volume: 0,
      participants: 0
    };

    markets.push(newMarket);
    saveToLocalStorage('markets', markets);
    
    return {
      ...newMarket,
      signature,
      explorerUrl
    };
  }

  // Execute trade
  static async executeTrade(
    marketId: string,
    optionId: string,
    type: TradeType,
    amount: number,
    userAddress: string
  ): Promise<Trade & { signature: string; explorerUrl: string }> {
    // Simulate realistic blockchain transaction delay (1-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    const market = markets.find(m => m.id === marketId);
    if (!market) {
      throw new Error('Market not found');
    }

    const option = market.options.find(o => o.id === optionId);
    if (!option) {
      throw new Error('Option not found');
    }

    // Calculate shares and fees
    const shares = amount / option.probability;
    const fee = amount * (market.fees.tradingFee / 100);
    const totalCost = type === TradeType.BUY ? amount + fee : amount - fee;

    // Generate realistic Solana transaction signature
    const signature = generateSolanaSignature();
    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

    // Create trade record
    const trade: Trade = {
      id: `trade_${Date.now()}`,
      marketId,
      userId: userAddress,
      optionId,
      type,
      amount,
      shares,
      price: option.probability,
      fee,
      timestamp: new Date().toISOString(),
      status: 'confirmed' as any,
      txHash: signature
    };

    trades.push(trade);
    saveToLocalStorage('trades', trades);

    // Update market data
    option.volume += amount;
    market.volume += amount;
    market.participants = Math.max(market.participants, trades.filter(t => t.marketId === marketId).length);

    // Update probabilities based on trading (simplified AMM logic)
    if (type === TradeType.BUY) {
      option.probability = Math.min(0.99, option.probability + (amount / market.volume) * 0.1);
    } else {
      option.probability = Math.max(0.01, option.probability - (amount / market.volume) * 0.1);
    }

    // Normalize probabilities
    const totalProb = market.options.reduce((sum, opt) => sum + opt.probability, 0);
    market.options.forEach(opt => {
      opt.probability = opt.probability / totalProb;
    });

    // Save updated markets to localStorage
    saveToLocalStorage('markets', markets);

    // Update or create position
    const existingPosition = positions.find(p => 
      p.marketId === marketId && p.optionId === optionId && p.id === userAddress
    );

    if (existingPosition) {
      if (type === TradeType.BUY) {
        const newShares = existingPosition.shares + shares;
        const newAvgPrice = (existingPosition.averagePrice * existingPosition.shares + amount) / newShares;
        existingPosition.shares = newShares;
        existingPosition.averagePrice = newAvgPrice;
      } else {
        existingPosition.shares = Math.max(0, existingPosition.shares - shares);
      }
      existingPosition.currentValue = existingPosition.shares * option.probability;
      existingPosition.profitLoss = existingPosition.currentValue - (existingPosition.averagePrice * existingPosition.shares);
      existingPosition.profitLossPercentage = existingPosition.profitLoss / (existingPosition.averagePrice * existingPosition.shares) * 100;
    } else if (type === TradeType.BUY) {
      const newPosition: Position = {
        id: userAddress,
        marketId,
        optionId,
        shares,
        averagePrice: amount / shares,
        currentValue: shares * option.probability,
        profitLoss: (shares * option.probability) - amount,
        profitLossPercentage: ((shares * option.probability) - amount) / amount * 100
      };
      positions.push(newPosition);
    }

    // Save updated positions to localStorage
    saveToLocalStorage('positions', positions);

    // Return trade with signature and explorer URL
    return {
      ...trade,
      signature,
      explorerUrl
    };
  }

  // Get user positions
  static async getUserPositions(userAddress: string): Promise<Position[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return positions.filter(p => p.id === userAddress);
  }

  // Get market trades
  static async getMarketTrades(marketId: string): Promise<Trade[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return trades.filter(t => t.marketId === marketId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Get user trades
  static async getUserTrades(userAddress: string): Promise<Trade[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return trades.filter(t => t.userId === userAddress).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Simulate real-time price updates
  static subscribeToMarketUpdates(marketId: string, callback: (market: MarketQuestion) => void) {
    const interval = setInterval(() => {
      const market = markets.find(m => m.id === marketId);
      if (market) {
        // Simulate small price movements
        market.options.forEach(option => {
          const change = (Math.random() - 0.5) * 0.02; // ±1% change
          option.probability = Math.max(0.01, Math.min(0.99, option.probability + change));
        });

        // Normalize probabilities
        const totalProb = market.options.reduce((sum, opt) => sum + opt.probability, 0);
        market.options.forEach(opt => {
          opt.probability = opt.probability / totalProb;
        });

        callback({ ...market });
      }
    }, 2000);

    return () => clearInterval(interval);
  }
}



