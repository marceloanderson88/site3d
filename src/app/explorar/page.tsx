import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ModelCard from '@/components/models/ModelCard'
import Select from '@/components/ui/Select'
import { Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import type { Model } from '@/types'
import { CATEGORIES, FILE_TYPES, MATERIALS, LICENSES } from '@/lib/utils'

interface ExplorarPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    file_type?: string
    material?: string
    license?: string
    page?: string
  }>
}

async function getModels(params: Awaited<ExplorarPageProps['searchParams']>) {
  const supabase = await createClient()
  const page = parseInt(params.page || '1')
  const limit = 24
  const offset = (page - 1) * limit

  let query = supabase
    .from('models')
    .select(`*, profile:profiles(id,name,avatar_url,role), category:categories(id,name,slug,icon), tags:model_tags(tags(id,name,slug)), images:model_images(id,image_url,created_at)`, { count: 'exact' })
    .eq('status', 'published')
    .range(offset, offset + limit - 1)

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }

  if (params.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (params.file_type) query = query.eq('file_type', params.file_type)
  if (params.material) query = query.eq('material', params.material)
  if (params.license) query = query.eq('license', params.license)

  switch (params.sort) {
    case 'downloads': query = query.order('downloads_count', { ascending: false }); break
    case 'rating': query = query.order('downloads_count', { ascending: false }); break
    default: query = query.order('created_at', { ascending: false })
  }

  const { data, count } = await query
  const models = (data || []).map((d: Record<string, unknown>) => {
    const tags = Array.isArray(d.tags) ? d.tags.map((mt: Record<string, unknown>) => mt.tags).filter(Boolean) : []
    return { ...d, tags, profile: d.profile || undefined, category: d.category || undefined, images: Array.isArray(d.images) ? d.images : [] } as Model
  })

  return { models, total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) }
}

export default async function ExplorarPage({ searchParams }: ExplorarPageProps) {
  const params = await searchParams
  const { models, total, page, totalPages } = await getModels(params)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const merged = { ...params, ...overrides }
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join('&')
    return `/explorar${qs ? '?' + qs : ''}`
  }

  const sortOptions = [
    { value: 'recent', label: 'Mais recentes' },
    { value: 'downloads', label: 'Mais baixadas' },
    { value: 'rating', label: 'Melhor avaliadas' },
  ]

  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    ...CATEGORIES.map(c => ({ value: c.slug, label: c.name })),
  ]

  const fileTypeOptions = [
    { value: '', label: 'Qualquer formato' },
    ...FILE_TYPES.map(t => ({ value: t, label: t.toUpperCase() })),
  ]

  const materialOptions = [
    { value: '', label: 'Qualquer material' },
    ...MATERIALS.map(m => ({ value: m, label: m })),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explorar Peças 3D</h1>
        {params.q && (
          <p className="text-gray-500 mt-1 text-sm">
            Resultados para: <span className="font-medium text-gray-900">"{params.q}"</span>
            {' '}— {total} peça{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Select
            options={categoryOptions}
            value={params.category || ''}
            onChange={(e) => { window.location.href = buildUrl({ category: e.target.value || undefined, page: undefined }) }}
            placeholder="Categoria"
          />
          <Select
            options={sortOptions}
            value={params.sort || 'recent'}
            onChange={(e) => { window.location.href = buildUrl({ sort: e.target.value, page: undefined }) }}
          />
          <Select
            options={fileTypeOptions}
            value={params.file_type || ''}
            onChange={(e) => { window.location.href = buildUrl({ file_type: e.target.value || undefined, page: undefined }) }}
            placeholder="Formato"
          />
          <Select
            options={materialOptions}
            value={params.material || ''}
            onChange={(e) => { window.location.href = buildUrl({ material: e.target.value || undefined, page: undefined }) }}
            placeholder="Material"
          />
        </div>
      </div>

      {/* Results */}
      {models.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Search size={48} className="mb-3 opacity-40" />
          <p className="font-medium text-gray-600">Nenhuma peça encontrada</p>
          <p className="text-sm mt-1">Tente outros filtros ou termos de busca</p>
          <Link href="/explorar" className="mt-4 text-blue-600 hover:underline text-sm">Limpar filtros</Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{total.toLocaleString('pt-BR')} peça{total !== 1 ? 's' : ''}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {models.map((model) => <ModelCard key={model.id} model={model} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link href={buildUrl({ page: String(page - 1) })} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                  Anterior
                </Link>
              )}
              <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
              {page < totalPages && (
                <Link href={buildUrl({ page: String(page + 1) })} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                  Próxima
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
