/**
 * Mock Prediction Market Hook for Hackathon Demo
 * Simulates blockchain interactions with instant feedback
 */

import { useState, useEffect } from 'react'
import {
  MOCK_MARKETS,
  MOCK_USER_POSITIONS,
  mockPlaceBet,
  mockClaimWinnings,
  getMockUserPosition,
  getMockUserBalance,
  getMockMarkets,
  getMockMarket,
  type MockMarket,
  type MockPosition,
} from '@/lib/mock-data'

export function useMockPredictionMarket() {
  const [markets, setMarkets] = useState<MockMarket[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    setMarkets(getMockMarkets())
    setBalance(getMockUserBalance())
  }, [])

  /**
   * Place a bet on a market
   */
  const placeBet = async (marketId: string, isYes: boolean, amount: number) => {
    setLoading(true)
    setError(null)

    try {
      await mockPlaceBet(marketId, isYes, amount)

      // Update local state
      setMarkets(getMockMarkets())
      setBalance(getMockUserBalance())

      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Failed to place bet')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Claim winnings from a resolved market
   */
  const claimWinnings = async (marketId: string) => {
    setLoading(true)
    setError(null)

    try {
      const winnings = await mockClaimWinnings(marketId)

      // Update local state
      setMarkets(getMockMarkets())
      setBalance(getMockUserBalance())

      return { success: true, winnings }
    } catch (err: any) {
      setError(err.message || 'Failed to claim winnings')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get user's position in a market
   */
  const getUserPosition = (marketId: string): MockPosition | null => {
    return getMockUserPosition(marketId)
  }

  /**
   * Get a specific market
   */
  const getMarket = (marketId: string): MockMarket | null => {
    return getMockMarket(marketId)
  }

  /**
   * Get user's total positions value
   */
  const getTotalPositionsValue = (): number => {
    return MOCK_USER_POSITIONS.reduce((total, pos) => {
      const market = getMockMarket(pos.marketId)
      if (!market) return total

      // Calculate current value based on market prices
      const currentPrice = pos.isYes ? market.yesPrice : market.noPrice
      return total + pos.amount / currentPrice
    }, 0)
  }

  /**
   * Get user's P&L (Profit & Loss)
   */
  const getProfitLoss = (): number => {
    const invested = MOCK_USER_POSITIONS.reduce(
      (total, pos) => total + pos.amount,
      0
    )
    const currentValue = getTotalPositionsValue()
    return currentValue - invested
  }

  return {
    // State
    markets,
    balance,
    loading,
    error,
    userPositions: MOCK_USER_POSITIONS,

    // Actions
    placeBet,
    claimWinnings,
    getUserPosition,
    getMarket,
    getTotalPositionsValue,
    getProfitLoss,

    // Utils
    isConnected: true, // Always "connected" in mock mode
    isMockMode: true,
  }
}

/**
 * Format SOL amount with proper decimals
 */
export function formatSOL(amount: number): string {
  return amount.toFixed(4) + ' SOL'
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return (value * 100).toFixed(1) + '%'
}

/**
 * Calculate time remaining
 */
export function getTimeRemaining(endTime: number): string {
  const now = Date.now() / 1000
  const remaining = endTime - now

  if (remaining <= 0) return 'Finalizado'

  const days = Math.floor(remaining / 86400)
  const hours = Math.floor((remaining % 86400) / 3600)

  if (days > 0) {
    return `${days} día${days > 1 ? 's' : ''} ${hours}h`
  }
  return `${hours} hora${hours > 1 ? 's' : ''}`
}
