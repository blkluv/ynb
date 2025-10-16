'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import MarketCard from '@/components/market/MarketCard';
import {
  MarketQuestion,
  MarketCategory,
  OutcomeType,
  MarketStatus
} from '@/types/market';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// Mock data - In production, this would come from API/blockchain
const mockMarkets: MarketQuestion[] = [
  {
    id: '1',
    question: 'Will Bitcoin reach $100,000 by December 31, 2024?',
    description: 'This market will resolve to YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange.',
    category: MarketCategory.CRYPTO,
    resolutionDate: '2024-12-31T23:59:59Z',
    resolutionSource: 'https://www.coingecko.com/en/coins/bitcoin',
    outcomeType: OutcomeType.BINARY,
    options: [
      { id: 'yes', text: 'Yes', probability: 0.65, volume: 12500 },
      { id: 'no', text: 'No', probability: 0.35, volume: 8300 }
    ],
    creator: '0x1234...5678',
    createdAt: '2024-01-15T10:00:00Z',
    status: MarketStatus.ACTIVE,
    volume: 20800,
    participants: 342,
    fees: { creationFee: 0.5, tradingFee: 0.5, resolutionFee: 1.0 }
  },
  {
    id: '2',
    question: 'Will AI replace 50% of software developers by 2030?',
    description: 'Market resolves YES if credible studies show AI has replaced at least 50% of traditional software development roles.',
    category: MarketCategory.TECHNOLOGY,
    resolutionDate: '2030-12-31T23:59:59Z',
    resolutionSource: 'https://www.example.com/ai-study',
    outcomeType: OutcomeType.BINARY,
    options: [
      { id: 'yes', text: 'Yes', probability: 0.28, volume: 5200 },
      { id: 'no', text: 'No', probability: 0.72, volume: 13400 }
    ],
    creator: '0x2345...6789',
    createdAt: '2024-02-01T10:00:00Z',
    status: MarketStatus.ACTIVE,
    volume: 18600,
    participants: 267,
    fees: { creationFee: 0.5, tradingFee: 0.5, resolutionFee: 1.0 }
  },
  {
    id: '3',
    question: 'Who will win the 2024 US Presidential Election?',
    description: 'Market resolves based on the official Electoral College results.',
    category: MarketCategory.POLITICS,
    resolutionDate: '2024-11-06T23:59:59Z',
    resolutionSource: 'https://www.example.com/election-results',
    outcomeType: OutcomeType.CATEGORICAL,
    options: [
      { id: 'dem', text: 'Democratic Candidate', probability: 0.52, volume: 15600 },
      { id: 'rep', text: 'Republican Candidate', probability: 0.46, volume: 13800 },
      { id: 'other', text: 'Other', probability: 0.02, volume: 600 }
    ],
    creator: '0x3456...7890',
    createdAt: '2024-01-20T10:00:00Z',
    status: MarketStatus.ACTIVE,
    volume: 30000,
    participants: 521,
    fees: { creationFee: 0.5, tradingFee: 0.5, resolutionFee: 1.0 }
  },
  {
    id: '4',
    question: 'Will Ethereum reach $5,000 by June 2024?',
    description: 'Resolves YES if ETH hits $5,000 on major exchanges before the deadline.',
    category: MarketCategory.CRYPTO,
    resolutionDate: '2024-06-30T23:59:59Z',
    resolutionSource: 'https://www.coingecko.com/en/coins/ethereum',
    outcomeType: OutcomeType.BINARY,
    options: [
      { id: 'yes', text: 'Yes', probability: 0.42, volume: 8900 },
      { id: 'no', text: 'No', probability: 0.58, volume: 12300 }
    ],
    creator: '0x4567...8901',
    createdAt: '2024-03-01T10:00:00Z',
    status: MarketStatus.ACTIVE,
    volume: 21200,
    participants: 389,
    fees: { creationFee: 0.5, tradingFee: 0.5, resolutionFee: 1.0 }
  },
  {
    id: '5',
    question: 'Will there be a new iPhone release in September 2024?',
    description: 'Market resolves YES if Apple announces a new iPhone model in September 2024.',
    category: MarketCategory.TECHNOLOGY,
    resolutionDate: '2024-09-30T23:59:59Z',
    resolutionSource: 'https://www.apple.com',
    outcomeType: OutcomeType.BINARY,
    options: [
      { id: 'yes', text: 'Yes', probability: 0.89, volume: 17800 },
      { id: 'no', text: 'No', probability: 0.11, volume: 2200 }
    ],
    creator: '0x5678...9012',
    createdAt: '2024-01-10T10:00:00Z',
    status: MarketStatus.ACTIVE,
    volume: 20000,
    participants: 412,
    fees: { creationFee: 0.5, tradingFee: 0.5, resolutionFee: 1.0 }
  },
  {
    id: '6',
    question: 'Will global temperatures increase by 1.5°C by 2025?',
    description: 'Based on IPCC official reports and measurements.',
    category: MarketCategory.WEATHER,
    resolutionDate: '2025-12-31T23:59:59Z',
    resolutionSource: 'https://www.ipcc.ch',
    outcomeType: OutcomeType.BINARY,
    options: [
      { id: 'yes', text: 'Yes', probability: 0.73, volume: 9200 },
      { id: 'no', text: 'No', probability: 0.27, volume: 3400 }
    ],
    creator: '0x6789...0123',
    createdAt: '2024-02-15T10:00:00Z',
    status: MarketStatus.ACTIVE,
    volume: 12600,
    participants: 198,
    fees: { creationFee: 0.5, tradingFee: 0.5, resolutionFee: 1.0 }
  }
];

