'use client'

import dynamic from 'next/dynamic'
import Layout from '@/components/layout/Layout'
import { useSolanaWallet } from '@/hooks/useSolanaWallet'
import {
  MOCK_USER_STATS,
  MOCK_USER_POSITIONS,
  getActivePositions,
  getTotalClaimableAmount,
} from '@/lib/mock'
import { TrendingUp, TrendingDown } from 'lucide-react'

// Importar WalletMultiButton solo en el cliente para evitar errores de hidratación
const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
)

export default function PortfolioPage() {
  const { connected, address, shortAddress } = useSolanaWallet()

  // Use mock data when connected
  const stats = connected ? MOCK_USER_STATS : null
  const activePositions = connected ? getActivePositions() : []
  const claimableAmount = connected ? getTotalClaimableAmount() : 0

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">Your Portfolio</h1>
            {connected && shortAddress && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
                <span className="text-gray-400 text-sm">Connected: </span>
                <span className="text-white font-mono">{shortAddress}</span>
              </div>
            )}
          </div>

          {/* Connect Wallet Prompt - Show only when NOT connected */}
          {!connected && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-12 text-center mb-8">
              <div className="text-6xl mb-4">👛</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-400 mb-6">
                Connect your Solana wallet to view your portfolio and trading
                history
              </p>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !text-white !shadow-lg hover:!shadow-purple-500/25 !rounded-lg !font-medium !transition-all !duration-200" />
            </div>
          )}

          {/* Stats Preview - Show real data when connected */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-gray-400 text-sm mb-1">Total Value</div>
              <div className="text-white text-2xl font-bold">
                {stats ? `${stats.totalValue.toFixed(2)} SOL` : '--'}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-gray-400 text-sm mb-1">Active Positions</div>
              <div className="text-white text-2xl font-bold">
                {stats ? stats.activePositions : '--'}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-gray-400 text-sm mb-1">Total Profit</div>
              <div
                className={`text-2xl font-bold ${
                  stats && stats.totalProfit >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {stats
                  ? `${
                      stats.totalProfit >= 0 ? '+' : ''
                    }${stats.totalProfit.toFixed(2)} SOL`
                  : '--'}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-gray-400 text-sm mb-1">Win Rate</div>
              <div className="text-white text-2xl font-bold">
                {stats ? `${stats.winRate}%` : '--'}
              </div>
            </div>
          </div>

          {/* Active Positions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Active Positions</h2>
              {connected && activePositions.length > 0 && (
                <span className="text-gray-400 text-sm">
                  {activePositions.length} positions
                </span>
              )}
            </div>

            {!connected ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-400">
                  Connect your wallet to see your positions
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Your portfolio data will appear here once connected
                </p>
              </div>
            ) : activePositions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-400">No active positions yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Start trading to see your positions here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activePositions.map((position) => (
                  <div
                    key={position.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">
                          {position.marketQuestion}
                        </h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              position.outcome
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {position.outcome ? 'YES' : 'NO'}
                          </span>
                          <span className="text-gray-400">
                            {position.amount.toFixed(2)} SOL
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            position.unrealizedPnL >= 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {position.unrealizedPnL >= 0 ? '+' : ''}
                          {position.unrealizedPnL.toFixed(2)} SOL
                        </div>
                        <div className="text-gray-400 text-sm">
                          {position.currentOdds}% odds
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            position.unrealizedPnL >= 0
                              ? 'bg-gradient-to-r from-green-500 to-green-400'
                              : 'bg-gradient-to-r from-red-500 to-red-400'
                          }`}
                          style={{ width: `${position.currentOdds}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs">
                        {position.currentOdds}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Claimable Winnings */}
          {connected && claimableAmount > 0 && (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    🎉 Claimable Winnings
                  </h3>
                  <p className="text-gray-400 text-sm">
                    You have winnings ready to claim!
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-2xl mb-2">
                    {claimableAmount.toFixed(2)} SOL
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all">
                    Claim Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Info Card - Only show when connected */}
          {connected && address && (
            <div className="mt-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Wallet Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white font-mono text-sm">
                    {address}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white">Mainnet Beta</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Connected
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
