'use client';

import { useState, useEffect, useCallback } from 'react';
import RealTimeStatus from '@/components/common/RealTimeStatus';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useParams, useRouter } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import Layout from '@/components/layout/Layout';
import WalletInfo from '@/components/wallet/WalletInfo';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileActivity from '@/components/profile/ProfileActivity';
import ShareProfile from '@/components/social/ShareProfile';
import {
  fetchAllUserBets,
  fetchMarketDirect,
  calculateUserStats,
  calculateWinnings,
  type EnrichedBet,
  type UserStats,
  type MarketAccount,
} from '@/lib/program/direct-read';

interface ProfileData {
  bets: EnrichedBet[];
  stats: UserStats;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const connectedWallet = useAnchorWallet();
  const walletAddress = params.wallet as string;

  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Check if viewing own profile
  useEffect(() => {
    if (connectedWallet && walletAddress) {
      setIsOwnProfile(connectedWallet.publicKey.toBase58() === walletAddress);
    }
  }, [connectedWallet, walletAddress]);

  // Fetch profile data function
  const fetchProfileData = useCallback(async (): Promise<ProfileData | null> => {
    try {
      // Validate wallet address
      let profilePubkey: PublicKey;
      try {
        profilePubkey = new PublicKey(walletAddress);
      } catch (err) {
        console.error('❌ Invalid wallet address');
        return null;
      }

      console.log('👤 Loading profile for:', profilePubkey.toBase58());

      // Fetch all user bets
      const userBets = await fetchAllUserBets(profilePubkey);
      console.log('✅ Fetched', userBets.length, 'bets');

      if (userBets.length === 0) {
        return { bets: [], stats: {
          totalBets: 0,
          activeBets: 0,
          resolvedBets: 0,
          wonBets: 0,
          lostBets: 0,
          totalWagered: 0,
          totalWon: 0,
          totalClaimed: 0,
          unclaimedWinnings: 0,
          winRate: 0,
          profitLoss: 0,
          roi: 0,
        }};
      }

      // Fetch market data for each bet
      const marketsMap = new Map<string, MarketAccount>();
      const enrichedBets: EnrichedBet[] = [];

      for (const bet of userBets) {
        try {
          const marketAddress = bet.market.toBase58();

          let marketData: MarketAccount | null | undefined = marketsMap.get(marketAddress);

          if (!marketData) {
            marketData = await fetchMarketDirect(marketAddress);
            if (marketData) {
              marketsMap.set(marketAddress, marketData);
            }
          }

          const enriched: EnrichedBet = {
            ...bet,
            marketData: marketData ?? undefined, // Convert null to undefined for type compatibility
          };

          if (marketData) {
            enriched.winnings = calculateWinnings(bet, marketData);
          }

          enrichedBets.push(enriched);
        } catch (error) {
          console.error('Error fetching market for bet:', bet.address, error);
          enrichedBets.push(bet);
        }
      }

      // Calculate statistics
      const userStats = await calculateUserStats(userBets, marketsMap);

      // Sort bets by timestamp (most recent first)
      enrichedBets.sort((a, b) => b.timestamp - a.timestamp);

      return {
        bets: enrichedBets,
        stats: userStats,
      };
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      throw error;
    }
  }, [walletAddress]);

  // Use real-time data hook
  const {
    data: profileData,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
    toggleAutoRefresh,
    isAutoRefreshEnabled,
  } = useRealTimeData<ProfileData>({
    fetchData: fetchProfileData,
    interval: 12000, // 12 seconds
    fetchOnMount: true,
    enabled: !!walletAddress,
  });

  // Format wallet address for display
  const formatWallet = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <WalletInfo />

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">
                  {formatWallet(walletAddress)}
                </h1>
                {isOwnProfile && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-500/50">
                    Your Profile
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm font-mono">{walletAddress}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Real-Time Status */}
              <RealTimeStatus
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                isAutoRefreshEnabled={isAutoRefreshEnabled}
                onRefresh={refresh}
                onToggleAutoRefresh={toggleAutoRefresh}
              />

              {/* Share Button */}
              {profileData?.stats && <ShareProfile walletAddress={walletAddress} stats={profileData.stats} />}
            </div>
          </div>

          {/* Quick Actions */}
          {isOwnProfile && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/markets')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Browse Markets
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && !profileData && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        )}

        {/* Error State */}
        {error && !profileData && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-300 mb-2">Error</h3>
            <p className="text-gray-400">{error.message || 'Failed to load profile data'}</p>
            <button
              onClick={refresh}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Activity */}
        {!isLoading && !error && (profileData?.bets.length || 0) === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <div className="text-6xl mb-6">👤</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Activity Yet</h2>
            <p className="text-gray-400 mb-6">
              {isOwnProfile
                ? "You haven't placed any bets yet. Start by browsing available markets!"
                : 'This user has not placed any bets yet.'}
            </p>
            {isOwnProfile && (
              <button
                onClick={() => router.push('/markets')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Browse Markets
              </button>
            )}
          </div>
        )}

        {/* Profile Content */}
        {!isLoading && profileData && (profileData.bets.length || 0) > 0 && profileData.stats && (
          <div className="space-y-8">
            {/* Statistics */}
            <ProfileStats stats={profileData.stats} isOwnProfile={isOwnProfile} />

            {/* Activity/Bet History */}
            <ProfileActivity bets={profileData.bets} walletAddress={walletAddress} />
          </div>
        )}
      </div>
    </Layout>
  );
}

