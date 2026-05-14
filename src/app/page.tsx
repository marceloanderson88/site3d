import Link from 'next/link'
import { Download, Upload, Printer, Share2, ArrowRight, Search, Zap } from 'lucide-react'
import ModelCard from '@/components/models/ModelCard'
import { CATEGORIES } from '@/lib/utils'
import { MOCK_MODELS, MOCK_STATS } from '@/lib/mock-data'

export default function HomePage() {
  const featured = [...MOCK_MODELS].sort((a, b) => b.downloads_count - a.downloads_count).slice(0, 8)
  const recent = [...MOCK_MODELS].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 rounded-full px-4 py-1.5 text-sm mb-6">
              <Zap size={14} />
              100% Gratuito · Open Source · Comunidade Maker
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Repositório Livre de
              <span className="block text-blue-200">Peças para Impressão 3D</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              Encontre, baixe, compartilhe e imprima modelos 3D gratuitamente. Uma plataforma aberta criada pela comunidade maker.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/explorar" className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center">
                <Search size={20} /> Explorar Peças
              </Link>
              <Link href="/enviar" className="border-2 border-white/40 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors flex items-center gap-2 justify-center">
                <Upload size={20} /> Enviar uma Peça
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl sm:text-3xl font-bold">{MOCK_STATS.models.toLocaleString('pt-BR')}</p><p className="text-blue-200 text-sm">Modelos 3D</p></div>
              <div><p className="text-2xl sm:text-3xl font-bold">{MOCK_STATS.users.toLocaleString('pt-BR')}</p><p className="text-blue-200 text-sm">Usuários</p></div>
              <div><p className="text-2xl sm:text-3xl font-bold">{MOCK_STATS.downloads.toLocaleString('pt-BR')}</p><p className="text-blue-200 text-sm">Downloads</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Como funciona</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Search, title: 'Encontre uma peça', desc: 'Navegue por categorias ou busque pelo que precisa', bg: 'bg-blue-100', color: 'text-blue-600' },
              { icon: Download, title: 'Baixe gratuitamente', desc: 'Todos os arquivos são gratuitos e livres para baixar', bg: 'bg-green-100', color: 'text-green-600' },
              { icon: Printer, title: 'Imprima em 3D', desc: 'Use sua impressora com as configurações sugeridas', bg: 'bg-purple-100', color: 'text-purple-600' },
              { icon: Share2, title: 'Compartilhe', desc: 'Envie suas próprias criações para a comunidade', bg: 'bg-orange-100', color: 'text-orange-600' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${step.bg}`}>
                  <step.icon size={24} className={step.color} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
          <Link href="/categorias" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">Ver todas <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.slice(0, 12).map((cat) => (
            <Link key={cat.slug} href={`/categorias/${cat.slug}`} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group text-center">
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Most downloaded */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-bold text-gray-900">Mais Baixadas</h2><p className="text-gray-500 text-sm mt-1">As peças favoritas da comunidade</p></div>
            <Link href="/explorar?sort=downloads" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">Ver mais <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featured.map((model) => <ModelCard key={model.id} model={model} />)}
          </div>
        </div>
      </section>

      {/* Recent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-2xl font-bold text-gray-900">Adicionadas Recentemente</h2><p className="text-gray-500 text-sm mt-1">Novidades da comunidade</p></div>
          <Link href="/explorar?sort=recent" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">Ver mais <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recent.map((model) => <ModelCard key={model.id} model={model} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Tem uma peça para compartilhar?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Contribua com a comunidade! Envie seus modelos 3D gratuitamente e ajude outros makers.</p>
          <Link href="/enviar" className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
            <Upload size={20} /> Enviar minha peça
          </Link>
        </div>
      </section>
    </div>
  )
}
