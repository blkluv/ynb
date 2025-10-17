'use client';

import React, { useState, useEffect } from 'react';
import { Trade, TradeType, TradeStatus } from '@/types/market';
import { MarketService } from '@/lib/marketService';

interface TradeHistoryProps {
  marketId: string;
}

export default function TradeHistory({ marketId }: TradeHistoryProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrades = async () => {
      try {
        setLoading(true);
        const tradesData = await MarketService.getMarketTrades(marketId);
        setTrades(tradesData);
      } catch (error) {
        console.error('Error loading trades:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrades();
  }, [marketId]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: TradeStatus) => {
    switch (status) {
      case TradeStatus.CONFIRMED:
        return 'text-green-400';
      case TradeStatus.PENDING:
        return 'text-yellow-400';
      case TradeStatus.FAILED:
        return 'text-red-400';
      case TradeStatus.CANCELLED:
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Trade History</h3>
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Trade History</h3>
      
      {trades.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No trades yet</p>
      ) : (
        <div className="space-y-3">
          {trades.slice(0, 10).map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  trade.type === TradeType.BUY ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <div>
                  <div className="text-white font-medium text-sm">
                    {trade.type === TradeType.BUY ? 'Buy' : 'Sell'} {trade.shares.toFixed(2)} shares
                  </div>
                  <div className="text-gray-400 text-xs">
                    {formatTime(trade.timestamp)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  ${trade.amount.toFixed(2)}
                </div>
                <div className={`text-xs ${getStatusColor(trade.status)}`}>
                  {trade.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}