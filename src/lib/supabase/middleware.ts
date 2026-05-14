import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const protectedRoutes = ['/enviar', '/minha-conta']
  const adminRoutes = ['/admin']
  const authRoutes = ['/login', '/cadastro']

  const path = request.nextUrl.pathname

  if (!user && protectedRoutes.some(r => path.startsWith(r))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (adminRoutes.some(r => path.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}
