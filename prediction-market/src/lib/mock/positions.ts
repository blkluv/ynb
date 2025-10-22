// Mock data for user positions

export interface MockPosition {
  id: string
  marketId: string
  marketQuestion: string
  outcome: boolean // true = YES, false = NO
  amount: number // in SOL
  entryOdds: number // odds when user entered (percentage)
  currentOdds: number // current market odds
  unrealizedPnL: number // in SOL (can be negative)
  status: 'active' | 'won' | 'lost' | 'pending'
  placedAt: Date
}

export const MOCK_USER_POSITIONS: MockPosition[] = [
  {
    id: 'pos-1',
    marketId: '1',
    marketQuestion: 'Will Bitcoin reach $100,000 by end of 2025?',
    outcome: true, // YES
    amount: 2.5,
    entryOdds: 55,
    currentOdds: 61,
    unrealizedPnL: 0.35,
    status: 'active',
    placedAt: new Date('2025-02-10'),
  },
  {
    id: 'pos-2',
    marketId: '2',
    marketQuestion: 'Will Solana TVL exceed $10B in 2025?',
    outcome: true, // YES
    amount: 1.0,
    entryOdds: 58,
    currentOdds: 61,
    unrealizedPnL: 0.12,
    status: 'active',
    placedAt: new Date('2025-03-01'),
  },
  {
    id: 'pos-3',
    marketId: '3',
    marketQuestion: 'Will there be a US recession in 2025?',
    outcome: false, // NO
    amount: 3.2,
    entryOdds: 65,
    currentOdds: 64,
    unrealizedPnL: -0.08,
    status: 'active',
    placedAt: new Date('2025-01-15'),
  },
  {
    id: 'pos-4',
    marketId: '6',
    marketQuestion: 'Will Ethereum switch to Proof of Stake 2.0 in 2025?',
    outcome: true, // YES (WON!)
    amount: 5.0,
    entryOdds: 72,
    currentOdds: 72,
    unrealizedPnL: 8.95, // Won big!
    status: 'won',
    placedAt: new Date('2024-08-20'),
  },
  {
    id: 'pos-5',
    marketId: '10',
    marketQuestion: 'Will global temperatures exceed 1.5°C warming in 2025?',
    outcome: true, // YES (LOST)
    amount: 1.5,
    entryOdds: 37,
    currentOdds: 37,
    unrealizedPnL: -1.5, // Lost all
    status: 'lost',
    placedAt: new Date('2024-03-15'),
  },
]

// Mock user stats
export interface MockUserStats {
  totalValue: number // in SOL
  activePositions: number
  totalProfit: number // in SOL
  winRate: number // percentage
  totalVolume: number // in SOL (all time)
  marketsTraded: number
}

export const MOCK_USER_STATS: MockUserStats = {
  totalValue: 13.45, // Current portfolio value
  activePositions: 3,
  totalProfit: 7.94, // Net profit (wins - losses)
  winRate: 62.5, // 5 wins out of 8 trades
  totalVolume: 18.7, // Total SOL traded
  marketsTraded: 8,
}

// Helper functions
export function getActivePositions(): MockPosition[] {
  return MOCK_USER_POSITIONS.filter((p) => p.status === 'active')
}

export function getResolvedPositions(): MockPosition[] {
  return MOCK_USER_POSITIONS.filter((p) => p.status !== 'active')
}

export function getPositionsByMarket(marketId: string): MockPosition[] {
  return MOCK_USER_POSITIONS.filter((p) => p.marketId === marketId)
}

export function getTotalUnrealizedPnL(): number {
  return MOCK_USER_POSITIONS.filter((p) => p.status === 'active').reduce(
    (sum, p) => sum + p.unrealizedPnL,
    0
  )
}

export function getClaimableWinnings(): MockPosition[] {
  return MOCK_USER_POSITIONS.filter((p) => p.status === 'won')
}

export function getTotalClaimableAmount(): number {
  return getClaimableWinnings().reduce(
    (sum, p) => sum + p.amount + p.unrealizedPnL,
    0
  )
}


