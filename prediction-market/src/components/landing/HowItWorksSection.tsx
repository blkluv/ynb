'use client';

import { Wallet, Search, TrendingUp, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Wallet,
    title: 'Connect your Wallet',
    description: 'Phantom, Solflare or any Solana wallet',
    time: '10 seconds',
    action: 'One click. No registration. No KYC.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    number: '02',
    icon: Search,
    title: 'Predict or Create',
    description: 'Find existing markets or create your own',
    time: '2 minutes',
    action: 'Thousands of markets on social, crypto, sports, economy.',
    color: 'from-pink-500 to-purple-500'
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Win and Withdraw',
    description: 'Automatic on-chain resolution, withdraw instantly',
    time: '24 hours',
    action: 'No waits. No verifications. Your funds, always available.',
    color: 'from-purple-500 to-blue-500'
  }
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-block px-4 py-2 mb-6 border rounded-full bg-purple-500/10 border-purple-500/20">
            <span className="text-sm font-medium text-purple-300">Simple and Fast</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
            <span className="text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              From Zero to Predicting in 3 Steps
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            You don&apos;t need to be an expert. Start predicting and earning in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-0 right-0 hidden h-1 transform -translate-y-1/2 lg:block top-1/2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20"></div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative p-8 overflow-hidden transition-all duration-300 bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-2xl hover:scale-105">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                    {/* Number Badge */}
                    <div className="relative">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} mb-6`}>
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>

                      {/* Icon */}
                      <div className="absolute flex items-center justify-center w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg -top-2 -right-2">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-2xl font-bold text-white">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 text-gray-400">
                      {step.description}
                    </p>

                    {/* Time Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-medium text-green-400">{step.time}</span>
                    </div>

                    {/* Action */}
                    <p className="text-sm text-gray-300">
                      {step.action}
                    </p>

                    {/* Hover Border Gradient */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-20`}></div>
                    </div>
                  </div>

                  {/* Arrow (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="absolute z-10 hidden transform -translate-y-1/2 lg:block top-1/2 -right-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-900 border-2 border-purple-500 rounded-full">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 gap-6 mt-16 md:grid-cols-4">
          <div className="p-6 text-center border border-gray-800 bg-gray-900/50 rounded-xl">
            <div className="mb-2 text-3xl font-bold text-white">10s</div>
            <div className="text-sm text-gray-400">Setup Time</div>
          </div>
          <div className="p-6 text-center border border-gray-800 bg-gray-900/50 rounded-xl">
            <div className="mb-2 text-3xl font-bold text-white">$5</div>
            <div className="text-sm text-gray-400">Minimum to Start</div>
          </div>
          <div className="p-6 text-center border border-gray-800 bg-gray-900/50 rounded-xl">
            <div className="mb-2 text-3xl font-bold text-white">24h</div>
            <div className="text-sm text-gray-400">Average Resolution</div>
          </div>
          <div className="p-6 text-center border border-gray-800 bg-gray-900/50 rounded-xl">
            <div className="mb-2 text-3xl font-bold text-white">0%</div>
            <div className="text-sm text-gray-400">Withdrawal Fees</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 font-semibold text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/50">
            Start Now - It&apos;s Free →
          </button>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. Just your wallet.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
