'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Layers, UserPlus } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

export default function CadastroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()
  const { showToast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { showToast('A senha deve ter pelo menos 6 caracteres.', 'error'); return }
    setLoading(true)
    const { error } = await register(name, email, password)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Conta criada com sucesso! Bem-vindo(a) ao 3D Livre.')
      router.push('/')
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
          <h1 className="text-2xl font-bold text-gray-900">Criar conta gratuita</h1>
          <p className="text-gray-500 mt-1 text-sm">Junte-se à comunidade maker</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input id="name" type="text" label="Nome" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="email" type="email" label="Email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <Input id="password" type="password" label="Senha" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" hint="Use pelo menos 6 caracteres" />
            <Button type="submit" className="w-full" loading={loading} size="lg">
              <UserPlus size={16} />Criar conta
            </Button>
          </form>

          <p className="mt-4 text-xs text-gray-500 text-center">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/termos" className="text-blue-600 hover:underline">Termos de Uso</Link>.
          </p>

          <div className="mt-4 text-center text-sm text-gray-600">
            Já tem conta?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Entrar</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
