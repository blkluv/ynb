'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import WalletInfo from '@/components/wallet/WalletInfo';
import ActivityFeed from '@/components/activity/ActivityFeed';
import {
  fetchRecentActivity,
  type ActivityEvent,
  type ActivityType,
} from '@/lib/program/activity';

export default function ActivityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');
  const [limit, setLimit] = useState(50);

  // Load activity
  useEffect(() => {
    const loadActivity = async () => {
      try {
        setIsLoading(true);
        console.log('📡 Loading activity feed...');

        const activityData = await fetchRecentActivity(limit);
        setEvents(activityData);
      } catch (error) {
        console.error('❌ Error loading activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivity();
  }, [limit]);

  // Filter events
  const filteredEvents =
    filter === 'all' ? events : events.filter((e) => e.type === filter);

  const filterOptions: { value: ActivityType | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All Activity', icon: '📡' },
    { value: 'bet_placed', label: 'Bets Placed', icon: '🎲' },
    { value: 'market_created', label: 'Markets Created', icon: '📊' },
    { value: 'market_resolved', label: 'Markets Resolved', icon: '✅' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <WalletInfo />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white">📡 Activity Feed</h1>
            <div className="animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-400">
            Real-time stream of prediction market activity
          </p>
        </div>

        {/* Filter Options */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 text-sm font-medium">Filter:</span>
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === option.value
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
                {filter === option.value && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {filteredEvents.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading activity feed...</p>
          </div>
        )}

        {/* Activity Feed */}
        {!isLoading && (
          <>
            <ActivityFeed events={filteredEvents} />

            {/* Load More */}
            {events.length >= limit && filter === 'all' && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setLimit((prev) => prev + 50)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Load More Activity
                </button>
              </div>
            )}

            {/* Stats */}
            {events.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Total Events</div>
                  <div className="text-2xl font-bold text-white">{events.length}</div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Bets Placed</div>
                  <div className="text-2xl font-bold text-blue-300">
                    {events.filter((e) => e.type === 'bet_placed').length}
                  </div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Markets Created</div>
                  <div className="text-2xl font-bold text-purple-300">
                    {events.filter((e) => e.type === 'market_created').length}
                  </div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Markets Resolved</div>
                  <div className="text-2xl font-bold text-green-300">
                    {events.filter((e) => e.type === 'market_resolved').length}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <div className="text-6xl mb-6">📡</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Activity Yet</h2>
            <p className="text-gray-400 mb-6">
              Start trading to see activity here!
            </p>
            <button
              onClick={() => (window.location.href = '/markets')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Markets
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
