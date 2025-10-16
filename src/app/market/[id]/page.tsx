'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import TradingPanel from '@/components/market/TradingPanel';
import OrderBook from '@/components/market/OrderBook';
import PositionsList from '@/components/market/PositionsList';
import TradeHistory from '@/components/market/TradeHistory';
import {
  MarketQuestion,
  MarketCategory,
  OutcomeType,
  MarketStatus,
  TradeType,
  TradeStatus,
  Position,
  Trade,
  OrderBook as OrderBookType
} from '@/types/market';
import { CalendarIcon, UserGroupIcon, CurrencyDollarIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

// Mock data - In production, this would come from API/blockchain
const mockMarket: MarketQuestion = {
  id: '1',
  question: 'Will Bitcoin reach $100,000 by December 31, 2024?',
  description: 'This market will resolve to YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange (Coinbase, Binance, Kraken) before 11:59 PM UTC on December 31, 2024. Price will be verified using CoinGecko API data.',
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
  fees: {
    creationFee: 0.5,
    tradingFee: 0.5,
    resolutionFee: 1.0
  }
};

const mockOrderBook: OrderBookType = {
  optionId: 'yes',
  bids: [
    { price: 0.6480, shares: 150, total: 97.2 },
    { price: 0.6450, shares: 200, total: 129.0 },
    { price: 0.6400, shares: 350, total: 224.0 },
    { price: 0.6350, shares: 180, total: 114.3 },
    { price: 0.6300, shares: 250, total: 157.5 }
  ],
  asks: [
    { price: 0.6520, shares: 180, total: 117.36 },
    { price: 0.6550, shares: 220, total: 144.1 },
    { price: 0.6600, shares: 300, total: 198.0 },
    { price: 0.6650, shares: 150, total: 99.75 },
    { price: 0.6700, shares: 200, total: 134.0 }
  ]
};

const mockPositions: Position[] = [
  {
    id: 'pos1',
    marketId: '1',
    optionId: 'yes',
    shares: 50,
    averagePrice: 0.62,
    currentValue: 32.5,
    profitLoss: 1.5,
    profitLossPercentage: 4.84
  }
];

const mockTrades: Trade[] = [
  {
    id: 'trade1',
    marketId: '1',
    userId: 'user1',
    optionId: 'yes',
    type: TradeType.BUY,
    amount: 31,
    shares: 50,
    price: 0.62,
    fee: 0.155,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: TradeStatus.CONFIRMED,
    txHash: '0xabcd...1234'
  },
  {
    id: 'trade2',
    marketId: '1',
    userId: 'user1',
    optionId: 'no',
    type: TradeType.BUY,
    amount: 10,
    shares: 28.57,
    price: 0.35,
    fee: 0.05,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: TradeStatus.CONFIRMED,
    txHash: '0xabcd...5678'
  }
];

export default function MarketPage() {
  const [positions] = useState<Position[]>(mockPositions);
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [selectedTab, setSelectedTab] = useState<'trade' | 'positions' | 'history'>('trade');

  const handleTrade = async (optionId: string, type: TradeType, amount: number, shares: number) => {
    console.log('Trade:', { optionId, type, amount, shares });
    
    // Simulate trade execution
    const newTrade: Trade = {
      id: `trade${Date.now()}`,
      marketId: mockMarket.id,
      userId: 'user1',
      optionId,
      type,
      amount,
      shares,
      price: mockMarket.options.find(opt => opt.id === optionId)?.probability || 0,
      fee: amount * (mockMarket.fees.tradingFee / 100),
      timestamp: new Date().toISOString(),
      status: TradeStatus.PENDING,
      txHash: undefined
    };

    setTrades(prev => [newTrade, ...prev]);

    // Simulate blockchain confirmation
    setTimeout(() => {
      setTrades(prev => prev.map(t => 
        t.id === newTrade.id 
          ? { ...t, status: TradeStatus.CONFIRMED, txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}` }
          : t
      ));
    }, 2000);
  };

  const handleSellPosition = (positionId: string) => {
    console.log('Sell position:', positionId);
    // TODO: Implement sell position logic
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Market Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-medium rounded-full border border-purple-600/30">
                  ₿ {mockMarket.category}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  mockMarket.status === MarketStatus.ACTIVE
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                    : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                }`}>
                  {mockMarket.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {mockMarket.question}
              </h1>
              <p className="text-gray-300 leading-relaxed mb-4">
                {mockMarket.description}
              </p>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-xs text-gray-400">Total Volume</div>
                <div className="text-white font-semibold">${mockMarket.volume.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-xs text-gray-400">Participants</div>
                <div className="text-white font-semibold">{mockMarket.participants}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Resolution Date</div>
                <div className="text-white font-semibold text-sm">
                  {formatDate(mockMarket.resolutionDate)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckBadgeIcon className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-xs text-gray-400">Trading Fee</div>
                <div className="text-white font-semibold">{mockMarket.fees.tradingFee}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trading & Order Book */}
          <div className="lg:col-span-2 space-y-6">
            <TradingPanel
              marketId={mockMarket.id}
              options={mockMarket.options}
              tradingFee={mockMarket.fees.tradingFee}
              onTrade={handleTrade}
            />
            
            <OrderBook
              orderBook={mockOrderBook}
              optionName={mockMarket.options[0].text}
            />
          </div>

          {/* Right Column - Tabs for Positions & History */}
          <div className="lg:col-span-1">
            {/* Tab Buttons */}
            <div className="bg-gray-800 rounded-lg p-2 mb-6 border border-gray-700 flex gap-2">
              <button
                onClick={() => setSelectedTab('trade')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  selectedTab === 'trade'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                Trade
              </button>
              <button
                onClick={() => setSelectedTab('positions')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  selectedTab === 'positions'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                Positions
              </button>
              <button
                onClick={() => setSelectedTab('history')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  selectedTab === 'history'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                History
              </button>
            </div>

            {/* Tab Content */}
            {selectedTab === 'trade' && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Market Options</h3>
                <div className="space-y-3">
                  {mockMarket.options.map((option) => (
                    <div
                      key={option.id}
                      className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">{option.text}</span>
                        <span className="text-purple-400 font-bold">
                          {(option.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                          style={{ width: `${option.probability * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Volume: ${option.volume.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedTab === 'positions' && (
              <PositionsList positions={positions} onSell={handleSellPosition} />
            )}
            {selectedTab === 'history' && (
              <TradeHistory trades={trades} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}




