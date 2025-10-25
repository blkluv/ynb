/**
 * Direct program interaction WITHOUT using Anchor Program class
 * This bypasses IDL compatibility issues
 */

import * as anchor from "@coral-xyz/anchor";
import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  TransactionInstruction,
  Transaction
} from "@solana/web3.js";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import { PROGRAM_ID, RPC_ENDPOINT, CONNECTION_CONFIG } from "./constants";

// Discriminators from IDL
const DISCRIMINATORS = {
  createMarket: Buffer.from([103, 226, 97, 235, 200, 188, 251, 254]),
  placeBet: Buffer.from([222, 62, 67, 220, 63, 166, 126, 33]),
  resolveMarket: Buffer.from([155, 23, 80, 173, 46, 74, 23, 239]),
};

/**
 * Create market instruction data
 */
function encodeCreateMarketData(
  question: string,
  description: string,
  endTime: anchor.BN
): Buffer {
  // Discriminator (8 bytes) + question (4 + len) + description (4 + len) + endTime (8)
  const questionBytes = Buffer.from(question, 'utf8');
  const descriptionBytes = Buffer.from(description, 'utf8');
  
  const data = Buffer.alloc(
    8 + // discriminator
    4 + questionBytes.length + // question length + data
    4 + descriptionBytes.length + // description length + data
    8 // endTime i64
  );
  
  let offset = 0;
  
  // Discriminator
  DISCRIMINATORS.createMarket.copy(data, offset);
  offset += 8;
  
  // Question
  data.writeUInt32LE(questionBytes.length, offset);
  offset += 4;
  questionBytes.copy(data, offset);
  offset += questionBytes.length;
  
  // Description
  data.writeUInt32LE(descriptionBytes.length, offset);
  offset += 4;
  descriptionBytes.copy(data, offset);
  offset += descriptionBytes.length;
  
  // End time
  const endTimeBuffer = endTime.toArrayLike(Buffer, 'le', 8);
  endTimeBuffer.copy(data, offset);
  
  return data;
}

/**
 * Create a market directly
 */
export async function createMarketDirect(
  wallet: AnchorWallet,
  question: string,
  description: string,
  endTime: number
): Promise<{ signature: string; marketPubkey: PublicKey }> {
  console.log("📝 Creating market (direct)...");
  console.log("  Question:", question);
  console.log("  End time:", endTime);
  
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);
  const marketKeypair = anchor.web3.Keypair.generate();
  
  console.log("  Market pubkey:", marketKeypair.publicKey.toBase58());
  console.log("  Authority:", wallet.publicKey.toBase58());
  
  // Encode instruction data
  const endTimeBN = new anchor.BN(endTime);
  const instructionData = encodeCreateMarketData(question, description, endTimeBN);
  
  console.log("  Instruction data length:", instructionData.length);
  
  // Create instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: marketKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  });
  
  // Create and send transaction
  const transaction = new Transaction().add(instruction);
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
  // Sign transaction
  transaction.partialSign(marketKeypair);
  const signedTx = await wallet.signTransaction(transaction);
  
  // Send transaction
  const signature = await connection.sendRawTransaction(signedTx.serialize());
  
  // Confirm transaction
  await connection.confirmTransaction(signature, CONNECTION_CONFIG.commitment);
  
  console.log("✅ Market created! Tx:", signature);
  
  return {
    signature,
    marketPubkey: marketKeypair.publicKey,
  };
}

/**
 * Place bet instruction data
 */
function encodePlaceBetData(
  amount: anchor.BN,
  betYes: boolean
): Buffer {
  // Discriminator (8 bytes) + amount (8 bytes u64) + betYes (1 byte bool)
  const data = Buffer.alloc(8 + 8 + 1);
  
  let offset = 0;
  
  // Discriminator
  DISCRIMINATORS.placeBet.copy(data, offset);
  offset += 8;
  
  // Amount (u64)
  const amountBuffer = amount.toArrayLike(Buffer, 'le', 8);
  amountBuffer.copy(data, offset);
  offset += 8;
  
  // BetYes (bool)
  data.writeUInt8(betYes ? 1 : 0, offset);
  
  return data;
}

/**
 * Place a bet on a market directly
 */
export async function placeBetDirect(
  wallet: AnchorWallet,
  marketPubkey: PublicKey,
  amount: number,
  betYes: boolean
): Promise<string> {
  console.log("🎲 Placing bet (direct)...");
  console.log("  Market:", marketPubkey.toBase58());
  console.log("  Amount:", amount, "SOL");
  console.log("  Bet:", betYes ? "YES" : "NO");
  
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);
  
  // Convert SOL to lamports
  const amountLamports = new anchor.BN(amount * anchor.web3.LAMPORTS_PER_SOL);
  
  console.log("  Amount (lamports):", amountLamports.toString());
  console.log("  User:", wallet.publicKey.toBase58());
  
  // Encode instruction data
  const instructionData = encodePlaceBetData(amountLamports, betYes);
  
  console.log("  Instruction data length:", instructionData.length);
  
  // Create instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: marketPubkey, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  });
  
  // Create and send transaction
  const transaction = new Transaction().add(instruction);
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
  // Sign transaction
  const signedTx = await wallet.signTransaction(transaction);
  
  // Send transaction
  const signature = await connection.sendRawTransaction(signedTx.serialize());
  
  // Confirm transaction
  await connection.confirmTransaction(signature, CONNECTION_CONFIG.commitment);
  
  console.log("✅ Bet placed! Tx:", signature);
  
  return signature;
}

/**
 * Resolve market instruction data
 */
function encodeResolveMarketData(outcome: boolean): Buffer {
  // Discriminator (8 bytes) + outcome (1 byte bool)
  const data = Buffer.alloc(8 + 1);
  
  let offset = 0;
  
  // Discriminator
  DISCRIMINATORS.resolveMarket.copy(data, offset);
  offset += 8;
  
  // Outcome (bool)
  data.writeUInt8(outcome ? 1 : 0, offset);
  
  return data;
}

/**
 * Resolve a market directly (only authority can do this)
 */
export async function resolveMarketDirect(
  wallet: AnchorWallet,
  marketPubkey: PublicKey,
  outcome: boolean
): Promise<string> {
  console.log("⚖️ Resolving market (direct)...");
  console.log("  Market:", marketPubkey.toBase58());
  console.log("  Outcome:", outcome ? "YES" : "NO");
  console.log("  Authority:", wallet.publicKey.toBase58());
  
  const connection = new Connection(RPC_ENDPOINT, CONNECTION_CONFIG.commitment);
  
  // Encode instruction data
  const instructionData = encodeResolveMarketData(outcome);
  
  console.log("  Instruction data length:", instructionData.length);
  
  // Create instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: marketPubkey, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  });
  
  // Create and send transaction
  const transaction = new Transaction().add(instruction);
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
  // Sign transaction
  const signedTx = await wallet.signTransaction(transaction);
  
  // Send transaction
  const signature = await connection.sendRawTransaction(signedTx.serialize());
  
  // Confirm transaction
  await connection.confirmTransaction(signature, CONNECTION_CONFIG.commitment);
  
  console.log("✅ Market resolved! Tx:", signature);
  
  return signature;
}

