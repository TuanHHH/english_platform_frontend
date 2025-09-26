"use server"

import { cookies } from "next/headers"

export async function loginAction(formData) {
  const identifier = formData.get("identifier")
  const password = formData.get("password")

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { error: err.message || "Đăng nhập thất bại" }
    }

    // backend returns JSON + Set-Cookie header
    const data = await res.json()

    // get cookie from response headers
    const setCookie = res.headers.get("set-cookie")
    if (setCookie) {
      const cookieStore = await cookies()

      setCookie.split(/,(?=\s*\w+=)/).forEach((c) => {
        const [pair] = c.split(";")
        const [name, value] = pair.split("=")

        cookieStore.set({
          name: name.trim(),
          value: value.trim(),
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
      })
    }

    return { success: true, user: data }
  } catch (err) {
    console.error("Login error:", err)
    return { error: "Lỗi kết nối server" }
  }
}
