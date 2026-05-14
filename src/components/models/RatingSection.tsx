'use client'

import { useState } from 'react'
import StarRating from '@/components/ui/StarRating'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ui/Toast'
import { Star } from 'lucide-react'

interface RatingSectionProps {
  modelId: string
  initialStats: { average: number; count: number }
}

export default function RatingSection({ initialStats }: RatingSectionProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [stats, setStats] = useState(initialStats)
  const [userRating, setUserRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleRate = async (rating: number) => {
    if (!user) { showToast('Faça login para avaliar.', 'error'); return }
    if (hasRated) { showToast('Você já avaliou esta peça.', 'error'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 400))
    const newCount = stats.count + 1
    const newAverage = Math.round(((stats.average * stats.count + rating) / newCount) * 10) / 10
    setStats({ average: newAverage, count: newCount })
    setUserRating(rating)
    setHasRated(true)
    showToast('Avaliação registrada!')
    setSubmitting(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Star size={16} />Avaliações
      </h2>

      <div className="flex items-center gap-6 mb-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{stats.average > 0 ? stats.average.toFixed(1) : '—'}</p>
          <StarRating value={Math.round(stats.average)} readonly size="sm" />
          <p className="text-xs text-gray-500 mt-1">{stats.count} avaliação{stats.count !== 1 ? 'ões' : ''}</p>
        </div>
      </div>

      {user ? (
        hasRated ? (
          <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
            Você avaliou esta peça com {userRating} estrela{userRating !== 1 ? 's' : ''}.
            <StarRating value={userRating} readonly size="sm" />
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-2">Sua avaliação:</p>
            <StarRating value={userRating} onChange={submitting ? undefined : handleRate} size="lg" />
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
