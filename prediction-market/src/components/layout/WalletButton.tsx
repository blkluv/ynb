'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useWallet } from '@solana/wallet-adapter-react'

// Importar WalletMultiButton solo en el cliente para evitar errores de hidratación
const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
)

export default function WalletButton() {
  return (
    <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !text-white !shadow-lg hover:!shadow-purple-500/25 !rounded-lg !font-medium !transition-all !duration-200" />
  )
}
