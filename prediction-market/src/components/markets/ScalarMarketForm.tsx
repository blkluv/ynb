'use client'

import { CATEGORIES } from '@/lib/mock/markets'

interface ScalarMarketFormProps {
  formData: {
    question: string
    description: string
    category: string
    endDate: string
    endTime: string
    minValue: string
    maxValue: string
    unit: string
    dataSource: string
    dataSourceUrl: string
  }
  errors: {
    question?: string
    description?: string
    category?: string
    endDate?: string
    minValue?: string
    maxValue?: string
    unit?: string
    dataSource?: string
  }
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
}

export default function ScalarMarketForm({
  formData,
  errors,
  onChange,
}: ScalarMarketFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-bold text-lg mb-2">
          2. Market Details
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Configure your numeric prediction market
        </p>
      </div>

      {/* Question */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Market Question *
          <span className="text-gray-400 font-normal text-sm ml-2">
            (what number will be predicted?)
          </span>
        </label>
        <input
          type="text"
          name="question"
          value={formData.question}
          onChange={onChange}
          placeholder="Argentina monthly inflation (INDEC) - March 2025"
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.question ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.question && (
          <p className="text-red-400 text-sm mt-2">{errors.question}</p>
        )}
        <p className="text-gray-500 text-xs mt-2">
          {formData.question.length}/200 characters
        </p>
      </div>

      {/* Value Range */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2">
            Min Value *
          </label>
          <input
            type="number"
            name="minValue"
            value={formData.minValue}
            onChange={onChange}
            placeholder="0"
            step="0.01"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.minValue ? 'border-red-500' : 'border-gray-700'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.minValue && (
            <p className="text-red-400 text-xs mt-1">{errors.minValue}</p>
          )}
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">
            Max Value *
          </label>
          <input
            type="number"
            name="maxValue"
            value={formData.maxValue}
            onChange={onChange}
            placeholder="50"
            step="0.01"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.maxValue ? 'border-red-500' : 'border-gray-700'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.maxValue && (
            <p className="text-red-400 text-xs mt-1">{errors.maxValue}</p>
          )}
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Unit *</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={onChange}
            placeholder="%"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.unit ? 'border-red-500' : 'border-gray-700'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.unit && (
            <p className="text-red-400 text-xs mt-1">{errors.unit}</p>
          )}
        </div>
      </div>

      {/* Visual Range Preview */}
      {formData.minValue && formData.maxValue && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-3">RANGE PREVIEW:</p>
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-white font-bold text-sm">
              {formData.minValue}
              {formData.unit}
            </span>
            <span className="text-white font-bold text-sm">
              {formData.maxValue}
              {formData.unit}
            </span>
          </div>
        </div>
      )}

      {/* Data Source */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Official Data Source *
          <span className="text-gray-400 font-normal text-sm ml-2">
            (where will the real number come from?)
          </span>
        </label>
        <input
          type="text"
          name="dataSource"
          value={formData.dataSource}
          onChange={onChange}
          placeholder="INDEC - Instituto Nacional de Estadística y Censos"
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.dataSource ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.dataSource && (
          <p className="text-red-400 text-sm mt-2">{errors.dataSource}</p>
        )}
      </div>

      {/* Data Source URL */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Data Source URL
          <span className="text-gray-400 font-normal text-sm ml-2">
            (optional - link to official source)
          </span>
        </label>
        <input
          type="url"
          name="dataSourceUrl"
          value={formData.dataSourceUrl}
          onChange={onChange}
          placeholder="https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Resolution Details */}
      <div>
        <label className="block text-white font-semibold mb-2">
          Resolution Details *
          <span className="text-gray-400 font-normal text-sm ml-2">
            (timestamp, timezone, rounding rules)
          </span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="This market resolves to the official monthly inflation rate published by INDEC for March 2025. Resolution date: First business day of April 2025, 16:00 ART. Source: INDEC official website (www.indec.gob.ar). Rounding: 2 decimals. If data is delayed >7 days, market cancels and returns funds."
          rows={5}
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.description ? 'border-red-500' : 'border-gray-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-2">{errors.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-2">
          {formData.description.length}/1000 characters
        </p>

        {/* Scalar checklist */}
        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-yellow-300 text-xs font-semibold mb-2">
            ⚠️ Scalar Checklist (REQUIRED):
          </p>
          <ul className="space-y-1 text-yellow-200/80 text-xs">
            <li>✓ Exact source name + URL</li>
            <li>✓ Timestamp + timezone (e.g., "16:00 ART")</li>
            <li>✓ Revision window (e.g., "3 business days")</li>
            <li>✓ Rounding rules (e.g., "2 decimals")</li>
            <li>✓ Fallback if delayed (e.g., "cancel if &gt;7 days")</li>
          </ul>
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
          } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
          Trading End Date & Time *
          <span className="text-gray-400 font-normal text-sm ml-2">
            (when should predictions close?)
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
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={onChange}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {errors.endDate && (
          <p className="text-red-400 text-sm mt-2">{errors.endDate}</p>
        )}
      </div>
    </div>
  )
}

