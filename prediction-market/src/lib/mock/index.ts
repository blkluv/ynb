// Export all mock data

export * from './markets'
export * from './positions'
export * from './activity'

// Mock mode flag (toggle this for demo vs real blockchain)
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

// Helper to toggle mock data
export function isMockMode(): boolean {
  return USE_MOCK_DATA
}


