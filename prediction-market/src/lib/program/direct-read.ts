/**
 * Direct program read functions WITHOUT using Anchor Program class
 * Reads market accounts directly from the blockchain
 */

import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, AccountInfo } from "@solana/web3.js";
import { PROGRAM_ID, RPC_ENDPOINT, CONNECTION_CONFIG } from "./constants";
import { deriveBetPDA } from "./direct";

// Discriminators from IDL
const MARKET_DISCRIMINATOR = Buffer.from([219, 190, 213, 55, 0, 227, 198, 154]);
const BET_DISCRIMINATOR = Buffer.from([147, 23, 35, 59, 15, 75, 155, 32]);

export interface MarketAccount {
  address: string;
  authority: PublicKey;
  question: string;
  description: string;
  endTime: number;
  createdAt: number;
  yesAmount: number;
  noAmount: number;
  resolved: boolean;
  winningOutcome: boolean;
}

export interface BetAccount {
  address: string;
  user: PublicKey;
  market: PublicKey;
  amount: number; // lamports
  outcome: boolean; // true = YES, false = NO
  claimed: boolean;
  timestamp: number;
}

/**
 * Decode a Market account from raw data
 */
function decodeMarketAccount(data: Buffer, address: PublicKey): MarketAccount | null {
  try {
    // Verify discriminator
    const discriminator = data.slice(0, 8);
    if (!discriminator.equals(MARKET_DISCRIMINATOR)) {
      console.log("❌ Invalid discriminator for account:", address.toBase58());
      return null;
    }

    let offset = 8; // Skip discriminator

    // Read authority (32 bytes)
    const authority = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;

    // Read question (4 bytes length + string)
    const questionLen = data.readUInt32LE(offset);
    offset += 4;
    const question = data.slice(offset, offset + questionLen).toString('utf8');
    offset += questionLen;

    // Read description (4 bytes length + string)
    const descriptionLen = data.readUInt32LE(offset);
    offset += 4;
    const description = data.slice(offset, offset + descriptionLen).toString('utf8');
    offset += descriptionLen;

    // Read end_time (8 bytes, i64)
    const endTimeBuffer = data.slice(offset, offset + 8);
    const endTime = new anchor.BN(endTimeBuffer, 'le').toNumber();
    offset += 8;

    // Read created_at (8 bytes, i64)
    const createdAtBuffer = data.slice(offset, offset + 8);
    const createdAt = new anchor.BN(createdAtBuffer, 'le').toNumber();
    offset += 8;

    // Read yes_amount (8 bytes, u64)
    const yesAmountBuffer = data.slice(offset, offset + 8);
    const yesAmount = new anchor.BN(yesAmountBuffer, 'le').toNumber();
    offset += 8;

    // Read no_amount (8 bytes, u64)
    const noAmountBuffer = data.slice(offset, offset + 8);
    const noAmount = new anchor.BN(noAmountBuffer, 'le').toNumber();
    offset += 8;

    // Read resolved (1 byte, bool)
    const resolved = data.readUInt8(offset) !== 0;
    offset += 1;

    // Read winning_outcome (1 byte, bool)
    const winningOutcome = data.readUInt8(offset) !== 0;

    return {
      address: address.toBase58(),
      authority,
      question,
      description,
      endTime,
      createdAt,
      yesAmount,
      noAmount,
      resolved,
      winningOutcome,
    };
  } catch (error) {
    console.error("Error decoding market account:", error);
    return null;
  }
}

/**
 * Fetch all market accounts owned by the program
 */
export async function fetchAllMarketsDirect(): Promise<MarketAccount[]> {
  console.log("🔍 Fetching markets directly from blockchain...");
  
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);

  try {
    // Get all accounts owned by the program
    const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: anchor.utils.bytes.bs58.encode(MARKET_DISCRIMINATOR),
          },
        },
      ],
    });

    console.log(`📦 Found ${accounts.length} market accounts`);

    // Decode each account
    const markets: MarketAccount[] = [];
    for (const { pubkey, account } of accounts) {
      const decoded = decodeMarketAccount(account.data, pubkey);
      if (decoded) {
        markets.push(decoded);
        console.log(`✅ Decoded market: ${decoded.question.substring(0, 50)}...`);
      }
    }

    console.log(`✅ Successfully decoded ${markets.length} markets`);
    return markets;
  } catch (error) {
    console.error("❌ Error fetching markets:", error);
    return [];
  }
}

/**
 * Fetch a single market account
 */
export async function fetchMarketDirect(marketAddress: string): Promise<MarketAccount | null> {
  console.log("🔍 Fetching market:", marketAddress);
  
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);

  try {
    const marketPubkey = new PublicKey(marketAddress);
    const accountInfo = await connection.getAccountInfo(marketPubkey);

    if (!accountInfo) {
      console.log("❌ Market account not found");
      return null;
    }

    const decoded = decodeMarketAccount(accountInfo.data, marketPubkey);
    
    if (decoded) {
      console.log(`✅ Decoded market: ${decoded.question}`);
    }

    return decoded;
  } catch (error) {
    console.error("❌ Error fetching market:", error);
    return null;
  }
}

