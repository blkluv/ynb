'use client';

import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-purple-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute delay-1000 rounded-full bottom-20 right-10 w-96 h-96 bg-pink-500/20 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border rounded-full bg-purple-500/10 border-purple-500/20 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Build on Solana • 0.5% Comissions
            </span>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/images/prismafi-logo.svg"
              alt="YE NO BET"
              className="w-auto h-72"
            />
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            <span className="text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Social Prediction Markets
            </span>
            <br />
            <span className="text-2xl text-gray-400 sm:text-3xl lg:text-4xl">
              See what real people believe — and let the market prove it.
            </span>
          </h1>

          {/* Problem Statement */}
          <p className="max-w-4xl mx-auto mb-4 text-xl leading-relaxed text-gray-300 sm:text-2xl">
            Social promises, public projects, and institutional commitments{' '}
            <span className="font-bold text-pink-400">lack transparent tracking</span>.
          </p>

          {/* Solution Statement */}
          <p className="max-w-3xl mx-auto mb-12 text-lg text-purple-300 sm:text-xl">
            Create <span className="font-bold text-white">YE/NO markets</span> on promises and outcomes.
            {' '}Community bets → Evidence decides → Accountability enforced.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white sm:text-4xl">$2.4M</div>
              <div className="text-sm text-gray-400">Verified Volume</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white sm:text-4xl">4,237</div>
              <div className="text-sm text-gray-400">Predictions Resolved</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white sm:text-4xl">99.8%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/create-market"
              className="flex items-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-200 rounded-lg shadow-lg group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/50"
            >
              <span>Create Market</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/markets"
              className="flex items-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-200 border rounded-lg bg-white/5 hover:bg-white/10 backdrop-blur-sm border-white/10 hover:border-white/20"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Browse Markets</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Audited by Certora</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Powered by Solana</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">$2.4M+ in volume</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};

export default HeroSection;
