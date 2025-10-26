import { PublicKey } from "@solana/web3.js";

/**
 * Program ID deployed to Devnet (Oracle-Enabled)
 * Deploy Date: 2025-10-26
 * Explorer: https://explorer.solana.com/address/GUzTP7BCgdTUTEDtguuUwZKdDbrkAKFiiRuqzpbSaQLu?cluster=devnet
 * Features: Pyth Network Oracle Integration for automatic price-based resolution
 */
export const PROGRAM_ID = new PublicKey(
  "GUzTP7BCgdTUTEDtguuUwZKdDbrkAKFiiRuqzpbSaQLu"
);

/**
 * IDL Account Address
 */
export const IDL_ACCOUNT = new PublicKey(
  "GvHscGzk7tLC8SDdTqbHXgjifEEwUUYaVYMgRCNN1tFL"
);

/**
 * Cluster Configuration
 */
export const CLUSTER = "devnet";
export const RPC_ENDPOINT = "https://api.devnet.solana.com";

/**
 * Connection Configuration
 */
export const CONNECTION_CONFIG = {
  commitment: 'confirmed' as const,
  confirmTransactionInitialTimeout: 60000,
};

/**
 * Market Configuration
 */
export const MIN_BET_AMOUNT = 0.01; // SOL
export const MAX_QUESTION_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 500;

