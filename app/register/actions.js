'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function registerAction(formData) {
  const fullName = formData.get('fullName')
  const username = formData.get('username')
  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  if (!fullName || !username || !email || !password) {
    return { error: 'Vui lòng nhập đầy đủ thông tin.' }
  }
  if (password !== confirmPassword) {
    return { error: 'Mật khẩu xác nhận không khớp.' }
  }

  const res = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, username, email, password }),
    cache: 'no-store',
  })

  if (!res.ok) {
    return { error: 'Đăng ký thất bại. Vui lòng thử lại.' }
  }

  const data = await res.json()
  if (data?.accessToken) {
    const cookieStore = await cookies()
    cookieStore.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    })
    redirect('/')
  }

  return { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' }
}
