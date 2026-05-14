'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ModelCard from '@/components/models/ModelCard'
import Select from '@/components/ui/Select'
import { Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { CATEGORIES, FILE_TYPES, MATERIALS } from '@/lib/utils'
import { searchModels } from '@/lib/mock-data'

export default function ExplorarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'recent'
  const file_type = searchParams.get('file_type') || ''
  const material = searchParams.get('material') || ''

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 12

  const models = useMemo(() => searchModels(q, { category, sort, file_type, material }), [q, category, sort, file_type, material])

  const total = models.length
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const paged = models.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const navigate = (overrides: Record<string, string>) => {
    setPage(1)
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (category) p.set('category', category)
    if (sort && sort !== 'recent') p.set('sort', sort)
    if (file_type) p.set('file_type', file_type)
    if (material) p.set('material', material)
    Object.entries(overrides).forEach(([k, v]) => { if (v) p.set(k, v); else p.delete(k) })
    router.push(`/explorar?${p.toString()}`)
  }

  const sortOptions = [
    { value: 'recent', label: 'Mais recentes' },
    { value: 'downloads', label: 'Mais baixadas' },
    { value: 'rating', label: 'Melhor avaliadas' },
  ]

  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    ...CATEGORIES.map(c => ({ value: c.slug, label: `${c.icon} ${c.name}` })),
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
        {q && (
          <p className="text-gray-500 mt-1 text-sm">
            Resultados para: <span className="font-medium text-gray-900">"{q}"</span>
            {' — '}{total} peça{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Select options={categoryOptions} value={category} onChange={e => navigate({ category: e.target.value })} />
          <Select options={sortOptions} value={sort} onChange={e => navigate({ sort: e.target.value })} />
          <Select options={fileTypeOptions} value={file_type} onChange={e => navigate({ file_type: e.target.value })} />
          <Select options={materialOptions} value={material} onChange={e => navigate({ material: e.target.value })} />
        </div>
      </div>

      {paged.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Search size={48} className="mb-3 opacity-40" />
          <p className="font-medium text-gray-600">Nenhuma peça encontrada</p>
          <p className="text-sm mt-1">Tente outros filtros ou termos de busca</p>
          <Link href="/explorar" className="mt-4 text-blue-600 hover:underline text-sm">Limpar filtros</Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{total.toLocaleString('pt-BR')} peça{total !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {paged.map((model) => <ModelCard key={model.id} model={model} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && <button onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Anterior</button>}
              <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
              {page < totalPages && <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Próxima</button>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
