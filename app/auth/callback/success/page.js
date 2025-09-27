"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import FullPageLoader from "@/components/common/full-page-loader"

export default function CallbackSuccess() {
    const router = useRouter()

    useEffect(() => {
        // redirect to home after 1.5s
        const timer = setTimeout(() => {
            router.replace("/")
        }, 1500)
        return () => clearTimeout(timer)
    }, [router])

    return (
        <FullPageLoader />
    )
}
