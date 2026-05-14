'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hover, setHover] = useState(0)

  const sizes = { sm: 14, md: 18, lg: 24 }
  const px = sizes[size]

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hover || value) >= star
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={cn(
              'transition-colors',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
            )}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            <Star
              size={px}
              className={cn(
                filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 fill-gray-100'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
