import Link from 'next/link'
import { MOCK_CATEGORIES } from '@/lib/mock-data'

export default function CategoriasPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
        <p className="text-gray-500 mt-2">Explore modelos 3D organizados por categoria</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categorias/${cat.slug}`}
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <span className="text-4xl">{cat.icon}</span>
            <div>
              <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{cat.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{cat.model_count ?? 0} peça{(cat.model_count ?? 0) !== 1 ? 's' : ''}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
