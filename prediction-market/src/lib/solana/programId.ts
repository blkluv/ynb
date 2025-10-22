/**
 * Program ID del smart contract deployado
 *
 * IMPORTANTE: Actualiza este valor después de deployar en Solana Playground
 *
 * Ejemplo: Si Playground te da:
 * "Program ID: 7PZf8wZqG5t3H9xKvN4M8rY2wXq1Q3nC6sD9xJ2vL4kA"
 *
 * Entonces actualiza:
 * export const PROGRAM_ID = new PublicKey('7PZf8wZqG5t3H9xKvN4M8rY2wXq1Q3nC6sD9xJ2vL4kA')
 */

import { PublicKey } from '@solana/web3.js'

// Program ID deployado en Devnet
export const PROGRAM_ID = new PublicKey(
  '5RkwWAaXDWKhEDmw8XQsoDqUvbZAphqoeZNX5tFmE6o8'
)

// Network configuration
export const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'

// RPC endpoints
export const RPC_ENDPOINTS = {
  devnet:
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com',
}

export const getCurrentRpcEndpoint = () => {
  return (
    RPC_ENDPOINTS[NETWORK as keyof typeof RPC_ENDPOINTS] || RPC_ENDPOINTS.devnet
  )
}
