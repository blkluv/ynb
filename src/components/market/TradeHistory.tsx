'use client';

import React from 'react';
import { Trade, TradeType, TradeStatus } from '@/types/market';
import { ArrowUpIcon, ArrowDownIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface TradeHistoryProps {
  trades: Trade[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const getStatusIcon = (status: TradeStatus) => {
  switch (status) {
    case TradeStatus.CONFIRMED:
      return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
    case TradeStatus.PENDING:
      return <ClockIcon className="w-4 h-4 text-yellow-400" />;
    case TradeStatus.FAILED:
    case TradeStatus.CANCELLED:
      return <XCircleIcon className="w-4 h-4 text-red-400" />;
  }
};

const getStatusColor = (status: TradeStatus) => {
  switch (status) {
    case TradeStatus.CONFIRMED:
      return 'text-green-400';
    case TradeStatus.PENDING:
      return 'text-yellow-400';
    case TradeStatus.FAILED:
    case TradeStatus.CANCELLED:
      return 'text-red-400';
  }
};

export default function TradeHistory({ trades }: TradeHistoryProps) {
  if (trades.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Trade History</h3>
        <div className="text-center py-12">
          <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-400 mb-2">No trades yet</h4>
          <p className="text-gray-500 text-sm">
            Your trading history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-6">Trade History</h3>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-xs font-medium text-gray-400 pb-3">Type</th>
              <th className="text-left text-xs font-medium text-gray-400 pb-3">Option</th>
              <th className="text-right text-xs font-medium text-gray-400 pb-3">Amount</th>
              <th className="text-right text-xs font-medium text-gray-400 pb-3">Shares</th>
              <th className="text-right text-xs font-medium text-gray-400 pb-3">Price</th>
              <th className="text-right text-xs font-medium text-gray-400 pb-3">Fee</th>
              <th className="text-center text-xs font-medium text-gray-400 pb-3">Status</th>
              <th className="text-right text-xs font-medium text-gray-400 pb-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="py-3">
                  <div className={`flex items-center gap-2 ${
                    trade.type === TradeType.BUY ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.type === TradeType.BUY ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    <span className="font-medium">{trade.type.toUpperCase()}</span>
                  </div>
                </td>
                <td className="py-3 text-white text-sm">
                  #{trade.optionId.slice(0, 8)}
                </td>
                <td className="py-3 text-right text-white font-medium">
                  ${trade.amount.toFixed(2)}
                </td>
                <td className="py-3 text-right text-white">
                  {trade.shares.toFixed(2)}
                </td>
                <td className="py-3 text-right text-gray-300">
                  ${trade.price.toFixed(4)}
                </td>
                <td className="py-3 text-right text-gray-400 text-sm">
                  ${trade.fee.toFixed(4)}
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-center gap-1">
                    {getStatusIcon(trade.status)}
                    <span className={`text-xs font-medium ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right text-gray-400 text-sm">
                  {formatDate(trade.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center gap-2 ${
                trade.type === TradeType.BUY ? 'text-green-400' : 'text-red-400'
              }`}>
                {trade.type === TradeType.BUY ? (
                  <ArrowUpIcon className="w-5 h-5" />
                ) : (
                  <ArrowDownIcon className="w-5 h-5" />
                )}
                <span className="font-semibold">{trade.type.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(trade.status)}
                <span className={`text-xs font-medium ${getStatusColor(trade.status)}`}>
                  {trade.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Amount</div>
                <div className="text-white font-medium">${trade.amount.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Shares</div>
                <div className="text-white font-medium">{trade.shares.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Price</div>
                <div className="text-white">${trade.price.toFixed(4)}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Fee</div>
                <div className="text-gray-300">${trade.fee.toFixed(4)}</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-600 flex items-center justify-between text-xs text-gray-400">
              <span>#{trade.optionId.slice(0, 12)}</span>
              <span>{formatDate(trade.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




