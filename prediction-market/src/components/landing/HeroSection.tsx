'use client';

import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">
              Build on Solana • 0.5% Comissions
            </span>
          </div>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/images/prismafi-logo.svg" 
              alt="PrismaFi" 
              className="h-72 w-auto"
            />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Generate your Prediction Market in 3 steps
            </span>
            <br />
            <span className="text-gray-400 text-2xl sm:text-3xl lg:text-4xl">
              Put your price for truth
            </span>
          </h1>

          {/* Problem Statement */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
            It&apos;s hard to prove that <span className="text-pink-400 font-bold">community predictions or insights</span> 
            {' '}lead to measurable impact.
          </p>

          {/* Solution Statement */}
          <p className="text-lg sm:text-xl text-purple-300 mb-12 max-w-3xl mx-auto">
            On-chain tracking of <span className="font-bold text-white">outcomes linked to real-world data</span> and social metrics, 
            enabling transparent reporting and funding.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">$2.4M</div>
              <div className="text-sm text-gray-400">Verified Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">4,237</div>
              <div className="text-sm text-gray-400">Predictions Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">99.8%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/markets"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
            >
              <span>Explore Markets</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>View Demo</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
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
