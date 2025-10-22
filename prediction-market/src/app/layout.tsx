import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WalletProvider from '@/providers/WalletProvider'
import './suppress-wallet-errors'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PrismaFi | Your own Prediction Markets on Solana',
  description:
    'Generate your prediction market in 3 steps. Put your price for truth. 95% privacy with on-chain resolution and only 0.5% fees.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}
