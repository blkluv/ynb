'use client';

import React, { useState, useEffect } from 'react';
import { OrderBook as OrderBookType } from '@/types/market';
import { MarketService } from '@/lib/marketService';

interface OrderBookProps {
  marketId: string;
}

export default function OrderBook({ marketId }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderBook = async () => {
      try {
        setLoading(true);
        // For now, we'll create a mock order book
        // In production, this would come from the blockchain/API
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
        setOrderBook(mockOrderBook);
      } catch (error) {
        console.error('Error loading order book:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderBook();
  }, [marketId]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Order Book</h3>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!orderBook) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Order Book</h3>
        <p className="text-gray-400">No order book data available</p>
      </div>
    );
  }

  const maxTotal = Math.max(
    ...orderBook.bids.map(b => b.total),
    ...orderBook.asks.map(a => a.total)
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Order Book</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Bids */}
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">Bids (Buy Orders)</div>
          <div className="space-y-1">
            {orderBook.bids.map((bid, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex-1 flex items-center">
                  <div 
                    className="h-6 bg-green-600/20 rounded-l"
                    style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                  ></div>
                  <div className="flex-1 bg-gray-700/50 h-6 rounded-r"></div>
                </div>
                <div className="flex items-center justify-between w-32 ml-2">
                  <span className="text-green-400 font-medium">{bid.price.toFixed(4)}</span>
                  <span className="text-white">{bid.shares}</span>
                  <span className="text-gray-400">{bid.total.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asks */}
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">Asks (Sell Orders)</div>
          <div className="space-y-1">
            {orderBook.asks.map((ask, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex-1 flex items-center">
                  <div 
                    className="h-6 bg-red-600/20 rounded-l"
                    style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                  ></div>
                  <div className="flex-1 bg-gray-700/50 h-6 rounded-r"></div>
                </div>
                <div className="flex items-center justify-between w-32 ml-2">
                  <span className="text-red-400 font-medium">{ask.price.toFixed(4)}</span>
                  <span className="text-white">{ask.shares}</span>
                  <span className="text-gray-400">{ask.total.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Price</span>
          <span>Shares</span>
          <span>Total</span>
        </div>
      </div>
    </div>
  );
}