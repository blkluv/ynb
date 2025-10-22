'use client'

import { useMemo, ReactNode } from 'react'
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css'

interface WalletProviderProps {
  children: ReactNode
}

export default function WalletProvider({ children }: WalletProviderProps) {
  // Configure network - use Devnet for development, Mainnet for production
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta'
    ? WalletAdapterNetwork.Mainnet
    : WalletAdapterNetwork.Devnet) as WalletAdapterNetwork

  // Use custom RPC endpoint or fallback to default
  const endpoint = useMemo(() => {
    const customRPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT
    if (customRPC) {
      return customRPC
    }
    // Default to Devnet for development
    return network === WalletAdapterNetwork.Mainnet
      ? clusterApiUrl(WalletAdapterNetwork.Mainnet)
      : 'https://api.devnet.solana.com'
  }, [network])

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // Add more wallets here as needed
      // new SolflareWalletAdapter(),
      // new BackpackWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
