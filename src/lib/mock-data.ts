import type { Model, Category, Comment, Profile } from '@/types'

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Casa e Organização', slug: 'casa-e-organizacao', icon: '🏠', description: 'Peças para organização doméstica', model_count: 24 },
  { id: '2', name: 'Ferramentas', slug: 'ferramentas', icon: '🔧', description: 'Ferramentas e acessórios para oficina', model_count: 18 },
  { id: '3', name: 'Robótica', slug: 'robotica', icon: '🤖', description: 'Peças para projetos robóticos', model_count: 12 },
  { id: '4', name: 'Eletrônica', slug: 'eletronica', icon: '⚡', description: 'Cases e suportes para eletrônica', model_count: 31 },
  { id: '5', name: 'Educação', slug: 'educacao', icon: '📚', description: 'Modelos didáticos e pedagógicos', model_count: 9 },
  { id: '6', name: 'Brinquedos', slug: 'brinquedos', icon: '🎮', description: 'Brinquedos e jogos', model_count: 22 },
  { id: '7', name: 'Peças de Reposição', slug: 'pecas-de-reposicao', icon: '⚙️', description: 'Peças de reposição para equipamentos', model_count: 15 },
  { id: '8', name: 'Acessórios', slug: 'acessorios', icon: '🎒', description: 'Acessórios pessoais e complementos', model_count: 27 },
  { id: '9', name: 'Arte e Decoração', slug: 'arte-e-decoracao', icon: '🎨', description: 'Esculturas, vasos e peças decorativas', model_count: 33 },
  { id: '10', name: 'Prototipagem', slug: 'prototipagem', icon: '🔬', description: 'Peças para protótipos e testes', model_count: 7 },
  { id: '11', name: 'Agricultura', slug: 'agricultura', icon: '🌱', description: 'Ferramentas para jardim e agricultura', model_count: 5 },
  { id: '12', name: 'Saúde e Acessibilidade', slug: 'saude-e-acessibilidade', icon: '♿', description: 'Dispositivos de acessibilidade', model_count: 8 },
  { id: '13', name: 'Outros', slug: 'outros', icon: '📦', description: 'Modelos variados', model_count: 11 },
]

const AUTHORS: Profile[] = [
  { id: 'u1', name: 'Carlos Maker', avatar_url: null, bio: 'Entusiasta de impressão 3D há 5 anos.', role: 'user', created_at: '2023-01-10T00:00:00Z' },
  { id: 'u2', name: 'Ana Silva', avatar_url: null, bio: 'Engenheira mecânica e maker.', role: 'user', created_at: '2023-03-15T00:00:00Z' },
  { id: 'u3', name: 'Pedro Rocha', avatar_url: null, bio: 'Professor de robótica.', role: 'user', created_at: '2023-06-01T00:00:00Z' },
  { id: 'u4', name: 'Julia Costa', avatar_url: null, bio: 'Designer de produto e maker.', role: 'user', created_at: '2023-08-20T00:00:00Z' },
]

