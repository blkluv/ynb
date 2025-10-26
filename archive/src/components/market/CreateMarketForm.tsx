'use client'

import React, { useState } from 'react'
import type { CreateMarketForm as CreateMarketFormType } from '@/types/market'
import { MarketCategory, OutcomeType } from '@/types/market'
import { PlusIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { MarketService } from '@/lib/marketService'
import { useWallet } from '@/hooks/useWallet'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

const initialForm: CreateMarketFormType = {
  question: '',
  description: '',
  category: MarketCategory.OTHER,
  resolutionDate: '',
  resolutionSource: '',
  outcomeType: OutcomeType.BINARY,
  options: [{ text: 'Yes' }, { text: 'No' }],
  fees: {
    creationFee: 0.5,
    tradingFee: 0.5,
    resolutionFee: 1.0,
  },
}

const categoryOptions = [
  { value: MarketCategory.SPORTS, label: 'Sports', emoji: '⚽' },
  { value: MarketCategory.SOCIAL, label: 'Social', emoji: '📲' },
  { value: MarketCategory.ECONOMICS, label: 'Economics', emoji: '📈' },
  { value: MarketCategory.TECHNOLOGY, label: 'Technology', emoji: '💻' },
  { value: MarketCategory.CRYPTO, label: 'Crypto', emoji: '₿' },
  { value: MarketCategory.WEATHER, label: 'Weather', emoji: '🌤️' },
  { value: MarketCategory.ENTERTAINMENT, label: 'Entertainment', emoji: '🎬' },
  { value: MarketCategory.OTHER, label: 'Other', emoji: '📊' },
]

const outcomeTypeOptions = [
  {
    value: OutcomeType.BINARY,
    label: 'Binary (Yes/No)',
    description: 'Simple yes or no question',
  },
  {
    value: OutcomeType.CATEGORICAL,
    label: 'Categorical',
    description: 'Multiple choice options',
  },
  {
    value: OutcomeType.SCALAR,
    label: 'Scalar (Number)',
    description: 'Numerical outcome prediction',
  },
]

export default function CreateMarketForm() {
  const { isConnected, address, connect } = useWallet()
  const router = useRouter()
  const [form, setForm] = useState<CreateMarketFormType>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof CreateMarketFormType, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...form.options]
    newOptions[index].text = text
    setForm((prev) => ({
      ...prev,
      options: newOptions,
    }))
  }

  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { text: '' }],
    }))
  }

  const removeOption = (index: number) => {
    if (form.options.length > 2) {
      const newOptions = form.options.filter((_, i) => i !== index)
      setForm((prev) => ({
        ...prev,
        options: newOptions,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check wallet connection first
    if (!isConnected) {
      await connect()
      return
    }

    if (!address) {
      alert('Please connect your wallet to create a market')
      return
    }

    setIsSubmitting(true)

    // Show loading toast
    const loadingToast = toast.loading('Creating market on Solana...')

    try {
      console.log('Creating market:', form)

      // Create market through service
      const newMarket = await MarketService.createMarket({
        question: form.question,
        description: form.description,
        category: form.category,
        resolutionDate: form.resolutionDate,
        resolutionSource: form.resolutionSource,
        outcomeType: form.outcomeType,
        options: form.options.map((option) => ({
          id: option.text.toLowerCase().replace(/\s+/g, '_'),
          text: option.text,
          probability: 0.5, // Default probability
          volume: 0,
        })),
        creator: address,
        fees: form.fees,
      })

      console.log('Market created successfully:', newMarket)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      // Show success toast
      toast.success(
        (t) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              Market Created Successfully! 🎉
            </span>
            <span className="text-sm">{form.question}</span>
            <a
              href={newMarket.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 underline hover:text-purple-300"
            >
              View on Solana Explorer →
            </a>
          </div>
        ),
        { duration: 6000 }
      )

      // Redirect to the new market after a short delay
      setTimeout(() => {
        router.push(`/market/${newMarket.id}`)
      }, 1000)
    } catch (error) {
      console.error('Error creating market:', error)
      toast.dismiss(loadingToast)
      toast.error(
        `Failed to create market: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        { duration: 5000 }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      form.question.trim() &&
      form.description.trim() &&
      form.resolutionDate &&
      form.resolutionSource.trim() &&
      form.options.every((option) => option.text.trim()) &&
      form.options.length >= 2
    )
  }

  return (
    <div className="p-6 mx-auto text-white bg-gray-900 max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Create Prediction Market</h1>
        <p className="text-gray-400">
          Set up your prediction market with clear questions, resolution
          criteria, and trading parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="p-6 bg-gray-800 rounded-lg">
              <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Market Question *
                  </label>
                  <input
                    type="text"
                    value={form.question}
                    onChange={(e) =>
                      handleInputChange('question', e.target.value)
                    }
                    placeholder="e.g., Will Bitcoin reach $100,000 by December 2024?"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Provide detailed context and criteria for resolution..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        handleInputChange(
                          'category',
                          e.target.value as MarketCategory
                        )
                      }
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.emoji} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Outcome Type *
                    </label>
                    <select
                      value={form.outcomeType}
                      onChange={(e) =>
                        handleInputChange(
                          'outcomeType',
                          e.target.value as OutcomeType
                        )
                      }
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {outcomeTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-400">
                      {
                        outcomeTypeOptions.find(
                          (opt) => opt.value === form.outcomeType
                        )?.description
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Options */}
            <div className="p-6 bg-gray-800 rounded-lg">
              <h2 className="mb-4 text-xl font-semibold">Market Options</h2>

              <div className="space-y-4">
                {form.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {form.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-3 text-red-400 transition-colors rounded-lg hover:text-red-300 hover:bg-red-900/20"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-2 px-4 py-3 text-purple-400 transition-colors rounded-lg hover:text-purple-300 hover:bg-purple-900/20"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Option
                </button>
              </div>
            </div>

            {/* Resolution Details */}
            <div className="p-6 bg-gray-800 rounded-lg">
              <h2 className="mb-4 text-xl font-semibold">Resolution Details</h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Resolution Date *
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={form.resolutionDate}
                      onChange={(e) =>
                        handleInputChange('resolutionDate', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                    <CalendarIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Resolution Source *
                  </label>
                  <input
                    type="url"
                    value={form.resolutionSource}
                    onChange={(e) =>
                      handleInputChange('resolutionSource', e.target.value)
                    }
                    placeholder="https://example.com/source"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fees Configuration */}
            <div className="p-6 bg-gray-800 rounded-lg">
              <h2 className="mb-4 text-xl font-semibold">Fee Configuration</h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Creation Fee (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={form.fees.creationFee}
                    onChange={(e) =>
                      handleInputChange('fees', {
                        ...form.fees,
                        creationFee: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Trading Fee (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.fees.tradingFee}
                    onChange={(e) =>
                      handleInputChange('fees', {
                        ...form.fees,
                        tradingFee: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Resolution Fee (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.fees.resolutionFee}
                    onChange={(e) =>
                      handleInputChange('fees', {
                        ...form.fees,
                        resolutionFee: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Wallet Connection Status */}
            {!isConnected && (
              <div className="p-4 mb-6 border rounded-lg bg-yellow-900/20 border-yellow-600/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-5 h-5 bg-yellow-600 rounded-full">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-300">
                      Wallet Not Connected
                    </p>
                    <p className="text-sm text-yellow-400">
                      Connect your wallet to create a market
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting || !isConnected}
                className="flex items-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Creating Market...
                  </>
                ) : !isConnected ? (
                  'Connect Wallet to Create'
                ) : (
                  'Create Market'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notifications Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}
