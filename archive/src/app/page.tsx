'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/markets')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🔮</div>
        <h1 className="text-4xl font-bold text-white mb-2">PrismaFi</h1>
        <p className="text-gray-300">Cargando mercados...</p>
      </div>
    </div>
  )
}
