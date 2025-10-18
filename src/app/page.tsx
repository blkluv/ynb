'use client'

import React from 'react'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Permissionless Markets',
    description:
      'Create and trade on any event without restrictions. Full decentralization on Solana.',
    icon: GlobeAltIcon,
    color: 'text-blue-400',
  },
  {
    name: 'Low Fees',
    description:
      "Trade with minimal fees thanks to Solana's high throughput and low costs.",
    icon: CurrencyDollarIcon,
    color: 'text-green-400',
  },
  {
    name: 'Secure Resolution',
    description:
      'Decentralized resolution system with validator incentives and dispute mechanisms.',
    icon: ShieldCheckIcon,
    color: 'text-purple-400',
  },
  {
    name: 'Real-time Data',
    description:
      "Live market data and instant settlements powered by Solana's speed.",
    icon: ChartBarIcon,
    color: 'text-orange-400',
  },
]

const stats = [
  { label: 'Active Markets', value: '50+', change: '+12%' },
  { label: 'Total Volume', value: '$2.1M', change: '+45%' },
  { label: 'Traders', value: '1,200+', change: '+28%' },
  { label: 'Success Rate', value: '99.2%', change: '+0.1%' },
]

const markets = [
  {
    id: '1',
    question: 'Will Bitcoin reach $100K by 2024?',
    category: 'Crypto',
    probability: 65,
    volume: '$125K',
    participants: 342,
    timeLeft: '45 days',
  },
  {
    id: '2',
    question: '2024 US Presidential Election Winner',
    category: 'Politics',
    probability: 52,
    volume: '$89K',
    participants: 521,
    timeLeft: '12 days',
  },
  {
    id: '3',
    question: 'AI replaces 50% of developers by 2030?',
    category: 'Technology',
    probability: 28,
    volume: '$67K',
    participants: 267,
    timeLeft: '2,190 days',
  },
]

export default function HomePage() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                The Open Prediction Layer
                <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  for Solana
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Trade on any event, anywhere. PrismaFi enables permissionless
                prediction markets with lightning-fast settlements and minimal
                fees on Solana.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/markets">
                  <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-purple-500/30">
                    <ChartBarIcon className="w-5 h-5" />
                    Explore Markets
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/create-market">
                  <button className="flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all border border-gray-600">
                    <PlayIcon className="w-5 h-5" />
                    Create Market
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                  <div className="text-green-400 text-xs font-medium">
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Why Choose PrismaFi?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Built on Solana for speed, security, and scalability. Experience
                the future of decentralized prediction markets.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-all"
                >
                  <div className={`w-12 h-12 ${feature.color} mb-4`}>
                    <feature.icon className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Markets Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Trending Markets
                </h2>
                <p className="text-gray-400">
                  Most active prediction markets right now
                </p>
              </div>
              <Link href="/markets">
                <button className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2">
                  View All Markets
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {markets.map((market) => (
                <div
                  key={market.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm font-medium rounded-full">
                      {market.category}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {market.timeLeft}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-4 line-clamp-2">
                    {market.question}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Probability</span>
                      <span className="text-white font-semibold">
                        {market.probability}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Volume</span>
                      <span className="text-white font-semibold">
                        {market.volume}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Traders</span>
                      <span className="text-white font-semibold">
                        {market.participants}
                      </span>
                    </div>
                  </div>
                  <Link href={`/market/${market.id}`}>
                    <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all">
                      Trade Now
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-900 to-blue-900">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of traders making predictions on real-world events.
              Create markets, trade outcomes, and earn from your knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/markets">
                <button className="px-8 py-4 bg-white text-purple-900 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg">
                  Start Trading
                </button>
              </Link>
              <Link href="/create-market">
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-900 transition-all">
                  Create Your Market
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
