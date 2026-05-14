import { createClient } from '@/lib/supabase/server'
import type { Model, SearchFilters } from '@/types'

const MODEL_SELECT = `
  *,
  profile:profiles(id, name, avatar_url, role),
  category:categories(id, name, slug, icon),
  tags:model_tags(tags(id, name, slug)),
  images:model_images(id, image_url, created_at)
`

export async function getModels(filters: SearchFilters = {}, limit = 20, offset = 0) {
  const supabase = await createClient()

  let query = supabase
    .from('models')
    .select(MODEL_SELECT)
    .eq('status', 'published')
    .range(offset, offset + limit - 1)

  if (filters.query) {
    query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
  }

  if (filters.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.category)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (filters.file_type) {
    query = query.eq('file_type', filters.file_type)
  }

  if (filters.material) {
    query = query.eq('material', filters.material)
  }

  if (filters.license) {
    query = query.eq('license', filters.license)
  }

  switch (filters.sort) {
    case 'downloads':
      query = query.order('downloads_count', { ascending: false })
      break
    case 'rating':
      query = query.order('downloads_count', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) return []

  return normalizeModels(data)
}

export async function getModelBySlug(slug: string): Promise<Model | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('models')
    .select(MODEL_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  return normalizeModel(data)
}

export async function getModelById(id: string): Promise<Model | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('models')
    .select(MODEL_SELECT)
    .eq('id', id)
    .single()

  if (error || !data) return null
  return normalizeModel(data)
}

export async function getUserModels(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('models')
    .select(MODEL_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return normalizeModels(data)
}

export async function getRelatedModels(model: Model, limit = 4) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('models')
    .select(MODEL_SELECT)
    .eq('category_id', model.category_id)
    .eq('status', 'published')
    .neq('id', model.id)
    .limit(limit)

  if (!data) return []
  return normalizeModels(data)
}

export async function getModelRatingStats(modelId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('ratings')
    .select('rating')
    .eq('model_id', modelId)

  if (!data || data.length === 0) return { average: 0, count: 0 }
  const average = data.reduce((sum, r) => sum + r.rating, 0) / data.length
  return { average: Math.round(average * 10) / 10, count: data.length }
}

function normalizeModel(data: Record<string, unknown>): Model {
  const tags = Array.isArray(data.tags)
    ? data.tags
        .map((mt: Record<string, unknown>) => mt.tags)
        .filter(Boolean)
    : []

  return {
    ...data,
    tags,
    profile: data.profile || undefined,
    category: data.category || undefined,
    images: Array.isArray(data.images) ? data.images : [],
  } as Model
}

function normalizeModels(data: Record<string, unknown>[]): Model[] {
  return data.map(normalizeModel)
}
