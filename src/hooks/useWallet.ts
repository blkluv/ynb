'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useCallback, useMemo } from 'react'

export function useWallet() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  const { wallets } = useWallets()

  // Get the primary Solana wallet
  const solanaWallet = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === 'solana')
  }, [wallets])

  // Get wallet address
  const address = useMemo(() => {
    return solanaWallet?.address || null
  }, [solanaWallet])

  // Check if wallet is connected
  const isConnected = useMemo(() => {
    return authenticated && !!address
  }, [authenticated, address])

  // Connect wallet function
  const connect = useCallback(async () => {
    try {
      await login()
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }, [login])

  // Disconnect wallet function
  const disconnect = useCallback(async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
      throw error
    }
  }, [logout])

  // Get user info
  const userInfo = useMemo(() => {
    if (!user) return null

    return {
      id: user.id,
      email: user.email?.address || null,
      wallets: user.linkedAccounts
        .filter((account) => account.type === 'wallet')
        .map((account) => ({
          address: account.address,
          chainType: account.chainType,
          verified: account.verifiedAt !== null,
        })),
      createdAt: user.createdAt,
    }
  }, [user])

  return {
    // State
    ready,
    isConnected,
    address,
    wallet: solanaWallet,
    wallets,
    user: userInfo,
    authenticated,

    // Actions
    connect,
    disconnect,
  }
}
