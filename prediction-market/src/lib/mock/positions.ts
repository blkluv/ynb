// Mock user positions

export interface MockPosition {
  id: string
  marketId: string
  userId: string
  isYes: boolean
  amount: number
  placedAt: Date
  claimedWinnings: boolean
}

let mockBalance = 10.5 // SOL

export const MOCK_USER_POSITIONS: MockPosition[] = [
  {
    id: 'pos_1',
    marketId: '1', // Bitcoin $100K
    userId: 'user_1',
    isYes: true,
    amount: 2.5,
    placedAt: new Date('2025-01-20'),
    claimedWinnings: false,
  },
  {
    id: 'pos_2',
    marketId: '2', // Solana TVL
    userId: 'user_1',
    isYes: true,
    amount: 1.0,
    placedAt: new Date('2025-02-05'),
    claimedWinnings: false,
  },
  {
    id: 'pos_3',
    marketId: '3', // US Recession
    userId: 'user_1',
    isYes: false,
    amount: 3.0,
    placedAt: new Date('2025-01-15'),
    claimedWinnings: false,
  },
  {
    id: 'pos_4',
    marketId: '6', // Ethereum PoS (Resolved - Won)
    userId: 'user_1',
    isYes: true,
    amount: 1.5,
    placedAt: new Date('2024-08-10'),
    claimedWinnings: true,
  },
  {
    id: 'pos_5',
    marketId: '10', // Global warming (Resolved - Lost)
    userId: 'user_1',
    isYes: true,
    amount: 0.5,
    placedAt: new Date('2024-03-15'),
    claimedWinnings: false,
  },
]

export function getMockUserBalance(): number {
  return mockBalance
}

export function updateMockUserBalance(amount: number): void {
  mockBalance = amount
}

export async function mockClaimWinnings(positionId: string): Promise<boolean> {
  // Simulate claiming winnings
  const position = MOCK_USER_POSITIONS.find((p) => p.id === positionId)
  if (!position || position.claimedWinnings) {
    return false
  }

  // Simulate adding winnings to balance
  // This would be calculated based on market outcome
  const winnings = position.amount * 2 // Simplified: 2x return
  mockBalance += winnings
  position.claimedWinnings = true

  return true
}

export function getMockUserPosition(
  marketId: string,
  userId: string
): MockPosition | undefined {
  return MOCK_USER_POSITIONS.find(
    (p) => p.marketId === marketId && p.userId === userId
  )
}

export function getMockUserPositions(userId: string): MockPosition[] {
  return MOCK_USER_POSITIONS.filter((p) => p.userId === userId)
}
