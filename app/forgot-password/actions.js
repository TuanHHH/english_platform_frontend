"use server"

export async function actionForgotPassword(email) {
  console.log("Mock forgot password for:", email)
  // giả lập delay 1s
  await new Promise((r) => setTimeout(r, 1000))

  if (email === "notfound@test.com") {
    throw { code: "RESOURCE_NOT_FOUND", message: "Email không tồn tại" }
  }

  return { success: true }
}

export async function actionVerifyOtp(email, otp) {
  console.log("Mock verify otp:", otp, "for", email)
  await new Promise((r) => setTimeout(r, 1000))

  if (otp !== "123456") {
    throw { code: "RESOURCE_INVALID", message: "OTP sai" }
  }

  return { success: true, data: { identifyCode: "mock-identify-code" } }
}

export async function actionResetPassword(email, newPassword, confirmPassword, identifyCode) {
  console.log("Mock reset password for:", email, { newPassword, confirmPassword, identifyCode })
  await new Promise((r) => setTimeout(r, 1000))

  if (newPassword !== confirmPassword) {
    throw { code: "RESOURCE_INVALID", message: "Password mismatch" }
  }

  return { success: true }
}
