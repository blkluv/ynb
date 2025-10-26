'use client';

import { useState, useEffect } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import WalletInfo from '@/components/wallet/WalletInfo';
import StatsWidget from '@/components/dashboard/StatsWidget';
import BetCard from '@/components/dashboard/BetCard';
import {
  fetchAllUserBets,
  fetchMarketDirect,
  calculateUserStats,
  calculateWinnings,
  type BetAccount,
  type MarketAccount,
  type EnrichedBet,
  type UserStats,
} from '@/lib/program/direct-read';

export default function DashboardPage() {
  const wallet = useAnchorWallet();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [bets, setBets] = useState<EnrichedBet[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'claimable'>('all');

  // Fetch user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!wallet) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        console.log('📊 Loading dashboard for:', wallet.publicKey.toBase58());

        // 1. Fetch all user bets
        const userBets = await fetchAllUserBets(wallet.publicKey);
        console.log('✅ Fetched', userBets.length, 'bets');

        if (userBets.length === 0) {
          setIsLoading(false);
          return;
        }

        // 2. Fetch market data for each bet
        const marketsMap = new Map<string, MarketAccount>();
        const enrichedBets: EnrichedBet[] = [];

        for (const bet of userBets) {
          try {
            const marketAddress = bet.market.toBase58();
            
            // Check if we already fetched this market
            let marketData = marketsMap.get(marketAddress);
            
            if (!marketData) {
              marketData = await fetchMarketDirect(marketAddress);
              if (marketData) {
                marketsMap.set(marketAddress, marketData);
              }
            }

            // Enrich bet with market data and winnings calculation
            const enriched: EnrichedBet = {
              ...bet,
              marketData,
            };

            if (marketData) {
              enriched.winnings = calculateWinnings(bet, marketData);
            }

            enrichedBets.push(enriched);
          } catch (error) {
            console.error('Error fetching market for bet:', bet.address, error);
            // Add bet without market data
            enrichedBets.push(bet);
          }
        }

        // 3. Calculate statistics
        const userStats = await calculateUserStats(userBets, marketsMap);

        // 4. Sort bets: claimable first, then active, then resolved
        enrichedBets.sort((a, b) => {
          if (a.winnings?.canClaim && !b.winnings?.canClaim) return -1;
          if (!a.winnings?.canClaim && b.winnings?.canClaim) return 1;
          if (!a.marketData?.resolved && b.marketData?.resolved) return -1;
          if (a.marketData?.resolved && !b.marketData?.resolved) return 1;
          return b.timestamp - a.timestamp; // Most recent first
        });

        setBets(enrichedBets);
        setStats(userStats);
      } catch (error) {
        console.error('❌ Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [wallet]);

  // Filter bets
  const filteredBets = bets.filter((bet) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !bet.marketData?.resolved;
    if (filter === 'resolved') return bet.marketData?.resolved;
    if (filter === 'claimable') return bet.winnings?.canClaim;
    return true;
  });

  // Not connected
  if (!wallet) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <WalletInfo />
          
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
              <div className="text-6xl mb-6">🔐</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-400 mb-6">
                Connect your wallet to view your betting dashboard, track your performance,
                and manage your winnings.
              </p>
              <button
                onClick={() => router.push('/markets')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Browse Markets
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <WalletInfo />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-gray-400">
            Track your bets, monitor performance, and claim your winnings
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-8">
            <StatsWidget stats={{} as UserStats} isLoading={true} />
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your dashboard...</p>
            </div>
          </div>
        )}

        {/* No bets */}
        {!isLoading && bets.length === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <div className="text-6xl mb-6">🎲</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Bets Yet</h2>
            <p className="text-gray-400 mb-6">
              You haven't placed any bets yet. Start by browsing available markets!
            </p>
            <button
              onClick={() => router.push('/markets')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Markets
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && bets.length > 0 && stats && (
          <div className="space-y-8">
            {/* Statistics */}
            <StatsWidget stats={stats} />

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All ({bets.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'active'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Active ({bets.filter((b) => !b.marketData?.resolved).length})
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'resolved'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Resolved ({bets.filter((b) => b.marketData?.resolved).length})
              </button>
              <button
                onClick={() => setFilter('claimable')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'claimable'
                    ? 'bg-green-500 text-white animate-pulse'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Claimable ({bets.filter((b) => b.winnings?.canClaim).length})
              </button>
            </div>

            {/* Bets List */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {filter === 'all' && 'All Bets'}
                {filter === 'active' && 'Active Bets'}
                {filter === 'resolved' && 'Resolved Bets'}
                {filter === 'claimable' && '💰 Claimable Winnings'}
              </h2>

              {filteredBets.length === 0 ? (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No bets in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBets.map((bet) => (
                    <BetCard key={bet.address} bet={bet} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

