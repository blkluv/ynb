import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import { PROGRAM_ID, RPC_ENDPOINT, CONNECTION_CONFIG } from "./constants";
import idlJson from "../../idl/prediction_market.json";

/**
 * Get the program instance
 */
export function getProgram(wallet: AnchorWallet): Program {
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: CONNECTION_CONFIG.commitment,
    commitment: CONNECTION_CONFIG.commitment,
  });
  
  // Debug: verificar setup
  console.log("🔍 Program ID:", PROGRAM_ID.toBase58());
  console.log("🔍 Provider wallet:", provider.wallet.publicKey.toBase58());
  
  try {
    // ✅ Crear programa con IDL JSON
    // El programId se toma del IDL o se usa el PROGRAM_ID de constants
    const program = new Program(
      idlJson as Idl,
      provider
    );
    
    console.log("✅ Program created successfully");
    console.log("✅ Program.programId:", program.programId.toBase58());
    
    return program;
  } catch (error) {
    console.error("❌ Error creating Program:", error);
    console.log("❌ Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
}

/**
 * Market data structure
 */
export interface Market {
  authority: PublicKey;
  question: string;
  description: string;
  endTime: anchor.BN;
  createdAt: anchor.BN;
  yesAmount: anchor.BN;
  noAmount: anchor.BN;
  resolved: boolean;
  winningOutcome: boolean;
}

/**
 * Create a new prediction market
 */
export async function createMarket(
  program: Program,
  question: string,
  description: string,
  endTime: number
): Promise<{ signature: string; marketPubkey: PublicKey }> {
  // Validate inputs
  if (!question || question.trim().length === 0) {
    throw new Error("Question is required");
  }
  if (!description || description.trim().length === 0) {
    throw new Error("Description is required");
  }
  if (!endTime || isNaN(endTime) || endTime <= 0) {
    throw new Error(`Invalid end time: ${endTime}. Must be a positive Unix timestamp.`);
  }

  const marketKeypair = anchor.web3.Keypair.generate();
  
  console.log("📝 Creating market...");
  console.log("  Question:", question);
  console.log("  Description:", description.substring(0, 100) + "...");
  console.log("  End time (unix):", endTime);
  console.log("  End time (date):", new Date(endTime * 1000).toISOString());
  console.log("  Market pubkey:", marketKeypair.publicKey.toBase58());
  console.log("  Authority:", program.provider.publicKey!.toBase58());
  
  // Create BN from validated endTime
  const endTimeBN = new anchor.BN(endTime);
  console.log("  End time BN:", endTimeBN.toString());
  
  const tx = await (program.methods as any)
    .createMarket(question, description, endTimeBN)
    .accounts({
      market: marketKeypair.publicKey,
      authority: program.provider.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .signers([marketKeypair])
    .rpc();

  console.log("✅ Market created! Tx:", tx);

  return {
    signature: tx,
    marketPubkey: marketKeypair.publicKey,
  };
}

/**
 * Place a bet on a market
 */
export async function placeBet(
  program: Program,
  marketPubkey: PublicKey,
  amount: number,
  betYes: boolean
): Promise<string> {
  const amountLamports = new anchor.BN(amount * anchor.web3.LAMPORTS_PER_SOL);
  
  const tx = await (program.methods as any)
    .placeBet(amountLamports, betYes)
    .accounts({
      market: marketPubkey,
      user: program.provider.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

/**
 * Resolve a market (only authority)
 */
export async function resolveMarket(
  program: Program,
  marketPubkey: PublicKey,
  outcome: boolean
): Promise<string> {
  const tx = await (program.methods as any)
    .resolveMarket(outcome)
    .accounts({
      market: marketPubkey,
      authority: program.provider.publicKey!,
    })
    .rpc();

  return tx;
}

/**
 * Fetch a market account
 */
export async function fetchMarket(
  program: Program,
  marketPubkey: PublicKey
): Promise<Market | null> {
  try {
    const marketAccount = await (program.account as any).market.fetch(marketPubkey);
    return marketAccount as Market;
  } catch (error) {
    console.error("Error fetching market:", error);
    return null;
  }
}

/**
 * Fetch all markets
 */
export async function fetchAllMarkets(
  program: Program
): Promise<Array<{ pubkey: PublicKey; account: Market }>> {
  try {
    const markets = await (program.account as any).market.all();
    return markets.map((m: any) => ({
      pubkey: m.publicKey,
      account: m.account as Market
    }));
  } catch (error) {
    console.error("Error fetching all markets:", error);
    return [];
  }
}

/**
 * Calculate odds from amounts
 */
export function calculateOdds(yesAmount: number, noAmount: number): {
  yesOdds: number;
  noOdds: number;
  yesPercentage: number;
  noPercentage: number;
} {
  const total = yesAmount + noAmount;
  
  if (total === 0) {
    return {
      yesOdds: 50,
      noOdds: 50,
      yesPercentage: 50,
      noPercentage: 50,
    };
  }
  
  const yesPercentage = (yesAmount / total) * 100;
  const noPercentage = (noAmount / total) * 100;
  
  return {
    yesOdds: yesAmount / total,
    noOdds: noAmount / total,
    yesPercentage,
    noPercentage,
  };
}

/**
 * Format SOL amount
 */
export function formatSOL(lamports: number): string {
  return (lamports / anchor.web3.LAMPORTS_PER_SOL).toFixed(4);
}

