import ModelCard from './ModelCard'
import type { Model } from '@/types'
import { Package } from 'lucide-react'

interface ModelGridProps {
  models: Model[]
  emptyMessage?: string
}

export default function ModelGrid({ models, emptyMessage = 'Nenhuma peça encontrada.' }: ModelGridProps) {
  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Package size={48} className="mb-3 opacity-50" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  )
}
