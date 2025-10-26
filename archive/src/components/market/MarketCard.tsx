'use client';

import React from 'react';
import Link from 'next/link';
import { MarketQuestion, MarketCategory } from '@/types/market';
import {
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface MarketCardProps {
  market: MarketQuestion;
}

const categoryEmojis: Record<MarketCategory, string> = {
  [MarketCategory.SPORTS]: '⚽',
  [MarketCategory.SOCIAL]: '📲',
  [MarketCategory.ECONOMICS]: '📈',
  [MarketCategory.TECHNOLOGY]: '💻',
  [MarketCategory.CRYPTO]: '₿',
  [MarketCategory.WEATHER]: '🌤️',
  [MarketCategory.ENTERTAINMENT]: '🎬',
  [MarketCategory.OTHER]: '📊'
};

const formatTimeRemaining = (dateString: string) => {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - now.getTime();

  if (diff < 0) return 'Closed';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
};

export default function MarketCard({ market }: MarketCardProps) {
  const topOption = market.options.reduce((prev, current) =>
    (prev.probability > current.probability) ? prev : current
  );

  return (
    <Link href={`/market/${market.id}`}>
      <div className="p-5 transition-all bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryEmojis[market.category]}</span>
            <span className="text-xs tracking-wide text-gray-400 uppercase">
              {market.category}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-400">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>{(topOption.probability * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Question */}
        <h3 className="mb-3 font-semibold text-white transition-colors line-clamp-2 group-hover:text-purple-300">
          {market.question}
        </h3>

        {/* Options Preview */}
        <div className="mb-4 space-y-2">
          {market.options.slice(0, 2).map((option) => (
            <div key={option.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{option.text}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                    style={{ width: `${option.probability * 100}%` }}
                  ></div>
                </div>
                <span className="w-12 text-sm font-medium text-right text-purple-400">
                  {(option.probability * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-700">
          <div className="flex items-center gap-1.5">
            <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
            <div className="text-xs">
              <div className="text-gray-400">Volume</div>
              <div className="font-medium text-white">
                ${(market.volume / 1000).toFixed(1)}k
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <UserGroupIcon className="w-4 h-4 text-gray-400" />
            <div className="text-xs">
              <div className="text-gray-400">Traders</div>
              <div className="font-medium text-white">{market.participants}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <div className="text-xs">
              <div className="text-gray-400">Ends in</div>
              <div className="font-medium text-white">
                {formatTimeRemaining(market.resolutionDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}






























