'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import WalletInfo from '@/components/wallet/WalletInfo'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  MOCK_MARKETS,
  getActiveMarkets,
  getResolvedMarkets,
  getMarketsByCategory,
  getMarketOdds,
  CATEGORIES,
  type MockMarket,
} from '@/lib/mock/markets'

export default function MarketsPage() {
  const { connected } = useWallet()
  const [markets, setMarkets] = useState<MockMarket[]>(MOCK_MARKETS)
  const [filteredMarkets, setFilteredMarkets] =
    useState<MockMarket[]>(MOCK_MARKETS)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('all')

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
    if (categoryFilter !== 'All') {
      filtered = getMarketsByCategory(categoryFilter)
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((m) => !m.resolved)
    } else if (statusFilter === 'resolved') {
      filtered = filtered.filter((m) => m.resolved)
    }

    setFilteredMarkets(filtered)
  }, [markets, searchQuery, categoryFilter, statusFilter])

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
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
                    DEMO MODE - Using Mock Data
                  </p>
                  <p className="text-yellow-200/70 text-sm">
                    Connect your wallet to interact with live markets on Devnet
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Prediction Markets
            </h1>
            <p className="text-gray-400">
              Browse and trade on prediction markets powered by Solana
            </p>
          </div>

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
                  {CATEGORIES.map((cat) => (
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
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                Showing {filteredMarkets.length} of {markets.length} markets
              </p>
              <Link
                href="/create-market"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all"
              >
                + Create Market
              </Link>
            </div>
          </div>

          {/* Empty State */}
          {filteredMarkets.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Markets Found
              </h3>
              <p className="text-gray-400 mb-6">
                No markets match your filters. Try adjusting your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('All')
                  setStatusFilter('all')
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Markets Grid */}
          {filteredMarkets.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

// Market Card Component
function MarketCard({ market }: { market: MockMarket }) {
  const odds = getMarketOdds(market)
  const endDate = new Date(market.endTime)
  const isExpired = endDate < new Date() && !market.resolved

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded font-medium">
          {market.category}
        </span>
        <span
          className={`px-2 py-1 text-xs rounded font-medium ${
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
        <div className="text-4xl mb-3 text-center">{market.imageUrl}</div>
      )}

      {/* Question */}
      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
        {market.question}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {market.description}
      </p>

      {/* Odds */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="text-green-400 text-xs mb-1 font-semibold">YES</div>
          <div className="text-white font-bold text-xl">
            {odds.yesPercentage}%
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="text-red-400 text-xs mb-1 font-semibold">NO</div>
          <div className="text-white font-bold text-xl">
            {odds.noPercentage}%
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4 pb-4 border-b border-gray-800">
        <div>
          <span className="text-gray-500">Volume:</span>{' '}
          <span className="text-white font-medium">
            {odds.totalPool.toFixed(1)} SOL
          </span>
        </div>
        <div>
          <span className="text-gray-500">Ends:</span>{' '}
          <span className="text-white">
            {endDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <Link
        href={`/markets/${market.id}`}
        className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-center"
      >
        {market.resolved ? 'View Results' : 'Trade Now'}
      </Link>
    </div>
  )
}
