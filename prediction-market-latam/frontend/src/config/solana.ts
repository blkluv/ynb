import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey('9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka');
export const NETWORK = 'devnet';
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

export const CONNECTION_CONFIG = {
  commitment: 'confirmed' as const,
  confirmTransactionInitialTimeout: 60000,
};


