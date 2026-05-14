'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { formatDate } from '@/lib/utils'
import { CheckCircle, Clock, Package, Users, Download } from 'lucide-react'
import { MOCK_MODELS, MOCK_STATS } from '@/lib/mock-data'

const PENDING = MOCK_MODELS.slice(0, 2).map(m => ({ ...m, status: 'pending' as const }))

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.push('/')
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== 'admin') return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Administração</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Package, label: 'Modelos publicados', value: MOCK_STATS.models, color: 'text-blue-600 bg-blue-100' },
          { icon: Users, label: 'Usuários', value: MOCK_STATS.users, color: 'text-green-600 bg-green-100' },
          { icon: Download, label: 'Downloads', value: MOCK_STATS.downloads, color: 'text-purple-600 bg-purple-100' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString('pt-BR')}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={16} className="text-yellow-600" />
            Peças pendentes de aprovação ({PENDING.length} — demonstração)
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {PENDING.map((model) => (
            <div key={model.id} className="p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{model.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  por {model.profile?.name} · {model.category?.icon} {model.category?.name} · {formatDate(model.created_at)}
                </p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{model.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{model.file_type.toUpperCase()}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{model.license}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => alert('Aprovado! (Demo — sem banco de dados)')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={14} />Aprovar
                </button>
                <button
                  onClick={() => alert('Rejeitado! (Demo — sem banco de dados)')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
