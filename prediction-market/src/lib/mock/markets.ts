// Mock data for prediction markets

export interface MockMarket {
  id: string
  question: string
  description: string
  category: string
  creator: string
  createdAt: Date
  endTime: Date
  totalYesAmount: number // in SOL
  totalNoAmount: number // in SOL
  resolved: boolean
  winningOutcome: boolean | null
  imageUrl?: string
}

export const MOCK_MARKETS: MockMarket[] = [
  {
    id: '1',
    question: 'Will Bitcoin reach $100,000 by end of 2025?',
    description:
      'This market resolves YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange (Binance, Coinbase, Kraken) before December 31, 2025 23:59:59 UTC. Price must be sustained for at least 1 hour.',
    category: 'Crypto',
    creator: 'Ab3x...9Zf2',
    createdAt: new Date('2025-01-15'),
    endTime: new Date('2025-12-31'),
    totalYesAmount: 127.5,
    totalNoAmount: 82.3,
    resolved: false,
    winningOutcome: null,
    imageUrl: '🪙',
  },
  {
    id: '2',
    question: 'Will Solana TVL exceed $10B in 2025?',
    description:
      'This market resolves YES if Total Value Locked (TVL) on Solana blockchain exceeds $10 billion USD according to DeFiLlama before December 31, 2025.',
    category: 'Crypto',
    creator: 'Cd2y...4Ks8',
    createdAt: new Date('2025-02-01'),
    endTime: new Date('2025-12-31'),
    totalYesAmount: 45.2,
    totalNoAmount: 28.7,
    resolved: false,
    winningOutcome: null,
    imageUrl: '◎',
  },
  {
    id: '3',
    question: 'Will there be a US recession in 2025?',
    description:
      'This market resolves YES if the National Bureau of Economic Research (NBER) officially declares a recession that includes any part of 2025. Resolution based on NBER announcement.',
    category: 'Economics',
    creator: 'Ef4z...7Mn3',
    createdAt: new Date('2025-01-10'),
    endTime: new Date('2026-01-31'),
    totalYesAmount: 89.6,
    totalNoAmount: 156.4,
    resolved: false,
    winningOutcome: null,
    imageUrl: '📊',
  },
  {
    id: '4',
    question: 'Will Argentina win Copa America 2025?',
    description:
      'This market resolves YES if Argentina wins the Copa America 2025 tournament final match. Resolution based on official CONMEBOL announcement.',
    category: 'Sports',
    creator: 'Gh8x...2Qw9',
    createdAt: new Date('2025-03-01'),
    endTime: new Date('2025-07-20'),
    totalYesAmount: 34.8,
    totalNoAmount: 41.2,
    resolved: false,
    winningOutcome: null,
    imageUrl: '⚽',
  },
  {
    id: '5',
    question: 'Will OpenAI release GPT-5 in 2025?',
    description:
      'This market resolves YES if OpenAI officially announces and releases GPT-5 (or equivalent next-generation model) to the public before December 31, 2025.',
    category: 'Technology',
    creator: 'Ij6v...5Bn4',
    createdAt: new Date('2025-01-20'),
    endTime: new Date('2025-12-31'),
    totalYesAmount: 67.3,
    totalNoAmount: 52.1,
    resolved: false,
    winningOutcome: null,
    imageUrl: '🤖',
  },
  {
    id: '6',
    question: 'Will Ethereum switch to Proof of Stake 2.0 in 2025?',
    description:
      'RESOLVED: This market has been resolved. Ethereum successfully completed the merge to Proof of Stake.',
    category: 'Crypto',
    creator: 'Kl3m...8Rp2',
    createdAt: new Date('2024-06-01'),
    endTime: new Date('2024-12-31'),
    totalYesAmount: 215.6,
    totalNoAmount: 84.3,
    resolved: true,
    winningOutcome: true,
    imageUrl: '⟠',
  },
  {
    id: '7',
    question: 'Will SpaceX reach Mars before 2026?',
    description:
      'This market resolves YES if SpaceX successfully lands a spacecraft on Mars before January 1, 2026. Unmanned missions count.',
    category: 'Technology',
    creator: 'Mn9p...3Vs7',
    createdAt: new Date('2025-02-15'),
    endTime: new Date('2025-12-31'),
    totalYesAmount: 23.4,
    totalNoAmount: 67.8,
    resolved: false,
    winningOutcome: null,
    imageUrl: '🚀',
  },
  {
    id: '8',
    question: 'Will Apple release AR glasses in 2025?',
    description:
      'This market resolves YES if Apple officially announces and begins shipping augmented reality glasses (not VR headset) to consumers in 2025.',
    category: 'Technology',
    creator: 'Op2q...6Xt1',
    createdAt: new Date('2025-01-05'),
    endTime: new Date('2025-12-31'),
    totalYesAmount: 12.7,
    totalNoAmount: 45.3,
    resolved: false,
    winningOutcome: null,
    imageUrl: '🥽',
  },
  {
    id: '9',
    question: 'Will any country ban TikTok nationwide in 2025?',
    description:
      'This market resolves YES if any country with population >50M implements a complete nationwide ban on TikTok before December 31, 2025.',
    category: 'Politics',
    creator: 'Qr8s...4Zu5',
    createdAt: new Date('2025-03-10'),
    endTime: new Date('2025-12-31'),
    totalYesAmount: 56.2,
    totalNoAmount: 38.9,
    resolved: false,
    winningOutcome: null,
    imageUrl: '🎵',
  },
  {
    id: '10',
    question: 'Will global temperatures exceed 1.5°C warming in 2025?',
    description:
      'RESOLVED: Market closed. Global temperatures did not exceed 1.5°C sustained warming threshold.',
    category: 'Climate',
    creator: 'St5u...9Av6',
    createdAt: new Date('2024-01-01'),
    endTime: new Date('2024-12-31'),
    totalYesAmount: 78.9,
    totalNoAmount: 134.5,
    resolved: true,
    winningOutcome: false,
    imageUrl: '🌡️',
  },
]

// Helper functions
export function getMarketById(id: string): MockMarket | undefined {
  return MOCK_MARKETS.find((m) => m.id === id)
}

export function getActiveMarkets(): MockMarket[] {
  return MOCK_MARKETS.filter((m) => !m.resolved)
}

export function getResolvedMarkets(): MockMarket[] {
  return MOCK_MARKETS.filter((m) => m.resolved)
}

export function getMarketsByCategory(category: string): MockMarket[] {
  return MOCK_MARKETS.filter((m) => m.category === category)
}

export function getMarketOdds(market: MockMarket): {
  yesPercentage: number
  noPercentage: number
  totalPool: number
} {
  const totalPool = market.totalYesAmount + market.totalNoAmount
  const yesPercentage =
    totalPool === 0 ? 50 : (market.totalYesAmount / totalPool) * 100
  const noPercentage = 100 - yesPercentage

  return {
    yesPercentage: Math.round(yesPercentage),
    noPercentage: Math.round(noPercentage),
    totalPool,
  }
}

export const CATEGORIES = [
  'All',
  'Crypto',
  'Technology',
  'Sports',
  'Politics',
  'Economics',
  'Climate',
]


