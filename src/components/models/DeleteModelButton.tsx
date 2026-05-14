'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'

interface DeleteModelButtonProps {
  modelId: string
  modelTitle: string
}

export default function DeleteModelButton({ modelId, modelTitle }: DeleteModelButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { showToast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase.from('models').delete().eq('id', modelId)
    if (error) {
      showToast('Erro ao excluir peça.', 'error')
    } else {
      showToast('Peça excluída com sucesso.')
      router.refresh()
    }
    setLoading(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-600 hidden sm:block">Confirmar?</span>
        <button onClick={handleDelete} disabled={loading} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-60">
          {loading ? '...' : 'Sim'}
        </button>
        <button onClick={() => setConfirming(false)} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200">
          Não
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title={`Excluir "${modelTitle}"`}
    >
      <Trash2 size={16} />
    </button>
  )
}
