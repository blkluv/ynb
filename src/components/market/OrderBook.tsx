'use client';

import React from 'react';
import { OrderBook as OrderBookType } from '@/types/market';

interface OrderBookProps {
  orderBook: OrderBookType;
  optionName: string;
}

export default function OrderBook({ orderBook, optionName }: OrderBookProps) {
  const maxTotal = Math.max(
    ...orderBook.bids.map(b => b.total),
    ...orderBook.asks.map(a => a.total)
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Order Book - {optionName}</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Bids (Buy Orders) */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
            <h4 className="text-sm font-semibold text-green-400">Bids (Buy)</h4>
          </div>
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 font-medium mb-2">
              <span>Price</span>
              <span className="text-right">Shares</span>
              <span className="text-right">Total</span>
            </div>
            
            {/* Bid Orders */}
            {orderBook.bids.length > 0 ? (
              orderBook.bids.map((bid, index) => (
                <div key={index} className="relative">
                  {/* Background bar */}
                  <div
                    className="absolute inset-0 bg-green-500/10 rounded"
                    style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                  ></div>
                  
                  {/* Content */}
                  <div className="relative grid grid-cols-3 gap-2 text-sm py-1.5 px-2 hover:bg-gray-700/50 rounded transition-colors">
                    <span className="text-green-400 font-medium">
                      ${bid.price.toFixed(4)}
                    </span>
                    <span className="text-right text-white">
                      {bid.shares.toFixed(2)}
                    </span>
                    <span className="text-right text-gray-300">
                      ${bid.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No buy orders
              </div>
            )}
          </div>
        </div>

        {/* Asks (Sell Orders) */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
            <h4 className="text-sm font-semibold text-red-400">Asks (Sell)</h4>
          </div>
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 font-medium mb-2">
              <span>Price</span>
              <span className="text-right">Shares</span>
              <span className="text-right">Total</span>
            </div>
            
            {/* Ask Orders */}
            {orderBook.asks.length > 0 ? (
              orderBook.asks.map((ask, index) => (
                <div key={index} className="relative">
                  {/* Background bar */}
                  <div
                    className="absolute inset-0 bg-red-500/10 rounded"
                    style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                  ></div>
                  
                  {/* Content */}
                  <div className="relative grid grid-cols-3 gap-2 text-sm py-1.5 px-2 hover:bg-gray-700/50 rounded transition-colors">
                    <span className="text-red-400 font-medium">
                      ${ask.price.toFixed(4)}
                    </span>
                    <span className="text-right text-white">
                      {ask.shares.toFixed(2)}
                    </span>
                    <span className="text-right text-gray-300">
                      ${ask.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No sell orders
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-gray-400 mb-1">Spread</div>
          <div className="text-white font-semibold">
            {orderBook.asks.length > 0 && orderBook.bids.length > 0
              ? `$${(orderBook.asks[0].price - orderBook.bids[0].price).toFixed(4)}`
              : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Best Bid</div>
          <div className="text-green-400 font-semibold">
            {orderBook.bids.length > 0 ? `$${orderBook.bids[0].price.toFixed(4)}` : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Best Ask</div>
          <div className="text-red-400 font-semibold">
            {orderBook.asks.length > 0 ? `$${orderBook.asks[0].price.toFixed(4)}` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}




