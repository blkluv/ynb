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
        <h3 className="text-white font-bold text-lg mb-2">
          2. Market Details
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Fill in the information for your YES/NO market
        </p>
      </div>

      {/* Question */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Market Question *
          <span className="text-gray-400 font-normal text-sm ml-2">
            (must end with ?)
          </span>
        </label>
        <input
          type="text"
          name="question"
          value={formData.question}
          onChange={onChange}
          placeholder="¿Milei cumplirá su promesa de déficit cero en 2025?"
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.question ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        {errors.question && (
          <p className="text-red-400 text-sm mt-2">{errors.question}</p>
        )}
        <p className="text-gray-500 text-xs mt-2">
          {formData.question.length}/200 characters
        </p>
      </div>

      {/* Resolution Criteria */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Resolution Criteria *
          <span className="text-gray-400 font-normal text-sm ml-2">
            (how will this be verified?)
          </span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="This market resolves YES if official government reports confirm zero deficit by December 31, 2025. Source: Ministry of Economy official statements and published budget reports."
          rows={5}
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.description ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-2">{errors.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-2">
          {formData.description.length}/1000 characters
        </p>

        {/* Helper tip */}
        <div className="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-blue-300 text-xs">
            <strong>💡 Tip:</strong> Include specific sources, dates, and
            verification methods. Clear criteria = fewer disputes.
          </p>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-white font-semibold mb-2">
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
          <p className="text-red-400 text-sm mt-2">{errors.category}</p>
        )}
      </div>

      {/* End Date & Time */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Market End Date & Time *
          <span className="text-gray-400 font-normal text-sm ml-2">
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
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {errors.endDate && (
          <p className="text-red-400 text-sm mt-2">{errors.endDate}</p>
        )}
      </div>
    </div>
  )
}



