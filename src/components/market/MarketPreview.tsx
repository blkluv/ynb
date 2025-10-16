'use client';

import React from 'react';
import { CreateMarketForm, MarketCategory } from '@/types/market';
import { CalendarIcon, GlobeAltIcon, TagIcon } from '@heroicons/react/24/outline';

interface MarketPreviewProps {
  form: CreateMarketForm;
}

const categoryEmojis: Record<MarketCategory, string> = {
  [MarketCategory.SPORTS]: '⚽',
  [MarketCategory.POLITICS]: '🏛️',
  [MarketCategory.ECONOMICS]: '📈',
  [MarketCategory.TECHNOLOGY]: '💻',
  [MarketCategory.CRYPTO]: '₿',
  [MarketCategory.WEATHER]: '🌤️',
  [MarketCategory.ENTERTAINMENT]: '🎬',
  [MarketCategory.OTHER]: '📊'
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatOutcomeType = (type: string) => {
  switch (type) {
    case 'binary': return 'Binary (Yes/No)';
    case 'categorical': return 'Categorical';
    case 'scalar': return 'Scalar (Number)';
    default: return type;
  }
};

export default function MarketPreview({ form }: MarketPreviewProps) {
  if (!form.question.trim()) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-300">Market Preview</h3>
        <p className="text-gray-400 italic">Start filling out the form to see a preview of your market...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Market Preview</h3>
      
      <div className="space-y-6">
        {/* Question */}
        <div>
          <h4 className="text-lg font-medium text-white mb-2">{form.question}</h4>
          {form.description && (
            <p className="text-gray-300 text-sm leading-relaxed">{form.description}</p>
          )}
        </div>

        {/* Category and Type */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <TagIcon className="w-4 h-4" />
            <span>{categoryEmojis[form.category]} {form.category}</span>
          </div>
          <div className="text-gray-400">
            {formatOutcomeType(form.outcomeType)}
          </div>
        </div>

        {/* Options */}
        <div>
          <h5 className="font-medium text-white mb-3">Market Options:</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {form.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
              >
                <span className="text-white font-medium">{option.text || `Option ${index + 1}`}</span>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-16 h-2 bg-gray-600 rounded-full">
                    <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span>50%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>Resolution: {formatDate(form.resolutionDate)}</span>
          </div>
          
          {form.resolutionSource && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <GlobeAltIcon className="w-4 h-4" />
              <span className="truncate">{form.resolutionSource}</span>
            </div>
          )}
        </div>

        {/* Fees */}
        <div className="border-t border-gray-700 pt-4">
          <h5 className="font-medium text-white mb-3">Fee Structure:</h5>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400">Creation</div>
              <div className="text-white font-medium">{form.fees.creationFee}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Trading</div>
              <div className="text-white font-medium">{form.fees.tradingFee}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Resolution</div>
              <div className="text-white font-medium">{form.fees.resolutionFee}%</div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <span className="text-sm text-gray-400">Market Status:</span>
          <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-600/30">
            Draft
          </span>
        </div>
      </div>
    </div>
  );
}




