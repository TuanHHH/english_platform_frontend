'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { User } from 'lucide-react'

const ProfileCard = () => {
  const [hasChanges, setHasChanges] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)

  useEffect(() => {
    setHasChanges(true) // fake trạng thái để hiện nút submit
  }, [])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  const handleAvatarRemove = () => {
    setAvatarPreview(null)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Hồ sơ cá nhân
          </CardTitle>
          <CardDescription>Thông tin cá nhân</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs text-center px-2">
                    No Avatar
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-500 text-sm text-center"
                >
                  Upload Avatar
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarRemove}
                  >
                    Xóa avatar
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label className="mb-2" htmlFor="fullName">
                Tên
              </Label>
              <Input id="fullName" />
            </div>

            <div>
              <Label className="mb-2" htmlFor="email">
                Email
              </Label>
              <Input id="email" type="email" />
            </div>

            {hasChanges && (
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-500"
              >
                Cập nhật hồ sơ
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>Tăng bảo mật tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <Label className="mb-2">Mật khẩu hiện tại</Label>
              <Input type="password" />
            </div>
            <div>
              <Label className="mb-2">Mật khẩu mới</Label>
              <Input type="password" />
            </div>
            <div>
              <Label className="mb-2">Xác nhận mật khẩu</Label>
              <Input type="password" />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-500"
            >
              Xác nhận đổi mật khẩu
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileCard
