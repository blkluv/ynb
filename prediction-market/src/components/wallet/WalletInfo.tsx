'use client'

import { useSolanaWallet } from '@/hooks/useSolanaWallet'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function WalletInfo() {
  const { connected, address, shortAddress, walletName } = useSolanaWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!connected || !address) {
    return null
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        Connected Wallet
        {walletName && (
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({walletName})
          </span>
        )}
      </h3>

      <div className="space-y-3">
        {/* Address */}
        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">Wallet Address</div>
            <div className="text-white font-mono text-sm break-all">
              {address}
            </div>
          </div>
          <button
            onClick={copyAddress}
            className="ml-3 p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy address"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Status</span>
          <span className="text-green-400 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Connected
          </span>
        </div>

        {/* Network */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Network</span>
          <span className="text-white text-sm">Solana Mainnet</span>
        </div>
      </div>
    </div>
  )
}


