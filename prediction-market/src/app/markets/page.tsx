'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Layout from '@/components/layout/Layout'
import { useSolanaWallet } from '@/hooks/useSolanaWallet'
import {
  fetchAllMarkets,
  calculateYesPrice,
  lamportsToSOL,
  isMarketExpired,
  type Market,
} from '@/lib/solana/contract'
import { useWallet } from '@solana/wallet-adapter-react'
import Link from 'next/link'

const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
)

export default function MarketsPage() {
  const { connected } = useSolanaWallet()
  const wallet = useWallet()

  const [markets, setMarkets] = useState<Market[]>([])
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Load markets
  useEffect(() => {
    if (connected && wallet.publicKey) {
      loadMarkets()
    }
  }, [connected, wallet.publicKey])

  // Apply filters
  useEffect(() => {
    let filtered = [...markets]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (m) => m.category.toLowerCase() === categoryFilter.toLowerCase()
      )
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(
        (m) => !m.resolved && !isMarketExpired(m.endTime)
      )
    } else if (statusFilter === 'expired') {
      filtered = filtered.filter(
        (m) => !m.resolved && isMarketExpired(m.endTime)
      )
    } else if (statusFilter === 'resolved') {
      filtered = filtered.filter((m) => m.resolved)
    }

    setFilteredMarkets(filtered)
  }, [markets, searchQuery, categoryFilter, statusFilter])

  const loadMarkets = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const allMarkets = await fetchAllMarkets(wallet)
      setMarkets(allMarkets)
      setFilteredMarkets(allMarkets)
      console.log(`Loaded ${allMarkets.length} markets`)
    } catch (err: any) {
      console.error('Error loading markets:', err)
      setError(err.message || 'Failed to load markets')
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique categories
  const categories = Array.from(new Set(markets.map((m) => m.category)))

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Prediction Markets
            </h1>
            <p className="text-gray-400">
              Browse and trade on active prediction markets on Solana Devnet
            </p>
          </div>

          {/* Wallet Connection Required */}
          {!connected ? (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Wallet Required
              </h2>
              <p className="text-gray-400 mb-6">
                Connect your Solana wallet to browse prediction markets
              </p>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !text-white !shadow-lg hover:!shadow-purple-500/25 !rounded-lg !font-medium !transition-all !duration-200" />
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search markets..."
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Markets</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired (Pending)</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">
                    Showing {filteredMarkets.length} of {markets.length} markets
                  </p>
                  <button
                    onClick={loadMarkets}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Refreshing...' : '🔄 Refresh'}
                  </button>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <p className="text-red-300">❌ {error}</p>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin text-4xl mb-4">
                    ⏳
                  </div>
                  <p className="text-gray-400">
                    Loading markets from blockchain...
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredMarkets.length === 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Markets Found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {markets.length === 0
                      ? 'No markets have been created yet. Be the first to create one!'
                      : 'No markets match your filters. Try adjusting your search.'}
                  </p>
                  <Link
                    href="/create-market"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Create Market
                  </Link>
                </div>
              )}

              {/* Markets Grid */}
              {!isLoading && filteredMarkets.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMarkets.map((market) => (
                    <MarketCard
                      key={market.publicKey.toString()}
                      market={market}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

// Market Card Component
function MarketCard({ market }: { market: Market }) {
  const yesPrice = calculateYesPrice(
    market.totalYesAmount,
    market.totalNoAmount
  )
  const noPrice = 1 - yesPrice
  const totalVolume = lamportsToSOL(
    market.totalYesAmount.add(market.totalNoAmount)
  )
  const expired = isMarketExpired(market.endTime)
  const endDate = new Date(market.endTime.toNumber() * 1000)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
          {market.category}
        </span>
        <span
          className={`px-2 py-1 text-xs rounded ${
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
      </div>

      {/* Question */}
      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
        {market.question}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {market.description}
      </p>

      {/* Odds */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="text-green-400 text-xs mb-1">YES</div>
          <div className="text-white font-bold text-xl">
            {(yesPrice * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="text-red-400 text-xs mb-1">NO</div>
          <div className="text-white font-bold text-xl">
            {(noPrice * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4 pb-4 border-b border-gray-800">
        <div>
          <span className="text-gray-500">Volume:</span>{' '}
          {totalVolume.toFixed(2)} SOL
        </div>
        <div>
          <span className="text-gray-500">Ends:</span>{' '}
          {endDate.toLocaleDateString()}
        </div>
      </div>

      {/* Actions */}
      <Link
        href={`/markets/${market.publicKey.toString()}`}
        className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-center"
      >
        {market.resolved ? 'View Results' : 'Trade Now'}
      </Link>
    </div>
  )
}
