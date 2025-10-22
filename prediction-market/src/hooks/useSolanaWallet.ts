'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

/**
 * Custom hook that wraps Solana Wallet Adapter
 * Provides a clean API for wallet interactions
 */
export function useSolanaWallet() {
  const {
    publicKey,
    connected,
    connecting,
    disconnecting,
    wallet,
    connect,
    disconnect,
    select,
  } = useWallet()

  // Format address to short version (e.g., "Ab3x...9Zf2")
  const address = useMemo(() => {
    if (!publicKey) return null
    return publicKey.toString()
  }, [publicKey])

  const shortAddress = useMemo(() => {
    if (!address) return null
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }, [address])

  return {
    // Connection state
    connected,
    connecting,
    disconnecting,
    ready: !connecting && !disconnecting,

    // Wallet info
    publicKey,
    address, // Full address as string
    shortAddress, // Shortened for display
    walletName: wallet?.adapter.name || null,

    // Actions
    connect,
    disconnect,
    selectWallet: select,
  }
}


