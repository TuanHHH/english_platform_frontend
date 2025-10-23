import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Define route rules
const rules = [
  {
    // Public routes
    routes: ["/login", "/register", "/forgot-password", "/auth/callback/error"],
    requireAuth: false, // No authentication required
    redirectIfAuth: "/", // Redirect logged-in users back to home
  },
  {
    // Private routes
    routes: ["/dashboard", "/profile", "/settings", "/auth/callback/success"],
    requireAuth: true, // Requires authentication
    redirectIfNoAuth: "/login", // Redirect unauthenticated users to login
  },
  {
    // Admin-only routes
    routes: ["/admin", "/admin/:path*"],
    requireAuth: true, // Requires authentication
    requireAdmin: true, // Requires ADMIN role
    redirectIfNoAuth: "/login", // If not logged in → redirect to login
    redirectIfNoAdmin: "/forbidden", // If logged in but not admin → redirect to 403 page
  },
]

export function middleware(request) {
  // const { pathname } = request.nextUrl

  // // Allow all API routes without middleware checks
  // if (pathname.startsWith("/api")) {
  //   return NextResponse.next()
  // }

  // // Get tokens from cookies
  // const access = request.cookies.get("access_token")?.value
  // const refresh = request.cookies.get("refresh_token")?.value

  // // Decode JWT if access token exists
  // let decoded = null
  // if (access) {
  //   try {
  //     // Decode only (no signature verification here)
  //     decoded = jwt.decode(access)
  //   } catch (e) {
  //     decoded = null
  //   }
  // }

  // // Iterate through rules
  // for (const rule of rules) {
  //   for (const route of rule.routes) {
  //     if (pathname.startsWith(route)) {
  //       // Case 1: Private route but no tokens
  //       if (rule.requireAuth && !access && !refresh) {
  //         return NextResponse.redirect(
  //           new URL(rule.redirectIfNoAuth, request.url)
  //         )
  //       }

  //       // Case 2: Admin route but user is not admin
  //       if (rule.requireAdmin) {
  //         const authorities = decoded?.authorities || []
  //         const isAdmin = authorities.includes("ROLE_ADMIN")
  //         if (!isAdmin) {
  //           return NextResponse.redirect(
  //             new URL(rule.redirectIfNoAdmin, request.url)
  //           )
  //         }
  //       }

  //       // Case 3: Public route but already logged in
  //       if (!rule.requireAuth && access && rule.redirectIfAuth) {
  //         return NextResponse.redirect(
  //           new URL(rule.redirectIfAuth, request.url)
  //         )
  //       }
  //     }
  //   }
  // }

  // Default: allow request
  return NextResponse.next()
}

// // Apply middleware for all routes
export const config = {
  matcher: ["/:path*"],
}


