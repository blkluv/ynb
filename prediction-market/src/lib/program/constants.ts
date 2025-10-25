import { PublicKey } from "@solana/web3.js";

/**
 * Program ID deployed to Devnet
 * Deploy Date: 2025-10-25
 * Explorer: https://explorer.solana.com/address/9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka?cluster=devnet
 */
export const PROGRAM_ID = new PublicKey(
  "9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka"
);

/**
 * IDL Account Address
 */
export const IDL_ACCOUNT = new PublicKey(
  "5nHBkAVTUWCrbs7rN1wtcLJAaeFjVMVM5M5ytVUCwUC1"
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

