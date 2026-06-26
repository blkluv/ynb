'use client';

import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Gradient Background - Updated with Official Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-[#8B5CF6]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Floating Elements - Updated with Official Colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00F0FF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF0080]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#FF7A2F]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge - Updated with Official Colors */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF7A2F]/10 border border-[#FF7A2F]/30 rounded-full mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-[#FF7A2F]" />
            <span className="text-sm text-[#FF7A2F] font-semibold tracking-wide">
            <a
                  href="https://tiktok.com/@predictok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-[#FF9A4F] transition-colors"
                >
             @PredicTokfun
            </a>
            </span>
          </div>

          {/* Logo - Responsive sizing for mobile */}
          <div className="flex justify-center mb-6 sm:mb-8">
          <img
             src="/images/predictokfun.svg"
             alt="PredicTok"
             className="w-auto h-48 mx-auto sm:h-64 md:h-72"
           />
          </div>
          <div className="flex justify-center mb-6 sm:mb-8">

          {/* Main Headline - Optimized for mobile readability */}
          <h1 className="px-2 mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl sm:mb-6">
            <span className="leading-tight text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Create Your Own Polymarket in Minutes. FREE
            </span>
            <br className="hidden sm:block" />
            <span className="block mt-2 text-xl leading-snug text-gray-400 sm:text-2xl md:text-3xl lg:text-4xl sm:mt-0">
              Your audience already predicts things every day. Launch your own market for any niche and earn a fee on every trade.
            </span>
          </h1>

          {/* Problem Statement - Mobile optimized */}
          <p className="max-w-4xl px-4 mx-auto mb-3 text-lg leading-relaxed text-gray-300 sm:text-xl md:text-2xl sm:mb-4">
            Promises made. Promises <span className="text-[#FF0080] font-bold">ghosted</span>.
            <span className="block mt-1 text-sm text-gray-400">👻 we track the receipts</span>.
          </p>

          {/* Solution */}
          <p className="max-w-3xl px-4 mx-auto mb-8 text-base text-gray-300 sm:text-lg md:text-xl sm:mb-12">
          <span className="font-bold text-[#00F0FF]">YES = they deliver.</span>
             {' '}<span className="font-bold text-[#FF0080]">NO = they cap.</span>
            {' '}Community votes. Hard evidence wins. {' '}
          <span className="text-[#00F0FF]">No cap.</span> 🎯
          </p>

          {/* Stats Bar - Mobile grid layout */}
          <div className="grid max-w-2xl grid-cols-3 gap-4 px-4 mx-auto mb-8 sm:gap-8 sm:mb-12">
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white sm:text-3xl md:text-4xl">$2.4M</div>
              <div className="text-xs text-gray-400 sm:text-sm">Verified Volume</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white sm:text-3xl md:text-4xl">4,237</div>
              <div className="text-xs text-gray-400 sm:text-sm">Predictions Resolved</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white sm:text-3xl md:text-4xl">99.8%</div>
              <div className="text-xs text-gray-400 sm:text-sm">Accuracy</div>
            </div>
          </div>

          {/* CTAs - Mobile friendly with touch targets */}
          <div className="flex flex-col items-stretch justify-center max-w-md gap-3 px-4 mx-auto sm:flex-row sm:gap-4 sm:items-center sm:max-w-none">
            <Link
              href="/create-market"
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#00F0FF] via-[#FF0080] to-[#FF7A2F] hover:opacity-90 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-[#00F0FF]/50 flex items-center justify-center gap-2 text-center min-h-[48px]"
            >
              <span>Create Market</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/markets"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-[#00F0FF]/30 hover:border-[#00F0FF]/50 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-center min-h-[48px]"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Browse Markets</span>
            </Link>
          </div>

          {/* Trust Indicators - Mobile optimized */}
          <div className="flex flex-col flex-wrap items-center justify-center gap-4 px-4 mt-12 sm:mt-16 sm:flex-row sm:gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400 sm:w-5 sm:h-5" />
              <span className="text-xs text-gray-400 sm:text-sm">Audited by Certora</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400 sm:w-5 sm:h-5" />
              <span className="text-xs text-gray-400 sm:text-sm">Powered by Solana</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400 sm:w-5 sm:h-5" />
              <span className="text-xs text-gray-400 sm:text-sm">$2.4M+ in volume</span>
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
