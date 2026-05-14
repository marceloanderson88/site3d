import { Suspense } from 'react'
import ExplorarContent from './ExplorarContent'

export default function ExplorarPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Carregando...</div>}>
      <ExplorarContent />
    </Suspense>
  )
}
