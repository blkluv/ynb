/**
 * PrismaFi - Betting Interface Component
 *
 * Integrated with usePredictionMarket hook for real blockchain transactions
 */

import { useState, useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { usePredictionMarket } from '@/hooks/usePredictionMarket'
import toast from 'react-hot-toast'

interface BettingInterfaceProps {
  marketId: string
  marketQuestion: string
  totalYes: number
  totalNo: number
  isResolved: boolean
  endTime: number
}

export function BettingInterface({
  marketId,
  marketQuestion,
  totalYes,
  totalNo,
  isResolved,
  endTime,
}: BettingInterfaceProps) {
  const { connected, publicKey, placeBet, isPlacingBet, getUserPosition } =
    usePredictionMarket()

  const [outcome, setOutcome] = useState<boolean>(true) // true = YES
  const [amount, setAmount] = useState<string>('1.0')
  const [userPosition, setUserPosition] = useState<any>(null)

  // Calculate odds
  const total = totalYes + totalNo
  const yesOdds = total > 0 ? ((totalYes / total) * 100).toFixed(1) : '50.0'
  const noOdds = total > 0 ? ((totalNo / total) * 100).toFixed(1) : '50.0'

  // Calculate potential return
  const betAmount = parseFloat(amount) || 0
  const newTotal = total + betAmount * 1e9 // Convert SOL to lamports
  const newOutcomeTotal = outcome
    ? totalYes + betAmount * 1e9
    : totalNo + betAmount * 1e9

  const potentialReturn =
    newTotal > 0
      ? ((betAmount * newTotal) / newOutcomeTotal).toFixed(4)
      : '0.0000'

  // Load user position
  useEffect(() => {
    const loadPosition = async () => {
      if (connected && publicKey) {
        try {
          const position = await getUserPosition(new PublicKey(marketId))
          setUserPosition(position)
        } catch (error) {
          console.log('No position yet')
        }
      }
    }

    loadPosition()
  }, [connected, publicKey, marketId, getUserPosition])

  // Check if market is expired
  const isExpired = Date.now() / 1000 > endTime

  // Handle bet submission
  const handlePlaceBet = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (isResolved) {
      toast.error('Market is already resolved')
      return
    }

    if (isExpired) {
      toast.error('Market has expired')
      return
    }

    const betAmountNum = parseFloat(amount)
    if (isNaN(betAmountNum) || betAmountNum <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (betAmountNum < 0.01) {
      toast.error('Minimum bet is 0.01 SOL')
      return
    }

    const signature = await placeBet({
      marketPubkey: new PublicKey(marketId),
      outcome,
      amount: betAmountNum,
    })

    if (signature) {
      // Refresh position
      setTimeout(async () => {
        const newPosition = await getUserPosition(new PublicKey(marketId))
        setUserPosition(newPosition)
      }, 2000)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Place Your Bet</h3>
        <p className="text-sm text-gray-600">{marketQuestion}</p>
      </div>

      {/* Current Odds */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-2">Current Odds</div>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{yesOdds}%</div>
            <div className="text-xs text-gray-500">YES</div>
          </div>
          <div className="text-gray-400 text-2xl">|</div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{noOdds}%</div>
            <div className="text-xs text-gray-500">NO</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Total Pool: {(total / 1e9).toFixed(4)} SOL
        </div>
      </div>

      {/* User's Current Position */}
      {userPosition && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-1">
            Your Current Position
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700">
              {userPosition.outcome ? 'YES' : 'NO'}
            </span>
            <span className="text-sm font-bold text-blue-900">
              {(userPosition.amount.toNumber() / 1e9).toFixed(4)} SOL
            </span>
          </div>
        </div>
      )}

      {/* Outcome Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Outcome
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOutcome(true)}
            disabled={isResolved || isExpired}
            className={`
              py-4 px-6 rounded-lg font-semibold text-lg transition-all
              ${
                outcome
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${(isResolved || isExpired) && 'opacity-50 cursor-not-allowed'}
            `}
          >
            YES
          </button>
          <button
            type="button"
            onClick={() => setOutcome(false)}
            disabled={isResolved || isExpired}
            className={`
              py-4 px-6 rounded-lg font-semibold text-lg transition-all
              ${
                !outcome
                  ? 'bg-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${(isResolved || isExpired) && 'opacity-50 cursor-not-allowed'}
            `}
          >
            NO
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bet Amount (SOL)
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isResolved || isExpired}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0.00"
            step="0.1"
            min="0.01"
          />
          <div className="absolute right-3 top-3 text-gray-500 font-medium">
            SOL
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-2 mt-2">
          {['0.5', '1.0', '2.0', '5.0'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              disabled={isResolved || isExpired}
              className="flex-1 py-1 px-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Potential Return */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Potential Return</span>
          <span className="text-lg font-bold text-gray-900">
            {potentialReturn} SOL
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">Potential Profit</span>
          <span
            className={`text-sm font-semibold ${
              parseFloat(potentialReturn) > betAmount
                ? 'text-green-600'
                : 'text-gray-600'
            }`}
          >
            +{(parseFloat(potentialReturn) - betAmount).toFixed(4)} SOL
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handlePlaceBet}
        disabled={!connected || isPlacingBet || isResolved || isExpired}
        className={`
          w-full py-4 px-6 rounded-lg font-bold text-lg transition-all
          ${
            !connected
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : isResolved || isExpired
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : outcome
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
          }
          ${isPlacingBet && 'opacity-75 cursor-wait'}
        `}
      >
        {!connected ? (
          'Connect Wallet to Bet'
        ) : isResolved ? (
          'Market Resolved'
        ) : isExpired ? (
          'Market Expired'
        ) : isPlacingBet ? (
          <>
            <span className="inline-block animate-spin mr-2">⌛</span>
            Processing...
          </>
        ) : (
          `Bet ${amount} SOL on ${outcome ? 'YES' : 'NO'}`
        )}
      </button>

      {/* Warnings */}
      {isExpired && !isResolved && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            ⚠️ This market has expired and is awaiting resolution.
          </p>
        </div>
      )}

      {!connected && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Connect your Phantom or Backpack wallet to start betting!
          </p>
        </div>
      )}
    </div>
  )
}


