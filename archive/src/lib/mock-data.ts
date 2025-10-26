/**
 * Mock Data for Hackathon Demo
 * Simulates real Solana prediction markets
 */

export interface MockMarket {
  id: string
  question: string
  description: string
  endTime: number
  totalYesAmount: number
  totalNoAmount: number
  resolved: boolean
  outcome: boolean | null
  creator: string
  yesPrice: number
  noPrice: number
  volume: number
  participants: number
}

export interface MockPosition {
  marketId: string
  isYes: boolean
  amount: number
  timestamp: number
}

// Simulated markets
export const MOCK_MARKETS: MockMarket[] = [
  {
    id: 'market_btc_100k',
    question: '¿Bitcoin alcanzará $100,000 antes del 31 de diciembre de 2025?',
    description:
      'Este mercado se resolverá como SÍ si Bitcoin (BTC) alcanza o supera los $100,000 USD en cualquier exchange principal antes del 31 de diciembre de 2025 a las 23:59 UTC.',
    endTime: new Date('2025-12-31T23:59:59Z').getTime() / 1000,
    totalYesAmount: 15.5,
    totalNoAmount: 8.3,
    resolved: false,
    outcome: null,
    creator: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 23.8,
    participants: 142,
  },
  {
    id: 'market_eth_10k',
    question: '¿Ethereum superará los $10,000 en 2025?',
    description:
      'Este mercado se resolverá como SÍ si Ethereum (ETH) alcanza o supera los $10,000 USD en cualquier exchange principal durante el año 2025.',
    endTime: new Date('2025-12-31T23:59:59Z').getTime() / 1000,
    totalYesAmount: 22.1,
    totalNoAmount: 18.7,
    resolved: false,
    outcome: null,
    creator: '4vMsoUT2BWatFweudnQM1xedRLfJgJ4gfpbMiHyvQw28',
    yesPrice: 0.54,
    noPrice: 0.46,
    volume: 40.8,
    participants: 89,
  },
  {
    id: 'market_solana_adoption',
    question: '¿Solana tendrá más de 10 millones de usuarios activos en 2025?',
    description:
      'Este mercado se resolverá como SÍ si Solana alcanza 10 millones de wallets activas únicas (con al menos 1 transacción) antes del 31 de diciembre de 2025.',
    endTime: new Date('2025-12-31T23:59:59Z').getTime() / 1000,
    totalYesAmount: 31.2,
    totalNoAmount: 12.5,
    resolved: false,
    outcome: null,
    creator: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    yesPrice: 0.71,
    noPrice: 0.29,
    volume: 43.7,
    participants: 203,
  },
  {
    id: 'market_ai_agi',
    question: '¿Se anunciará AGI (Inteligencia Artificial General) en 2025?',
    description:
      'Este mercado se resolverá como SÍ si una empresa tecnológica reconocida (OpenAI, Google, Anthropic, etc.) anuncia oficialmente que ha logrado AGI durante 2025.',
    endTime: new Date('2025-12-31T23:59:59Z').getTime() / 1000,
    totalYesAmount: 5.8,
    totalNoAmount: 28.3,
    resolved: false,
    outcome: null,
    creator: '5vQKELhcZcP3k6aKdnGJW8xNJvPBhEK7XmqBUqvQhwXX',
    yesPrice: 0.17,
    noPrice: 0.83,
    volume: 34.1,
    participants: 167,
  },
  {
    id: 'market_defi_tvl',
    question: '¿DeFi en Solana superará $50B en TVL en 2025?',
    description:
      'Este mercado se resolverá como SÍ si el Total Value Locked (TVL) en protocolos DeFi de Solana supera los $50 mil millones según DeFiLlama antes del 31 de diciembre de 2025.',
    endTime: new Date('2025-12-31T23:59:59Z').getTime() / 1000,
    totalYesAmount: 18.9,
    totalNoAmount: 21.4,
    resolved: false,
    outcome: null,
    creator: '3wQKXzK8YqKXjbZXJ9sVqHbYvDxNJLJdPvqwBJxqYwXX',
    yesPrice: 0.47,
    noPrice: 0.53,
    volume: 40.3,
    participants: 156,
  },
  {
    id: 'market_world_cup_2026',
    question: '¿Argentina ganará el Mundial 2026?',
    description:
      'Este mercado se resolverá como SÍ si Argentina gana la Copa Mundial de la FIFA 2026.',
    endTime: new Date('2026-07-19T23:59:59Z').getTime() / 1000,
    totalYesAmount: 42.3,
    totalNoAmount: 35.8,
    resolved: false,
    outcome: null,
    creator: '8xKLmN2pQ9wVdR7fJhKbS5vTqWxYzPeUmNkLjHgFdWXX',
    yesPrice: 0.54,
    noPrice: 0.46,
    volume: 78.1,
    participants: 412,
  },
]

