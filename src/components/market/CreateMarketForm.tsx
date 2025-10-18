'use client'

import React, { useState } from 'react'
import type { CreateMarketForm as CreateMarketFormType } from '@/types/market'
import { MarketCategory, OutcomeType } from '@/types/market'
import { PlusIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { MarketService } from '@/lib/marketService'
import { useWallet } from '@/hooks/useWallet'
import { useRouter } from 'next/navigation'

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
  { value: MarketCategory.POLITICS, label: 'Politics', emoji: '🏛️' },
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
      alert('Market created successfully!')

      // Redirect to the new market
      router.push(`/market/${newMarket.id}`)
    } catch (error) {
      console.error('Error creating market:', error)
      alert(
        `Error creating market: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
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
    <div className="max-w-7xl mx-auto p-6 bg-gray-900 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Prediction Market</h1>
        <p className="text-gray-400">
          Set up your prediction market with clear questions, resolution
          criteria, and trading parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
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
                  <label className="block text-sm font-medium mb-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                    <label className="block text-sm font-medium mb-2">
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
                    <p className="text-sm text-gray-400 mt-1">
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
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Market Options</h2>

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
                        className="p-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-2 px-4 py-3 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded-lg transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Option
                </button>
              </div>
            </div>

            {/* Resolution Details */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Resolution Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
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
                  <label className="block text-sm font-medium mb-2">
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
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Fee Configuration</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
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
                  <label className="block text-sm font-medium mb-2">
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
                  <label className="block text-sm font-medium mb-2">
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
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-yellow-300 font-medium">
                      Wallet Not Connected
                    </p>
                    <p className="text-yellow-400 text-sm">
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
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
    </div>
  )
}
