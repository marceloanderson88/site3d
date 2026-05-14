'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Layers, LogIn } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { showToast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      showToast(error.message === 'Invalid login credentials' ? 'Email ou senha incorretos.' : error.message, 'error')
    } else {
      showToast('Login realizado com sucesso!')
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Layers size={22} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-xl">3D Livre</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Entrar na conta</h1>
          <p className="text-gray-500 mt-1 text-sm">Acesse para enviar peças, comentar e avaliar</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" loading={loading} size="lg">
              <LogIn size={16} />
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-blue-600 hover:text-blue-700 font-medium">
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
