"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FullPageLoader } from "@/components/ui/full-page-loader"
import { toast } from "sonner"

export default function CallbackSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const run = async () => {
      try {
        const access_token = searchParams.get("access_token")
        const refresh_token = searchParams.get("refresh_token")

        if (!access_token || !refresh_token) {
          throw new Error("Missing tokens")
        }

        const res = await fetch("/api/auth/set-tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token, refresh_token })
        })

        if (!res.ok) throw new Error("Failed to set tokens")

        toast.success("Đăng nhập thành công!")
        setTimeout(() => router.replace("/"), 1000)
      } catch (e) {
        console.error("OAuth callback error:", e)
        toast.error("Đăng nhập thất bại")
        setTimeout(() => router.replace("/login"), 1000)
      }
    }
    run()
  }, [router, searchParams])

  return <FullPageLoader />
}
