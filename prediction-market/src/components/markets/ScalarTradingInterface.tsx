'use client'

import { useState } from 'react'
import { type MockMarket } from '@/lib/mock/markets'

interface ScalarTradingInterfaceProps {
  market: MockMarket
}

export default function ScalarTradingInterface({
  market,
}: ScalarTradingInterfaceProps) {
  const [predictionValue, setPredictionValue] = useState<string>('')
  const [betAmount, setBetAmount] = useState<string>('1.0')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePlacePrediction = async () => {
    const prediction = parseFloat(predictionValue)
    const amount = parseFloat(betAmount)

    if (isNaN(prediction)) {
      alert('Please enter a prediction value')
      return
    }

    if (
      market.minValue !== undefined &&
      market.maxValue !== undefined &&
      (prediction < market.minValue || prediction > market.maxValue)
    ) {
      alert(
        `Prediction must be between ${market.minValue} and ${market.maxValue}`
      )
      return
    }

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
      setPredictionValue('')
      setBetAmount('1.0')
    }, 3000)
  }

  const getSliderPosition = () => {
    if (
      !predictionValue ||
      market.minValue === undefined ||
      market.maxValue === undefined
    )
      return 50
    const prediction = parseFloat(predictionValue)
    return (
      ((prediction - market.minValue) / (market.maxValue - market.minValue)) *
      100
    )
  }

  return (
    <div className="space-y-6">
      {/* Range Display */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">
          Prediction Range
        </h3>
        <div className="bg-gray-800/50 rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">MINIMUM</p>
              <p className="text-white font-bold text-xl">
                {market.minValue}
                {market.unit}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs mb-1">MAXIMUM</p>
              <p className="text-white font-bold text-xl">
                {market.maxValue}
                {market.unit}
              </p>
            </div>
          </div>

          {/* Visual Range */}
          <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            {predictionValue && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                style={{ left: `${getSliderPosition()}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                  {parseFloat(predictionValue).toFixed(2)}
                  {market.unit}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Your Prediction */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Your Prediction
          <span className="text-gray-400 font-normal text-sm ml-2">
            (what number do you predict?)
          </span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={predictionValue}
            onChange={(e) => setPredictionValue(e.target.value)}
            placeholder={`Enter value between ${market.minValue} and ${market.maxValue}`}
            step="0.01"
            min={market.minValue}
            max={market.maxValue}
            className="w-full px-4 py-3 pr-16 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
            {market.unit}
          </span>
        </div>

        {predictionValue && (
          <p className="text-blue-300 text-xs mt-2">
            You're predicting: {parseFloat(predictionValue).toFixed(2)}
            {market.unit}
          </p>
        )}
      </div>

      {/* Bet Amount */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Stake Amount (SOL)
          <span className="text-gray-400 font-normal text-sm ml-2">
            (higher stake = higher payout if accurate)
          </span>
        </label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          step="0.1"
          min="0.1"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* How Payout Works */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-yellow-300 text-sm font-semibold mb-2">
          💡 How Scalar Payouts Work:
        </p>
        <ul className="space-y-1 text-yellow-200/80 text-xs">
          <li>• The closer your prediction to the real outcome, the more you earn</li>
          <li>• Exact match = Maximum payout (up to 10x your stake)</li>
          <li>• Error distance reduces payout proportionally</li>
          <li>• Too far? You may lose your stake</li>
        </ul>
      </div>

      {/* Potential Winnings Display */}
      {predictionValue && parseFloat(betAmount) > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-300 text-sm">Your Stake:</span>
            <span className="text-white font-bold">
              {parseFloat(betAmount).toFixed(2)} SOL
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-300 text-sm">Your Prediction:</span>
            <span className="text-white font-bold">
              {parseFloat(predictionValue).toFixed(2)}
              {market.unit}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-blue-500/30">
            <span className="text-blue-300 text-sm">Max Payout (if exact):</span>
            <span className="text-white font-bold">
              ~{(parseFloat(betAmount) * 10).toFixed(2)} SOL
            </span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-300 text-center font-semibold">
            ✓ Prediction placed successfully! (Demo mode)
          </p>
        </div>
      )}

      {/* Data Source Info */}
      {market.dataSource && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">OFFICIAL DATA SOURCE:</p>
          <p className="text-white text-sm font-semibold">
            {market.dataSource}
          </p>
        </div>
      )}

      {/* Place Prediction Button */}
      <button
        onClick={handlePlacePrediction}
        disabled={
          isSubmitting || !predictionValue || parseFloat(betAmount) <= 0
        }
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Placing Prediction...
          </span>
        ) : (
          'Submit Prediction'
        )}
      </button>
    </div>
  )
}

