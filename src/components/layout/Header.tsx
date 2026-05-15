'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Search, Menu, X, Upload, User, LogOut, Settings, ChevronDown, Layers } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/')
    setUserMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/explorar?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const navLinks = [
    { href: '/explorar', label: 'Explorar', code: '§01' },
    { href: '/categorias', label: 'Categorias', code: '§02' },
    { href: '/sobre', label: 'Manifesto', code: '§03' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink">
      <div className="border-b border-hairline">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-7 text-[10px] uppercase tracking-[0.18em] text-ink-mute font-mono">
          <span className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 bg-vermillion blink" />
            REPOSITÓRIO ABERTO · BR
          </span>
          <span className="hidden sm:flex items-center gap-4">
            <span>EST. 2026</span>
            <span className="hidden md:inline">ED. 01 — VOL. 01</span>
            <span>CC · OPEN SOURCE</span>
          </span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-6">
          <Link href="/" className="flex items-baseline gap-2.5 shrink-0 group">
            <div className="relative w-9 h-9 border border-ink flex items-center justify-center bg-paper group-hover:bg-ink transition-colors">
              <Layers size={16} strokeWidth={1.5} className="text-ink group-hover:text-paper transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-vermillion" />
            </div>
            <div className="leading-none">
              <div className="font-display text-[26px] font-medium tracking-tight" style={{ fontVariationSettings: '"opsz" 36, "SOFT" 30, "WONK" 1' }}>
                3D<span className="text-vermillion">·</span>Livre
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-mute mt-0.5">
                Repositório / Open Source
              </div>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-[12px] text-vermillion pl-3">›</div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="buscar.peças( )"
                className="w-full pl-8 pr-12 py-2.5 bg-transparent border border-ink text-sm font-mono placeholder:text-ink-mute focus:outline-none focus:bg-paper-2 transition-colors"
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 border-l border-ink hover:bg-ink hover:text-paper transition-colors">
                <Search size={14} strokeWidth={1.5} />
              </button>
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em]"
                >
                  <span className="text-ink-mute mr-1.5">{link.code}</span>
                  <span className={active ? 'text-vermillion' : 'text-ink group-hover:text-vermillion transition-colors'}>
                    {link.label}
                  </span>
                  {active && <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-vermillion" />}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link href="/enviar" className="hidden sm:inline-flex btn-ink !py-2.5 !px-3.5 !text-[11px]">
                  <Upload size={13} strokeWidth={1.5} /> Enviar
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 border border-ink hover:bg-ink hover:text-paper transition-colors"
                  >
                    <div className="w-7 h-7 bg-vermillion text-paper flex items-center justify-center font-mono text-xs font-bold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={12} strokeWidth={1.5} className="hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-60 bg-paper border border-ink shadow-[4px_4px_0_var(--ink)] z-20">
                        <div className="px-3 py-2.5 border-b border-ink bg-paper-2">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">Sessão</p>
                          <p className="font-display text-base truncate">{user.name}</p>
                          {user.role === 'admin' && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-vermillion text-paper font-mono text-[9px] uppercase tracking-[0.2em]">Admin</span>
                          )}
                        </div>
                        <Link href="/minha-conta" className="flex items-center gap-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-paper-2" onClick={() => setUserMenuOpen(false)}>
                          <User size={13} strokeWidth={1.5} />Minha Conta
                        </Link>
                        <Link href="/minha-conta/pecas" className="flex items-center gap-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-paper-2" onClick={() => setUserMenuOpen(false)}>
                          <Layers size={13} strokeWidth={1.5} />Minhas Peças
                        </Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-paper-2" onClick={() => setUserMenuOpen(false)}>
                            <Settings size={13} strokeWidth={1.5} />Administração
                          </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-vermillion hover:bg-vermillion hover:text-paper w-full text-left border-t border-ink">
                          <LogOut size={13} strokeWidth={1.5} />Encerrar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="font-mono text-[11px] uppercase tracking-[0.16em] px-3 py-2 hover:text-vermillion transition-colors">
                  Entrar
                </Link>
                <Link href="/cadastro" className="btn-ink !py-2.5 !px-3.5 !text-[11px]">
                  Cadastrar
                </Link>
              </>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 border border-ink"
              aria-label="Menu"
            >
              {menuOpen ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden pb-5 border-t border-hairline pt-4">
            <form onSubmit={handleSearch} className="mb-4 md:hidden">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vermillion font-mono">›</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="buscar.peças( )"
                  className="w-full pl-8 pr-4 py-2.5 bg-transparent border border-ink text-sm font-mono focus:outline-none"
                />
              </div>
            </form>
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center justify-between px-1 py-3 border-b border-hairline font-mono text-xs uppercase tracking-[0.18em] hover:text-vermillion" onClick={() => setMenuOpen(false)}>
                  <span>{link.label}</span>
                  <span className="text-ink-mute">{link.code} →</span>
                </Link>
              ))}
              {user && (
                <Link href="/enviar" className="flex items-center gap-2 px-1 py-3 font-mono text-xs uppercase tracking-[0.18em] text-vermillion" onClick={() => setMenuOpen(false)}>
                  <Upload size={13} strokeWidth={1.5} />Enviar Peça →
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
