/**
 * PrismaFi - React Hook for Prediction Markets
 *
 * This hook integrates Privy wallet with Solana smart contract functions.
 * Use this in your components for easy market interactions.
 */

import { useState, useEffect, useCallback } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { AnchorProvider, web3, BN } from '@project-serum/anchor'
import toast from 'react-hot-toast'
import {
  PROGRAM_ID,
  RPC_ENDPOINT,
  connection,
  createMarket as contractCreateMarket,
  placeBet as contractPlaceBet,
  resolveMarket as contractResolveMarket,
  claimWinnings as contractClaimWinnings,
  deriveMarketPDA,
  derivePositionPDA,
  CreateMarketParams,
  PlaceBetParams,
  Market,
  UserPosition,
  formatSOL,
  getExplorerLink,
} from '../lib/solana-integration'

// ============================================================================
// TYPES
// ============================================================================

interface UsePredictionMarketReturn {
  // Wallet state
  connected: boolean
  connecting: boolean
  publicKey: PublicKey | null

  // Actions
  createMarket: (params: CreateMarketParams) => Promise<PublicKey | null>
  placeBet: (params: PlaceBetParams) => Promise<string | null>
  resolveMarket: (
    marketPubkey: PublicKey,
    winningOutcome: boolean
  ) => Promise<string | null>
  claimWinnings: (
    marketPubkey: PublicKey
  ) => Promise<{ signature: string; amount: number } | null>

  // Loading states
  isCreatingMarket: boolean
  isPlacingBet: boolean
  isResolvingMarket: boolean
  isClaimingWinnings: boolean

  // Query functions
  getUserPosition: (marketPubkey: PublicKey) => Promise<UserPosition | null>
  getMarket: (marketPubkey: PublicKey) => Promise<Market | null>
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function usePredictionMarket(): UsePredictionMarketReturn {
  const { ready, authenticated } = usePrivy()
  const { wallets } = useWallets()

  // State
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)

  const [isCreatingMarket, setIsCreatingMarket] = useState(false)
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [isResolvingMarket, setIsResolvingMarket] = useState(false)
  const [isClaimingWinnings, setIsClaimingWinnings] = useState(false)

