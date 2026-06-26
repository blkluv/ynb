'use client';

import { Wallet, Search, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Wallet,
    title: 'Get Your Digital Wallet',
    description: 'Think of it like a digital bank account for the internet',
    time: '2 minutes',
    action: 'Download Phantom - it\'s free and works like a browser extension',
    color: 'from-purple-500 to-pink-500',
    links: [
      {
        text: '📱 Download Phantom Wallet',
        url: 'https://phantom.app/',
        isExternal: true
      },
      {
        text: '🎥 Watch: How to Setup Phantom',
        url: 'https://www.youtube.com/results?search_query=how+to+setup+phantom+wallet',
        isExternal: true
      }
    ]
  },
  {
    number: '02',
    icon: Search,
    title: 'Create or Join a Prediction',
    description: 'Ask a question, set a deadline, and let people vote',
    time: '3 minutes',
    action: 'Tag @PredicTokFun and use #PredicTokFun when you create! 🎯',
    color: 'from-pink-500 to-purple-500',
    links: [
      {
        text: '🎥 Watch: How to Create a Market',
        url: 'https://www.youtube.com/results?search_query=how+to+create+a+prediction+market',
        isExternal: true
      }
    ]
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Win & Share Your Results',
    description: 'Get your rewards instantly and share your wins on TikTok',
    time: '24 hours',
    action: '🚀 Post your win with @PredicTokFun and #PredicTokFun to flex!',
    color: 'from-purple-500 to-blue-500',
    links: [
      {
        text: '📱 Follow @PredicTokFun on TikTok',
        url: 'https://tiktok.com/@predictok',
        isExternal: true
      }
    ]
  }
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-block px-4 py-2 bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-full mb-6">
            <span className="text-sm text-[#00F0FF] font-medium">🎯 Beginner Friendly</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
            <span className="text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Get Started in 3 Easy Steps
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            No experience needed. No crypto knowledge required. Just follow along! 🚀
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="relative grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="bg-gray-900 border border-gray-700 hover:border-[#00F0FF]/50 rounded-2xl p-8 transition-all duration-300 hover:scale-105 relative overflow-hidden h-full flex flex-col">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                    {/* Number Badge */}
                    <div className="relative">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} mb-6`}>
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>

                      {/* Icon */}
                      <div className="absolute flex items-center justify-center w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg -top-2 -right-2">
                        <Icon className="w-6 h-6 text-[#00F0FF]" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-2xl font-bold text-white">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="flex-1 mb-4 text-gray-400">
                      {step.description}
                    </p>

                    {/* Time Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-medium text-green-400">{step.time}</span>
                    </div>

                    {/* Action */}
                    <p className="mb-6 text-sm text-gray-300">
                      {step.action}
                    </p>

                    {/* Links */}
                    <div className="mt-auto space-y-2">
                      {step.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors group/link"
                        >
                          <span>{link.text}</span>
                          {link.isExternal && <ExternalLink className="w-3 h-3" />}
                        </a>
                      ))}
                    </div>

                    {/* Hover Border Gradient */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-20`}></div>
                    </div>
                  </div>

                  {/* Arrow (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="absolute z-10 hidden transform -translate-y-1/2 lg:block top-1/2 -right-4">
                      <div className="w-8 h-8 bg-gray-900 border-2 border-[#00F0FF] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ⚡ Important Info Box for Complete Beginners */}
        <div className="max-w-4xl p-8 mx-auto mt-16 border bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border-purple-500/20 rounded-2xl">
          <h4 className="mb-4 text-lg font-bold text-white">📝 Important Setup Guide (No Crypto Experience? No Problem!)</h4>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-[#00F0FF] font-bold">1.</span>
              <div>
                <p className="font-semibold text-white">Get Free Test Tokens</p>
                <p className="text-sm text-gray-400">
                  You'll need play money to practice. Get free tokens here:
                  <a
                    href="https://faucet.solana.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00F0FF] hover:underline ml-1 inline-flex items-center gap-1"
                  >
                    Solana Devnet Faucet <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00F0FF] font-bold">2.</span>
              <div>
                <p className="font-semibold text-white">Switch Your Wallet to Devnet</p>
                <p className="text-sm text-gray-400">
                  In your Phantom wallet, click settings → network → select "Devnet".
                  <a
                    href="https://www.youtube.com/results?search_query=how+to+switch+phantom+wallet+to+devnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00F0FF] hover:underline ml-1 inline-flex items-center gap-1"
                  >
                    Watch tutorial <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00F0FF] font-bold">3.</span>
              <div>
                <p className="font-semibold text-white">Tag Us When You Create!</p>
                <p className="text-sm text-gray-400">
                  When you create your first prediction, tag
                  <a
                    href="https://tiktok.com/@predictok"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF0080] hover:underline mx-1 inline-flex items-center gap-1"
                  >
                    @PredicTokFun <ExternalLink className="w-3 h-3" />
                  </a>
                  and use the hashtag
                  <span className="text-[#FF7A2F] font-bold mx-1">#PredicTokFun</span>
                  to get featured! 🎯
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 gap-6 mt-16 md:grid-cols-4">
          <div className="p-6 text-center border border-gray-800 bg-gray-900/50 rounded-xl">
            <div className="mb-2 text-3xl font-bold text-white">⏱️ 2 min</div>
            <div className="text-sm text-gray-400">Setup Time</div>
          </div>
          <div className="p-6 text-center border border-gray-800 bg-gray-900/50 rounded-xl">
            <div className="mb-2 text-3xl font-bold text-white">💰 Free</div>
            <div className="text-sm text-gray-400">To Start Predicting</div>
          </div>
          <div className="p-6 text-center border border-gray-800 bg-gray-900/50 rounded-xl">
            <div className="mb-2 text-3xl font-bold text-white">🎯 24h</div>
            <div className="text-sm text-gray-400">Fast Results</div>
          </div>
          <div className="p-6 text-center border border-gray-800 bg-gray-900/50 rounded-xl">
            <div className="mb-2 text-3xl font-bold text-white">📱 100%</div>
            <div className="text-sm text-gray-400">Mobile Friendly</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.location.href = '/markets'}
            className="px-8 py-4 bg-gradient-to-r from-[#00F0FF] via-[#FF0080] to-[#FF7A2F] hover:opacity-90 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-[#00F0FF]/50 cursor-pointer"
          >
            Start Predicting - It's Free 🚀
          </button>
          <p className="mt-4 text-sm text-gray-500">
            No credit card. No crypto experience. Just follow the steps above! 💪
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
