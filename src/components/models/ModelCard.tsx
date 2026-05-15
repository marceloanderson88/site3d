import Link from 'next/link'
import Image from 'next/image'
import { Download, Star, ArrowUpRight } from 'lucide-react'
import { formatNumber, getFileTypeLabel } from '@/lib/utils'
import type { Model } from '@/types'

interface ModelCardProps {
  model: Model
  index?: number
}

export default function ModelCard({ model, index = 0 }: ModelCardProps) {
  const rating = model.average_rating || 0
  const ref = String(index + 1).padStart(3, '0')

  return (
    <Link href={`/pecas/${model.slug}`} className="group block">
      <div className="bg-paper border border-ink relative transition-all duration-200 group-hover:translate-x-[-3px] group-hover:translate-y-[-3px] group-hover:shadow-[6px_6px_0_var(--ink)]">
        {/* Top meta strip */}
        <div className="flex items-center justify-between px-2.5 h-7 border-b border-ink bg-paper-2">
          <span className="font-mono text-[10px] tracking-[0.18em] text-ink-mute uppercase">
            №{ref} · {getFileTypeLabel(model.file_type)}
          </span>
          <ArrowUpRight size={12} strokeWidth={1.5} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Image — technical drawing slot */}
        <div className="relative aspect-[5/4] bg-paper-3 overflow-hidden border-b border-ink">
          {/* grid */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          {/* corner crosshairs */}
          <span className="absolute top-2 left-2 w-3 h-px bg-ink" />
          <span className="absolute top-2 left-2 w-px h-3 bg-ink" />
          <span className="absolute top-2 right-2 w-3 h-px bg-ink" />
          <span className="absolute top-2 right-2 w-px h-3 bg-ink translate-x-[11px]" style={{ transform: 'translateX(0)' }} />
          <span className="absolute bottom-2 left-2 w-3 h-px bg-ink" />
          <span className="absolute bottom-2 left-2 w-px h-3 bg-ink -translate-y-[11px]" />
          <span className="absolute bottom-2 right-2 w-3 h-px bg-ink" />
          <span className="absolute bottom-2 right-2 w-px h-3 bg-ink -translate-y-[11px]" />

          {model.cover_image_url ? (
            <Image
              src={model.cover_image_url}
              alt={model.title}
              fill
              className="object-cover mix-blend-multiply group-hover:scale-[1.04] transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-display text-7xl text-ink/20 italic">3D</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5">
          <h3 className="font-display text-lg leading-[1.1] line-clamp-2 group-hover:text-vermillion transition-colors" style={{ fontVariationSettings: '"opsz" 24, "SOFT" 25' }}>
            {model.title}
          </h3>

          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute mt-1.5">
            POR — {model.profile?.name || 'Anônimo'}
          </p>

          {model.tags && model.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {model.tags.slice(0, 3).map((tag) => (
                <span key={tag.id} className="font-mono text-[9px] uppercase tracking-[0.14em] px-1.5 py-0.5 border border-hairline text-ink-2">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-hairline font-mono text-[10px] uppercase tracking-[0.14em]">
            <div className="flex items-center gap-1.5">
              <Star size={11} strokeWidth={1.5} className="text-vermillion fill-vermillion" />
              <span>{rating > 0 ? rating.toFixed(1) : '—.—'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-mute">
              <Download size={11} strokeWidth={1.5} />
              <span>{formatNumber(model.downloads_count)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