  // Get Solana wallet from Privy
  const solanaWallet = wallets.find(
    (w) => w.walletClientType === 'phantom' || w.walletClientType === 'solana'
  )

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (ready && authenticated && solanaWallet) {
      setConnecting(true)

      // Get public key from wallet
      const setupWallet = async () => {
        try {
          // Privy provides the address
          const address = await solanaWallet.address
          if (address) {
            setPublicKey(new PublicKey(address))
            setConnected(true)
            console.log('✅ Wallet connected:', address)
          }
        } catch (error) {
          console.error('❌ Wallet connection failed:', error)
          toast.error('Failed to connect wallet')
        } finally {
          setConnecting(false)
        }
      }

      setupWallet()
    } else {
      setConnected(false)
      setPublicKey(null)
    }
  }, [ready, authenticated, solanaWallet])

  // ============================================================================
  // HELPER: GET PROVIDER
  // ============================================================================

  const getProvider = useCallback((): AnchorProvider | null => {
    if (!solanaWallet || !publicKey) {
      toast.error('Please connect your wallet first')
      return null
    }

    // Create a wallet interface for Anchor
    const wallet = {
      publicKey,
      signTransaction: async (tx: Transaction) => {
        // Use Privy's wallet to sign
        const signedTx = await solanaWallet.signTransaction(tx as any)
        return signedTx as Transaction
      },
      signAllTransactions: async (txs: Transaction[]) => {
        const signedTxs = await solanaWallet.signAllTransactions(txs as any)
        return signedTxs as Transaction[]
      },
    }

    return new AnchorProvider(connection, wallet as any, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    })
  }, [solanaWallet, publicKey])

  // ============================================================================
  // ACTION: CREATE MARKET
  // ============================================================================

  const createMarket = useCallback(
    async (params: CreateMarketParams): Promise<PublicKey | null> => {
      const provider = getProvider()
      if (!provider) return null

      setIsCreatingMarket(true)
      const loadingToast = toast.loading('Creating market...')

      try {
        const marketPDA = await contractCreateMarket(provider, params)

      toast.success(
        `Market created! View on Explorer: ${getExplorerLink(marketPDA.toString())}`,
        { id: loadingToast }
      )

        return marketPDA
      } catch (error: any) {
        console.error('Create market error:', error)
        toast.error(error.message || 'Failed to create market', {
          id: loadingToast,
        })
        return null
      } finally {
        setIsCreatingMarket(false)
      }
    },
    [getProvider]
  )

  // ============================================================================
  // ACTION: PLACE BET
  // ============================================================================

  const placeBet = useCallback(
    async (params: PlaceBetParams): Promise<string | null> => {
      const provider = getProvider()
      if (!provider) return null

      setIsPlacingBet(true)
      const outcomeText = params.outcome ? 'YES' : 'NO'
      const loadingToast = toast.loading(
        `Betting ${params.amount} SOL on ${outcomeText}...`
      )

      try {
        const signature = await contractPlaceBet(provider, params)

        toast.success(
          <div>
            Bet placed!
            <a
              href={getExplorerLink(signature, 'tx')}
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-2"
            >
              View Transaction
            </a>
          </div>,
          { id: loadingToast }
        )

        return signature
      } catch (error: any) {
        console.error('Place bet error:', error)
        toast.error(error.message || 'Failed to place bet', {
          id: loadingToast,
        })
        return null
      } finally {
        setIsPlacingBet(false)
      }
    },
    [getProvider]
  )

  // ============================================================================
  // ACTION: RESOLVE MARKET
  // ============================================================================

  const resolveMarket = useCallback(
    async (
      marketPubkey: PublicKey,
      winningOutcome: boolean
    ): Promise<string | null> => {
      const provider = getProvider()
      if (!provider) return null

      setIsResolvingMarket(true)
      const outcomeText = winningOutcome ? 'YES' : 'NO'
      const loadingToast = toast.loading(
        `Resolving market as ${outcomeText}...`
      )

      try {
        const signature = await contractResolveMarket(
          provider,
          marketPubkey,
          winningOutcome
        )

        toast.success(
          <div>
            Market resolved! Winner: {outcomeText}
            <a
              href={getExplorerLink(signature, 'tx')}
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-2"
            >
              View Transaction
            </a>
          </div>,
          { id: loadingToast }
        )

        return signature
      } catch (error: any) {
        console.error('Resolve market error:', error)
        toast.error(error.message || 'Failed to resolve market', {
          id: loadingToast,
        })
        return null
      } finally {
        setIsResolvingMarket(false)
      }
    },
    [getProvider]
  )

  // ============================================================================
  // ACTION: CLAIM WINNINGS
  // ============================================================================

  const claimWinnings = useCallback(
    async (
      marketPubkey: PublicKey
    ): Promise<{ signature: string; amount: number } | null> => {
      const provider = getProvider()
      if (!provider) return null

      setIsClaimingWinnings(true)
      const loadingToast = toast.loading('Claiming winnings...')

      try {
        const result = await contractClaimWinnings(provider, marketPubkey)

        toast.success(
          <div>
            Claimed {result.amount.toFixed(4)} SOL! 🎉
            <a
              href={getExplorerLink(result.signature, 'tx')}
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-2"
            >
              View Transaction
            </a>
          </div>,
          { id: loadingToast }
        )

        return result
      } catch (error: any) {
        console.error('Claim winnings error:', error)
        toast.error(error.message || 'Failed to claim winnings', {
          id: loadingToast,
        })
        return null
      } finally {
        setIsClaimingWinnings(false)
      }
    },
    [getProvider]
  )

  // ============================================================================
  // QUERY: GET USER POSITION
  // ============================================================================

  const getUserPosition = useCallback(
    async (marketPubkey: PublicKey): Promise<UserPosition | null> => {
      if (!publicKey) {
        console.warn('No wallet connected')
        return null
      }

      try {
        const [positionPDA] = derivePositionPDA(marketPubkey, publicKey)

        const accountInfo = await connection.getAccountInfo(positionPDA)
        if (!accountInfo) {
          return null // No position yet
        }

        // TODO: Deserialize using your IDL
        throw new Error('Implement position deserialization')
      } catch (error: any) {
        if (error.message.includes('Account does not exist')) {
          return null // No position
        }
        console.error('Get position error:', error)
        return null
      }
    },
    [publicKey]
  )

  // ============================================================================
  // QUERY: GET MARKET
  // ============================================================================

  const getMarket = useCallback(
    async (marketPubkey: PublicKey): Promise<Market | null> => {
      try {
        const accountInfo = await connection.getAccountInfo(marketPubkey)
        if (!accountInfo) {
          return null
        }

        // TODO: Deserialize using your IDL
        throw new Error('Implement market deserialization')
      } catch (error: any) {
        console.error('Get market error:', error)
        return null
      }
    },
    []
  )

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Wallet state
    connected,
    connecting,
    publicKey,

    // Actions
    createMarket,
    placeBet,
    resolveMarket,
    claimWinnings,

    // Loading states
    isCreatingMarket,
    isPlacingBet,
    isResolvingMarket,
    isClaimingWinnings,

    // Query functions
    getUserPosition,
    getMarket,
  }
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Example component using the hook:
 *
 * ```tsx
 * import { usePredictionMarket } from '@/hooks/usePredictionMarket';
 *
 * export function MarketComponent() {
 *   const {
 *     connected,
 *     createMarket,
 *     placeBet,
 *     isPlacingBet
 *   } = usePredictionMarket();
 *
 *   const handleBet = async () => {
 *     if (!connected) {
 *       toast.error('Please connect wallet first');
 *       return;
 *     }
 *
 *     const signature = await placeBet({
 *       marketPubkey: new PublicKey('...'),
 *       outcome: true, // YES
 *       amount: 1.5 // SOL
 *     });
 *
 *     if (signature) {
 *       console.log('Bet successful!', signature);
 *     }
 *   };
 *
 *   return (
 *     <button
 *       onClick={handleBet}
 *       disabled={!connected || isPlacingBet}
 *     >
 *       {isPlacingBet ? 'Placing Bet...' : 'Bet 1.5 SOL on YES'}
 *     </button>
 *   );
 * }
 * ```
 */


