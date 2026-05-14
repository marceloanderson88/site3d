import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { User, Calendar, MessageSquare, Star, Layers } from 'lucide-react'
import Link from 'next/link'

export default async function MinhaContaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const [{ count: modelsCount }, { count: commentsCount }, { count: ratingsCount }] = await Promise.all([
    supabase.from('models').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('ratings').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Minha Conta</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{profile?.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{user.email}</p>
            {profile?.role === 'admin' && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Administrador</span>
            )}
            {profile?.bio && <p className="text-sm text-gray-600 mt-3">{profile.bio}</p>}
            <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <Calendar size={12} />
              Membro desde {formatDate(profile?.created_at || user.created_at)}
            </p>
          </div>
        </div>

        {/* Stats & links */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Layers, label: 'Peças enviadas', value: modelsCount || 0, href: '/minha-conta/pecas' },
              { icon: MessageSquare, label: 'Comentários', value: commentsCount || 0, href: '#' },
              { icon: Star, label: 'Avaliações', value: ratingsCount || 0, href: '#' },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-blue-300 hover:shadow-sm transition-all group">
                <stat.icon size={20} className="mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Ações rápidas</h3>
            <div className="space-y-2">
              <Link href="/enviar" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><User size={16} className="text-blue-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">Enviar nova peça</p><p className="text-xs text-gray-500">Compartilhe um modelo 3D</p></div>
              </Link>
              <Link href="/minha-conta/pecas" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Layers size={16} className="text-green-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">Minhas peças</p><p className="text-xs text-gray-500">Gerencie seus modelos enviados</p></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
