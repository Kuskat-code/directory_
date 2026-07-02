import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname
  const userRole = user?.app_metadata?.role

  // Admin route - solo admin
  if (path.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Dashboard routes - requieren autenticación
  if (path.startsWith('/dashboard/paciente') && (!user || userRole !== 'paciente')) {
    if (!user) {
      return NextResponse.redirect(new URL('/?auth=login', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path.startsWith('/dashboard/doctor') && (!user || (userRole !== 'doctor' && userRole !== 'admin'))) {
    if (!user) {
      return NextResponse.redirect(new URL('/?auth=login', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path.startsWith('/dashboard/admin') && (!user || userRole !== 'admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/?auth=login', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Configuracion route - solo doctor
  if (path.startsWith('/configuracion') && (!user || userRole !== 'doctor')) {
    if (!user) {
      return NextResponse.redirect(new URL('/?auth=login', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirigir "/" al dashboard según el rol si está autenticado
  if (path === '/' && user) {
    if (userRole === 'paciente') {
      return NextResponse.redirect(new URL('/dashboard/paciente', request.url))
    }
    if (userRole === 'doctor') {
      return NextResponse.redirect(new URL('/dashboard/doctor', request.url))
    }
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