export const MOCK_MODELS: Model[] = [
  {
    id: 'm1',
    title: 'Suporte para Carretel de Filamento',
    slug: 'suporte-carretel-filamento',
    description: 'Suporte de parede para carreteis de filamento 1kg. Impressão fácil, sem suportes. Comporta carreteis de 200mm de diâmetro.\n\nMonta com 2 parafusos M3x10mm. Recomendo imprimir em PETG para maior resistência ao calor próximo da impressora.',
    user_id: 'u1',
    category_id: '1',
    license: 'CC BY',
    file_url: '#',
    file_type: 'stl',
    cover_image_url: null,
    status: 'published',
    downloads_count: 1847,
    material: 'PETG',
    print_time: '2h30min',
    layer_height: '0.2',
    infill: '20',
    supports_required: false,
    printer_used: 'Ender 3 Pro',
    assembly_notes: 'Use 2 parafusos M3x10mm para fixar na parede.',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    profile: AUTHORS[0],
    category: MOCK_CATEGORIES[0],
    tags: [{ id: 't1', name: 'organização', slug: 'organizacao' }, { id: 't2', name: 'parede', slug: 'parede' }, { id: 't3', name: 'filamento', slug: 'filamento' }],
    images: [],
    average_rating: 4.8,
    ratings_count: 124,
  },
  {
    id: 'm2',
    title: 'Case para Raspberry Pi 4 com Ventilação',
    slug: 'case-raspberry-pi-4-ventilacao',
    description: 'Case completa para Raspberry Pi 4 com aberturas para ventilação lateral e suporte para cooler 30mm. Design slim e moderno.\n\nCompatível com GPIO ribbon cable. Impressão sem suportes necessários.',
    user_id: 'u2',
    category_id: '4',
    license: 'CC0',
    file_url: '#',
    file_type: 'stl',
    cover_image_url: null,
    status: 'published',
    downloads_count: 3241,
    material: 'PLA',
    print_time: '4h',
    layer_height: '0.2',
    infill: '25',
    supports_required: false,
    printer_used: 'Prusa MK3S+',
    assembly_notes: 'Tampa encaixe press-fit. Não precisa de parafusos.',
    created_at: '2024-02-03T14:00:00Z',
    updated_at: '2024-02-03T14:00:00Z',
    profile: AUTHORS[1],
    category: MOCK_CATEGORIES[3],
    tags: [{ id: 't4', name: 'raspberry', slug: 'raspberry' }, { id: 't5', name: 'eletronica', slug: 'eletronica' }, { id: 't6', name: 'case', slug: 'case' }],
    images: [],
    average_rating: 4.6,
    ratings_count: 87,
  },
  {
    id: 'm3',
    title: 'Braço Robótico 6-DOF Completo',
    slug: 'braco-robotico-6-dof',
    description: 'Braço robótico de 6 graus de liberdade controlado por servos. Projeto completo com todas as peças, inclui suporte de mesa e garra.\n\nRequer 6 servos MG996R e controle via Arduino ou Raspberry Pi. Arquivo ZIP com todas as peças separadas.',
    user_id: 'u3',
    category_id: '3',
    license: 'CC BY-SA',
    file_url: '#',
    file_type: 'zip',
    cover_image_url: null,
    status: 'published',
    downloads_count: 892,
    material: 'PLA',
    print_time: '48h',
    layer_height: '0.15',
    infill: '40',
    supports_required: true,
    printer_used: 'Creality CR-10',
    assembly_notes: 'Imprima as peças com infill alto. Siga o guia de montagem incluído no ZIP.',
    created_at: '2024-02-20T09:00:00Z',
    updated_at: '2024-02-20T09:00:00Z',
    profile: AUTHORS[2],
    category: MOCK_CATEGORIES[2],
    tags: [{ id: 't7', name: 'robotica', slug: 'robotica' }, { id: 't8', name: 'servo', slug: 'servo' }, { id: 't9', name: 'arduino', slug: 'arduino' }],
    images: [],
    average_rating: 4.9,
    ratings_count: 56,
  },
  {
    id: 'm4',
    title: 'Vaso Geométrico Moderno',
    slug: 'vaso-geometrico-moderno',
    description: 'Vaso decorativo com padrão geométrico facetado. Modo vase (spiralize) para impressão rápida e paredes finas elegantes.\n\nImpressão no modo "Vase Mode" em espiral, sem camada inferior para usar como vaso com garrafa pet interna.',
    user_id: 'u4',
    category_id: '9',
    license: 'CC BY-NC',
    file_url: '#',
    file_type: 'stl',
    cover_image_url: null,
    status: 'published',
    downloads_count: 5102,
    material: 'PLA',
    print_time: '3h',
    layer_height: '0.3',
    infill: '0',
    supports_required: false,
    printer_used: 'Bambu Lab P1S',
    assembly_notes: null,
    created_at: '2024-03-01T11:00:00Z',
    updated_at: '2024-03-01T11:00:00Z',
    profile: AUTHORS[3],
    category: MOCK_CATEGORIES[8],
    tags: [{ id: 't10', name: 'vaso', slug: 'vaso' }, { id: 't11', name: 'decoracao', slug: 'decoracao' }, { id: 't12', name: 'geometrico', slug: 'geometrico' }],
    images: [],
    average_rating: 4.7,
    ratings_count: 203,
  },
  {
    id: 'm5',
    title: 'Suporte Articulado para Monitor',
    slug: 'suporte-articulado-monitor',
    description: 'Suporte de mesa articulado para monitor de até 27". Sistema de rótula permite ajuste de ângulo em todas as direções.\n\nConstrução robusta em PETG, suporta até 5kg. Requer parafusos M5.',
    user_id: 'u1',
    category_id: '1',
    license: 'CC BY',
    file_url: '#',
    file_type: '3mf',
    cover_image_url: null,
    status: 'published',
    downloads_count: 2156,
    material: 'PETG',
    print_time: '8h',
    layer_height: '0.2',
    infill: '50',
    supports_required: true,
    printer_used: 'Prusa MK3S+',
    assembly_notes: 'Parafusos M5x20mm para articulações e M5x40mm para fixação na mesa.',
    created_at: '2024-03-10T16:00:00Z',
    updated_at: '2024-03-10T16:00:00Z',
    profile: AUTHORS[0],
    category: MOCK_CATEGORIES[0],
    tags: [{ id: 't13', name: 'monitor', slug: 'monitor' }, { id: 't14', name: 'suporte', slug: 'suporte' }, { id: 't15', name: 'mesa', slug: 'mesa' }],
    images: [],
    average_rating: 4.4,
    ratings_count: 78,
  },
  {
    id: 'm6',
    title: 'Engrenagem Planetária Didática',
    slug: 'engrenagem-planetaria-didatica',
    description: 'Engrenagem planetária funcional para ensino de mecânica. Todas as peças encaixam sem parafusos.\n\nÓtima para aulas de física e engenharia. Imprime em partes separadas e monta a seco.',
    user_id: 'u3',
    category_id: '5',
    license: 'CC0',
    file_url: '#',
    file_type: 'stl',
    cover_image_url: null,
    status: 'published',
    downloads_count: 1423,
    material: 'PLA',
    print_time: '6h',
    layer_height: '0.15',
    infill: '30',
    supports_required: false,
    printer_used: 'Ender 3 Pro',
    assembly_notes: null,
    created_at: '2024-03-15T08:00:00Z',
    updated_at: '2024-03-15T08:00:00Z',
    profile: AUTHORS[2],
    category: MOCK_CATEGORIES[4],
    tags: [{ id: 't16', name: 'engrenagem', slug: 'engrenagem' }, { id: 't17', name: 'educacao', slug: 'educacao' }, { id: 't18', name: 'didatico', slug: 'didatico' }],
    images: [],
    average_rating: 4.9,
    ratings_count: 92,
  },
  {
    id: 'm7',
    title: 'Organizador de Ferramentas para Parede',
    slug: 'organizador-ferramentas-parede',
    description: 'Sistema modular de ganchos e prateleiras para organização de ferramentas na parede. Compatível com perfil francês.\n\nPacote ZIP com 12 peças diferentes: ganchos simples, duplos, suporte para martelo, chave de fenda, etc.',
    user_id: 'u2',
    category_id: '2',
    license: 'CC BY',
    file_url: '#',
    file_type: 'zip',
    cover_image_url: null,
    status: 'published',
    downloads_count: 4387,
    material: 'PLA',
    print_time: '2h por peça',
    layer_height: '0.2',
    infill: '30',
    supports_required: false,
    printer_used: 'Bambu Lab A1',
    assembly_notes: 'Encaixe no perfil francês (French cleat). Sem parafusos.',
    created_at: '2024-03-22T13:00:00Z',
    updated_at: '2024-03-22T13:00:00Z',
    profile: AUTHORS[1],
    category: MOCK_CATEGORIES[1],
    tags: [{ id: 't19', name: 'ferramentas', slug: 'ferramentas' }, { id: 't20', name: 'modular', slug: 'modular' }, { id: 't21', name: 'oficina', slug: 'oficina' }],
    images: [],
    average_rating: 4.5,
    ratings_count: 145,
  },
  {
    id: 'm8',
    title: 'Capa Protetora para AirPods Pro',
    slug: 'capa-protetora-airpods-pro',
    description: 'Capa slim e resistente para AirPods Pro 2ª geração. Compatível com carregamento MagSafe.\n\nImpressão em TPU para flexibilidade e proteção contra quedas. Abertura precisa para todos os botões.',
    user_id: 'u4',
    category_id: '8',
    license: 'CC BY-NC-SA',
    file_url: '#',
    file_type: 'stl',
    cover_image_url: null,
    status: 'published',
    downloads_count: 2891,
    material: 'TPU',
    print_time: '1h30min',
    layer_height: '0.2',
    infill: '15',
    supports_required: false,
    printer_used: 'Bambu Lab P1S',
    assembly_notes: null,
    created_at: '2024-04-01T10:00:00Z',
    updated_at: '2024-04-01T10:00:00Z',
    profile: AUTHORS[3],
    category: MOCK_CATEGORIES[7],
    tags: [{ id: 't22', name: 'airpods', slug: 'airpods' }, { id: 't23', name: 'apple', slug: 'apple' }, { id: 't24', name: 'tpu', slug: 'tpu' }],
    images: [],
    average_rating: 4.3,
    ratings_count: 67,
  },
]

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    model_id: 'm1',
    user_id: 'u2',
    content: 'Peça excelente! Impressão perfeita na Ender 3. Recomendo aumentar um pouco o infill para maior resistência.',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    profile: AUTHORS[1],
  },
  {
    id: 'c2',
    model_id: 'm1',
    user_id: 'u3',
    content: 'Muito bem projetado. Uso há 3 meses e ainda está firme na parede com 3 carreteis.',
    created_at: '2024-02-05T09:15:00Z',
    updated_at: '2024-02-05T09:15:00Z',
    profile: AUTHORS[2],
  },
  {
    id: 'c3',
    model_id: 'm2',
    user_id: 'u1',
    content: 'Ótima case! A ventilação faz diferença na temperatura do Pi. Temperatura caiu de 65°C para 48°C.',
    created_at: '2024-02-10T11:00:00Z',
    updated_at: '2024-02-10T11:00:00Z',
    profile: AUTHORS[0],
  },
  {
    id: 'c4',
    model_id: 'm3',
    user_id: 'u4',
    content: 'Projeto incrível! Levei 2 semanas para imprimir tudo mas o resultado ficou fantástico. Obrigado por compartilhar!',
    created_at: '2024-03-01T16:45:00Z',
    updated_at: '2024-03-01T16:45:00Z',
    profile: AUTHORS[3],
  },
]