// Simulated user positions
export const MOCK_USER_POSITIONS: MockPosition[] = [
  {
    marketId: 'market_btc_100k',
    isYes: true,
    amount: 2.5,
    timestamp: Date.now() / 1000 - 86400 * 3, // 3 days ago
  },
  {
    marketId: 'market_solana_adoption',
    isYes: true,
    amount: 1.2,
    timestamp: Date.now() / 1000 - 86400 * 7, // 7 days ago
  },
]

// Simulated user balance
export let MOCK_USER_BALANCE = 10.5 // SOL

/**
 * Mock function to place a bet
 */
export async function mockPlaceBet(
  marketId: string,
  isYes: boolean,
  amount: number
): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check balance
  if (amount > MOCK_USER_BALANCE) {
    throw new Error('Insufficient balance')
  }

  // Deduct from balance
  MOCK_USER_BALANCE -= amount

  // Find market and update
  const market = MOCK_MARKETS.find((m) => m.id === marketId)
  if (market) {
    if (isYes) {
      market.totalYesAmount += amount
    } else {
      market.totalNoAmount += amount
    }
    market.participants += 1
    market.volume += amount

    // Recalculate prices
    const total = market.totalYesAmount + market.totalNoAmount
    market.yesPrice = market.totalYesAmount / total
    market.noPrice = market.totalNoAmount / total
  }

  // Add to user positions
  MOCK_USER_POSITIONS.push({
    marketId,
    isYes,
    amount,
    timestamp: Date.now() / 1000,
  })

  return true
}

/**
 * Mock function to claim winnings
 */
export async function mockClaimWinnings(marketId: string): Promise<number> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const market = MOCK_MARKETS.find((m) => m.id === marketId)
  const position = MOCK_USER_POSITIONS.find((p) => p.marketId === marketId)

  if (!market || !position) {
    throw new Error('Market or position not found')
  }

  if (!market.resolved) {
    throw new Error('Market not resolved yet')
  }

  // Check if user won
  const userWon = market.outcome === position.isYes
  if (!userWon) {
    throw new Error('This is a losing position')
  }

  // Calculate winnings
  const winningPool = position.isYes
    ? market.totalYesAmount
    : market.totalNoAmount
  const losingPool = position.isYes
    ? market.totalNoAmount
    : market.totalYesAmount
  const totalPool = winningPool + losingPool

  const winnings = (position.amount / winningPool) * totalPool

  // Add to balance
  MOCK_USER_BALANCE += winnings

  // Remove position
  const posIndex = MOCK_USER_POSITIONS.indexOf(position)
  MOCK_USER_POSITIONS.splice(posIndex, 1)

  return winnings
}

/**
 * Get user's positions for a specific market
 */
export function getMockUserPosition(marketId: string): MockPosition | null {
  return MOCK_USER_POSITIONS.find((p) => p.marketId === marketId) || null
}

/**
 * Get mock user balance
 */
export function getMockUserBalance(): number {
  return MOCK_USER_BALANCE
}

/**
 * Get all mock markets
 */
export function getMockMarkets(): MockMarket[] {
  return MOCK_MARKETS
}

/**
 * Get a single mock market by ID
 */
export function getMockMarket(id: string): MockMarket | null {
  return MOCK_MARKETS.find((m) => m.id === id) || null
}
