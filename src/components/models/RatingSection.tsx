'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import StarRating from '@/components/ui/StarRating'
import { useToast } from '@/components/ui/Toast'
import { Star } from 'lucide-react'

interface RatingSectionProps {
  modelId: string
  initialStats: { average: number; count: number }
}

export default function RatingSection({ modelId, initialStats }: RatingSectionProps) {
  const [stats, setStats] = useState(initialStats)
  const [userRating, setUserRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()
  const { showToast } = useToast()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
        const { data } = await supabase.from('ratings').select('rating').eq('model_id', modelId).eq('user_id', user.id).single()
        if (data) { setUserRating(data.rating); setHasRated(true) }
      }
    }
    init()
  }, [modelId])

  const refreshStats = async () => {
    const { data } = await supabase.from('ratings').select('rating').eq('model_id', modelId)
    if (data && data.length > 0) {
      const average = data.reduce((sum, r) => sum + r.rating, 0) / data.length
      setStats({ average: Math.round(average * 10) / 10, count: data.length })
    }
  }

  const handleRate = async (rating: number) => {
    if (!currentUserId) { showToast('Faça login para avaliar.', 'error'); return }
    if (hasRated) { showToast('Você já avaliou esta peça.', 'error'); return }
    setSubmitting(true)
    const { error } = await supabase.from('ratings').insert({ model_id: modelId, user_id: currentUserId, rating })
    if (error) {
      showToast('Erro ao registrar avaliação.', 'error')
    } else {
      setUserRating(rating)
      setHasRated(true)
      showToast('Avaliação registrada!')
      await refreshStats()
    }
    setSubmitting(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Star size={16} />
        Avaliações
      </h2>

      <div className="flex items-center gap-6 mb-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{stats.average > 0 ? stats.average.toFixed(1) : '—'}</p>
          <StarRating value={Math.round(stats.average)} readonly size="sm" />
          <p className="text-xs text-gray-500 mt-1">{stats.count} avaliação{stats.count !== 1 ? 'ões' : ''}</p>
        </div>
      </div>

      {currentUserId ? (
        hasRated ? (
          <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
            Você avaliou esta peça com {userRating} estrela{userRating !== 1 ? 's' : ''}.
            <StarRating value={userRating} readonly size="sm" />
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-2">Sua avaliação:</p>
            <StarRating
              value={userRating}
              onChange={submitting ? undefined : handleRate}
              size="lg"
            />
          </div>
        )
      ) : (
        <p className="text-sm text-gray-500">
          <a href="/login" className="text-blue-600 hover:underline">Faça login</a> para avaliar.
        </p>
      )}
    </div>
  )
}
