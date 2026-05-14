import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ChevronRight, Download, Calendar, User, Tag, FileText, Settings, AlertTriangle } from 'lucide-react'
import { formatDate, formatNumber, getLicenseLabel, getMaterialLabel } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import ModelCard from '@/components/models/ModelCard'
import CommentsSection from '@/components/models/CommentsSection'
import RatingSection from '@/components/models/RatingSection'
import DownloadButton from '@/components/models/DownloadButton'
import type { Model } from '@/types'

interface ModelPageProps {
  params: Promise<{ slug: string }>
}

async function getModel(slug: string): Promise<Model | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('models')
    .select(`*, profile:profiles(id,name,avatar_url,role,bio,created_at), category:categories(id,name,slug,icon), tags:model_tags(tags(id,name,slug)), images:model_images(id,image_url,created_at)`)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error || !data) return null
  const tags = Array.isArray(data.tags) ? data.tags.map((mt: Record<string, unknown>) => mt.tags).filter(Boolean) : []
  return { ...data, tags, profile: data.profile || undefined, category: data.category || undefined, images: Array.isArray(data.images) ? data.images : [] } as Model
}

async function getRelated(model: Model): Promise<Model[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('models')
    .select(`*, profile:profiles(id,name,avatar_url,role), category:categories(id,name,slug,icon), tags:model_tags(tags(id,name,slug)), images:model_images(id,image_url,created_at)`)
    .eq('category_id', model.category_id)
    .eq('status', 'published')
    .neq('id', model.id)
    .limit(4)
  return (data || []).map((d: Record<string, unknown>) => {
    const tags = Array.isArray(d.tags) ? d.tags.map((mt: Record<string, unknown>) => mt.tags).filter(Boolean) : []
    return { ...d, tags, profile: d.profile || undefined, category: d.category || undefined, images: Array.isArray(d.images) ? d.images : [] } as Model
  })
}

async function getRatingStats(modelId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('ratings').select('rating').eq('model_id', modelId)
  if (!data || data.length === 0) return { average: 0, count: 0 }
  const average = data.reduce((sum, r) => sum + r.rating, 0) / data.length
  return { average: Math.round(average * 10) / 10, count: data.length }
}

export async function generateMetadata({ params }: ModelPageProps) {
  const { slug } = await params
  const model = await getModel(slug)
  if (!model) return {}
  return {
    title: `${model.title} — 3D Livre`,
    description: model.description.slice(0, 160),
  }
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params
  const model = await getModel(slug)
  if (!model) notFound()

  const [related, ratingStats] = await Promise.all([getRelated(model), getRatingStats(model.id)])

  const allImages = [
    ...(model.cover_image_url ? [model.cover_image_url] : []),
    ...(model.images?.map(i => i.image_url) || []),
  ]

  const { data: { user } } = await (await import('@/lib/supabase/server')).createClient().then(s => s.auth.getUser())
  const isOwner = user?.id === model.user_id

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-900">Início</Link>
        <ChevronRight size={14} />
        <Link href="/explorar" className="hover:text-gray-900">Explorar</Link>
        {model.category && (
          <>
            <ChevronRight size={14} />
            <Link href={`/categorias/${model.category.slug}`} className="hover:text-gray-900">{model.category.name}</Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium truncate">{model.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            {allImages[0] ? (
              <Image src={allImages[0]} alt={model.title} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 66vw" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl text-gray-300">🖨️</div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <div key={i} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 border-gray-200">
                  <Image src={img} alt={`${model.title} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={16} />
              Descrição
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{model.description}</p>
          </div>

          {/* Print settings */}
          {(model.material || model.print_time || model.layer_height || model.infill !== null || model.supports_required !== null || model.printer_used || model.assembly_notes) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings size={16} />
                Configurações de Impressão
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {model.material && (
                  <div><p className="text-xs text-gray-500 mb-1">Material</p><p className="text-sm font-medium text-gray-900">{getMaterialLabel(model.material)}</p></div>
                )}
                {model.print_time && (
                  <div><p className="text-xs text-gray-500 mb-1">Tempo estimado</p><p className="text-sm font-medium text-gray-900">{model.print_time}</p></div>
                )}
                {model.layer_height && (
                  <div><p className="text-xs text-gray-500 mb-1">Altura de camada</p><p className="text-sm font-medium text-gray-900">{model.layer_height} mm</p></div>
                )}
                {model.infill && (
                  <div><p className="text-xs text-gray-500 mb-1">Preenchimento</p><p className="text-sm font-medium text-gray-900">{model.infill}%</p></div>
                )}
                {model.supports_required !== null && (
                  <div><p className="text-xs text-gray-500 mb-1">Suporte</p><p className="text-sm font-medium text-gray-900">{model.supports_required ? 'Necessário' : 'Não necessário'}</p></div>
                )}
                {model.printer_used && (
                  <div><p className="text-xs text-gray-500 mb-1">Impressora</p><p className="text-sm font-medium text-gray-900">{model.printer_used}</p></div>
                )}
              </div>
              {model.assembly_notes && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500 mb-1">Observações de montagem</p>
                  <p className="text-sm text-gray-700">{model.assembly_notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Ratings */}
          <RatingSection modelId={model.id} initialStats={ratingStats} />

          {/* Comments */}
          <CommentsSection modelId={model.id} />
        </div>

        {/* Right: Info sidebar */}
        <div className="space-y-4">
          {/* Title & download */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h1 className="text-xl font-bold text-gray-900">{model.title}</h1>
              {isOwner && (
                <Link href={`/minha-conta/pecas`} className="text-xs text-blue-600 hover:underline shrink-0">Editar</Link>
              )}
            </div>

            {model.category && (
              <Link href={`/categorias/${model.category.slug}`} className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-3 hover:bg-blue-100">
                {model.category.icon} {model.category.name}
              </Link>
            )}

            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {model.tags.map((tag) => (
                  <Link key={tag.id} href={`/explorar?q=${tag.name}`} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full hover:bg-gray-200">
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Download size={14} />
                {formatNumber(model.downloads_count)} downloads
              </span>
              {ratingStats.count > 0 && (
                <span className="flex items-center gap-1">
                  ⭐ {ratingStats.average} ({ratingStats.count})
                </span>
              )}
            </div>

            <DownloadButton model={model} />
          </div>

          {/* Author */}
          {model.profile && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User size={14} />
                Autor
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {model.profile.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{model.profile.name}</p>
                  {model.profile.bio && <p className="text-xs text-gray-500 line-clamp-2">{model.profile.bio}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={13} />Enviado em</span>
              <span className="font-medium text-gray-900">{formatDate(model.created_at)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1.5"><FileText size={13} />Formato</span>
              <Badge variant="blue">{model.file_type.toUpperCase()}</Badge>
            </div>
            <div className="flex items-start justify-between text-sm gap-2">
              <span className="text-gray-500 flex items-center gap-1.5 shrink-0"><Tag size={13} />Licença</span>
              <span className="font-medium text-gray-900 text-right text-xs">{getLicenseLabel(model.license)}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Verifique a segurança e adequação do arquivo antes de imprimir. Os modelos são enviados pela comunidade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Peças Relacionadas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((m) => <ModelCard key={m.id} model={m} />)}
          </div>
        </div>
      )}
    </div>
  )
}
