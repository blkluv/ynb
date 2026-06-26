'use client';

import { Shield, DollarSign, Database, TrendingUp, Zap, Lock } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'No Cap, Just Facts',
    problem: '"How do I know this is legit?"',
    solution: 'Every result is verified on a public ledger. What you see is what you get. No funny business.',
    userType: 'For the real ones',
    stat: '99.8% accurate',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: DollarSign,
    title: 'Keep Your Coins',
    problem: '"Bruh, these fees are crazy"',
    solution: 'Only 0.5% fees. No hidden charges. More money in YOUR pocket.',
    userType: 'For the builders',
    stat: '0.5% vs 5-15% 👀',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Database,
    title: 'Full Transparency',
    problem: '"Where\'s the proof?"',
    solution: 'Everything is public. Anyone can check, verify, and hold us accountable. No gatekeeping.',
    userType: 'For the skeptics',
    stat: '100% open',
    color: 'from-blue-500 to-cyan-500'
  }
];

const additionalFeatures = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Results in 24 hours, not 7 days. We don\'t keep you waiting.',
    color: 'text-yellow-400'
  },
  {
    icon: Lock,
    title: 'You Own Your Bag',
    description: 'Your funds, your control. Nobody else touches your money.',
    color: 'text-purple-400'
  },
  {
    icon: TrendingUp,
    title: 'Liquidity Goes Brrr',
    description: '$2.4M+ in volume. Get in and out without the drama.',
    color: 'text-green-400'
  }
];

const BenefitsSection = () => {
  return (
    <section className="relative py-24 bg-black">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
            <span className="text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Create Your Prediction Market With AI
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-400">
            Zero BS. Maximum transparency. Minimal fees.
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid gap-8 mb-16 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="relative p-8 transition-all duration-300 border border-gray-700 group bg-gradient-to-br from-gray-900 to-gray-800 hover:border-gray-600 rounded-2xl hover:scale-105"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} p-3 mb-6`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* User Type Badge */}
                <div className="inline-block px-3 py-1 mb-4 border rounded-full bg-purple-500/10 border-purple-500/20">
                  <span className="text-xs font-medium text-purple-300">{benefit.userType}</span>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-2xl font-bold text-white">
                  {benefit.title}
                </h3>

                {/* Problem (in quotes) */}
                <p className="mb-4 text-sm italic text-gray-400">
                  {benefit.problem}
                </p>

                {/* Solution */}
                <p className="mb-4 text-gray-300">
                  {benefit.solution}
                </p>

                {/* Stat */}
                <div className="flex items-center gap-2">
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${benefit.color}`}></div>
                  <span className="font-bold text-white">{benefit.stat}</span>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="grid gap-6 md:grid-cols-3">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-6 transition-colors border border-gray-800 bg-gray-900/50 rounded-xl hover:border-gray-700"
              >
                <div className={`${feature.color} mt-1`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-lg text-gray-400">
            Tired of platforms that play you? 🥱
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#00F0FF] via-[#FF0080] to-[#FF7A2F] hover:opacity-90 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-[#00F0FF]/50">
            Start Predicting for Free 🚀
          </button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
