'use client'

import React from 'react'
import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth'

interface PrivyProviderProps {
  children: React.ReactNode
}

// Demo App ID público para testing
// Para producción: crea tu App ID en https://dashboard.privy.io/
const DEMO_APP_ID = 'clpispdty00ycl80fpueukfm'

export default function PrivyProvider({ children }: PrivyProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || DEMO_APP_ID

  // Validación adicional: si el App ID está vacío o es muy corto, es inválido
  if (!appId || appId.trim().length < 10) {
    console.warn(
      '⚠️ Invalid Privy App ID. Using demo mode without wallet connection.'
    )
    return <>{children}</>
  }

  return (
    <PrivyProviderBase
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#7c3aed',
          logo: '/images/prismafi-logo.svg',
          showWalletLoginFirst: true,
        },
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProviderBase>
  )
}
