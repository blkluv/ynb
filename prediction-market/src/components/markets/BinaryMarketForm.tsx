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
          🎯 2. Set Up Your Market
        </h3>
        <p className="mb-4 text-sm text-gray-400">
          Make it clear, make it fun, and tag @PredicTokFun when you're done! 🚀
        </p>
      </div>

      {/* Question */}
      <div>
        <label className="block mb-2 font-semibold text-white">
          Your Prediction Question *
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
          placeholder="Will your favorite influencer actually launch that product? 👀 Drop your bet."
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.question ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F0FF]`}
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
          How Will We Know Who Won? *
          <span className="ml-2 text-sm font-normal text-gray-400">
            (be specific!)
          </span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          maxLength={400}
          placeholder="This market hits YES if they actually post the video by Friday. Source: Their TikTok page. We'll check the receipts. 📱"
          rows={5}
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.description ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F0FF] resize-none`}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-400">{errors.description}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          {formData.description.length}/400 characters
        </p>

        {/* Helper tip - TikTok style */}
        <div className="mt-3 bg-gradient-to-r from-[#00F0FF]/10 to-[#FF0080]/10 border border-[#00F0FF]/20 rounded-lg p-3">
          <p className="text-[#00F0FF] text-xs">
            <strong>💡 Pro Tip:</strong> Drop the receipts! Link your sources so everyone knows it's legit. No cap. 🎯
          </p>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block mb-2 font-semibold text-white">
          Pick Your Vibe *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.category ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF]`}
        >
          <option value="">Choose a category</option>
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
          When Does the Bet Close? *
          <span className="ml-2 text-sm font-normal text-gray-400">
            (set your deadline)
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
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF]`}
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={onChange}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
          />
        </div>
        {errors.endDate && (
          <p className="mt-2 text-sm text-red-400">{errors.endDate}</p>
        )}
      </div>

      {/* TikTok Callout */}
      <div className="mt-4 p-4 bg-[#FF0080]/5 border border-[#FF0080]/20 rounded-lg">
        <p className="text-[#FF0080] text-sm text-center">
          📱 Don't forget to tag <strong>@PredicTokFun</strong> and use <strong>#PredicTokFun</strong> when you share your market on TikTok!
          <span className="block mt-1 text-xs text-gray-400">We'll feature the best ones! 🎯</span>
        </p>
      </div>
    </div>
  )
}
