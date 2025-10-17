import type { Metadata } from 'next'
import PrivyProvider from '@/providers/PrivyProvider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'PrismaFi - The Open Prediction Layer for Solana',
  description:
    'Trade on any event with lightning-fast settlements and minimal fees on Solana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <PrivyProvider>{children}</PrivyProvider>
      </body>
    </html>
  )
}
