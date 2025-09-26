"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"
import { loginAction } from "./actions"
import FullPageLoader from "@/components/common/full-page-loader"

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await loginAction(new FormData(e.currentTarget))
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Đăng nhập thành công!")
        router.push("/")
      }
    } catch (err) {
      toast.error("Có lỗi kết nối server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <FullPageLoader />}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <Label htmlFor="identifier">Email</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="identifier"
              name="identifier"
              placeholder="Nhập email của bạn"
              className="pl-10"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-500"
          disabled={loading}
        >
          {loading ? "Đang xử lý…" : "Đăng nhập"}
        </Button>
      </form>
    </>
  )
}
