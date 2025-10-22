'use client'

import { useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { MOCK_ACTIVITY, getMarketById, type MockActivity } from '@/lib/mock'

type FilterType = 'all' | 'bet' | 'claim' | 'create'

export default function ActivityPage() {
  const [activities] = useState<MockActivity[]>(MOCK_ACTIVITY)
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredActivities =
    filter === 'all'
      ? activities
      : activities.filter((a) => a.type === filter)

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Demo Banner */}
          <div className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-yellow-300 font-semibold">
                  DEMO MODE - Simulated Activity
                </p>
                <p className="text-yellow-200/70 text-sm">
                  This activity history is for demonstration purposes
                </p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Activity History
            </h1>
            <p className="text-gray-400">
              View all your transactions and market interactions
            </p>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All ({activities.length})
              </button>
              <button
                onClick={() => setFilter('bet')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'bet'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Bets ({activities.filter((a) => a.type === 'bet').length})
              </button>
              <button
                onClick={() => setFilter('claim')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'claim'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Claims ({activities.filter((a) => a.type === 'claim').length})
              </button>
              <button
                onClick={() => setFilter('create')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'create'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Created (
                {activities.filter((a) => a.type === 'create').length})
              </button>
            </div>
          </div>

          {/* Activity List */}
          {filteredActivities.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <div className="text-5xl mb-4">📜</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Activity Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Your activity history will appear here
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
              {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

// Activity Card Component
function ActivityCard({ activity }: { activity: MockActivity }) {
  const market = getMarketById(activity.marketId)
  if (!market) return null

  const getActivityIcon = () => {
    switch (activity.type) {
      case 'bet':
        return '🎲'
      case 'claim':
        return '💰'
      case 'create':
        return '✨'
      default:
        return '📝'
    }
  }

  const getActivityColor = () => {
    switch (activity.type) {
      case 'bet':
        return 'border-purple-500/30 bg-purple-500/10'
      case 'claim':
        return 'border-green-500/30 bg-green-500/10'
      case 'create':
        return 'border-blue-500/30 bg-blue-500/10'
      default:
        return 'border-gray-500/30 bg-gray-500/10'
    }
  }

  const getStatusBadge = () => {
    switch (activity.status) {
      case 'success':
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded font-semibold">
            ✓ Success
          </span>
        )
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded font-semibold">
            ⏳ Pending
          </span>
        )
      case 'failed':
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded font-semibold">
            ✗ Failed
          </span>
        )
    }
  }

  return (
    <div
      className={`border rounded-xl p-6 transition-all hover:border-opacity-50 ${getActivityColor()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4 flex-1">
          <div className="text-4xl">{getActivityIcon()}</div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-white font-bold text-lg">
                {activity.type === 'bet' && 'Placed Bet'}
                {activity.type === 'claim' && 'Claimed Winnings'}
                {activity.type === 'create' && 'Created Market'}
              </h3>
              {getStatusBadge()}
            </div>

            <Link
              href={`/markets/${market.id}`}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              {market.question}
            </Link>

            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <span>
                {new Date(activity.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              {activity.type === 'bet' && activity.details && (
                <>
                  <span className="text-gray-600">•</span>
                  <span
                    className={
                      activity.details.outcome
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {activity.details.outcome ? 'YES' : 'NO'}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-white font-semibold">
                    {activity.details.amount} SOL
                  </span>
                </>
              )}

              {activity.type === 'claim' && activity.details && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-green-400 font-semibold">
                    +{activity.details.amount} SOL
                  </span>
                </>
              )}
            </div>

            {activity.txHash && (
              <div className="mt-3">
                <a
                  href={`https://explorer.solana.com/tx/${activity.txHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 transition-colors"
                >
                  View on Explorer ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
