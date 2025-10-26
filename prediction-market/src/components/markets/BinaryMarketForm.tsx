'use client'

import { CATEGORIES } from '@/lib/mock/markets'

interface BinaryMarketFormProps {
  formData: {
    question: string
    description: string
    category: string
    endDate: string
    endTime: string
  }
  errors: {
    question?: string
    description?: string
    category?: string
    endDate?: string
  }
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
}

export default function BinaryMarketForm({
  formData,
  errors,
  onChange,
}: BinaryMarketFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-bold text-white">
          2. Market Details
        </h3>
        <p className="mb-4 text-sm text-gray-400">
          Fill in the information for your YES/NO market
        </p>
      </div>

      {/* Question */}
      <div>
        <label className="block mb-2 font-semibold text-white">
          Market Question *
          <span className="ml-2 text-sm font-normal text-gray-400">
            (must end with ?)
          </span>
        </label>
        <input
          type="text"
          name="question"
          value={formData.question}
          onChange={onChange}
          maxLength={150}
          placeholder="Will Nas mention YE/NO BET before 2025?"
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.question ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        {errors.question && (
          <p className="mt-2 text-sm text-red-400">{errors.question}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          {formData.question.length}/150 characters
        </p>
      </div>

      {/* Resolution Criteria */}
      <div>
        <label className="block mb-2 font-semibold text-white">
          Resolution Criteria *
          <span className="ml-2 text-sm font-normal text-gray-400">
            (how will this be verified?)
          </span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          maxLength={400}
          placeholder="This market resolves YES if Nas talks about YE/NO BET by December 31, 2025."
          rows={5}
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.description ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-400">{errors.description}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          {formData.description.length}/400 characters
        </p>

        {/* Helper tip */}
        <div className="p-3 mt-3 border rounded-lg bg-blue-500/10 border-blue-500/20">
          <p className="text-xs text-blue-300">
            <strong>💡 Tip:</strong> Include specific sources, dates, and
            verification methods. Clear criteria = fewer disputes.
          </p>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block mb-2 font-semibold text-white">
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={onChange}
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
          <p className="mt-2 text-sm text-red-400">{errors.category}</p>
        )}
      </div>

      {/* End Date & Time */}
      <div>
        <label className="block mb-2 font-semibold text-white">
          Market End Date & Time *
          <span className="ml-2 text-sm font-normal text-gray-400">
            (when should trading stop?)
          </span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
            className={`px-4 py-3 bg-gray-800 border ${
              errors.endDate ? 'border-red-500' : 'border-gray-700'
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={onChange}
            className="px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {errors.endDate && (
          <p className="mt-2 text-sm text-red-400">{errors.endDate}</p>
        )}
      </div>
    </div>
  )
}



