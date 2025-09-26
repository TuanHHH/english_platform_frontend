'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'
import { registerAction } from './actions'

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [agree, setAgree] = useState(false)
    const [pending, startTransition] = useTransition()

    async function handleAction(formData) {
        if (!agree) {
            toast.error('Bạn cần đồng ý với Điều khoản và Chính sách trước.')
            return
        }

        startTransition(async () => {
            const res = await registerAction(formData)
            if (res?.error) {
                toast.error(res.error)
            } else {
                toast.success('Đăng ký thành công! Vui lòng kiểm tra email.')
            }
        })
    }

    return (
        <form action={handleAction} className="space-y-6">
            <div>
                <Label htmlFor="fullName" className="mb-1">Tên</Label>
                <Input id="fullName" name="fullName" placeholder="Nhập họ và tên" />
            </div>
            <div>
                <Label htmlFor="email" className="mb-1">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Nhập email" />
            </div>

            <div>
                <Label htmlFor="password" className="mb-1">Mật khẩu</Label>
                <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" className="pr-10" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                </div>
            </div>

            <div>
                <Label htmlFor="confirmPassword" className="mb-1">Xác nhận mật khẩu</Label>
                <div className="relative">
                    <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" className="pr-10" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
                <Label htmlFor="agree" className="text-sm">
                    Tôi đồng ý với{' '}
                    <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        Điều khoản
                    </a>{' '}
                    và{' '}
                    <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        Chính sách bảo mật
                    </a>
                </Label>
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-500" disabled={pending}>
                {pending ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </Button>
        </form>
    )
}
