'use client'

import { useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import {
  MOCK_MARKETS,
  MOCK_USER_POSITIONS,
  getMockUserBalance,
  mockClaimWinnings,
  getMarketById,
  getMarketOdds,
  type MockPosition,
} from '@/lib/mock'

export default function PortfolioPage() {
  const [positions, setPositions] = useState<MockPosition[]>(
    MOCK_USER_POSITIONS
  )
  const [balance, setBalance] = useState(getMockUserBalance())
  const [claimingId, setClaimingId] = useState<string | null>(null)

  const handleClaimWinnings = async (positionId: string) => {
    setClaimingId(positionId)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success = await mockClaimWinnings(positionId)
    if (success) {
      setPositions(
        positions.map((p) =>
          p.id === positionId ? { ...p, claimedWinnings: true } : p
        )
      )
      setBalance(getMockUserBalance())
    }
    setClaimingId(null)
  }

  // Calculate stats
  const activePositions = positions.filter(
    (p) => !getMarketById(p.marketId)?.resolved
  )
  const resolvedPositions = positions.filter(
    (p) => getMarketById(p.marketId)?.resolved
  )

  const totalInvested = positions.reduce((sum, p) => sum + p.amount, 0)
  const totalValue = positions.reduce((sum, p) => {
    const market = getMarketById(p.marketId)
    if (!market) return sum
    if (market.resolved) {
      // If won, value is winnings; if lost, value is 0
      if (market.winningOutcome === p.isYes) {
        const winnings = calculateWinnings(p, market)
        return sum + winnings
      }
      return sum
    }
    // For active positions, estimate current value
    return sum + p.amount
  }, 0)

  const totalPnL = totalValue - totalInvested
  const totalPnLPercentage =
    totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Demo Banner */}
          <div className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-yellow-300 font-semibold">
                  DEMO MODE - Simulated Portfolio
                </p>
                <p className="text-yellow-200/70 text-sm">
                  These positions are for demonstration purposes
                </p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Portfolio</h1>
            <p className="text-gray-400">
              Track your positions and performance across all markets
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Current Balance</p>
              <p className="text-white font-bold text-3xl">
                {balance.toFixed(2)} SOL
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Total Invested</p>
              <p className="text-white font-bold text-3xl">
                {totalInvested.toFixed(2)} SOL
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Portfolio Value</p>
              <p className="text-white font-bold text-3xl">
                {totalValue.toFixed(2)} SOL
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Total P&L</p>
              <p
                className={`font-bold text-3xl ${
                  totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {totalPnL >= 0 ? '+' : ''}
                {totalPnL.toFixed(2)} SOL
              </p>
              <p
                className={`text-sm ${
                  totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {totalPnLPercentage >= 0 ? '+' : ''}
                {totalPnLPercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Active Positions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Active Positions ({activePositions.length})
            </h2>

            {activePositions.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Active Positions
                </h3>
                <p className="text-gray-400 mb-6">
                  You don't have any active positions. Start trading!
                </p>
                <Link
                  href="/markets"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Browse Markets
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activePositions.map((position) => (
                  <PositionCard
                    key={position.id}
                    position={position}
                    onClaim={handleClaimWinnings}
                    isClaiming={claimingId === position.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Resolved Positions */}
          {resolvedPositions.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Resolved Positions ({resolvedPositions.length})
              </h2>
              <div className="space-y-4">
                {resolvedPositions.map((position) => (
                  <PositionCard
                    key={position.id}
                    position={position}
                    onClaim={handleClaimWinnings}
                    isClaiming={claimingId === position.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

// Position Card Component
function PositionCard({
  position,
  onClaim,
  isClaiming,
}: {
  position: MockPosition
  onClaim: (id: string) => void
  isClaiming: boolean
}) {
  const market = getMarketById(position.marketId)
  if (!market) return null

  const odds = getMarketOdds(market)
  const isWinning =
    market.resolved && market.winningOutcome === position.isYes
  const isLosing = market.resolved && market.winningOutcome !== position.isYes

  const winnings = isWinning ? calculateWinnings(position, market) : 0
  const pnl = isWinning ? winnings - position.amount : isLosing ? -position.amount : 0
  const pnlPercentage = (pnl / position.amount) * 100

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded text-sm font-semibold ${
                position.isYes
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {position.isYes ? 'YES' : 'NO'}
            </span>
            {market.resolved && (
              <span
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  isWinning
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-gray-500/20 text-gray-300'
                }`}
              >
                {isWinning ? '✓ Won' : '✗ Lost'}
              </span>
            )}
            {!market.resolved && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm font-semibold">
                Active
              </span>
            )}
          </div>

          <Link
            href={`/markets/${market.id}`}
            className="text-white font-bold text-lg hover:text-purple-400 transition-colors"
          >
            {market.question}
          </Link>

          <p className="text-gray-400 text-sm mt-2">
            Placed on{' '}
            {new Date(position.placedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-gray-500 text-sm mb-1">Amount Bet</p>
          <p className="text-white font-bold">{position.amount.toFixed(2)} SOL</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-1">Current Odds</p>
          <p className="text-white font-bold">
            {position.isYes ? odds.yesPercentage : odds.noPercentage}%
          </p>
        </div>

        {market.resolved && (
          <>
            <div>
              <p className="text-gray-500 text-sm mb-1">Winnings</p>
              <p
                className={`font-bold ${
                  isWinning ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                {isWinning ? `${winnings.toFixed(2)} SOL` : '0 SOL'}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">P&L</p>
              <p
                className={`font-bold ${
                  pnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {pnl >= 0 ? '+' : ''}
                {pnl.toFixed(2)} SOL
              </p>
              <p
                className={`text-xs ${
                  pnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {pnlPercentage >= 0 ? '+' : ''}
                {pnlPercentage.toFixed(1)}%
              </p>
            </div>
          </>
        )}
      </div>

      {isWinning && !position.claimedWinnings && (
        <button
          onClick={() => onClaim(position.id)}
          disabled={isClaiming}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClaiming ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Claiming...
            </span>
          ) : (
            `Claim ${winnings.toFixed(2)} SOL`
          )}
        </button>
      )}

      {isWinning && position.claimedWinnings && (
        <div className="w-full py-3 bg-green-500/20 border border-green-500/30 text-green-300 font-semibold rounded-lg text-center">
          ✅ Winnings Claimed
        </div>
      )}
    </div>
  )
}

// Helper function to calculate winnings
function calculateWinnings(position: MockPosition, market: any): number {
  const totalPool = market.totalYesAmount + market.totalNoAmount
  const winningPool = position.isYes
    ? market.totalYesAmount
    : market.totalNoAmount

  if (winningPool === 0) return position.amount * 2

  const share = position.amount / winningPool
  return share * totalPool
}
