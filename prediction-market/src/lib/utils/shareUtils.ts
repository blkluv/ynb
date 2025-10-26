/**
 * Utilities for generating social share text and URLs
 */

import type { UserStats, MarketAccount, EnrichedBet } from '../program/direct-read';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cypherpunk-hackathon2025-three.vercel.app';

/**
 * Generate Twitter/X share URL
 */
export function getTwitterShareUrl(text: string, url?: string): string {
  const params = new URLSearchParams();
  params.append('text', text);
  if (url) {
    params.append('url', url);
  }
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Generate share text for a user profile
 */
export function generateProfileShareText(
  walletAddress: string,
  stats: UserStats
): string {
  const winRate = stats.winRate.toFixed(1);
  const roi = stats.roi >= 0 ? `+${stats.roi.toFixed(1)}` : stats.roi.toFixed(1);
  const profit = stats.profitLoss >= 0 ? `+${stats.profitLoss.toFixed(2)}` : stats.profitLoss.toFixed(2);

  let performance = '';
  if (stats.roi >= 50) {
    performance = '🏆 Elite Trader';
  } else if (stats.roi >= 20) {
    performance = '⭐ Pro Trader';
  } else if (stats.roi >= 0) {
    performance = '✅ Profitable';
  } else {
    performance = '📊 Trader';
  }

  return `${performance}

🎲 ${stats.totalBets} bets | 🎯 ${winRate}% win rate
💰 ${profit} SOL profit | 📈 ${roi}% ROI

Check out my track record on PrismaFi! 🚀`;
}

/**
 * Generate share text for a market
 */
export function generateMarketShareText(market: MarketAccount): string {
  const totalPool = (market.yesAmount + market.noAmount) / 1e9; // Convert to SOL
  const yesOdds = market.yesAmount + market.noAmount > 0 
    ? ((market.yesAmount / (market.yesAmount + market.noAmount)) * 100).toFixed(0)
    : '50';

  return `🎲 ${market.question}

Current odds:
✅ YES: ${yesOdds}%
❌ NO: ${100 - parseInt(yesOdds)}%

Total pool: ${totalPool.toFixed(2)} SOL

What's your prediction? Trade now on PrismaFi! 🚀`;
}

/**
 * Generate share text for a winning bet
 */
export function generateWinningBetShareText(
  bet: EnrichedBet,
  market: MarketAccount
): string {
  const betAmount = (bet.amount / 1e9).toFixed(4);
  const winnings = bet.winnings?.winningsSOL.toFixed(4) || '0';
  const multiplier = bet.winnings?.multiplier.toFixed(2) || '0';
  const outcome = bet.outcome ? 'YES' : 'NO';

  return `🎉 Just won ${winnings} SOL on PrismaFi!

💰 Bet ${betAmount} SOL on ${outcome}
📈 ${multiplier}x multiplier

"${market.question}"

My prediction was spot on! 🎯

Trade prediction markets on PrismaFi 🚀`;
}

/**
 * Generate share text for market resolution
 */
export function generateMarketResolutionShareText(
  market: MarketAccount,
  outcome: boolean
): string {
  const result = outcome ? 'YES' : 'NO';
  const totalPool = (market.yesAmount + market.noAmount) / 1e9;

  return `📊 Market Resolved!

"${market.question}"

✅ Result: ${result}
💰 Total pool: ${totalPool.toFixed(2)} SOL

Thanks to everyone who participated! 🎉

Trade more markets on PrismaFi 🚀`;
}

/**
 * Get profile URL
 */
export function getProfileUrl(walletAddress: string): string {
  return `${APP_URL}/profile/${walletAddress}`;
}

/**
 * Get market URL
 */
export function getMarketUrl(marketAddress: string): string {
  return `${APP_URL}/markets/${marketAddress}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Share via Web Share API (mobile-friendly)
 */
export async function shareViaWebApi(
  title: string,
  text: string,
  url: string
): Promise<boolean> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false;
  }

  try {
    await navigator.share({
      title,
      text,
      url,
    });
    return true;
  } catch (error) {
    console.error('Web Share API failed:', error);
    return false;
  }
}

