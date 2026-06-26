'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  useMockPredictionMarket,
  formatSOL,
  formatPercentage,
  getTimeRemaining,
} from '@/hooks/useMockPredictionMarket'

export default function MarketsPage() {
  const { markets, balance, userPositions, isMockMode } =
    useMockPredictionMarket()
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active')

  const filteredMarkets = markets.filter((market) => {
    if (filter === 'active') return !market.resolved
    if (filter === 'resolved') return market.resolved
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src="https://i.imgur.com/L3hsSR9.png"
                  alt="PredicTok"
                  className="w-10 h-10"
                />
                <h1 className="text-3xl font-bold text-white">
                  <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                    PrismaFi
                  </span>
                </h1>
              </div>
              {isMockMode && (
                <span className="px-3 py-1 text-xs font-semibold text-yellow-300 border rounded-full bg-yellow-500/20 border-yellow-500/30">
                  DEMO MODE
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur">
                <p className="text-sm text-gray-300">Tu Balance</p>
                <p className="text-xl font-bold text-white">
                  {formatSOL(balance)}
                </p>
              </div>
              <Link
                href="/create-market"
                className="px-4 py-2 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
              >
                + Crear Mercado
              </Link>
              <Link
                href="/markets/my-positions"
                className="px-4 py-2 font-semibold text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Mis Posiciones ({userPositions.length})
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container px-4 py-6 mx-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 font-semibold transition ${
              filter === 'all'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Todos ({markets.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`rounded-lg px-4 py-2 font-semibold transition ${
              filter === 'active'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Activos ({markets.filter((m) => !m.resolved).length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`rounded-lg px-4 py-2 font-semibold transition ${
              filter === 'resolved'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Resueltos ({markets.filter((m) => m.resolved).length})
          </button>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="container px-4 pb-12 mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMarkets.map((market) => {
            const userPosition = userPositions.find(
              (p) => p.marketId === market.id
            )

            return (
              <Link
                key={market.id}
                href={`/markets/${market.id}`}
                className="relative overflow-hidden transition-all duration-300 border group rounded-2xl bg-white/5 backdrop-blur-lg border-white/10 hover:border-white/30 hover:scale-105"
              >
                {/* Status Badge */}
                <div className="absolute z-10 top-4 right-4">
                  {market.resolved ? (
                    <span className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-gray-500/80">
                      Resuelto
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-green-500/80">
                      Activo
                    </span>
                  )}
                </div>

                {/* User Position Badge */}
                {userPosition && (
                  <div className="absolute z-10 top-14 right-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        userPosition.isYes
                          ? 'bg-blue-500/80 text-white'
                          : 'bg-red-500/80 text-white'
                      }`}
                    >
                      Tu apuesta: {userPosition.isYes ? 'SÍ' : 'NO'}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Question */}
                  <h2 className="mb-3 text-xl font-bold text-white line-clamp-2 min-h-[3.5rem]">
                    {market.question}
                  </h2>

                  {/* Description */}
                  <p className="mb-4 text-sm text-gray-300 line-clamp-2 min-h-[2.5rem]">
                    {market.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 border rounded-lg bg-blue-500/20 border-blue-500/30">
                      <p className="mb-1 text-xs text-blue-300">SÍ</p>
                      <p className="text-2xl font-bold text-white">
                        {formatPercentage(market.yesPrice)}
                      </p>
                      <p className="mt-1 text-xs text-gray-300">
                        {formatSOL(market.totalYesAmount)}
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg bg-red-500/20 border-red-500/30">
                      <p className="mb-1 text-xs text-red-300">NO</p>
                      <p className="text-2xl font-bold text-white">
                        {formatPercentage(market.noPrice)}
                      </p>
                      <p className="mt-1 text-xs text-gray-300">
                        {formatSOL(market.totalNoAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <div className="flex items-center space-x-4">
                      <span>👥 {market.participants}</span>
                      <span>💰 {formatSOL(market.volume)}</span>
                    </div>
                    <span className="font-semibold text-white">
                      {getTimeRemaining(market.endTime)}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10" />
              </Link>
            )
          })}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-xl text-gray-300">
              No hay mercados en esta categoría
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
