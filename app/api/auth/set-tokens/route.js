import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request) {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: "Missing tokens" }, { status: 400 })
    }

    const cookieStore = await cookies()

    // ACCESS TOKEN
    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: true,           
      sameSite: "none",       
      path: "/",              
      maxAge: 60 * 60 * 24 * 1       
    })

    // REFRESH TOKEN
    cookieStore.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to set tokens" }, { status: 500 })
  }
}
