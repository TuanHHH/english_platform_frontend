import { NextResponse } from "next/server"

const rules = [
  {
    routes: ["/login", "/register", "/forgot-password", "/auth/callback"], // public
    requireAuth: false,
    redirectIfAuth: "/", // nếu đã login thì chuyển về home
  },
  {
    routes: ["/dashboard", "/profile", "/settings"], // private
    requireAuth: true,
    redirectIfNoAuth: "/login", // nếu chưa login thì về login
  },
]

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Cho phép api routes đi qua
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const access = request.cookies.get("access_token")?.value
  const refresh = request.cookies.get("refresh_token")?.value

  for (const rule of rules) {
    for (const route of rule.routes) {
      if (pathname.startsWith(route)) {
        // Private route → cần login
        if (rule.requireAuth && !access && !refresh) {
          return NextResponse.redirect(
            new URL(rule.redirectIfNoAuth, request.url)
          )
        }

        // Public route → nếu login rồi thì redirect
        if (!rule.requireAuth && access && rule.redirectIfAuth) {
          return NextResponse.redirect(
            new URL(rule.redirectIfAuth, request.url)
          )
        }
      }
    }
  }

  return NextResponse.next()
}

// Áp dụng cho toàn bộ route
export const config = {
  matcher: ["/:path*"],
}
