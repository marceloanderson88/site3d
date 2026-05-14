import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getFileTypeLabel(type: string): string {
  return type.toUpperCase()
}

export function getLicenseLabel(license: string): string {
  const labels: Record<string, string> = {
    CC0: 'CC0 - Domínio Público',
    'CC BY': 'CC BY - Atribuição',
    'CC BY-SA': 'CC BY-SA - Atribuição-CompartilhaIgual',
    'CC BY-NC': 'CC BY-NC - Atribuição-NãoComercial',
    'CC BY-NC-SA': 'CC BY-NC-SA - Atribuição-NãoComercial-CompartilhaIgual',
    personal: 'Uso Pessoal',
  }
  return labels[license] || license
}

export function getMaterialLabel(material: string): string {
  return material
}

export const CATEGORIES = [
  { name: 'Casa e Organização', slug: 'casa-e-organizacao', icon: '🏠' },
  { name: 'Ferramentas', slug: 'ferramentas', icon: '🔧' },
  { name: 'Robótica', slug: 'robotica', icon: '🤖' },
  { name: 'Eletrônica', slug: 'eletronica', icon: '⚡' },
  { name: 'Educação', slug: 'educacao', icon: '📚' },
  { name: 'Brinquedos', slug: 'brinquedos', icon: '🎮' },
  { name: 'Peças de Reposição', slug: 'pecas-de-reposicao', icon: '⚙️' },
  { name: 'Acessórios', slug: 'acessorios', icon: '🎒' },
  { name: 'Arte e Decoração', slug: 'arte-e-decoracao', icon: '🎨' },
  { name: 'Prototipagem', slug: 'prototipagem', icon: '🔬' },
  { name: 'Agricultura', slug: 'agricultura', icon: '🌱' },
  { name: 'Saúde e Acessibilidade', slug: 'saude-e-acessibilidade', icon: '♿' },
  { name: 'Outros', slug: 'outros', icon: '📦' },
]

export const LICENSES = [
  'CC0',
  'CC BY',
  'CC BY-SA',
  'CC BY-NC',
  'CC BY-NC-SA',
  'personal',
] as const

export const MATERIALS = ['PLA', 'PETG', 'ABS', 'TPU', 'RESIN', 'NYLON', 'ASA', 'OTHER'] as const

export const FILE_TYPES = ['stl', 'obj', '3mf', 'step', 'zip'] as const
