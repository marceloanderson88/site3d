'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Profile } from '@/types'

interface AuthContextValue {
  user: Profile | null
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = '3dlivre_user'

const DEMO_USERS: (Profile & { email: string; password: string })[] = [
  { id: 'demo1', name: 'Demo User', email: 'demo@3dlivre.com', password: '123456', avatar_url: null, bio: 'Usuário de demonstração', role: 'user', created_at: new Date().toISOString() },
  { id: 'admin1', name: 'Administrador', email: 'admin@3dlivre.com', password: 'admin123', avatar_url: null, bio: 'Admin da plataforma', role: 'admin', created_at: new Date().toISOString() },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600))
    const found = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (!found) return { error: 'Email ou senha incorretos.' }
    const { email: _, password: __, ...profile } = found
    setUser(profile)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    return {}
  }, [])

  const register = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 600))
    if (!name || !email) return { error: 'Preencha todos os campos.' }
    const profile: Profile = {
      id: `user_${Date.now()}`,
      name,
      avatar_url: null,
      bio: null,
      role: 'user',
      created_at: new Date().toISOString(),
    }
    setUser(profile)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    return {}
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
