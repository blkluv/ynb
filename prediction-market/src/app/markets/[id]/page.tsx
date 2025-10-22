'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import WalletInfo from '@/components/wallet/WalletInfo'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  getMarketById,
  getMarketOdds,
  type MockMarket,
} from '@/lib/mock/markets'
import Link from 'next/link'

export default function MarketDetailPage() {
  const { connected } = useWallet()
  const params = useParams()
  const router = useRouter()
  const marketId = params.id as string

  const market = getMarketById(marketId)

  const [betAmount, setBetAmount] = useState<string>('1.0')
  const [selectedOutcome, setSelectedOutcome] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!market) {
    return (
      <Layout>
        <div className="min-h-screen bg-black py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Market Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              The market you're looking for doesn't exist.
            </p>
            <Link
              href="/markets"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              ← Back to Markets
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const odds = getMarketOdds(market)
  const endDate = new Date(market.endTime)
  const isExpired = endDate < new Date() && !market.resolved

  const handlePlaceBet = async () => {
    if (selectedOutcome === null) {
      alert('Please select YES or NO')
      return
    }

    const amount = parseFloat(betAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setIsSubmitting(true)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSuccess(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setSuccess(false)
      setBetAmount('1.0')
      setSelectedOutcome(null)
    }, 3000)
  }

  const calculatePotentialWinnings = () => {
    const amount = parseFloat(betAmount)
    if (isNaN(amount) || amount <= 0 || selectedOutcome === null) return 0

    const currentOdds = selectedOutcome ? odds.yesPercentage : odds.noPercentage
    const multiplier = 100 / currentOdds
    return amount * multiplier
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            href="/markets"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            ← Back to Markets
          </Link>

          {/* Wallet Info or Demo Banner */}
          {connected ? (
            <div className="mb-6">
              <WalletInfo />
            </div>
          ) : (
            <div className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-yellow-300 font-semibold">
                    DEMO MODE - Simulated Transaction
                  </p>
                  <p className="text-yellow-200/70 text-sm">
                    Connect your wallet to place real bets on Devnet
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Market Info */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded font-medium">
                    {market.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded font-medium ${
                      market.resolved
                        ? 'bg-blue-500/20 text-blue-300'
                        : isExpired
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {market.resolved
                      ? '✓ Resolved'
                      : isExpired
                      ? '⏰ Expired'
                      : '🟢 Active'}
                  </span>
                </div>

                {/* Emoji Icon */}
                {market.imageUrl && (
                  <div className="text-6xl mb-4 text-center">
                    {market.imageUrl}
                  </div>
                )}

                {/* Question */}
                <h1 className="text-3xl font-bold text-white mb-4">
                  {market.question}
                </h1>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-6">
                  {market.description}
                </p>

                {/* Market Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-800">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Total Volume</p>
                    <p className="text-white font-bold text-xl">
                      {odds.totalPool.toFixed(1)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">YES Pool</p>
                    <p className="text-green-400 font-bold text-xl">
                      {market.totalYesAmount.toFixed(1)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">NO Pool</p>
                    <p className="text-red-400 font-bold text-xl">
                      {market.totalNoAmount.toFixed(1)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Ends On</p>
                    <p className="text-white font-bold text-lg">
                      {endDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Odds */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Current Odds
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6 text-center">
                    <div className="text-green-400 text-sm font-semibold mb-2">
                      YES
                    </div>
                    <div className="text-white font-bold text-4xl mb-2">
                      {odds.yesPercentage}%
                    </div>
                    <div className="text-gray-400 text-sm">
                      {market.totalYesAmount.toFixed(1)} SOL staked
                    </div>
                  </div>
                  <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6 text-center">
                    <div className="text-red-400 text-sm font-semibold mb-2">
                      NO
                    </div>
                    <div className="text-white font-bold text-4xl mb-2">
                      {odds.noPercentage}%
                    </div>
                    <div className="text-gray-400 text-sm">
                      {market.totalNoAmount.toFixed(1)} SOL staked
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Betting Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">
                  Place Your Bet
                </h2>

                {market.resolved ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">🏁</div>
                    <p className="text-gray-400 mb-4">Market Resolved</p>
                    <p className="text-white font-bold text-xl">
                      Winning Outcome:{' '}
                      <span
                        className={
                          market.winningOutcome
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      >
                        {market.winningOutcome ? 'YES' : 'NO'}
                      </span>
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Outcome Selection */}
                    <div className="space-y-3 mb-6">
                      <button
                        onClick={() => setSelectedOutcome(true)}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          selectedOutcome === true
                            ? 'bg-green-500/20 border-green-500 text-green-300'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-green-500/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">YES</span>
                          <span className="text-xl font-bold">
                            {odds.yesPercentage}%
                          </span>
                        </div>
                      </button>

                      <button
                        onClick={() => setSelectedOutcome(false)}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          selectedOutcome === false
                            ? 'bg-red-500/20 border-red-500 text-red-300'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-red-500/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">NO</span>
                          <span className="text-xl font-bold">
                            {odds.noPercentage}%
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-4">
                      <label className="block text-gray-400 text-sm mb-2">
                        Bet Amount (SOL)
                      </label>
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        min="0.1"
                        step="0.1"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Potential Winnings */}
                    {selectedOutcome !== null && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
                        <p className="text-gray-400 text-sm mb-1">
                          Potential Winnings
                        </p>
                        <p className="text-purple-300 font-bold text-2xl">
                          {calculatePotentialWinnings().toFixed(2)} SOL
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {(
                            (calculatePotentialWinnings() /
                              parseFloat(betAmount || '1') -
                              1) *
                            100
                          ).toFixed(0)}
                          % return on investment
                        </p>
                      </div>
                    )}

                    {/* Success Message */}
                    {success && (
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
                        <p className="text-green-300 font-semibold text-center">
                          ✅ Bet Placed Successfully!
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handlePlaceBet}
                      disabled={isSubmitting || selectedOutcome === null}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Processing...
                        </span>
                      ) : (
                        'Place Bet'
                      )}
                    </button>

                    <p className="text-gray-500 text-xs text-center mt-3">
                      Demo mode - no real transactions
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
