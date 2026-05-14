import { notFound } from 'next/navigation'
import Link from 'next/link'
import ModelCard from '@/components/models/ModelCard'
import { ChevronRight } from 'lucide-react'
import { MOCK_CATEGORIES, getModelsByCategory } from '@/lib/mock-data'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const cat = MOCK_CATEGORIES.find(c => c.slug === slug)
  if (!cat) return {}
  return { title: `${cat.name} — 3D Livre`, description: `Modelos 3D na categoria ${cat.name}` }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const cat = MOCK_CATEGORIES.find(c => c.slug === slug)
  if (!cat) notFound()

  const models = getModelsByCategory(cat.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-900">Início</Link>
        <ChevronRight size={14} />
        <Link href="/categorias" className="hover:text-gray-900">Categorias</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{cat.name}</span>
      </nav>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl">{cat.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cat.name}</h1>
          <p className="text-gray-500 mt-1">{models.length} modelo{models.length !== 1 ? 's' : ''} disponível{models.length !== 1 ? 'is' : ''}</p>
        </div>
      </div>

      {models.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium text-gray-600">Nenhuma peça nesta categoria ainda</p>
          <p className="text-sm mt-1">Seja o primeiro a compartilhar!</p>
          <Link href="/enviar" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">Enviar peça</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {models.map((model) => <ModelCard key={model.id} model={model} />)}
        </div>
      )}
    </div>
  )
}
