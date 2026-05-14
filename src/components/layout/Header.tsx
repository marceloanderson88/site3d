'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Menu, X, Upload, Layers, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

export default function Header() {
  const [user, setUser] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        setUser(data)
      }
    }
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser(data)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
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
    { href: '/explorar', label: 'Explorar' },
    { href: '/categorias', label: 'Categorias' },
    { href: '/sobre', label: 'Sobre' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">3D Livre</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:flex">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar peças 3D..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* Nav links - desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link
                  href="/enviar"
                  className="hidden sm:flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Upload size={14} />
                  Enviar Peça
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          {user.role === 'admin' && (
                            <span className="text-xs text-blue-600 font-medium">Admin</span>
                          )}
                        </div>
                        <Link
                          href="/minha-conta"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={14} />
                          Minha Conta
                        </Link>
                        <Link
                          href="/minha-conta/pecas"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Layers size={14} />
                          Minhas Peças
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings size={14} />
                            Administração
                          </Link>
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <LogOut size={14} />
                            Sair
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 mt-2 pt-3">
            <form onSubmit={handleSearch} className="mb-3 md:hidden">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar peças 3D..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  href="/enviar"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <Upload size={14} />
                  Enviar Peça
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
