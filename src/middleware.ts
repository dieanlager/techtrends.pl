import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ochrona Panelu Administracyjnego (/admin/*)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization')
    const url = request.nextUrl
    
    // Auth bypass dla local development - jeśli nie zdefiniowano hasła w .env, blokujemy domyślnie.
    // W panelu Vercela MUSISZ ustawić ADMIN_PASSWORD.
    const EXPECTED_USER = process.env.ADMIN_USER || 'techtrends'
    const EXPECTED_PASS = process.env.ADMIN_PASSWORD || 'localdev_secure_pass'

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      if (user === EXPECTED_USER && pwd === EXPECTED_PASS) {
        return NextResponse.next()
      }
    }

    url.pathname = '/api/auth'
    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="TechTrends Control Tower"',
      },
    })
  }

  return NextResponse.next()
}

// Middleware uruchamiamy tylko dla ścieżek zaczynających się od /admin
export const config = {
  matcher: ['/admin/:path*'],
}
