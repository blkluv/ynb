'use client'

import React from 'react'
import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth'

interface PrivyProviderProps {
  children: React.ReactNode
}

export default function PrivyProvider({ children }: PrivyProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''

  // Si no hay App ID configurado, solo retornar los children sin el provider
  if (!appId) {
    console.warn(
      '⚠️ NEXT_PUBLIC_PRIVY_APP_ID is not set. Running without wallet connection.'
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
