'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Layout from '@/components/layout/Layout'
import { useSolanaWallet } from '@/hooks/useSolanaWallet'
import {
  fetchMarket,
  calculateYesPrice,
  lamportsToSOL,
  isMarketExpired,
  formatTimestamp,
  type Market,
} from '@/lib/solana/contract'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import Link from 'next/link'

const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
)

export default function MarketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { connected } = useSolanaWallet()
  const wallet = useWallet()

  const [market, setMarket] = useState<Market | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const marketId = params.id as string

  useEffect(() => {
    if (connected && wallet.publicKey && marketId) {
      loadMarket()
    }
  }, [connected, wallet.publicKey, marketId])

  const loadMarket = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const marketPubkey = new PublicKey(marketId)
      const marketData = await fetchMarket(wallet, marketPubkey)

      if (!marketData) {
        setError('Market not found')
        return
      }

      setMarket(marketData)
    } catch (err: any) {
      console.error('Error loading market:', err)
      setError(err.message || 'Failed to load market')
    } finally {
      setIsLoading(false)
    }
  }

  if (!connected) {
    return (
      <Layout>
        <div className="min-h-screen bg-black py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Wallet Required
              </h2>
              <p className="text-gray-400 mb-6">
                Connect your Solana wallet to view market details
              </p>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !text-white !shadow-lg hover:!shadow-purple-500/25 !rounded-lg !font-medium !transition-all !duration-200" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
            <p className="text-gray-400">Loading market details...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !market) {
    return (
      <Layout>
        <div className="min-h-screen bg-black py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {error || 'Market Not Found'}
              </h2>
              <Link
                href="/markets"
                className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
              >
                ← Back to Markets
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const yesPrice = calculateYesPrice(
    market.totalYesAmount,
    market.totalNoAmount
  )
  const noPrice = 1 - yesPrice
  const totalVolume = lamportsToSOL(
    market.totalYesAmount.add(market.totalNoAmount)
  )
  const expired = isMarketExpired(market.endTime)
  const isCreator = wallet.publicKey?.equals(market.authority)

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/markets"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            ← Back to Markets
          </Link>

          {/* Status Banner */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-lg">
              {market.category}
            </span>
            <span
              className={`px-3 py-1 text-sm rounded-lg ${
                market.resolved
                  ? 'bg-blue-500/20 text-blue-300'
                  : expired
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-green-500/20 text-green-300'
              }`}
            >
              {market.resolved
                ? '✓ Resolved'
                : expired
                ? '⏰ Expired'
                : '🟢 Active'}
            </span>
            {isCreator && (
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-lg">
                👑 Your Market
              </span>
            )}
          </div>

          {/* Question */}
          <h1 className="text-4xl font-bold text-white mb-4">
            {market.question}
          </h1>

          {/* Description */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-white font-semibold mb-2">Description</h2>
            <p className="text-gray-400">{market.description}</p>
          </div>

          {/* Market Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Total Volume</div>
              <div className="text-white text-2xl font-bold">
                {totalVolume.toFixed(2)} SOL
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Created</div>
              <div className="text-white text-lg">
                {formatTimestamp(market.createdAt)}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Ends</div>
              <div className="text-white text-lg">
                {formatTimestamp(market.endTime)}
              </div>
            </div>
          </div>

          {/* Trading Interface */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-white font-bold text-xl mb-4">Current Odds</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6">
                <div className="text-green-400 text-sm mb-2">YES</div>
                <div className="text-white font-bold text-4xl mb-2">
                  {(yesPrice * 100).toFixed(1)}%
                </div>
                <div className="text-gray-400 text-sm">
                  {lamportsToSOL(market.totalYesAmount).toFixed(2)} SOL
                </div>
              </div>

              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6">
                <div className="text-red-400 text-sm mb-2">NO</div>
                <div className="text-white font-bold text-4xl mb-2">
                  {(noPrice * 100).toFixed(1)}%
                </div>
                <div className="text-gray-400 text-sm">
                  {lamportsToSOL(market.totalNoAmount).toFixed(2)} SOL
                </div>
              </div>
            </div>

            {/* Place Bet Button */}
            {!market.resolved && !expired && (
              <button
                disabled
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white font-semibold rounded-lg cursor-not-allowed"
              >
                🚧 Place Bet (Coming Soon)
              </button>
            )}

            {/* Resolution Actions */}
            {!market.resolved && expired && isCreator && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-300 text-sm mb-3">
                  ⏰ This market has expired. As the creator, you can now
                  resolve it.
                </p>
                <button
                  disabled
                  className="w-full px-6 py-3 bg-blue-600/50 text-white font-semibold rounded-lg cursor-not-allowed"
                >
                  🚧 Resolve Market (Coming Soon)
                </button>
              </div>
            )}

            {/* Resolved Result */}
            {market.resolved && market.winningOutcome !== null && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center">
                <div className="text-6xl mb-3">
                  {market.winningOutcome ? '✅' : '❌'}
                </div>
                <div className="text-white text-2xl font-bold mb-2">
                  Market Resolved: {market.winningOutcome ? 'YES' : 'NO'}
                </div>
                <p className="text-gray-400 mb-4">
                  This market has been finalized. Winners can claim their
                  rewards.
                </p>
                <button
                  disabled
                  className="px-6 py-3 bg-green-600/50 text-white font-semibold rounded-lg cursor-not-allowed"
                >
                  🚧 Claim Winnings (Coming Soon)
                </button>
              </div>
            )}
          </div>

          {/* Market Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">
              Market Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Market Address</span>
                <a
                  href={`https://explorer.solana.com/address/${market.publicKey.toString()}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-mono text-sm"
                >
                  {market.publicKey.toString().slice(0, 8)}...
                  {market.publicKey.toString().slice(-8)} ↗
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Creator</span>
                <a
                  href={`https://explorer.solana.com/address/${market.authority.toString()}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-mono text-sm"
                >
                  {market.authority.toString().slice(0, 8)}...
                  {market.authority.toString().slice(-8)} ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}



