/**
 * PrismaFi - Create Market Form Component
 *
 * Integrated with usePredictionMarket hook for creating markets on-chain
 */

import { useState } from 'react'
import { useRouter } from 'next/router'
import { usePredictionMarket } from '@/hooks/usePredictionMarket'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'Social',
  'Sports',
  'Crypto',
  'Economics',
  'Technology',
  'Entertainment',
  'Science',
  'Other',
]

const EXAMPLE_MARKETS = [
  {
    question: 'Will The Breakfast Club mention LUV NFT by December 2025?',
    description:
      'Resolves YES if The Breakfast Club will mention LUV NFT by Dec 31, 2025. NO otherwise.',
    category: 'Social',
  },
  {
    question: 'Will Bitcoin reach $100K before 2026?',
    description:
      'Resolves YES if BTC/USD reaches $100,000 on any major exchange (Coinbase, Binance, Kraken) before Jan 1, 2026.',
    category: 'Crypto',
  },
  {
    question: 'Will Colombia beat Brazil in Copa América 2025?',
    description:
      "Resolves YES if Colombia wins the match. NO if Brazil wins or it's a draw.",
    category: 'Sports',
  },
]

export function CreateMarketForm() {
  const router = useRouter()
  const { connected, createMarket, isCreatingMarket } = usePredictionMarket()

  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Social')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('23:59')

  // Character counters
  const questionCharsLeft = 200 - question.length
  const descriptionCharsLeft = 1000 - description.length

  // Load example
  const loadExample = (index: number) => {
    const example = EXAMPLE_MARKETS[index]
    setQuestion(example.question)
    setDescription(example.description)
    setCategory(example.category)

    // Set end date to 30 days from now
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    setEndDate(futureDate.toISOString().split('T')[0])
  }

  // Validation
  const isValid =
    question.length > 0 &&
    question.length <= 200 &&
    description.length > 0 &&
    description.length <= 1000 &&
    category.length > 0 &&
    category.length <= 50 &&
    endDate.length > 0

  // Check if end date is in future
  const endDateTime =
    endDate && endTime ? new Date(`${endDate}T${endTime}`) : null

  const isFutureDate = endDateTime && endDateTime.getTime() > Date.now()

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!isValid) {
      toast.error('Please fill all fields correctly')
      return
    }

    if (!isFutureDate) {
      toast.error('End date must be in the future')
      return
    }

    const endTimestamp = Math.floor(endDateTime!.getTime() / 1000)

    const marketPDA = await createMarket({
      question,
      description,
      endTime: endTimestamp,
      category,
    })

    if (marketPDA) {
      // Navigate to the new market page
      router.push(`/market/${marketPDA.toString()}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-8 bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Create Prediction Market
          </h2>
          <p className="text-gray-600">
            Create a new market on any future event. Markets are immutable once
            created.
          </p>
        </div>

        {/* Example Markets */}
        <div className="p-4 mb-8 rounded-lg bg-blue-50">
          <div className="mb-3 text-sm font-medium text-blue-900">
            💡 Need inspiration? Try an example:
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {EXAMPLE_MARKETS.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => loadExample(index)}
                className="p-3 text-left transition-all bg-white border border-blue-200 rounded hover:border-blue-400 hover:shadow"
              >
                <div className="mb-1 text-xs font-semibold text-blue-700">
                  {example.category}
                </div>
                <div className="text-sm text-gray-700 line-clamp-2">
                  {example.question}
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Market Question *
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Will Argentina dollarize by December 2025?"
              maxLength={200}
              required
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                Keep it clear and unambiguous
              </p>
              <span
                className={`text-xs font-medium ${
                  questionCharsLeft < 20 ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {questionCharsLeft} chars left
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Resolution Criteria *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe exactly how this market will be resolved. What sources will be used? What counts as YES vs NO?"
              rows={6}
              maxLength={1000}
              required
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                Be specific about data sources and resolution logic
              </p>
              <span
                className={`text-xs font-medium ${
                  descriptionCharsLeft < 50 ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {descriptionCharsLeft} chars left
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* End Date & Time */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                End Time (UTC) *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {endDateTime && (
            <div
              className={`p-4 rounded-lg ${
                isFutureDate
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`text-sm ${
                  isFutureDate ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {isFutureDate ? (
                  <>
                    ✓ Market will close on {endDateTime.toLocaleDateString()} at{' '}
                    {endDateTime.toLocaleTimeString()}
                  </>
                ) : (
                  <>⚠️ End date must be in the future</>
                )}
              </p>
            </div>
          )}

          {/* Preview */}
          {question && description && (
            <div className="p-6 mt-8 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Preview
              </h3>
              <div className="space-y-2">
                <div className="text-lg font-bold text-gray-900">
                  {question}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="px-2 py-1 text-xs font-medium bg-white rounded">
                    {category}
                  </span>
                  {endDateTime && (
                    <span>Closes {endDateTime.toLocaleDateString()}</span>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-700">{description}</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              !connected || !isValid || !isFutureDate || isCreatingMarket
            }
            className={`
              w-full py-4 px-6 rounded-lg font-bold text-lg transition-all
              ${
                !connected || !isValid || !isFutureDate
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }
              ${isCreatingMarket && 'opacity-75 cursor-wait'}
            `}
          >
            {!connected ? (
              'Connect Wallet to Create Market'
            ) : isCreatingMarket ? (
              <>
                <span className="inline-block mr-2 animate-spin">⌛</span>
                Creating Market...
              </>
            ) : (
              'Create Market (Free)'
            )}
          </button>

          {!connected && (
            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <p className="text-sm text-yellow-800">
                ⚠️ You need to connect your wallet to create a market.
              </p>
            </div>
          )}

          {connected && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-800">
                💡 Creating a market costs ~0.01 SOL for rent (refundable when
                market closes).
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}


