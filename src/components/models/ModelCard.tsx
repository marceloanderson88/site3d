import Link from 'next/link'
import Image from 'next/image'
import { Download, Star, Tag } from 'lucide-react'
import { formatNumber, formatDate, getFileTypeLabel } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import type { Model } from '@/types'

interface ModelCardProps {
  model: Model
}

export default function ModelCard({ model }: ModelCardProps) {
  const rating = model.average_rating || 0

  return (
    <Link href={`/pecas/${model.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {model.cover_image_url ? (
            <Image
              src={model.cover_image_url}
              alt={model.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl text-gray-300">🖨️</div>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="blue">{getFileTypeLabel(model.file_type)}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
            {model.title}
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            por {model.profile?.name || 'Anônimo'}
          </p>

          {model.tags && model.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {model.tags.slice(0, 3).map((tag) => (
                <span key={tag.id} className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span>{rating > 0 ? rating.toFixed(1) : '—'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download size={12} />
              <span>{formatNumber(model.downloads_count)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
