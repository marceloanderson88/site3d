import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Plus, Edit, Trash2, Eye, Clock, CheckCircle, XCircle } from 'lucide-react'
import DeleteModelButton from '@/components/models/DeleteModelButton'
import type { Model } from '@/types'

export default async function MinhasPecasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('models')
    .select(`*, category:categories(id,name,slug,icon)`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const models = (data || []) as Model[]

  const statusConfig = {
    pending: { label: 'Pendente', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    published: { label: 'Publicada', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    rejected: { label: 'Rejeitada', icon: XCircle, color: 'text-red-600 bg-red-50' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Peças</h1>
          <p className="text-gray-500 text-sm mt-1">{models.length} peça{models.length !== 1 ? 's' : ''} enviada{models.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/enviar" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          Nova peça
        </Link>
      </div>

      {models.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="font-semibold text-gray-900 mb-1">Nenhuma peça enviada ainda</h3>
          <p className="text-gray-500 text-sm mb-4">Compartilhe seus modelos 3D com a comunidade!</p>
          <Link href="/enviar" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700">
            <Plus size={16} /> Enviar primeira peça
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {models.map((model) => {
            const status = statusConfig[model.status]
            const StatusIcon = status.icon
            return (
              <div key={model.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {model.cover_image_url ? (
                    <Image src={model.cover_image_url} alt={model.title} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🖨️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{model.title}</h3>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                      <StatusIcon size={11} />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {model.category && `${(model.category as {icon?: string}).icon} ${(model.category as {name?: string}).name} · `}
                    Enviado em {formatDate(model.created_at)}
                    {model.status === 'published' && ` · ${model.downloads_count} downloads`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {model.status === 'published' && (
                    <Link href={`/pecas/${model.slug}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver peça">
                      <Eye size={16} />
                    </Link>
                  )}
                  <DeleteModelButton modelId={model.id} modelTitle={model.title} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
