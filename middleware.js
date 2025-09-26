import { NextResponse } from 'next/server'

const rules = [
  {
    routes: ['/login', '/register', '/forgot-password'], // route public
    requireAuth: false,
    redirectIfAuth: '/', // if there is a token then push it to home
  },
  {
    routes: ['/dashboard', '/profile', '/settings'], // route private
    requireAuth: true,
    redirectIfNoAuth: '/login', // if not logged in then push to login
  },
]

export function middleware(request) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  for (const rule of rules) {
    for (const route of rule.routes) {
      // just check startsWith
      if (pathname.startsWith(route)) {
        // Private route without login
        if (rule.requireAuth && !token) {
          return NextResponse.redirect(new URL(rule.redirectIfNoAuth, request.url))
        }
        // Public route that is logged in
        if (!rule.requireAuth && token && rule.redirectIfAuth) {
          return NextResponse.redirect(new URL(rule.redirectIfAuth, request.url))
        }
      }
    }
  }

  return NextResponse.next()
}

// run middleware for all routes, filter in rules
export const config = {
  matcher: ['/:path*'],
}
