'use client';

import React from 'react';
import { Position } from '@/types/market';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface PositionsListProps {
  positions: Position[];
  onSell?: (positionId: string) => void;
}

export default function PositionsList({ positions, onSell }: PositionsListProps) {
  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalProfitLoss = positions.reduce((sum, pos) => sum + pos.profitLoss, 0);
  const totalProfitLossPercentage = positions.reduce((sum, pos) => sum + pos.profitLossPercentage, 0) / positions.length;

  if (positions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Your Positions</h3>
        <div className="text-center py-12">
          <ChartBarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-400 mb-2">No positions yet</h4>
          <p className="text-gray-500 text-sm">
            Start trading to build your portfolio
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-6">Your Positions</h3>

      {/* Portfolio Summary */}
      <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Total Value</div>
            <div className="text-white font-semibold text-lg">
              ${totalValue.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">P&L</div>
            <div className={`font-semibold text-lg flex items-center gap-1 ${
              totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {totalProfitLoss >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              )}
              ${Math.abs(totalProfitLoss).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">P&L %</div>
            <div className={`font-semibold text-lg ${
              totalProfitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {totalProfitLossPercentage >= 0 ? '+' : ''}
              {totalProfitLossPercentage.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div className="space-y-3">
        {positions.map((position) => (
          <div
            key={position.id}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-purple-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white mb-1">
                  Position #{position.optionId}
                </h4>
                <p className="text-sm text-gray-400">
                  Market: {position.marketId}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                position.profitLoss >= 0
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                  : 'bg-red-600/20 text-red-400 border border-red-600/30'
              }`}>
                {position.profitLoss >= 0 ? '+' : ''}
                {position.profitLossPercentage.toFixed(2)}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">Shares</div>
                <div className="text-white font-medium">
                  {position.shares.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Avg. Price</div>
                <div className="text-white font-medium">
                  ${position.averagePrice.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Current Value</div>
                <div className="text-white font-medium">
                  ${position.currentValue.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Profit/Loss</div>
                <div className={`font-medium ${
                  position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {position.profitLoss >= 0 ? '+' : ''}
                  ${position.profitLoss.toFixed(2)}
                </div>
              </div>
            </div>

            {onSell && (
              <button
                onClick={() => onSell(position.id)}
                className="w-full py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg font-medium text-sm transition-colors"
              >
                Sell Position
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}




