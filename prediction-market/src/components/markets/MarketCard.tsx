'use client'

import Link from 'next/link'
import { type MockMarket, getMarketOdds } from '@/lib/mock/markets'

export default function MarketCard({ market }: { market: MockMarket }) {
  const odds = getMarketOdds(market)
  const endDate = new Date(market.endTime)
  const isExpired = endDate < new Date() && !market.resolved

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all">
      {/* Header: Category + Status */}
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

      {/* Resolved market: Show winner */}
      {market.resolved ? (
        <div className="mb-4">
          <div className={`p-4 rounded-lg border-2 ${
            market.winningOutcome 
              ? 'bg-green-500/20 border-green-500/50' 
              : 'bg-red-500/20 border-red-500/50'
          }`}>
            <div className="text-center">
              <div className="text-2xl mb-2">
                {market.winningOutcome ? '✅' : '❌'}
              </div>
              <div className={`font-bold text-lg ${
                market.winningOutcome ? 'text-green-300' : 'text-red-300'
              }`}>
                {market.winningOutcome ? 'YES' : 'NO'} WON
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Market resolved
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Binary Market Display - YES/NO Odds */
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
      )}

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
        className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all text-center"
      >
        {market.resolved ? 'View Results' : 'Trade Now'}
      </Link>
    </div>
  )
}
