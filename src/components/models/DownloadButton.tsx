'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Model } from '@/types'

interface DownloadButtonProps {
  model: Model
}

export default function DownloadButton({ model }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleDownload = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('downloads').insert({
        model_id: model.id,
        user_id: user?.id || null,
      })
      window.open(model.file_url, '_blank')
    } catch {
      window.open(model.file_url, '_blank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
      {loading ? 'Preparando...' : `Baixar ${model.file_type.toUpperCase()}`}
    </button>
  )
}
