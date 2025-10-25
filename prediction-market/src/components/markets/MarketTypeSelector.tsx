'use client'

interface MarketTypeSelectorProps {
  selectedType: 'binary' | 'scalar'
  onTypeChange: (type: 'binary' | 'scalar') => void
}

export default function MarketTypeSelector({
  selectedType,
  onTypeChange,
}: MarketTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-bold text-lg mb-2">
          1. Choose Market Type
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Select the type of prediction market you want to create
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Binary Market Option */}
        <button
          type="button"
          onClick={() => onTypeChange('binary')}
          className={`relative p-6 rounded-xl border-2 transition-all text-left ${
            selectedType === 'binary'
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
          }`}
        >
          {selectedType === 'binary' && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">🎯</div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">
                Binary Market
              </h4>
              <p className="text-sm text-purple-300 font-medium">
                YES / NO Outcomes
              </p>
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Best for accountability, promises, and binary events. Users predict
            whether something will happen or not.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-gray-400">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Simple for users to understand</span>
            </div>
            <div className="flex items-start gap-2 text-gray-400">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Clear social pressure (did it happen?)</span>
            </div>
            <div className="flex items-start gap-2 text-gray-400">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Easy to verify and resolve</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-2">EXAMPLE:</p>
            <p className="text-xs text-gray-300 italic">
              "Will Milei achieve zero deficit in 2025?"
            </p>
          </div>
        </button>

        {/* Scalar Market Option */}
        <button
          type="button"
          onClick={() => onTypeChange('scalar')}
          className={`relative p-6 rounded-xl border-2 transition-all text-left ${
            selectedType === 'scalar'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
          }`}
        >
          {selectedType === 'scalar' && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">📊</div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">
                Scalar Market
              </h4>
              <p className="text-sm text-blue-300 font-medium">
                Numeric Range Predictions
              </p>
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Best for metrics and official statistics. Users predict an exact
            number and get paid by accuracy.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-gray-400">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Rewards precision and calibration</span>
            </div>
            <div className="flex items-start gap-2 text-gray-400">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Great for official metrics (CPI, budgets)</span>
            </div>
            <div className="flex items-start gap-2 text-gray-400">
              <span className="text-yellow-400 mt-0.5">!</span>
              <span>Requires verified data source</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-2">EXAMPLE:</p>
            <p className="text-xs text-gray-300 italic">
              "Argentina monthly inflation (INDEC) - March 2025"
            </p>
          </div>
        </button>
      </div>

      {/* Comparison Info */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm mb-1">
              Which one should I choose?
            </p>
            <p className="text-gray-400 text-xs">
              <strong className="text-purple-300">Binary</strong> for promises
              and accountability (80% of use cases in LATAM).{' '}
              <strong className="text-blue-300">Scalar</strong> for official
              statistics and precise metrics (analysts and researchers).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

