/**
 * React Hook para interactuar con el Smart Contract
 *
 * Uso:
 *
 * const { createMarket, placeBet, markets, loading, error } = useContract()
 *
 * await createMarket({
 *   question: "¿Bitcoin llegará a $100k?",
 *   description: "...",
 *   endTime: Date.now() / 1000 + 86400, // 24 horas
 *   category: "crypto"
 * })
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import * as contract from '@/lib/solana/contract'

export interface CreateMarketParams {
  question: string
  description: string
  endTime: number
  category: string
}

export interface PlaceBetParams {
  marketPubkey: string
  outcome: boolean
  amountSOL: number
}

export function useContract() {
  const wallet = useWallet()
  const [markets, setMarkets] = useState<contract.Market[]>([])
  const [userPositions, setUserPositions] = useState<contract.UserPosition[]>(
    []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ============================================================================
  // Fetch Markets
  // ============================================================================

  const fetchMarkets = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey) return

    setLoading(true)
    setError(null)

    try {
      const allMarkets = await contract.fetchAllMarkets(wallet)
      setMarkets(allMarkets)
    } catch (err: any) {
      setError(err.message || 'Error fetching markets')
      console.error('Error fetching markets:', err)
    } finally {
      setLoading(false)
    }
  }, [wallet])

  // ============================================================================
  // Fetch User Positions
  // ============================================================================

  const fetchUserPositions = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey) return

    setLoading(true)
    setError(null)

    try {
      const positions = await contract.fetchUserPositions(
        wallet,
        wallet.publicKey
      )
      setUserPositions(positions)
    } catch (err: any) {
      setError(err.message || 'Error fetching positions')
      console.error('Error fetching positions:', err)
    } finally {
      setLoading(false)
    }
  }, [wallet])

  // ============================================================================
  // Auto-fetch on wallet connect
  // ============================================================================

  useEffect(() => {
    if (wallet.connected) {
      fetchMarkets()
      fetchUserPositions()
    }
  }, [wallet.connected, fetchMarkets, fetchUserPositions])

  // ============================================================================
  // Create Market
  // ============================================================================

  const createMarket = useCallback(
    async (params: CreateMarketParams) => {
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Wallet not connected')
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.createMarket(
          wallet,
          params.question,
          params.description,
          params.endTime,
          params.category
        )

        console.log('Market created:', tx)

        // Refresh markets
        await fetchMarkets()

        return tx
      } catch (err: any) {
        const errorMsg = err.message || 'Error creating market'
        setError(errorMsg)
        console.error('Error creating market:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [wallet, fetchMarkets]
  )

  // ============================================================================
  // Place Bet
  // ============================================================================

  const placeBet = useCallback(
    async (params: PlaceBetParams) => {
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Wallet not connected')
      }

      setLoading(true)
      setError(null)

      try {
        const marketPubkey = new PublicKey(params.marketPubkey)

        const tx = await contract.placeBet(
          wallet,
          marketPubkey,
          params.outcome,
          params.amountSOL
        )

        console.log('Bet placed:', tx)

        // Refresh markets and positions
        await Promise.all([fetchMarkets(), fetchUserPositions()])

        return tx
      } catch (err: any) {
        const errorMsg = err.message || 'Error placing bet'
        setError(errorMsg)
        console.error('Error placing bet:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [wallet, fetchMarkets, fetchUserPositions]
  )

  // ============================================================================
  // Resolve Market
  // ============================================================================

  const resolveMarket = useCallback(
    async (marketPubkey: string, winningOutcome: boolean) => {
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Wallet not connected')
      }

      setLoading(true)
      setError(null)

      try {
        const pubkey = new PublicKey(marketPubkey)

        const tx = await contract.resolveMarket(wallet, pubkey, winningOutcome)

        console.log('Market resolved:', tx)

        // Refresh markets
        await fetchMarkets()

        return tx
      } catch (err: any) {
        const errorMsg = err.message || 'Error resolving market'
        setError(errorMsg)
        console.error('Error resolving market:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [wallet, fetchMarkets]
  )

  // ============================================================================
  // Claim Winnings
  // ============================================================================

  const claimWinnings = useCallback(
    async (marketPubkey: string) => {
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Wallet not connected')
      }

      setLoading(true)
      setError(null)

      try {
        const pubkey = new PublicKey(marketPubkey)

        const tx = await contract.claimWinnings(wallet, pubkey)

        console.log('Winnings claimed:', tx)

        // Refresh positions
        await fetchUserPositions()

        return tx
      } catch (err: any) {
        const errorMsg = err.message || 'Error claiming winnings'
        setError(errorMsg)
        console.error('Error claiming winnings:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [wallet, fetchUserPositions]
  )

  // ============================================================================
  // Fetch Single Market
  // ============================================================================

  const fetchMarket = useCallback(
    async (marketPubkey: string): Promise<contract.Market | null> => {
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Wallet not connected')
      }

      try {
        const pubkey = new PublicKey(marketPubkey)
        return await contract.fetchMarket(wallet, pubkey)
      } catch (err: any) {
        console.error('Error fetching market:', err)
        return null
      }
    },
    [wallet]
  )

  // ============================================================================
  // Fetch Single Position
  // ============================================================================

  const fetchUserPosition = useCallback(
    async (marketPubkey: string): Promise<contract.UserPosition | null> => {
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Wallet not connected')
      }

      try {
        const pubkey = new PublicKey(marketPubkey)
        return await contract.fetchUserPosition(
          wallet,
          pubkey,
          wallet.publicKey
        )
      } catch (err: any) {
        console.error('Error fetching position:', err)
        return null
      }
    },
    [wallet]
  )

  // ============================================================================
  // Return API
  // ============================================================================

  return {
    // State
    markets,
    userPositions,
    loading,
    error,

    // Actions
    createMarket,
    placeBet,
    resolveMarket,
    claimWinnings,

    // Queries
    fetchMarkets,
    fetchUserPositions,
    fetchMarket,
    fetchUserPosition,

    // Utils
    isConnected: wallet.connected,
    publicKey: wallet.publicKey,

    // Contract utils (re-export for convenience)
    utils: {
      lamportsToSOL: contract.lamportsToSOL,
      solToLamports: contract.solToLamports,
      calculateYesPrice: contract.calculateYesPrice,
      formatTimestamp: contract.formatTimestamp,
      isMarketExpired: contract.isMarketExpired,
    },
  }
}












