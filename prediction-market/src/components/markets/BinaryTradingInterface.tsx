'use client'

import { useState } from 'react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { placeBetDirect } from '@/lib/program/direct'
import { type MockMarket, getMarketOdds } from '@/lib/mock/markets'

interface BinaryTradingInterfaceProps {
  market: MockMarket
  onBetPlaced?: () => void
}

export default function BinaryTradingInterface({
  market,
  onBetPlaced,
}: BinaryTradingInterfaceProps) {
  const wallet = useAnchorWallet()
  const [betAmount, setBetAmount] = useState<string>('0.1')
  const [selectedOutcome, setSelectedOutcome] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txSignature, setTxSignature] = useState<string | null>(null)

  const odds = getMarketOdds(market)

  const handlePlaceBet = async () => {
    if (selectedOutcome === null) {
      alert('Please select YES or NO')
      return
    }

    const amount = parseFloat(betAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (amount < 0.01) {
      alert('Minimum bet is 0.01 SOL')
      return
    }

    if (!wallet) {
      alert('⚠️ Please connect your wallet first')
      return
    }

    setIsSubmitting(true)
    setSuccess(false)
    setTxSignature(null)

    try {
      const marketPubkey = new PublicKey(market.id)

      console.log('Placing bet...')
      console.log('Market:', market.id)
      console.log('Amount:', amount, 'SOL')
      console.log('Outcome:', selectedOutcome ? 'YES' : 'NO')

      const signature = await placeBetDirect(
        wallet,
        marketPubkey,
        amount,
        selectedOutcome
      )

      console.log('✅ Bet placed! Transaction:', signature)

      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`

      setTxSignature(signature)
      setSuccess(true)

      alert(
        `✅ Bet placed successfully!\n\n` +
        `Amount: ${amount} SOL on ${selectedOutcome ? 'YES' : 'NO'}\n` +
        `Transaction: ${signature.slice(0, 8)}...\n\n` +
        `View on Explorer: ${explorerUrl}`
      )

      // Reset form after success
      setTimeout(() => {
        setSuccess(false)
        setBetAmount('0.1')
        setSelectedOutcome(null)
        setTxSignature(null)
        
        // Callback to refresh market data
        if (onBetPlaced) {
          onBetPlaced()
        }
      }, 3000)

    } catch (error: any) {
      console.error('Error placing bet:', error)

      let errorMessage = 'Failed to place bet. Please try again.'

      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction cancelled by user.'
      } else if (error.message?.includes('Insufficient funds')) {
        errorMessage = 'Insufficient SOL balance. Please fund your wallet.'
      } else if (error.message?.includes('MarketExpired')) {
        errorMessage = 'This market has expired.'
      } else if (error.message?.includes('MarketResolved')) {
        errorMessage = 'This market has already been resolved.'
      } else if (error.message?.includes('BetTooSmall')) {
        errorMessage = 'Bet amount too small. Minimum is 0.01 SOL.'
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }

      alert(`❌ ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculatePotentialWinnings = () => {
    const amount = parseFloat(betAmount)
    if (isNaN(amount) || amount <= 0 || selectedOutcome === null) return 0

    const currentOdds =
      selectedOutcome ? odds.yesPercentage : odds.noPercentage
    const multiplier = 100 / currentOdds
    return amount * multiplier
  }

  return (
    <div className="space-y-6">
      {/* Current Odds Display */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Current Odds</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedOutcome(true)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedOutcome === true
                ? 'border-green-500 bg-green-500/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-green-500/50'
            }`}
          >
            <div className="text-green-400 text-sm font-semibold mb-2">
              YES
            </div>
            <div className="text-white font-bold text-3xl mb-2">
              {odds.yesPercentage}%
            </div>
            <div className="text-gray-400 text-xs">
              {odds.yesPercentage}¢ per share
            </div>
          </button>

          <button
            onClick={() => setSelectedOutcome(false)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedOutcome === false
                ? 'border-red-500 bg-red-500/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-red-500/50'
            }`}
          >
            <div className="text-red-400 text-sm font-semibold mb-2">NO</div>
            <div className="text-white font-bold text-3xl mb-2">
              {odds.noPercentage}%
            </div>
            <div className="text-gray-400 text-xs">
              {odds.noPercentage}¢ per share
            </div>
          </button>
        </div>
      </div>

      {/* Bet Amount */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Amount (SOL)
        </label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          step="0.01"
          min="0.01"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Potential Winnings */}
      {selectedOutcome !== null && parseFloat(betAmount) > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-300 text-sm">Your Bet:</span>
            <span className="text-white font-bold">
              {parseFloat(betAmount).toFixed(2)} SOL
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-300 text-sm">
              Potential Winnings:
            </span>
            <span className="text-white font-bold">
              {calculatePotentialWinnings().toFixed(2)} SOL
            </span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-300 text-center font-semibold mb-2">
            ✓ Bet placed successfully!
          </p>
          {txSignature && (
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs text-center block underline"
            >
              View transaction →
            </a>
          )}
        </div>
      )}

      {/* Place Bet Button */}
      <button
        onClick={handlePlaceBet}
        disabled={
          isSubmitting ||
          selectedOutcome === null ||
          parseFloat(betAmount) <= 0
        }
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Placing Bet...
          </span>
        ) : (
          `Place ${selectedOutcome === true ? 'YES' : selectedOutcome === false ? 'NO' : ''} Bet`
        )}
      </button>
    </div>
  )
}


