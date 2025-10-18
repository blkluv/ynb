'use client';

import React, { useState } from 'react';
import { MarketOption, TradeType } from '@/types/market';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useWallet } from '@/hooks/useWallet';
import { MarketService } from '@/lib/marketService';
import toast, { Toaster } from 'react-hot-toast';

interface TradingPanelProps {
  marketId: string;
  options: MarketOption[];
  tradingFee: number;
  onTrade?: (optionId: string, type: TradeType, amount: number, shares: number) => Promise<void>;
}

export default function TradingPanel({ marketId, options, tradingFee, onTrade }: TradingPanelProps) {
  const { isConnected, address, connect } = useWallet();
  const [selectedOption, setSelectedOption] = useState<string>(options[0]?.id || '');
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.BUY);
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOptionData = options.find(opt => opt.id === selectedOption);
  const currentPrice = selectedOptionData?.probability || 0;
  const amountNum = parseFloat(amount) || 0;
  const estimatedShares = amountNum / currentPrice;
  const fee = amountNum * (tradingFee / 100);
  const totalCost = tradeType === TradeType.BUY ? amountNum + fee : amountNum - fee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check wallet connection first
    if (!isConnected) {
      await connect();
      return;
    }

    if (!selectedOption || amountNum <= 0 || !address) return;

    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Confirming transaction on Solana...');
    
    try {
      console.log('Trading with wallet:', address);
      
      // Execute trade through service
      const trade = await MarketService.executeTrade(
        marketId,
        selectedOption,
        tradeType,
        amountNum,
        address
      );
      
      console.log('Trade executed:', trade);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success toast with transaction link
      toast.success(
        (t) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              Transaction Confirmed! ✅
            </span>
            <span className="text-sm">
              {tradeType === TradeType.BUY ? 'Bought' : 'Sold'} {trade.shares.toFixed(2)} shares
            </span>
            <a 
              href={trade.explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 underline"
            >
              View on Solana Explorer →
            </a>
          </div>
        ),
        { duration: 6000 }
      );
      
      // Call custom onTrade callback if provided
      if (onTrade) {
        await onTrade(selectedOption, tradeType, amountNum, trade.shares);
      }
      
      setAmount('');
      
    } catch (error) {
      console.error('Trade error:', error);
      toast.dismiss(loadingToast);
      toast.error(
        `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { duration: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-6">Trade</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trade Type Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTradeType(TradeType.BUY)}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              tradeType === TradeType.BUY
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <ArrowUpIcon className="w-5 h-5" />
            Buy
          </button>
          <button
            type="button"
            onClick={() => setTradeType(TradeType.SELL)}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              tradeType === TradeType.SELL
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <ArrowDownIcon className="w-5 h-5" />
            Sell
          </button>
        </div>

        {/* Option Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Outcome</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.text} - {(option.probability * 100).toFixed(1)}%
              </option>
            ))}
          </select>
        </div>

        {/* Current Price Display */}
        {selectedOptionData && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Current Price</span>
              <span className="text-white font-semibold">
                ${currentPrice.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Probability</span>
              <span className="text-purple-400 font-semibold">
                {(currentPrice * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Amount (SOL)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white pr-16"
            />
            <span className="absolute right-4 top-3.5 text-gray-400 font-medium">SOL</span>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[0.1, 0.5, 1, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(value.toString())}
              className="py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              {value} SOL
            </button>
          ))}
        </div>

        {/* Trade Summary */}
        {amountNum > 0 && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Estimated Shares</span>
              <span className="text-white font-medium">{estimatedShares.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Trading Fee ({tradingFee}%)</span>
              <span className="text-white font-medium">{fee.toFixed(4)} SOL</span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">
                  {tradeType === TradeType.BUY ? 'Total Cost' : 'You Receive'}
                </span>
                <span className="text-white font-bold text-lg">
                  {totalCost.toFixed(4)} SOL
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-300">
            {tradeType === TradeType.BUY
              ? 'You&apos;re buying shares at the current market price. Your potential profit depends on the final outcome.'
              : 'You&apos;re selling shares at the current market price. Make sure you have enough shares in your position.'}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={(isConnected && (!selectedOption || amountNum <= 0)) || isSubmitting}
          className={`w-full py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            !isConnected
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
              : tradeType === TradeType.BUY
              ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-green-500/30'
              : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/30'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : !isConnected ? (
            'Connect Wallet to Trade'
          ) : (
            `${tradeType === TradeType.BUY ? 'Buy' : 'Sell'} ${estimatedShares > 0 ? estimatedShares.toFixed(2) : ''} Shares`
          )}
        </button>
      </form>
      
      {/* Toast Notifications Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
