import { PublicKey } from '@solana/web3.js';

export interface Market {
  publicKey: PublicKey;
  authority: PublicKey;
  question: string;
  description: string;
  yesPool: number;
  noPool: number;
  totalPool: number;
  endTime: number;
  resolved: boolean;
  outcome: 'Yes' | 'No' | null;
  createdAt: number;
}

export interface MarketCardProps {
  market: Market;
  onBet?: (market: Market) => void;
}

export function calculateOdds(yesPool: number, noPool: number) {
  const total = yesPool + noPool;
  if (total === 0) return { yes: 50, no: 50 };
  
  return {
    yes: Math.round((yesPool / total) * 100),
    no: Math.round((noPool / total) * 100),
  };
}

export function formatSOL(lamports: number): string {
  return (lamports / 1e9).toFixed(2);
}