export function getModelBySlug(slug: string): Model | undefined {
  return MOCK_MODELS.find(m => m.slug === slug)
}

export function getModelsByCategory(categoryId: string): Model[] {
  return MOCK_MODELS.filter(m => m.category_id === categoryId)
}

export function getCommentsByModel(modelId: string): Comment[] {
  return MOCK_COMMENTS.filter(c => c.model_id === modelId)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return MOCK_CATEGORIES.find(c => c.slug === slug)
}

export function searchModels(query: string, filters: {
  category?: string
  sort?: string
  file_type?: string
  material?: string
  license?: string
} = {}): Model[] {
  let results = [...MOCK_MODELS]

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.tags?.some(t => t.name.toLowerCase().includes(q))
    )
  }

  if (filters.category) {
    const cat = MOCK_CATEGORIES.find(c => c.slug === filters.category)
    if (cat) results = results.filter(m => m.category_id === cat.id)
  }

  if (filters.file_type) {
    results = results.filter(m => m.file_type === filters.file_type)
  }

  if (filters.material) {
    results = results.filter(m => m.material === filters.material)
  }

  if (filters.license) {
    results = results.filter(m => m.license === filters.license)
  }

  switch (filters.sort) {
    case 'downloads':
      results.sort((a, b) => b.downloads_count - a.downloads_count)
      break
    case 'rating':
      results.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      break
    default:
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return results
}

export const MOCK_STATS = {
  models: 222,
  users: 1847,
  downloads: 48391,
}