/**
 * Calculate odds from amounts (in lamports)
 */
export function calculateOdds(yesAmount: number, noAmount: number): {
  yesPercentage: number;
  noPercentage: number;
} {
  const total = yesAmount + noAmount;
  
  if (total === 0) {
    return {
      yesPercentage: 50,
      noPercentage: 50,
    };
  }
  
  return {
    yesPercentage: (yesAmount / total) * 100,
    noPercentage: (noAmount / total) * 100,
  };
}

/**
 * Format lamports to SOL
 */
export function lamportsToSOL(lamports: number): number {
  return lamports / anchor.web3.LAMPORTS_PER_SOL;
}

/**
 * Decode a Bet account from raw data
 */
function decodeBetAccount(data: Buffer, address: PublicKey): BetAccount | null {
  try {
    // Verify discriminator
    const discriminator = data.slice(0, 8);
    if (!discriminator.equals(BET_DISCRIMINATOR)) {
      console.log("❌ Invalid discriminator for bet account:", address.toBase58());
      return null;
    }

    let offset = 8; // Skip discriminator

    // Read user (32 bytes)
    const user = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;

    // Read market (32 bytes)
    const market = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;

    // Read amount (8 bytes, u64)
    const amountBuffer = data.slice(offset, offset + 8);
    const amount = new anchor.BN(amountBuffer, 'le').toNumber();
    offset += 8;

    // Read outcome (1 byte, bool)
    const outcome = data.readUInt8(offset) !== 0;
    offset += 1;

    // Read claimed (1 byte, bool)
    const claimed = data.readUInt8(offset) !== 0;
    offset += 1;

    // Read timestamp (8 bytes, i64)
    const timestampBuffer = data.slice(offset, offset + 8);
    const timestamp = new anchor.BN(timestampBuffer, 'le').toNumber();

    return {
      address: address.toBase58(),
      user,
      market,
      amount,
      outcome,
      claimed,
      timestamp,
    };
  } catch (error) {
    console.error("Error decoding bet account:", error);
    return null;
  }
}

/**
 * Fetch a user's bet on a market
 */
export async function fetchUserBet(
  userPubkey: PublicKey,
  marketPubkey: PublicKey
): Promise<BetAccount | null> {
  console.log("🔍 Fetching bet for user:", userPubkey.toBase58());
  
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);

  try {
    const [betPDA] = deriveBetPDA(userPubkey, marketPubkey);
    console.log("  Bet PDA:", betPDA.toBase58());

    const accountInfo = await connection.getAccountInfo(betPDA);

    if (!accountInfo) {
      console.log("  No bet found");
      return null;
    }

    const decoded = decodeBetAccount(accountInfo.data, betPDA);
    
    if (decoded) {
      console.log(`✅ Found bet: ${lamportsToSOL(decoded.amount)} SOL on ${decoded.outcome ? 'YES' : 'NO'}`);
    }

    return decoded;
  } catch (error) {
    console.error("❌ Error fetching bet:", error);
    return null;
  }
}

/**
 * Calculate potential winnings for a user's bet
 */
export function calculateWinnings(
  bet: BetAccount,
  market: MarketAccount
): {
  hasWinnings: boolean;
  canClaim: boolean;
  winningsLamports: number;
  winningsSOL: number;
  multiplier: number;
} {
  // Market must be resolved
  if (!market.resolved) {
    return {
      hasWinnings: false,
      canClaim: false,
      winningsLamports: 0,
      winningsSOL: 0,
      multiplier: 0,
    };
  }

  // Must have bet on winning outcome
  if (bet.outcome !== market.winningOutcome) {
    return {
      hasWinnings: false,
      canClaim: false,
      winningsLamports: 0,
      winningsSOL: 0,
      multiplier: 0,
    };
  }

  // Must not have claimed already
  if (bet.claimed) {
    return {
      hasWinnings: false,
      canClaim: false,
      winningsLamports: 0,
      winningsSOL: 0,
      multiplier: 0,
    };
  }

  // Calculate winnings
  const totalPool = market.yesAmount + market.noAmount;
  const winningPool = market.winningOutcome ? market.yesAmount : market.noAmount;

  if (winningPool === 0) {
    return {
      hasWinnings: false,
      canClaim: false,
      winningsLamports: 0,
      winningsSOL: 0,
      multiplier: 0,
    };
  }

  // User's share: (user_bet / winning_pool) * total_pool
  const winningsLamports = Math.floor((bet.amount * totalPool) / winningPool);
  const multiplier = winningsLamports / bet.amount;

  return {
    hasWinnings: true,
    canClaim: true,
    winningsLamports,
    winningsSOL: lamportsToSOL(winningsLamports),
    multiplier,
  };
}

