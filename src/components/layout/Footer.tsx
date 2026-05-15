import Link from 'next/link'
import { Layers } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto bg-ink text-paper border-t border-ink relative overflow-hidden">
      {/* tick rule */}
      <div className="border-b border-paper/15">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-7 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
          <span>↘ ÁREA DE COLOFÃO</span>
          <span className="hidden sm:flex items-center gap-4">
            <span>LAT −15.79</span>
            <span>LON −47.88</span>
            <span>BR · TYPESET</span>
          </span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Big wordmark */}
          <div className="col-span-12 lg:col-span-7">
            <p className="eyebrow text-paper/60 mb-4">№ 01 — Manifesto</p>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-[112px] leading-[0.88] tracking-tight" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1' }}>
              Imprima<br />
              <span className="italic text-vermillion">livremente.</span><br />
              Compartilhe<br />
              em comum.
            </h2>
          </div>

          {/* Columns */}
          <div className="col-span-6 lg:col-span-2 lg:col-start-9">
            <p className="eyebrow text-paper/60 mb-4">Navegação</p>
            <ul className="space-y-2 font-mono text-xs uppercase tracking-[0.14em]">
              <li><Link href="/explorar" className="hover:text-vermillion transition-colors">→ Explorar</Link></li>
              <li><Link href="/categorias" className="hover:text-vermillion transition-colors">→ Categorias</Link></li>
              <li><Link href="/enviar" className="hover:text-vermillion transition-colors">→ Enviar Peça</Link></li>
              <li><Link href="/sobre" className="hover:text-vermillion transition-colors">→ Sobre</Link></li>
            </ul>
          </div>

          <div className="col-span-6 lg:col-span-2">
            <p className="eyebrow text-paper/60 mb-4">Legal</p>
            <ul className="space-y-2 font-mono text-xs uppercase tracking-[0.14em]">
              <li><Link href="/termos" className="hover:text-vermillion transition-colors">→ Termos</Link></li>
              <li><Link href="/termos#privacidade" className="hover:text-vermillion transition-colors">→ Privacidade</Link></li>
              <li><Link href="/termos#licencas" className="hover:text-vermillion transition-colors">→ Licenças</Link></li>
              <li><Link href="/termos#arquivos" className="hover:text-vermillion transition-colors">→ Envios</Link></li>
            </ul>
          </div>
        </div>

        {/* baseline */}
        <div className="mt-16 lg:mt-24 pt-6 border-t border-paper/20 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-paper/40 flex items-center justify-center">
              <Layers size={18} strokeWidth={1.5} />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60 leading-relaxed">
              <p>3D LIVRE / DOC.V01</p>
              <p>© {year} — TODO O CONTEÚDO PERTENCE AOS AUTORES</p>
            </div>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60 max-w-md">
            Aviso: arquivos enviados pela comunidade. Verifique segurança, encaixe e adequação antes de imprimir. Faça uma camada de teste.
          </p>
        </div>
      </div>

      {/* footer marquee strip */}
      <div className="border-t border-paper/15 overflow-hidden">
        <div className="font-display italic text-[14vw] lg:text-[10vw] leading-none whitespace-nowrap text-paper/10 tracking-tight px-4" style={{ fontVariationSettings: '"opsz" 144' }}>
          imprima · remixe · compartilhe · imprima · remixe · compartilhe ·
        </div>
      </div>
    </footer>
  )
}
