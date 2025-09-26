"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import FullPageLoader from "@/components/common/full-page-loader"

import { actionForgotPassword, actionVerifyOtp, actionResetPassword } from "./actions"

import EmailStep from "./steps/email-step"
import OtpStep from "./steps/otp-step"
import ResetStep from "./steps/reset-step"

export default function ForgotForm() {
  const router = useRouter()
  const [step, setStep] = useState("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [identifyCode, setIdentifyCode] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" })

  // resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setInterval(() => setResendTimer((s) => s - 1), 1000)
      return () => clearInterval(t)
    }
  }, [resendTimer])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await actionForgotPassword(email)
      toast.success("Mã xác thực đã gửi về email.")
      setStep("otp")
    } catch (err) {
      toast.error(err.message || "Lỗi khi gửi email.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return
    setLoading(true)
    try {
      const res = await actionVerifyOtp(email, otp)
      setIdentifyCode(res.data?.identifyCode)
      toast.success("Xác thực thành công.")
      setStep("reset")
    } catch (err) {
      toast.error(err.message || "OTP không hợp lệ.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    try {
      await actionForgotPassword(email)
      setResendTimer(60)
      toast.success("OTP mới đã được gửi")
    } catch {
      toast.error("Không thể gửi lại OTP.")
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await actionResetPassword(email, formData.newPassword, formData.confirmPassword, identifyCode)
      toast.success("Đặt lại mật khẩu thành công.")
      router.push("/login")
    } catch (err) {
      toast.error(err.message || "Không thể đặt lại mật khẩu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <FullPageLoader />}
      <div className="w-full max-w-xl space-y-8">
        {step === "email" && (
          <EmailStep email={email} setEmail={setEmail} onSubmit={handleEmailSubmit} />
        )}
        {step === "otp" && (
          <OtpStep
            email={email}
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleOtpSubmit}
            resendTimer={resendTimer}
            handleResend={handleResend}
            backToEmail={() => setStep("email")}
          />
        )}
        {step === "reset" && (
          <ResetStep
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            onSubmit={handleResetSubmit}
          />
        )}
      </div>
    </>
  )
}
