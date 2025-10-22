'use client';

import { Shield, DollarSign, Database, TrendingUp, Zap, Lock } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'On-Chain Verifiable Resolution',
    problem: '"I don&apos;t know if the market will resolve correctly"',
    solution: 'Every result verified on Solana. No manipulation, no disputes.',
    userType: 'Traders',
    stat: '99.8% accuracy',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: DollarSign,
    title: 'Only 0.5% Fees',
    problem: '"Paying 15% fees destroys my margins"',
    solution: 'Total transparency. No hidden fees. More profits for you.',
    userType: 'Market Creators',
    stat: '0.5% vs 5-15%',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Database,
    title: 'All Data Public',
    problem: '"Historical data is private and inaccessible"',
    solution: 'Everything on-chain. Analyze, verify, audit. No restrictions.',
    userType: 'Analysts',
    stat: '100% accessible',
    color: 'from-blue-500 to-cyan-500'
  }
];

const additionalFeatures = [
  {
    icon: Zap,
    title: '24h Resolution',
    description: 'Automatic results vs 7 days industry average',
    color: 'text-yellow-400'
  },
  {
    icon: Lock,
    title: 'Non-Custodial',
    description: 'Your funds always under your control. No intermediaries.',
    color: 'text-purple-400'
  },
  {
    icon: TrendingUp,
    title: 'Deep Liquidity',
    description: '$2.4M+ in volume. Enter and exit without slippage.',
    color: 'text-green-400'
  }
];

const BenefitsSection = () => {
  return (
    <section className="relative py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Generate your prediction market easy with Artificial Intelligence
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Every detail optimized for maximum transparency, minimum fees, and zero friction
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 rounded-2xl p-8 transition-all duration-300 hover:scale-105"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} p-3 mb-6`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* User Type Badge */}
                <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
                  <span className="text-xs text-purple-300 font-medium">{benefit.userType}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>

                {/* Problem (in quotes) */}
                <p className="text-gray-400 italic mb-4 text-sm">
                  {benefit.problem}
                </p>

                {/* Solution */}
                <p className="text-gray-300 mb-4">
                  {benefit.solution}
                </p>

                {/* Stat */}
                <div className="flex items-center gap-2">
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${benefit.color}`}></div>
                  <span className="text-white font-bold">{benefit.stat}</span>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors"
              >
                <div className={`${feature.color} mt-1`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">
            Tired of opaque platforms with abusive fees?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50">
            Start Predicting Free →
          </button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
