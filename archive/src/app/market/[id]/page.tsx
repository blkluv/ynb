'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import MarketPreview from '@/components/market/MarketPreview';
import TradingPanel from '@/components/market/TradingPanel';
import OrderBook from '@/components/market/OrderBook';
import TradeHistory from '@/components/market/TradeHistory';
import PositionsList from '@/components/market/PositionsList';
import { MarketQuestion, Position, Trade, TradeType } from '@/types/market';
import { MarketService } from '@/lib/marketService';
import { useWallet } from '@/hooks/useWallet';

export default function MarketPage() {
  const params = useParams();
  const marketId = params.id as string;
  const { address } = useWallet();
  
  const [market, setMarket] = useState<MarketQuestion | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'trade' | 'positions' | 'history'>('trade');

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setLoading(true);
        const [marketData, positionsData, tradesData] = await Promise.all([
          MarketService.getMarket(marketId),
          address ? MarketService.getUserPositions(address) : Promise.resolve([]),
          MarketService.getMarketTrades(marketId)
        ]);

        if (marketData) {
          setMarket(marketData);
        } else {
          setError('Market not found');
        }
        
        setPositions(positionsData);
        setTrades(tradesData);
      } catch (err) {
        setError('Failed to load market data');
        console.error('Error loading market:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();

    // Subscribe to real-time updates
    const unsubscribe = MarketService.subscribeToMarketUpdates(marketId, (updatedMarket) => {
      setMarket(updatedMarket);
    });

    return () => {
      unsubscribe();
    };
  }, [marketId, address]);

  const handleTrade = async (optionId: string, type: TradeType, amount: number, shares: number) => {
    if (!address) return;

    try {
      // Refresh positions after trade
      const updatedPositions = await MarketService.getUserPositions(address);
      setPositions(updatedPositions);

      // Refresh trades
      const updatedTrades = await MarketService.getMarketTrades(marketId);
      setTrades(updatedTrades);
    } catch (error) {
      console.error('Error refreshing data after trade:', error);
    }
  };

  const handleSellPosition = async (positionId: string) => {
    console.log('Sell position:', positionId);
    // TODO: Implement sell position logic
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !market) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">Market Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'The market you are looking for does not exist.'}</p>
            <a href="/markets" className="text-purple-400 hover:text-purple-300">
              ← Back to Markets
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Market Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-medium rounded-full border border-purple-600/30">
                  {market.category.toUpperCase()}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  market.status === 'active'
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                    : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                }`}>
                  {market.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {market.question}
              </h1>
              <p className="text-gray-300 leading-relaxed mb-4">
                {market.description}
              </p>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">$</span>
              </div>
              <div>
                <div className="text-xs text-gray-400">Total Volume</div>
                <div className="text-white font-semibold">${market.volume.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">👥</span>
              </div>
              <div>
                <div className="text-xs text-gray-400">Participants</div>
                <div className="text-white font-semibold">{market.participants}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">📅</span>
              </div>
              <div>
                <div className="text-xs text-gray-400">Resolution Date</div>
                <div className="text-white font-semibold text-sm">
                  {new Date(market.resolutionDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 font-bold text-sm">%</span>
              </div>
              <div>
                <div className="text-xs text-gray-400">Trading Fee</div>
                <div className="text-white font-semibold">{market.fees.tradingFee}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trading & Order Book */}
          <div className="lg:col-span-2 space-y-6">
            <TradingPanel
              marketId={market.id}
              options={market.options}
              tradingFee={market.fees.tradingFee}
              onTrade={handleTrade}
            />
            
            <OrderBook marketId={marketId} />
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
                  {market.options.map((option) => (
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
              <PositionsList marketId={marketId} />
            )}
            {selectedTab === 'history' && (
              <TradeHistory marketId={marketId} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}