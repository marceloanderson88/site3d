'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'

interface AdminActionsProps {
  modelId: string
}

export default function AdminActions({ modelId }: AdminActionsProps) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const supabase = createClient()
  const { showToast } = useToast()
  const router = useRouter()

  const updateStatus = async (status: 'published' | 'rejected') => {
    setLoading(status === 'published' ? 'approve' : 'reject')
    const { error } = await supabase.from('models').update({ status }).eq('id', modelId)
    if (error) {
      showToast('Erro ao atualizar status.', 'error')
    } else {
      showToast(status === 'published' ? 'Peça aprovada!' : 'Peça rejeitada.')
      router.refresh()
    }
    setLoading(null)
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => updateStatus('published')}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
      >
        {loading === 'approve' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
        Aprovar
      </button>
      <button
        onClick={() => updateStatus('rejected')}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
      >
        {loading === 'reject' ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
        Rejeitar
      </button>
    </div>
  )
}
