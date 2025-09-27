"use server"

import axios from "axios"
import { cookies } from "next/headers"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API

export async function serverAxios() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")?.value
  const refreshToken = cookieStore.get("refresh_token")?.value

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken ?? ""}; refresh_token=${refreshToken ?? ""}`,
    },
    validateStatus: () => true
  })
}