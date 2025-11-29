import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// DEFINE ACCESS RULES

const rules = [
  {
    // Public routes
    routes: ["/login", "/register", "/forgot-password", "/auth/callback/error"],
    requireAuth: false,
    redirectIfAuth: "/", // logged-in user should not visit again
  },
  {
    // Admin-only routes
    routes: ["/admin"],
    requireAuth: true,
    requireAdmin: true,
    redirectIfNoAuth: "/login",
    redirectIfNoAdmin: "/forbidden",
  },
  {
    // Instructor-only routes
    routes: ["/instructor"],
    requireAuth: true,
    requireInstructor: true,
    redirectIfNoAuth: "/login",
    redirectIfNoInstructor: "/forbidden",
  },
  {
    // Private routes
    routes: [
      "/cart",
      "/auth/callback/success",
      "/payment",
      "/account",
      "/become-instructor",
      "/my-courses",
      "/practice",
      "/forum/new",
    ],
    requireAuth: true,
    redirectIfNoAuth: "/login",
  },
]

// MAIN MIDDLEWARE
export function middleware(request) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const access = request.cookies.get("access_token")?.value
  const refresh = request.cookies.get("refresh_token")?.value

  let decoded = null
  if (access) {
    try {
      decoded = jwt.decode(access)
    } catch {
      decoded = null
    }
  }

  // Duyệt từng rule
  for (const rule of rules) {
    for (const route of rule.routes) {
      if (pathname.startsWith(route)) {
        // Case 1️: Private route nhưng chưa đăng nhập
        if (rule.requireAuth && !access && !refresh) {
          return NextResponse.redirect(new URL(rule.redirectIfNoAuth, request.url))
        }

        // Case 2️: Admin route nhưng không có quyền
        if (rule.requireAdmin) {
          const authorities = decoded?.authorities || []
          const isAdmin = authorities.includes("ROLE_ADMIN")
          if (!isAdmin) {
            return NextResponse.redirect(new URL(rule.redirectIfNoAdmin, request.url))
          }
        }

        // Case 2️b: Instructor route nhưng không có quyền
        if (rule.requireInstructor) {
          const authorities = decoded?.authorities || []
          const isInstructor = authorities.includes("ROLE_INSTRUCTOR")
          if (!isInstructor) {
            return NextResponse.redirect(new URL(rule.redirectIfNoInstructor, request.url))
          }
        }

        // Case 3️: Public route nhưng đã login
        if (!rule.requireAuth && access && rule.redirectIfAuth) {
          return NextResponse.redirect(new URL(rule.redirectIfAuth, request.url))
        }
      }
    }
  }

  // Special case: /courses/[slug]/learn requires auth
  if (pathname.match(/^\/courses\/[^/]+\/learn/)) {
    if (!access && !refresh) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Mặc định cho phép
  return NextResponse.next()
}

// MIDDLEWARE CONFIG
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)",
  ],
}
