'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'

export default function WalletInfo() {
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!publicKey || !connected) {
      setBalance(null)
      return
    }

    fetchBalance()
  }, [publicKey, connected])

  const fetchBalance = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
      const balanceLamports = await connection.getBalance(publicKey)
      setBalance(balanceLamports / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error fetching balance:', error)
      setBalance(null)
    } finally {
      setLoading(false)
    }
  }

  if (!connected || !publicKey) {
    return null
  }

  return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div>
            <p className="text-green-300 font-semibold text-sm">
              ✅ Connected to Devnet
            </p>
            <p className="text-green-200/70 text-xs">
              {publicKey.toString().slice(0, 4)}...
              {publicKey.toString().slice(-4)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-gray-400 text-xs">Balance</p>
          {loading ? (
            <p className="text-white font-bold">Loading...</p>
          ) : balance !== null ? (
            <p className="text-white font-bold">{balance.toFixed(2)} SOL</p>
          ) : (
            <p className="text-gray-400 text-sm">---</p>
          )}
        </div>
      </div>
    </div>
  )
}
