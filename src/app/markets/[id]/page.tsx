'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  useMockPredictionMarket,
  formatSOL,
  formatPercentage,
  getTimeRemaining,
} from '@/hooks/useMockPredictionMarket'

export default function MarketDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const {
    getMarket,
    placeBet,
    balance,
    loading,
    getUserPosition,
    claimWinnings,
  } = useMockPredictionMarket()

  const market = getMarket(params.id)
  const userPosition = getUserPosition(params.id)

  const [betSide, setBetSide] = useState<'yes' | 'no'>('yes')
  const [betAmount, setBetAmount] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!market) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Mercado no encontrado
          </h1>
          <Link
            href="/markets"
            className="text-purple-300 hover:text-purple-200"
          >
            ← Volver a mercados
          </Link>
        </div>
      </div>
    )
  }

  const handlePlaceBet = async () => {
    setErrorMsg(null)
    const amount = parseFloat(betAmount)

    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Por favor ingresa una cantidad válida')
      return
    }

    if (amount > balance) {
      setErrorMsg('Balance insuficiente')
      return
    }

    const result = await placeBet(market.id, betSide === 'yes', amount)

    if (result.success) {
      setShowSuccess(true)
      setBetAmount('')
      setTimeout(() => setShowSuccess(false), 3000)
    } else {
      setErrorMsg(result.error || 'Error al colocar apuesta')
    }
  }

  const handleClaimWinnings = async () => {
    setErrorMsg(null)
    const result = await claimWinnings(market.id)

    if (result.success) {
      alert(`¡Ganaste ${formatSOL(result.winnings || 0)}!`)
      router.push('/markets')
    } else {
      setErrorMsg(result.error || 'Error al reclamar ganancias')
    }
  }

  const potentialReturn = () => {
    const amount = parseFloat(betAmount)
    if (isNaN(amount) || amount <= 0) return 0

    const price = betSide === 'yes' ? market.yesPrice : market.noPrice
    return amount / price
  }

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
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Market Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Status */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-white flex-1">
                  {market.question}
                </h1>
                {market.resolved ? (
                  <span className="rounded-full bg-gray-500 px-4 py-2 text-sm font-semibold text-white">
                    Resuelto
                  </span>
                ) : (
                  <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-lg">{market.description}</p>
            </div>

            {/* Current Odds */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 p-6">
                <p className="text-blue-300 text-sm mb-2">Probabilidad SÍ</p>
                <p className="text-5xl font-bold text-white mb-2">
                  {formatPercentage(market.yesPrice)}
                </p>
                <p className="text-gray-300 text-sm">
                  Pool: {formatSOL(market.totalYesAmount)}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 p-6">
                <p className="text-red-300 text-sm mb-2">Probabilidad NO</p>
                <p className="text-5xl font-bold text-white mb-2">
                  {formatPercentage(market.noPrice)}
                </p>
                <p className="text-gray-300 text-sm">
                  Pool: {formatSOL(market.totalNoAmount)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Estadísticas del Mercado
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Volumen Total</p>
                  <p className="text-white text-xl font-bold">
                    {formatSOL(market.volume)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Participantes</p>
                  <p className="text-white text-xl font-bold">
                    {market.participants}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tiempo Restante</p>
                  <p className="text-white text-xl font-bold">
                    {getTimeRemaining(market.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Creador</p>
                  <p className="text-white text-sm font-mono">
                    {market.creator.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>

            {/* User Position */}
            {userPosition && (
              <div className="rounded-2xl bg-purple-500/20 border border-purple-500/30 p-6">
                <h2 className="text-xl font-bold text-white mb-3">
                  Tu Posición
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">
                      Apostaste{' '}
                      <span className="font-bold text-white">
                        {formatSOL(userPosition.amount)}
                      </span>{' '}
                      en
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        userPosition.isYes ? 'text-blue-400' : 'text-red-400'
                      }`}
                    >
                      {userPosition.isYes ? 'SÍ' : 'NO'}
                    </p>
                  </div>
                  {market.resolved && (
                    <button
                      onClick={handleClaimWinnings}
                      disabled={
                        loading || market.outcome !== userPosition.isYes
                      }
                      className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {loading
                        ? 'Procesando...'
                        : market.outcome === userPosition.isYes
                        ? 'Reclamar Ganancias'
                        : 'Posición Perdedora'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Betting Panel */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-white mb-6">
                Hacer Apuesta
              </h2>

              {/* Success Message */}
              {showSuccess && (
                <div className="mb-4 rounded-lg bg-green-500/20 border border-green-500/50 p-4">
                  <p className="text-green-300 font-semibold">
                    ¡Apuesta colocada exitosamente! 🎉
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/50 p-4">
                  <p className="text-red-300 font-semibold">{errorMsg}</p>
                </div>
              )}

              {/* Bet Side Selector */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm">
                  Selecciona tu predicción
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBetSide('yes')}
                    className={`rounded-lg p-4 font-semibold transition ${
                      betSide === 'yes'
                        ? 'bg-blue-600 text-white border-2 border-blue-400'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border-2 border-transparent'
                    }`}
                  >
                    <div className="text-2xl mb-1">👍</div>
                    <div>SÍ</div>
                    <div className="text-sm">
                      {formatPercentage(market.yesPrice)}
                    </div>
                  </button>
                  <button
                    onClick={() => setBetSide('no')}
                    className={`rounded-lg p-4 font-semibold transition ${
                      betSide === 'no'
                        ? 'bg-red-600 text-white border-2 border-red-400'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border-2 border-transparent'
                    }`}
                  >
                    <div className="text-2xl mb-1">👎</div>
                    <div>NO</div>
                    <div className="text-sm">
                      {formatPercentage(market.noPrice)}
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm">
                  Cantidad a apostar (SOL)
                </label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.1"
                  min="0"
                  max={balance}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">
                    Balance: {formatSOL(balance)}
                  </span>
                  <button
                    onClick={() => setBetAmount(balance.toString())}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Potential Return */}
              {parseFloat(betAmount) > 0 && (
                <div className="mb-6 rounded-lg bg-purple-500/20 border border-purple-500/30 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Retorno potencial:</span>
                    <span className="text-xl font-bold text-white">
                      {formatSOL(potentialReturn())}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Multiplicador:{' '}
                    {(potentialReturn() / parseFloat(betAmount)).toFixed(2)}x
                  </div>
                </div>
              )}

              {/* Place Bet Button */}
              <button
                onClick={handlePlaceBet}
                disabled={
                  loading ||
                  market.resolved ||
                  !betAmount ||
                  parseFloat(betAmount) <= 0
                }
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-lg font-bold text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {loading
                  ? 'Procesando...'
                  : market.resolved
                  ? 'Mercado Cerrado'
                  : 'Colocar Apuesta'}
              </button>

              {!market.resolved && (
                <p className="mt-4 text-center text-xs text-gray-400">
                  Las transacciones son instantáneas en modo demo
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
