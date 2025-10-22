/**
 * Suprimir errores de conflictos de wallets en consola
 *
 * Este script suprime el error "Cannot redefine property: ethereum"
 * que ocurre cuando múltiples wallets están instaladas.
 *
 * NOTA: Solo para desarrollo. En producción estos errores no aparecen
 * porque los usuarios típicamente tienen menos extensiones activas.
 */

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error
  const originalWarn = console.warn

  console.error = (...args: any[]) => {
    const errorString = args[0]?.toString() || ''

    // Suprimir errores conocidos de conflictos de wallets
    const suppressedErrors = [
      'Cannot redefine property: ethereum',
      'evmAsk.js',
      'defineProperty',
    ]

    if (suppressedErrors.some((err) => errorString.includes(err))) {
      return // Ignorar silenciosamente
    }

    originalError(...args)
  }

  console.warn = (...args: any[]) => {
    const warnString = args[0]?.toString() || ''

    // Suprimir warnings de wallets
    const suppressedWarnings = ['ethereum', 'wallet']

    if (suppressedWarnings.some((warn) => warnString.includes(warn))) {
      return // Ignorar silenciosamente
    }

    originalWarn(...args)
  }

  console.log('🛡️ Wallet error suppression active (development only)')
}

export {}












