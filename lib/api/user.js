"use server"

import { serverAxios } from "@/lib/axios-server"

export async function getUser() {
  try {
    const client = await serverAxios()
    const res = await client.get("/users/me")
    if (res.status === 200) return res.data?.data
    return null   
  } catch {
    return null
  }
}