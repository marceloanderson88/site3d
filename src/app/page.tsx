import Link from 'next/link'
import { ArrowUpRight, Upload, Plus } from 'lucide-react'
import ModelCard from '@/components/models/ModelCard'
import { CATEGORIES } from '@/lib/utils'
import { MOCK_MODELS, MOCK_STATS } from '@/lib/mock-data'

export default function HomePage() {
  const featured = [...MOCK_MODELS]
    .sort((a, b) => b.downloads_count - a.downloads_count)
    .slice(0, 8)
  const recent = [...MOCK_MODELS]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)

  const fmt = (n: number) => n.toLocaleString('pt-BR')

  return (
    <div className="bg-paper">
      {/* HERO */}
      <section className="relative border-b border-ink overflow-hidden">
        <Crosshair className="top-3 left-3" />
        <Crosshair className="top-3 right-3" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 lg:pt-14 pb-12 lg:pb-20">
          <div className="flex items-center justify-between border-y border-ink py-2 mb-12 lg:mb-16 font-mono text-[10px] uppercase tracking-[0.22em]">
            <span>EDIÇÃO N° 01 / VOL. 01</span>
            <span className="hidden sm:inline text-ink-mute">São Paulo · Brasil · MMXXVI</span>
            <span className="text-vermillion">↘ Repositório Aberto</span>
          </div>

          <div className="grid grid-cols-12 gap-x-4 lg:gap-x-8 gap-y-8">
            <aside className="hidden lg:flex col-span-1 items-start justify-end">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-mute origin-top-right rotate-[-90deg] translate-y-32 whitespace-nowrap">
                FIGURA 01 ── PEÇAS COMUNS · BENS COMUNS
              </p>
            </aside>

            <div className="col-span-12 lg:col-span-8">
              <p className="eyebrow mb-5 rise">
                <span className="text-vermillion">●</span> &nbsp;Manual de uso · §00 Introdução
              </p>
              <h1 className="display-xl text-[14vw] sm:text-[11vw] lg:text-[9.5vw] rise" style={{ animationDelay: '0.08s' }}>
                Peças que<br />
                <span className="italic text-vermillion" style={{ fontVariationSettings: '"opsz" 144, "WONK" 1' }}>pertencem</span><br />
                <span className="inline-flex items-baseline gap-3">
                  a todos
                  <span className="font-mono text-base sm:text-xl lg:text-2xl text-ink-mute self-end translate-y-[-0.6em]">·plr</span>
                </span>
              </h1>

              <div className="mt-8 lg:mt-10 grid grid-cols-12 gap-4 max-w-3xl rise" style={{ animationDelay: '0.18s' }}>
                <div className="col-span-12 sm:col-span-7">
                  <p className="font-display text-xl lg:text-[22px] leading-snug" style={{ fontVariationSettings: '"opsz" 28' }}>
                    Um repositório livre e aberto de modelos para impressão 3D. Baixe, remixe, imprima — e devolva o que aprender ao bem comum.
                  </p>
                </div>
                <div className="col-span-12 sm:col-span-5 border-l-0 sm:border-l border-ink sm:pl-4 pt-2 sm:pt-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute leading-relaxed">
                    Sem assinaturas. Sem paywall. Sem rastreio. <span className="text-ink">Apenas peças, autores e pessoas.</span>
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3 rise" style={{ animationDelay: '0.28s' }}>
                <Link href="/explorar" className="btn-ink">
                  Explorar acervo
                  <ArrowUpRight size={14} strokeWidth={1.5} />
                </Link>
                <Link href="/enviar" className="btn-outline">
                  <Upload size={14} strokeWidth={1.5} />
                  Enviar uma peça
                </Link>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute ml-auto sm:ml-2">
                  ↳ 100% gratuito
                </span>
              </div>
            </div>

            <aside className="col-span-12 lg:col-span-3 lg:pl-4">
              <div className="border border-ink bg-paper-2 p-4 lg:mt-12 rise" style={{ animationDelay: '0.36s' }}>
                <p className="eyebrow border-b border-hairline pb-2 mb-3">Índice do volume</p>
                <ol className="space-y-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                  {[
                    ['§00', 'Introdução'],
                    ['§01', 'Categorias'],
                    ['§02', 'Mais baixadas'],
                    ['§03', 'Recém-chegadas'],
                    ['§04', 'Como contribuir'],
                  ].map(([n, t]) => (
                    <li key={n} className="flex items-baseline justify-between gap-2">
                      <span className="text-ink-mute">{n}</span>
                      <span className="flex-1 mx-1 border-b border-dotted border-ink/30 translate-y-[-3px]" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="hidden lg:block mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                FIG. 01 — Sumário editorial
              </div>
            </aside>
          </div>
        </div>

        <div className="border-t border-ink bg-ink text-paper">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5 grid grid-cols-3 gap-4 sm:gap-8">
            <Stat label="Modelos no acervo" value={fmt(MOCK_STATS.models)} unit="UN" />
            <Stat label="Makers ativos" value={fmt(MOCK_STATS.users)} unit="PERS" />
            <Stat label="Downloads servidos" value={fmt(MOCK_STATS.downloads)} unit="∞" />
          </div>
        </div>
      </section>

      {/* MANIFESTO QUOTE */}
      <section className="border-b border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-2 lg:order-2">
            <p className="eyebrow lg:text-right">— Manifesto / §02</p>
          </div>
          <div className="col-span-12 lg:col-span-9 lg:order-1">
            <p className="font-display text-3xl sm:text-4xl lg:text-[56px] leading-[1.05]" style={{ fontVariationSettings: '"opsz" 80, "SOFT" 30' }}>
              <span className="text-vermillion font-mono text-2xl align-top">&ldquo;</span>
              Toda peça impressa é uma decisão pública: o que produzir, com que material, com que cuidado. O acervo é nossa biblioteca <span className="italic">comum</span> dessas decisões.
              <span className="text-vermillion font-mono text-2xl align-bottom">&rdquo;</span>
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="border-b border-ink relative">
        <SectionHeader code="§01" title="Categorias" subtitle="Doze prateleiras, um único acervo aberto." cta={{ href: '/categorias', label: 'Ver todas' }} />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 lg:pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-ink border border-ink">
            {CATEGORIES.slice(0, 12).map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}`}
                className="group bg-paper hover:bg-vermillion hover:text-paper transition-colors p-5 lg:p-6 relative aspect-[5/4] flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute group-hover:text-paper/70">
                    {String(i + 1).padStart(2, '0')} / 12
                  </span>
                  <ArrowUpRight size={14} strokeWidth={1.5} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <div className="text-4xl lg:text-5xl mb-2 grayscale group-hover:grayscale-0 transition-all">{cat.icon}</div>
                  <h3 className="font-display text-xl lg:text-2xl leading-tight" style={{ fontVariationSettings: '"opsz" 32, "SOFT" 25' }}>
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MAIS BAIXADAS */}
      <section className="border-b border-ink bg-paper-2/40">
        <SectionHeader
          code="§02"
          title="Mais baixadas"
          subtitle="As peças que a comunidade levou para casa esta semana."
          cta={{ href: '/explorar?sort=downloads', label: 'Ver tudo' }}
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 lg:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {featured.map((m, i) => <ModelCard key={m.id} model={m} index={i} />)}
          </div>
        </div>
      </section>

      {/* RECENTES */}
      <section className="border-b border-ink">
        <SectionHeader code="§03" title="Recém-chegadas" subtitle="Tinta ainda fresca, camada ainda quente." cta={{ href: '/explorar?sort=recent', label: 'Ver tudo' }} />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 lg:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {recent.map((m, i) => <ModelCard key={m.id} model={m} index={i} />)}
          </div>
        </div>
      </section>

      {/* CONTRIBUTE CTA */}
      <section className="bg-ink text-paper relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 diag-stripes opacity-15 rotate-12" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-32 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">§04</p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <p className="eyebrow text-paper/60 mb-4">— Como contribuir</p>
            <h2 className="display-lg text-5xl sm:text-7xl lg:text-[104px]">
              Tem uma peça?<br />
              <span className="italic text-vermillion">Devolva</span> à<br />
              comunidade.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:pt-6 flex flex-col gap-6">
            <p className="font-display text-xl lg:text-2xl text-paper/85 leading-snug" style={{ fontVariationSettings: '"opsz" 28' }}>
              Cada upload é um nó a mais nesta rede. Aceitamos STL, OBJ, 3MF, STEP e ZIP — sem custos, sem rodapés escondidos.
            </p>
            <Link href="/enviar" className="inline-flex items-center justify-between gap-4 bg-vermillion text-paper px-5 py-4 font-mono text-xs uppercase tracking-[0.18em] hover:bg-paper hover:text-ink transition-colors group">
              <span className="flex items-center gap-2"><Plus size={14} strokeWidth={2} /> Enviar peça</span>
              <ArrowUpRight size={16} strokeWidth={1.5} className="group-hover:rotate-45 transition-transform" />
            </Link>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50 leading-relaxed">
              ↳ tempo médio de aprovação: 24h<br />
              ↳ formatos aceitos: STL · OBJ · 3MF · STEP · ZIP
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="relative">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60 mb-1.5">
        {label} <span className="text-vermillion">[{unit}]</span>
      </div>
      <div className="font-display text-3xl sm:text-5xl lg:text-6xl leading-none" style={{ fontVariationSettings: '"opsz" 80, "WONK" 1' }}>
        {value}
      </div>
    </div>
  )
}

function SectionHeader({
  code,
  title,
  subtitle,
  cta,
}: {
  code: string
  title: string
  subtitle: string
  cta: { href: string; label: string }
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 lg:pt-24 pb-8 lg:pb-12">
      <div className="flex items-end justify-between gap-6 border-b border-ink pb-6">
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute mb-2">
            {code} ─── Capítulo
          </p>
          <h2 className="display-md text-4xl sm:text-5xl lg:text-7xl">
            {title}
          </h2>
          <p className="font-display text-base sm:text-lg text-ink-mute mt-3 max-w-xl" style={{ fontVariationSettings: '"opsz" 18' }}>
            {subtitle}
          </p>
        </div>
        <Link
          href={cta.href}
          className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] border-b border-ink pb-0.5 hover:text-vermillion hover:border-vermillion transition-colors whitespace-nowrap"
        >
          {cta.label} <ArrowUpRight size={13} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  )
}

function Crosshair({ className = '' }: { className?: string }) {
  return (
    <span className={`absolute ${className} w-3 h-3 pointer-events-none`}>
      <span className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-ink/40" />
      <span className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-ink/40" />
    </span>
  )
}
