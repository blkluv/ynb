'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import WalletInfo from '@/components/wallet/WalletInfo'
import { useWallet } from '@solana/wallet-adapter-react'
import { CATEGORIES } from '@/lib/mock/markets'

interface FormData {
  question: string
  description: string
  category: string
  endDate: string
  endTime: string
}

interface FormErrors {
  question?: string
  description?: string
  category?: string
  endDate?: string
}

export default function CreateMarketPage() {
  const { connected } = useWallet()
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    question: '',
    description: '',
    category: '',
    endDate: '',
    endTime: '23:59',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Question validation
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required'
    } else if (formData.question.length < 10) {
      newErrors.question = 'Question must be at least 10 characters'
    } else if (formData.question.length > 200) {
      newErrors.question = 'Question must be less than 200 characters'
    } else if (!formData.question.includes('?')) {
      newErrors.question = 'Question should end with a question mark'
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    // End date validation
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    } else {
      const selectedDate = new Date(`${formData.endDate}T${formData.endTime}`)
      const now = new Date()
      if (selectedDate <= now) {
        newErrors.endDate = 'End date must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate market creation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)

    // Show success and redirect
    alert('✅ Market created successfully! (Demo mode)')
    router.push('/markets')
  }

  const getEndDateTime = () => {
    if (!formData.endDate) return null
    return new Date(`${formData.endDate}T${formData.endTime}`)
  }

  const estimatedOdds = { yes: 50, no: 50 } // Initial odds

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Wallet Info or Demo Banner */}
          {connected ? (
            <div className="mb-6">
              <WalletInfo />
            </div>
          ) : (
            <div className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-yellow-300 font-semibold">
                    DEMO MODE - Simulated Market Creation
                  </p>
                  <p className="text-yellow-200/70 text-sm">
                    Connect your wallet to create real markets on Devnet
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Prediction Market
            </h1>
            <p className="text-gray-400">
              Create a new market and let others trade on the outcome
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Market Question *
                  </label>
                  <input
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    placeholder="Will Bitcoin reach $100,000 in 2025?"
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      errors.question ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.question && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.question}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">
                    {formData.question.length}/200 characters
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="This market will resolve YES if Bitcoin reaches or exceeds $100,000 USD on any major exchange before December 31, 2025..."
                    rows={5}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      errors.description
                        ? 'border-red-500'
                        : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      errors.category ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.filter((c) => c !== 'All').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* End Date & Time */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Market End Date & Time *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`px-4 py-3 bg-gray-800 border ${
                        errors.endDate ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.endDate}
                    </p>
                  )}
                  {getEndDateTime() && (
                    <p className="text-gray-400 text-sm mt-2">
                      Ends on{' '}
                      {getEndDateTime()?.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>

                {/* Creation Fee Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-300 text-sm font-semibold mb-1">
                    💡 Market Creation Fee
                  </p>
                  <p className="text-blue-200/70 text-xs">
                    Creating a market costs 0.1 SOL (includes rent + fees)
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
                  >
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Creating...
                      </span>
                    ) : (
                      'Create Market'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview */}
            <div
              className={`transition-all duration-300 ${
                showPreview ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">
                  Market Preview
                </h2>

                {formData.question ? (
                  <div className="space-y-4">
                    {/* Question */}
                    <div>
                      <p className="text-gray-400 text-xs mb-1">QUESTION</p>
                      <h3 className="text-white font-bold text-lg">
                        {formData.question}
                      </h3>
                    </div>

                    {/* Description */}
                    {formData.description && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          DESCRIPTION
                        </p>
                        <p className="text-gray-300 text-sm">
                          {formData.description}
                        </p>
                      </div>
                    )}

                    {/* Category */}
                    {formData.category && (
                      <div>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded font-medium">
                          {formData.category}
                        </span>
                      </div>
                    )}

                    {/* Odds */}
                    <div>
                      <p className="text-gray-400 text-xs mb-2">
                        INITIAL ODDS
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <p className="text-green-400 text-xs mb-1">YES</p>
                          <p className="text-white font-bold text-2xl">
                            {estimatedOdds.yes}%
                          </p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <p className="text-red-400 text-xs mb-1">NO</p>
                          <p className="text-white font-bold text-2xl">
                            {estimatedOdds.no}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* End Date */}
                    {formData.endDate && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          ENDS ON
                        </p>
                        <p className="text-white font-semibold">
                          {new Date(
                            `${formData.endDate}T${formData.endTime}`
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-gray-400">
                      Fill out the form to see a preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">
              📋 Market Creation Guidelines
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>
                  Questions must be clear, unambiguous, and answerable with
                  YES or NO
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>
                  Include specific resolution criteria in the description
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Set a realistic end date for market resolution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>
                  Avoid subjective questions or questions without clear
                  verification
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>
                  Don't create duplicate markets or markets on illegal activities
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}
