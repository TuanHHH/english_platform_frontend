"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { FullPageLoader } from "@/components/ui/full-page-loader"

function CallbackContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const access_token = searchParams.get("access_token")
    const refresh_token = searchParams.get("refresh_token")

    if (access_token && refresh_token) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      window.location.href = `${backendUrl}/set-cookie?access_token=${access_token}&refresh_token=${refresh_token}`
    }
  }, [searchParams])

  return <FullPageLoader />
}

export default function CallbackSuccess() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <CallbackContent />
    </Suspense>
  )
}
