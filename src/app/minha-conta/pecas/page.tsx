'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Plus } from 'lucide-react'

export default function MinhasPecasPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Peças</h1>
          <p className="text-gray-500 text-sm mt-1">0 peças enviadas</p>
        </div>
        <Link href="/enviar" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} />Nova peça
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-4xl mb-3">📭</p>
        <h3 className="font-semibold text-gray-900 mb-1">Nenhuma peça enviada ainda</h3>
        <p className="text-gray-500 text-sm mb-4">Compartilhe seus modelos 3D com a comunidade!</p>
        <Link href="/enviar" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} />Enviar primeira peça
        </Link>
      </div>
    </div>
  )
}
