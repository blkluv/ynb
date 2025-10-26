'use client'

import React from 'react'
import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth'

interface PrivyProviderProps {
  children: React.ReactNode
}

export default function PrivyProvider({ children }: PrivyProviderProps) {
  // Durante build/SSR, desactivar Privy para evitar errores de prerendering
  // Solo inicializar en el cliente
  if (typeof window === 'undefined') {
    return <>{children}</>
  }

  // Demo App ID público para testing
  // Para producción: crea tu App ID en https://dashboard.privy.io/
  const appId =
    process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clpispdty00ycl80fpueukfm'

  // Si no hay App ID válido, renderizar sin Privy
  if (!appId || appId.trim().length < 10) {
    console.warn(
      '⚠️ No valid Privy App ID configured. Wallet connection disabled.'
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
