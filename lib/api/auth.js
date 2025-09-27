import axios from "axios"
import { ErrorCode } from "@/lib/constants"

function getApiUrl(path) {
  return path
}

// ========== PUBLIC APIS ==========
export async function register(fullName, email, password, confirmPassword) {
  if (!fullName || !email || !password || !confirmPassword) {
    return { error: "Vui lòng nhập đầy đủ thông tin." }
  }
  if (password !== confirmPassword) {
    return { error: "Mật khẩu xác nhận không khớp." }
  }

  try {
    await axios.post(getApiUrl("/api/auth/register"), {
      fullName,
      email,
      password,
      confirmPassword,
    })
    return { success: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản." }
  } catch (err) {
    const code = err?.response?.data?.code
    if (code === ErrorCode.RESOURCE_ALREADY_EXISTS) {
      return { error: "Email đã được sử dụng. Vui lòng chọn email khác." }
    }
    return { error: "Đăng ký thất bại. Vui lòng thử lại." }
  }
}

export async function login(identifier, password) {
  try {
    const res = await axios.post(
      getApiUrl("/api/auth/login"),
      { identifier, password },
      { withCredentials: true, validateStatus: () => true }
    )

    if (res.status < 200 || res.status >= 300) {
      const err = res.data || {}
      if (err.code === "BAD_CREDENTIALS" || err.code === "RESOURCE_NOT_FOUND") {
        return { error: "Thông tin đăng nhập không chính xác. Vui lòng thử lại" }
      }
      return { error: "Không thể đăng nhập. Vui lòng thử lại." }
    }

    return { success: true, user: res.data }
  } catch (err) {
    console.error("Login error:", err)
    return { error: "Lỗi kết nối server" }
  }
}

export async function forgotPassword(email) {
  try {
    await axios.post(getApiUrl("/api/auth/forgot-password"), { email })
    return { success: true }
  } catch (err) {
    const code = err?.response?.data?.code
    if (code === ErrorCode.RESOURCE_NOT_FOUND) {
      return { success: false, error: "Email không tồn tại." }
    }
    return { success: false, error: "Yêu cầu đặt lại mật khẩu thất bại. Vui lòng thử lại." }
  }
}

export async function verifyOtp(email, otp) {
  try {
    const res = await axios.post(getApiUrl("/api/auth/verify-otp"), { email, otp })
    return { success: true, data: res.data }
  } catch (err) {
    const code = err?.response?.data?.code
    console.log("verifyOtp error code:", err)
    if (code === ErrorCode.RESOURCE_INVALID) {
      return { success: false, error: "OTP không hợp lệ." }
    }
    return { success: false, error: "Xác thực OTP thất bại. Vui lòng thử lại." }
  }
}

export async function resetPassword(email, newPassword, confirmPassword, identifyCode) {
  try {
    await axios.post(getApiUrl("/api/auth/reset-password"), {
      email,
      newPassword,
      confirmPassword,
      identifyCode,
    })
    return { success: true }
  } catch {
    return { success: false, error: "Đặt lại mật khẩu thất bại. Vui lòng thử lại." }
  }
}

export async function verifyRegister(token) {
  if (!token) {
    return { error: "Thiếu token xác thực." }
  }
  try {
    const res = await axios.get(getApiUrl(`/api/auth/verify-register?token=${token}`))
    return { success: true, message: res.data }
  } catch {
    return { error: "Token không hợp lệ hoặc đã hết hạn." }
  }
}

// ========== PRIVATE APIS ==========
export async function logout() {
  try {
    const res = await axios.post(getApiUrl("/api/auth/logout"), {}, { withCredentials: true })
    if (res.status >= 200 && res.status < 300) return { success: true }
    return { error: "Đăng xuất thất bại. Vui lòng thử lại." }
  } catch (err) {
    console.error("Logout error:", err)
    return { error: "Đăng xuất thất bại. Vui lòng thử lại." }
  }
}

export async function logoutAll() {
  try {
    const res = await axios.post(getApiUrl("/api/auth/logout-all"), {}, { withCredentials: true })
    if (res.status >= 200 && res.status < 300) return { success: true }
    return { error: "Đăng xuất tất cả thất bại. Vui lòng thử lại." }
  } catch (err) {
    console.error("LogoutAll error:", err)
    return { error: "Đăng xuất tất cả thất bại. Vui lòng thử lại." }
  }
}

export async function refreshTokens() {
  try {
    const res = await axios.post(getApiUrl("/api/auth/refresh"), {}, { withCredentials: true })
    return res.status >= 200 && res.status < 300
  } catch {
    return false
  }
}
