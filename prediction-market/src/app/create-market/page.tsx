'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '@/components/layout/Layout'
import { useSolanaWallet } from '@/hooks/useSolanaWallet'
import { createMarket } from '@/lib/solana/contract'
import { useWallet } from '@solana/wallet-adapter-react'

// Importar WalletMultiButton solo en el cliente para evitar errores de hidratación
const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
)

export default function CreateMarketPage() {
  const { connected, shortAddress } = useSolanaWallet()
  const wallet = useWallet()

  // Form state
  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [resolutionDate, setResolutionDate] = useState('')
  const [category, setCategory] = useState('')

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('Please connect your wallet first')
      return
    }

    // Validación
    if (!question.trim()) {
      setError('Question is required')
      return
    }

    if (question.length > 30) {
      setError(
        '⚠️ Question must be 30 characters or less (Solana PDA limitation)'
      )
      return
    }

    if (!description.trim() || description.length > 1000) {
      setError('Description must be between 1 and 1000 characters')
      return
    }

    if (!resolutionDate) {
      setError('Please select a resolution date')
      return
    }

    if (!category.trim() || category.length > 50) {
      setError('Category must be between 1 and 50 characters')
      return
    }

    // Convertir fecha a Unix timestamp
    const endTime = Math.floor(new Date(resolutionDate).getTime() / 1000)
    const now = Math.floor(Date.now() / 1000)

    if (endTime <= now) {
      setError('Resolution date must be in the future')
      return
    }

    setIsLoading(true)
    setError(null)
    setTxSignature(null)

    try {
      const signature = await createMarket(
        wallet,
        question,
        description,
        endTime,
        category
      )

      setTxSignature(signature)

      // Reset form
      setQuestion('')
      setDescription('')
      setResolutionDate('')
      setCategory('')

      // Show success message
      console.log('Market created successfully! Signature:', signature)
    } catch (err: any) {
      console.error('Error creating market:', err)
      setError(err.message || 'Failed to create market. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">
              Create Prediction Market
            </h1>
            {connected && shortAddress && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
                <span className="text-gray-400 text-sm">Creator: </span>
                <span className="text-white font-mono text-sm">
                  {shortAddress}
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-400 mb-8">
            Create your own on-chain prediction market deployed to Solana
            Devnet. Connect your wallet to get started!
          </p>

          {/* Require wallet connection */}
          {!connected ? (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Wallet Required
              </h2>
              <p className="text-gray-400 mb-6">
                Connect your Solana wallet to create prediction markets
              </p>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !text-white !shadow-lg hover:!shadow-purple-500/25 !rounded-lg !font-medium !transition-all !duration-200" />
            </div>
          ) : (
            <form onSubmit={handleCreateMarket}>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                <div className="space-y-6">
                  {/* Success Message */}
                  {txSignature && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-green-300 font-medium mb-2">
                        ✅ Market created successfully!
                      </p>
                      <a
                        href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 text-sm hover:underline break-all"
                      >
                        View transaction on Solana Explorer →
                      </a>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-red-300 text-sm">❌ {error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Market Question <span className="text-red-500">*</span>
                      <span className="text-yellow-400 text-xs ml-2">
                        (max 30 chars)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g., BTC $100k by Dec 2025?"
                      maxLength={30}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <p
                      className={`text-xs mt-1 ${
                        question.length > 30 ? 'text-red-400' : 'text-gray-500'
                      }`}
                    >
                      {question.length}/30 characters{' '}
                      {question.length > 30 && '⚠️ Too long!'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Provide details about the market resolution criteria..."
                      maxLength={1000}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      {description.length}/1000 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Resolution Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={resolutionDate}
                        onChange={(e) => setResolutionDate(e.target.value)}
                        required
                        disabled={isLoading}
                        min={
                          new Date(Date.now() + 86400000)
                            .toISOString()
                            .split('T')[0]
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Crypto, Sports, Politics"
                        maxLength={50}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                      ℹ️ <strong>On-Chain Market:</strong> Your market will be
                      deployed to Solana Devnet. Make sure you have enough SOL
                      for transaction fees (~0.01 SOL).
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block animate-spin">⏳</span>
                        Creating Market...
                      </>
                    ) : (
                      <>🚀 Create Market on Solana</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}
