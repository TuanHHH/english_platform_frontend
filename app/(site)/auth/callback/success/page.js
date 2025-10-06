"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import FullPageLoader from "@/components/common/full-page-loader"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "sonner"

export default function CallbackSuccess() {
  const router = useRouter()
  const oauthLogin = useAuthStore((s) => s.oauthLogin)

  useEffect(() => {
    const run = async () => {
      try {
        await oauthLogin()
        toast.success("Đăng nhập thành công!")
      } catch (e) {
        console.error("oauthLogin error:", e)
      } finally {
        setTimeout(() => {
          router.replace("/")
        }, 1000)
      }
    }
    run()
  }, [router, oauthLogin])

  return <FullPageLoader />
}
