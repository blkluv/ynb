'use client';

import React from 'react';
import { MarketQuestion } from '@/types/market';
import { CalendarIcon, GlobeAltIcon, TagIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface MarketPreviewProps {
  market: MarketQuestion;
}

const categoryEmojis: Record<string, string> = {
  'sports': '⚽',
  'politics': '🏛️',
  'economics': '📈',
  'technology': '💻',
  'crypto': '₿',
  'weather': '🌤️',
  'entertainment': '🎬',
  'other': '📊'
};

const formatDate = (dateString: string) => {
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

export default function MarketPreview({ market }: MarketPreviewProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="space-y-6">
        {/* Question */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-2">{market.question}</h4>
          {market.description && (
            <p className="text-gray-300 text-sm leading-relaxed">{market.description}</p>
          )}
        </div>

        {/* Category and Type */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <TagIcon className="w-4 h-4" />
            <span>{categoryEmojis[market.category] || '📊'} {market.category.toUpperCase()}</span>
          </div>
          <div className="text-gray-400">
            {formatOutcomeType(market.outcomeType)}
          </div>
        </div>

        {/* Options */}
        <div>
          <h5 className="font-medium text-white mb-3">Market Options:</h5>
          <div className="space-y-2">
            {market.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
              >
                <span className="text-white font-medium">{option.text}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                      style={{ width: `${option.probability * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-purple-400 font-bold text-sm min-w-[3rem] text-right">
                    {(option.probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs text-gray-400">Volume</div>
              <div className="text-white font-semibold">${market.volume.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-xs text-gray-400">Traders</div>
              <div className="text-white font-semibold">{market.participants}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-xs text-gray-400">Resolution</div>
              <div className="text-white font-semibold text-xs">
                {formatDate(market.resolutionDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-600/20 rounded flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-xs">%</span>
            </div>
            <div>
              <div className="text-xs text-gray-400">Trading Fee</div>
              <div className="text-white font-semibold">{market.fees.tradingFee}%</div>
            </div>
          </div>
        </div>

        {/* Resolution Details */}
        <div className="space-y-3">
          {market.resolutionSource && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <GlobeAltIcon className="w-4 h-4" />
              <a 
                href={market.resolutionSource} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors truncate"
              >
                {market.resolutionSource}
              </a>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <span className="text-sm text-gray-400">Market Status:</span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
            market.status === 'active'
              ? 'bg-green-600/20 text-green-400 border-green-600/30'
              : market.status === 'resolved'
              ? 'bg-blue-600/20 text-blue-400 border-blue-600/30'
              : 'bg-gray-600/20 text-gray-400 border-gray-600/30'
          }`}>
            {market.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}