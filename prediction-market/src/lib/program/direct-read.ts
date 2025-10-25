/**
 * Direct program read functions WITHOUT using Anchor Program class
 * Reads market accounts directly from the blockchain
 */

import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, AccountInfo } from "@solana/web3.js";
import { PROGRAM_ID, RPC_ENDPOINT, CONNECTION_CONFIG } from "./constants";

// Market discriminator from IDL
const MARKET_DISCRIMINATOR = Buffer.from([219, 190, 213, 55, 0, 227, 198, 154]);

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

