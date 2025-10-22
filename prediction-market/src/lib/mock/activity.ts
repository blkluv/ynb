// Mock data for activity/transaction history

export interface MockActivity {
  id: string
  type: 'bet_placed' | 'market_created' | 'winnings_claimed' | 'market_resolved'
  marketId: string
  marketQuestion: string
  amount?: number // in SOL
  outcome?: boolean // true = YES, false = NO
  timestamp: Date
  signature: string // Transaction signature
  status: 'confirmed' | 'pending' | 'failed'
  user?: string // wallet address
}

export const MOCK_ACTIVITY: MockActivity[] = [
  {
    id: 'act-1',
    type: 'bet_placed',
    marketId: '1',
    marketQuestion: 'Will Bitcoin reach $100,000 by end of 2025?',
    amount: 2.5,
    outcome: true,
    timestamp: new Date('2025-10-18T06:30:00'),
    signature: '3Zx9...Kp2w',
    status: 'confirmed',
    user: 'You',
  },
  {
    id: 'act-2',
    type: 'winnings_claimed',
    marketId: '6',
    marketQuestion: 'Will Ethereum switch to Proof of Stake 2.0 in 2025?',
    amount: 13.95,
    timestamp: new Date('2025-10-17T14:22:00'),
    signature: '5Yv2...Mn8t',
    status: 'confirmed',
    user: 'You',
  },
  {
    id: 'act-3',
    type: 'bet_placed',
    marketId: '2',
    marketQuestion: 'Will Solana TVL exceed $10B in 2025?',
    amount: 1.0,
    outcome: true,
    timestamp: new Date('2025-10-16T19:45:00'),
    signature: '7Wu4...Qr3v',
    status: 'confirmed',
    user: 'You',
  },
  {
    id: 'act-4',
    type: 'market_resolved',
    marketId: '6',
    marketQuestion: 'Will Ethereum switch to Proof of Stake 2.0 in 2025?',
    outcome: true,
    timestamp: new Date('2025-10-15T08:00:00'),
    signature: '9As6...Xt5y',
    status: 'confirmed',
    user: 'Market Creator',
  },
  {
    id: 'act-5',
    type: 'bet_placed',
    marketId: '3',
    marketQuestion: 'Will there be a US recession in 2025?',
    amount: 3.2,
    outcome: false,
    timestamp: new Date('2025-10-14T11:15:00'),
    signature: '2Bt7...Lp4u',
    status: 'confirmed',
    user: 'You',
  },
  {
    id: 'act-6',
    type: 'market_created',
    marketId: '9',
    marketQuestion: 'Will any country ban TikTok nationwide in 2025?',
    timestamp: new Date('2025-10-13T16:30:00'),
    signature: '4Cv8...Nr6w',
    status: 'confirmed',
    user: 'Qr8s...4Zu5',
  },
  {
    id: 'act-7',
    type: 'bet_placed',
    marketId: '5',
    marketQuestion: 'Will OpenAI release GPT-5 in 2025?',
    amount: 0.8,
    outcome: true,
    timestamp: new Date('2025-10-12T13:20:00'),
    signature: '6Dx9...Os7x',
    status: 'confirmed',
    user: 'Ij6v...5Bn4',
  },
  {
    id: 'act-8',
    type: 'market_resolved',
    marketId: '10',
    marketQuestion: 'Will global temperatures exceed 1.5°C warming in 2025?',
    outcome: false,
    timestamp: new Date('2025-10-11T10:00:00'),
    signature: '8Ey0...Pt8z',
    status: 'confirmed',
    user: 'Market Creator',
  },
  {
    id: 'act-9',
    type: 'bet_placed',
    marketId: '4',
    marketQuestion: 'Will Argentina win Copa America 2025?',
    amount: 1.5,
    outcome: true,
    timestamp: new Date('2025-10-10T20:45:00'),
    signature: '1Fz1...Qu9a',
    status: 'confirmed',
    user: 'Gh8x...2Qw9',
  },
  {
    id: 'act-10',
    type: 'bet_placed',
    marketId: '1',
    marketQuestion: 'Will Bitcoin reach $100,000 by end of 2025?',
    amount: 5.0,
    outcome: false,
    timestamp: new Date('2025-10-09T15:10:00'),
    signature: '3Gz2...Rv0b',
    status: 'confirmed',
    user: 'Cd2y...4Ks8',
  },
]

// Helper functions
export function getRecentActivity(limit: number = 10): MockActivity[] {
  return MOCK_ACTIVITY.slice(0, limit)
}

export function getUserActivity(filterUser: 'You'): MockActivity[] {
  return MOCK_ACTIVITY.filter((a) => a.user === filterUser)
}

export function getActivityByType(type: MockActivity['type']): MockActivity[] {
  return MOCK_ACTIVITY.filter((a) => a.type === type)
}

export function getActivityByMarket(marketId: string): MockActivity[] {
  return MOCK_ACTIVITY.filter((a) => a.marketId === marketId)
}

export function formatActivityType(type: MockActivity['type']): string {
  const labels = {
    bet_placed: 'Bet Placed',
    market_created: 'Market Created',
    winnings_claimed: 'Winnings Claimed',
    market_resolved: 'Market Resolved',
  }
  return labels[type]
}

export function getActivityIcon(type: MockActivity['type']): string {
  const icons = {
    bet_placed: '💰',
    market_created: '✨',
    winnings_claimed: '🎉',
    market_resolved: '✅',
  }
  return icons[type]
}

export function getExplorerUrl(
  signature: string,
  cluster: 'devnet' | 'mainnet' = 'devnet'
): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
}


