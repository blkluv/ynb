'use client'

import { useState } from 'react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { getProgram, resolveMarket } from '@/lib/program/predictionMarket'
import type { MockMarket } from '@/lib/mock/markets'

interface ResolveMarketInterfaceProps {
  market: MockMarket
  onResolved?: () => void
}

export default function ResolveMarketInterface({
  market,
  onResolved,
}: ResolveMarketInterfaceProps) {
  const wallet = useAnchorWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState<boolean | null>(null)

  const handleResolve = async () => {
    if (!wallet || selectedOutcome === null) return

      const program = getProgram(wallet)
    const marketPubkey = new PublicKey(market.id)

    try {
      setIsSubmitting(true)

      console.log('Resolving market...')
      console.log('Market:', market.id)
      console.log('Outcome:', selectedOutcome ? 'YES' : 'NO')

      const signature = await resolveMarket(
        program,
        marketPubkey,
        selectedOutcome
      )

      console.log('✅ Market resolved! Transaction:', signature)

      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`

      alert(
        `✅ Market resolved successfully!\n\n` +
          `Winner: ${selectedOutcome ? 'YES' : 'NO'}\n` +
          `Transaction: ${signature.slice(0, 8)}...\n\n` +
          `View on Explorer: ${explorerUrl}`
      )

      if (onResolved) {
        setTimeout(() => onResolved(), 2000)
      }
    } catch (error: any) {
      console.error('Error resolving market:', error)

      let errorMessage = 'Failed to resolve market. Please try again.'

      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction cancelled by user.'
      } else if (error.message?.includes('Unauthorized')) {
        errorMessage = 'Only the market creator can resolve this market.'
      } else if (error.message?.includes('AlreadyResolved')) {
        errorMessage = 'This market has already been resolved.'
      } else if (error.message?.includes('MarketNotExpired')) {
        errorMessage = 'Cannot resolve: market has not expired yet.'
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }

      alert(`❌ ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Only show if wallet is connected
  if (!wallet) {
    return null
  }

  // Check if user is the authority (market creator)
  const isAuthority =
    wallet.publicKey.toString() === market.creator ||
    market.creator.includes(wallet.publicKey.toString().slice(0, 4))

  if (!isAuthority) {
    return null // Don't show resolution interface if not the creator
  }

  // If already resolved
  if (market.resolved) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-2">
          ✅ Market Resolved
        </h3>
        <p className="text-gray-400">
          Winner:{' '}
          <span className="text-white font-semibold">
            {market.winningOutcome ? 'YES' : 'NO'}
          </span>
        </p>
      </div>
    )
  }

  // Check if market has expired
  const now = Date.now()
  const isExpired = market.endTime.getTime() < now

  if (!isExpired) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
        <h3 className="text-yellow-300 font-bold text-lg mb-2">
          ⏳ Market Not Expired
        </h3>
        <p className="text-yellow-200/70 text-sm">
          This market cannot be resolved until after{' '}
          {market.endTime.toLocaleString()}
        </p>
      </div>
    )
  }

  // Resolution interface
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6">
      <h3 className="text-white font-bold text-lg mb-4">
        🎯 Resolve Market (Authority Only)
      </h3>

      <p className="text-gray-300 mb-6">
        As the market creator, you can now resolve this market. Select the
        winning outcome:
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setSelectedOutcome(true)}
          disabled={isSubmitting}
          className={`p-6 rounded-xl border-2 transition-all ${
            selectedOutcome === true
              ? 'border-green-500 bg-green-500/20'
              : 'border-gray-700 bg-gray-800/50 hover:border-green-500/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="text-green-400 text-xl font-bold mb-2">
            YES WINS
          </div>
          <div className="text-gray-400 text-sm">YES bettors will be paid</div>
        </button>

        <button
          onClick={() => setSelectedOutcome(false)}
          disabled={isSubmitting}
          className={`p-6 rounded-xl border-2 transition-all ${
            selectedOutcome === false
              ? 'border-red-500 bg-red-500/20'
              : 'border-gray-700 bg-gray-800/50 hover:border-red-500/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="text-red-400 text-xl font-bold mb-2">NO WINS</div>
          <div className="text-gray-400 text-sm">NO bettors will be paid</div>
        </button>
      </div>

      <button
        onClick={handleResolve}
        disabled={isSubmitting || selectedOutcome === null}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Resolving...
          </span>
        ) : (
          'Confirm and Resolve Market'
        )}
      </button>

      <p className="text-gray-400 text-xs mt-4 text-center">
        ⚠️ This action is irreversible
      </p>
    </div>
  )
}

