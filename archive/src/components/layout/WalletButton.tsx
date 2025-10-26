'use client';

import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, LogOut, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function WalletButton() {
  const { ready, isConnected, address, connect, disconnect } = useWallet();
  const [showMenu, setShowMenu] = React.useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const handleClick = () => {
    if (isConnected) {
      setShowMenu(!showMenu);
    } else {
      connect();
    }
  };

  if (!ready) {
    return (
      <button
        disabled
        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-400 cursor-not-allowed"
      >
        <Wallet className="h-4 w-4" />
        <span>Loading...</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={clsx(
          'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
          isConnected
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25'
        )}
      >
        {isConnected ? (
          <>
            <User className="h-4 w-4" />
            <span>{address ? formatAddress(address) : 'Connected'}</span>
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isConnected && showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Connected Wallet</div>
              <div className="text-white font-mono text-sm break-all">
                {address}
              </div>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(address || '');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Copy Address
              </button>
              
              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors mt-1"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}