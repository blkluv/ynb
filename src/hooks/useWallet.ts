'use client'

import { useCallback, useMemo, useState } from 'react'

/**
 * Mock Wallet Hook for Demo Mode
 * Simulates wallet connection without Privy
 */
export function useWallet() {
  const [connected, setConnected] = useState(false)

  // Mock Solana address
  const address = useMemo(() => {
    return connected ? 'CEZVkMNmWtmLPNGjieSCAbARsh9JmULvKtGap2AECUpF' : null
  }, [connected])

  // Connect wallet function (mock)
  const connect = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setConnected(true)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }, [])

  // Disconnect wallet function (mock)
  const disconnect = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setConnected(false)
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
      throw error
    }
  }, [])

  // Get user info (mock)
  const userInfo = useMemo(() => {
    if (!connected) return null

    return {
      id: 'demo-user-123',
      email: 'demo@prismafi.com',
      wallets: [
        {
          address: 'CEZVkMNmWtmLPNGjieSCAbARsh9JmULvKtGap2AECUpF',
          chainType: 'solana',
          verified: true,
        },
      ],
      createdAt: new Date().toISOString(),
    }
  }, [connected])

  return {
    // State
    ready: true,
    isConnected: connected,
    address,
    wallet: connected
      ? {
          address: 'CEZVkMNmWtmLPNGjieSCAbARsh9JmULvKtGap2AECUpF',
          walletClientType: 'solana',
        }
      : null,
    wallets: connected
      ? [
          {
            address: 'CEZVkMNmWtmLPNGjieSCAbARsh9JmULvKtGap2AECUpF',
            walletClientType: 'solana',
          },
        ]
      : [],
    user: userInfo,
    authenticated: connected,

    // Actions
    connect,
    disconnect,
  }
}
