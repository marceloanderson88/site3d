export type UserRole = 'user' | 'admin'
export type ModelStatus = 'pending' | 'published' | 'rejected'
export type ReportStatus = 'pending' | 'resolved' | 'dismissed'
export type License = 'CC0' | 'CC BY' | 'CC BY-SA' | 'CC BY-NC' | 'CC BY-NC-SA' | 'personal'
export type FileType = 'stl' | 'obj' | '3mf' | 'step' | 'zip'
export type Material = 'PLA' | 'PETG' | 'ABS' | 'TPU' | 'RESIN' | 'NYLON' | 'ASA' | 'OTHER'

export interface Profile {
  id: string
  name: string
  avatar_url: string | null
  bio: string | null
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string
  model_count?: number
}

export interface Model {
  id: string
  title: string
  slug: string
  description: string
  user_id: string
  category_id: string
  license: License
  file_url: string
  file_type: FileType
  cover_image_url: string | null
  status: ModelStatus
  downloads_count: number
  material: Material | null
  print_time: string | null
  layer_height: string | null
  infill: string | null
  supports_required: boolean | null
  printer_used: string | null
  assembly_notes: string | null
  created_at: string
  updated_at: string
  profile?: Profile
  category?: Category
  tags?: Tag[]
  images?: ModelImage[]
  average_rating?: number
  ratings_count?: number
}

export interface ModelImage {
  id: string
  model_id: string
  image_url: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface ModelTag {
  model_id: string
  tag_id: string
  tags?: Tag
}

export interface Comment {
  id: string
  model_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Rating {
  id: string
  model_id: string
  user_id: string
  rating: number
  created_at: string
}

export interface Report {
  id: string
  model_id: string | null
  comment_id: string | null
  user_id: string
  reason: string
  status: ReportStatus
  created_at: string
  model?: Model
  comment?: Comment
}

export interface Download {
  id: string
  model_id: string
  user_id: string | null
  downloaded_at: string
}

export interface SearchFilters {
  query?: string
  category?: string
  sort?: 'recent' | 'downloads' | 'rating'
  file_type?: FileType
  material?: Material
  license?: License
}
