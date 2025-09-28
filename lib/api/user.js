import api from "@/lib/axios"

export async function getUser() {
  try {
    const res = await api.get("/api/users/me")
    if (res.status === 200) return res.data?.data
    return null
  } catch {
    return null
  }
}