const categories = [
  { value: 'all', label: 'All Markets', emoji: '🌐' },
  { value: MarketCategory.CRYPTO, label: 'Crypto', emoji: '₿' },
  { value: MarketCategory.TECHNOLOGY, label: 'Technology', emoji: '💻' },
  { value: MarketCategory.POLITICS, label: 'Politics', emoji: '🏛️' },
  { value: MarketCategory.SPORTS, label: 'Sports', emoji: '⚽' },
  { value: MarketCategory.ECONOMICS, label: 'Economics', emoji: '📈' },
  { value: MarketCategory.WEATHER, label: 'Weather', emoji: '🌤️' },
  { value: MarketCategory.ENTERTAINMENT, label: 'Entertainment', emoji: '🎬' },
  { value: MarketCategory.OTHER, label: 'Other', emoji: '📊' }
];

const sortOptions = [
  { value: 'volume', label: 'Highest Volume' },
  { value: 'participants', label: 'Most Participants' },
  { value: 'newest', label: 'Newest' },
  { value: 'ending-soon', label: 'Ending Soon' }
];

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('volume');
  const [showFilters, setShowFilters] = useState(false);

  const filteredMarkets = mockMarkets
    .filter(market => {
      const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || market.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume - a.volume;
        case 'participants':
          return b.participants - a.participants;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'ending-soon':
          return new Date(a.resolutionDate).getTime() - new Date(b.resolutionDate).getTime();
        default:
          return 0;
      }
    });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore Markets</h1>
            <p className="text-gray-400">
              Discover and trade on prediction markets across various categories
            </p>
          </div>
          <Link href="/create-market">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-purple-500/30">
              <PlusIcon className="w-5 h-5" />
              Create Market
            </button>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search markets..."
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                showFilters
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedCategory === category.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.emoji} {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Markets</div>
            <div className="text-white text-2xl font-bold">{filteredMarkets.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Volume</div>
            <div className="text-white text-2xl font-bold">
              ${(filteredMarkets.reduce((sum, m) => sum + m.volume, 0) / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Active Traders</div>
            <div className="text-white text-2xl font-bold">
              {filteredMarkets.reduce((sum, m) => sum + m.participants, 0)}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Avg. Fee</div>
            <div className="text-white text-2xl font-bold">0.5%</div>
          </div>
        </div>

        {/* Markets Grid */}
        {filteredMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No markets found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters
            </p>
            <Link href="/create-market">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all">
                Create the First Market
              </button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}




