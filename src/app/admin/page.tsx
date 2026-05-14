import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { CheckCircle, XCircle, Clock, Package, Users, Download } from 'lucide-react'
import AdminActions from '@/components/admin/AdminActions'
import type { Model } from '@/types'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/')

  const { data: pendingData } = await supabase
    .from('models')
    .select(`*, profile:profiles(id,name,avatar_url,role), category:categories(id,name,slug,icon)`)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const pending = (pendingData || []).map((d: Record<string, unknown>) => ({
    ...d,
    profile: d.profile || undefined,
    category: d.category || undefined,
  })) as Model[]

  const [{ count: totalModels }, { count: totalUsers }, { count: totalDownloads }] = await Promise.all([
    supabase.from('models').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('downloads').select('id', { count: 'exact', head: true }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Administração</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Package, label: 'Modelos publicados', value: totalModels || 0, color: 'text-blue-600 bg-blue-100' },
          { icon: Users, label: 'Usuários', value: totalUsers || 0, color: 'text-green-600 bg-green-100' },
          { icon: Download, label: 'Downloads', value: totalDownloads || 0, color: 'text-purple-600 bg-purple-100' },
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

      {/* Pending models */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={16} className="text-yellow-600" />
            Peças pendentes de aprovação ({pending.length})
          </h2>
        </div>

        {pending.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
            <p className="text-sm">Nenhuma peça aguardando aprovação.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pending.map((model) => (
              <div key={model.id} className="p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{model.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    por {model.profile?.name || 'Desconhecido'} ·
                    {model.category ? ` ${(model.category as {icon?: string}).icon} ${(model.category as {name?: string}).name} ·` : ''}
                    {' '}{formatDate(model.created_at)}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{model.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{model.file_type.toUpperCase()}</span>
                    {model.license && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{model.license}</span>}
                    <a href={model.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      Ver arquivo
                    </a>
                  </div>
                </div>
                <AdminActions modelId={model.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
