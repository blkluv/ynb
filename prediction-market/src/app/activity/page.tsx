'use client'

import Layout from '@/components/layout/Layout'
import {
  MOCK_ACTIVITY,
  getRecentActivity,
  formatActivityType,
  getActivityIcon,
  getExplorerUrl,
} from '@/lib/mock'
import { ExternalLink, Clock } from 'lucide-react'
import { useSolanaWallet } from '@/hooks/useSolanaWallet'

export default function ActivityPage() {
  const { connected } = useSolanaWallet()
  const recentActivity = getRecentActivity(20)

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Activity Feed</h1>

          {/* Activity List */}
          {!connected ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-400 mb-6">
                Connect your wallet to see market activity and your transaction
                history
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center text-2xl">
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold">
                            {formatActivityType(activity.type)}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-1">
                            {activity.marketQuestion}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            activity.status === 'confirmed'
                              ? 'bg-green-500/20 text-green-400'
                              : activity.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-4 text-sm mb-3">
                        {activity.amount && (
                          <span className="text-white font-medium">
                            {activity.amount.toFixed(2)} SOL
                          </span>
                        )}
                        {activity.outcome !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded ${
                              activity.outcome
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {activity.outcome ? 'YES' : 'NO'}
                          </span>
                        )}
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(activity.timestamp)}
                        </span>
                        {activity.user && (
                          <span className="text-gray-400">{activity.user}</span>
                        )}
                      </div>

                      {/* Transaction Link */}
                      <a
                        href={getExplorerUrl(activity.signature)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                      >
                        <span className="font-mono">{activity.signature}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Demo Banner */}
          {connected && (
            <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📊</div>
                <div>
                  <h3 className="text-white font-bold mb-2">Demo Activity</h3>
                  <p className="text-gray-400 text-sm">
                    This is simulated activity data. Once the smart contract is
                    deployed, you&apos;ll see real on-chain transactions here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}
