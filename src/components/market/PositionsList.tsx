'use client';

import React, { useState, useEffect } from 'react';
import { Position } from '@/types/market';
import { MarketService } from '@/lib/marketService';
import { useWallet } from '@/hooks/useWallet';

interface PositionsListProps {
  marketId: string;
}

export default function PositionsList({ marketId }: PositionsListProps) {
  const { address } = useWallet();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPositions = async () => {
      if (!address) {
        setPositions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const positionsData = await MarketService.getUserPositions(address);
        // Filter positions for this market
        const marketPositions = positionsData.filter(p => p.marketId === marketId);
        setPositions(marketPositions);
      } catch (error) {
        console.error('Error loading positions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPositions();
  }, [marketId, address]);

  const handleSellPosition = (positionId: string) => {
    console.log('Sell position:', positionId);
    // TODO: Implement sell position logic
  };

  if (!address) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Your Positions</h3>
        <p className="text-gray-400 text-center py-4">Connect your wallet to view positions</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Your Positions</h3>
        <div className="animate-pulse space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Your Positions</h3>
      
      {positions.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No positions in this market</p>
      ) : (
        <div className="space-y-3">
          {positions.map((position) => (
            <div key={position.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{position.optionId}</span>
                <span className="text-purple-400 font-bold">
                  {position.shares.toFixed(2)} shares
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-400">Avg Price</div>
                  <div className="text-white font-medium">${position.averagePrice.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Current Value</div>
                  <div className="text-white font-medium">${position.currentValue.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`text-sm font-medium ${
                  position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {position.profitLoss >= 0 ? '+' : ''}${position.profitLoss.toFixed(2)} 
                  ({position.profitLossPercentage >= 0 ? '+' : ''}{position.profitLossPercentage.toFixed(1)}%)
                </div>
                <button
                  onClick={() => handleSellPosition(position.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                >
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}