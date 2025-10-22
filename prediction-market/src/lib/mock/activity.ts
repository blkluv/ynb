// Mock activity history

export interface MockActivity {
  id: string
  type: 'bet' | 'claim' | 'create'
  marketId: string
  userId: string
  timestamp: Date
  status: 'success' | 'pending' | 'failed'
  txHash?: string
  details?: {
    outcome?: boolean
    amount?: number
  }
}

export const MOCK_ACTIVITY: MockActivity[] = [
  {
    id: 'activity_1',
    type: 'bet',
    marketId: '1', // Bitcoin $100K
    userId: 'user_1',
    timestamp: new Date('2025-01-20T14:30:00Z'),
    status: 'success',
    txHash: '5xKz...7mQ9',
    details: {
      outcome: true, // YES
      amount: 2.5,
    },
  },
  {
    id: 'activity_2',
    type: 'bet',
    marketId: '2', // Solana TVL
    userId: 'user_1',
    timestamp: new Date('2025-02-05T10:15:00Z'),
    status: 'success',
    txHash: '3aRt...4nP2',
    details: {
      outcome: true, // YES
      amount: 1.0,
    },
  },
  {
    id: 'activity_3',
    type: 'bet',
    marketId: '3', // US Recession
    userId: 'user_1',
    timestamp: new Date('2025-01-15T16:45:00Z'),
    status: 'success',
    txHash: '7bQw...8kL5',
    details: {
      outcome: false, // NO
      amount: 3.0,
    },
  },
  {
    id: 'activity_4',
    type: 'claim',
    marketId: '6', // Ethereum PoS
    userId: 'user_1',
    timestamp: new Date('2024-12-15T09:20:00Z'),
    status: 'success',
    txHash: '2mVx...6pN3',
    details: {
      amount: 4.5, // Winnings
    },
  },
  {
    id: 'activity_5',
    type: 'bet',
    marketId: '10', // Global warming
    userId: 'user_1',
    timestamp: new Date('2024-03-15T11:00:00Z'),
    status: 'success',
    txHash: '9cYz...1qR7',
    details: {
      outcome: true, // YES
      amount: 0.5,
    },
  },
  {
    id: 'activity_6',
    type: 'bet',
    marketId: '4', // Argentina Copa America
    userId: 'user_1',
    timestamp: new Date('2025-03-01T13:30:00Z'),
    status: 'pending',
    details: {
      outcome: true, // YES
      amount: 1.2,
    },
  },
  {
    id: 'activity_7',
    type: 'bet',
    marketId: '5', // OpenAI GPT-5
    userId: 'user_1',
    timestamp: new Date('2025-01-25T15:45:00Z'),
    status: 'success',
    txHash: '4dHz...5tM8',
    details: {
      outcome: false, // NO
      amount: 0.8,
    },
  },
]

export function getMockActivity(userId: string): MockActivity[] {
  return MOCK_ACTIVITY.filter((a) => a.userId === userId).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )
}

export function getMockActivityByMarket(marketId: string): MockActivity[] {
  return MOCK_ACTIVITY.filter((a) => a.marketId === marketId).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )
}
