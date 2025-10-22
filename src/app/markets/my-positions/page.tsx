'use client'

import Link from 'next/link'
import {
  useMockPredictionMarket,
  formatSOL,
  formatPercentage,
  getTimeRemaining,
} from '@/hooks/useMockPredictionMarket'

export default function MyPositionsPage() {
  const {
    userPositions,
    getMarket,
    balance,
    getTotalPositionsValue,
    getProfitLoss,
  } = useMockPredictionMarket()

  const totalInvested = userPositions.reduce((sum, pos) => sum + pos.amount, 0)
  const totalValue = getTotalPositionsValue()
  const profitLoss = getProfitLoss()
  const profitLossPercentage =
    totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/markets"
              className="text-purple-300 hover:text-purple-200 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Volver a mercados</span>
            </Link>
            <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">
              <p className="text-sm text-gray-300">Tu Balance</p>
              <p className="text-xl font-bold text-white">
                {formatSOL(balance)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Mis Posiciones</h1>

        {/* Portfolio Summary */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6">
            <p className="text-gray-400 text-sm mb-2">Balance Disponible</p>
            <p className="text-3xl font-bold text-white">
              {formatSOL(balance)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6">
            <p className="text-gray-400 text-sm mb-2">Total Invertido</p>
            <p className="text-3xl font-bold text-white">
              {formatSOL(totalInvested)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6">
            <p className="text-gray-400 text-sm mb-2">Valor Actual</p>
            <p className="text-3xl font-bold text-white">
              {formatSOL(totalValue)}
            </p>
          </div>
          <div
            className={`rounded-2xl backdrop-blur-lg border p-6 ${
              profitLoss >= 0
                ? 'bg-green-500/20 border-green-500/30'
                : 'bg-red-500/20 border-red-500/30'
            }`}
          >
            <p className="text-gray-400 text-sm mb-2">Ganancias/Pérdidas</p>
            <p
              className={`text-3xl font-bold ${
                profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {profitLoss >= 0 ? '+' : ''}
              {formatSOL(profitLoss)}
            </p>
            <p
              className={`text-sm ${
                profitLoss >= 0 ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {profitLoss >= 0 ? '+' : ''}
              {profitLossPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Positions List */}
        {userPositions.length > 0 ? (
          <div className="space-y-4">
            {userPositions.map((position) => {
              const market = getMarket(position.marketId)
              if (!market) return null

              const currentPrice = position.isYes
                ? market.yesPrice
                : market.noPrice
              const currentValue = position.amount / currentPrice
              const positionPL = currentValue - position.amount
              const positionPLPercentage = (positionPL / position.amount) * 100

              return (
                <Link
                  key={position.marketId}
                  href={`/markets/${position.marketId}`}
                  className="block rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/30 transition-all p-6"
                >
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Market Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-bold text-white flex-1">
                          {market.question}
                        </h2>
                        {market.resolved ? (
                          <span className="rounded-full bg-gray-500 px-3 py-1 text-xs font-semibold text-white ml-4">
                            Resuelto
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white ml-4">
                            Activo
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold ${
                            position.isYes
                              ? 'bg-blue-500/30 text-blue-300'
                              : 'bg-red-500/30 text-red-300'
                          }`}
                        >
                          Tu apuesta: {position.isYes ? 'SÍ' : 'NO'}
                        </span>
                        <span>⏱️ {getTimeRemaining(market.endTime)}</span>
                        <span>👥 {market.participants} participantes</span>
                      </div>
                    </div>

                    {/* Position Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Invertido</p>
                        <p className="text-white font-bold">
                          {formatSOL(position.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          Valor Actual
                        </p>
                        <p className="text-white font-bold">
                          {formatSOL(currentValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">P&L</p>
                        <p
                          className={`font-bold ${
                            positionPL >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {positionPL >= 0 ? '+' : ''}
                          {formatSOL(positionPL)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">P&L %</p>
                        <p
                          className={`font-bold ${
                            positionPL >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {positionPL >= 0 ? '+' : ''}
                          {positionPLPercentage.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Market Odds */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <p className="text-blue-300 text-xs mb-1">Odds SÍ</p>
                        <p className="text-white font-bold text-lg">
                          {formatPercentage(market.yesPrice)}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-red-300 text-xs mb-1">Odds NO</p>
                        <p className="text-white font-bold text-lg">
                          {formatPercentage(market.noPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No tienes posiciones activas
            </h2>
            <p className="text-gray-300 mb-6">
              Comienza a apostar en los mercados de predicción para ver tus
              posiciones aquí
            </p>
            <Link
              href="/markets"
              className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-bold text-white hover:from-purple-700 hover:to-pink-700 transition"
            >
              Explorar Mercados
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
