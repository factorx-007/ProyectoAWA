import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Rutas protegidas
  const protectedPaths = ['/admin', '/dashboard']
  // Rutas de autenticación
  const authPaths = ['/auth/login', '/auth/register']

  // Verificar rutas protegidas
  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    // Guardar la URL original para redirigir después del login
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar rutas de autenticación
  if (authPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/auth/login',
    '/auth/register',
  ],
}