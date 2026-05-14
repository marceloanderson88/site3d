'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import type { Model } from '@/types'

interface DownloadButtonProps {
  model: Model
}

export default function DownloadButton({ model }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleDownload = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    showToast('Download iniciado! (Demo — sem arquivo real)')
    setLoading(false)
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
