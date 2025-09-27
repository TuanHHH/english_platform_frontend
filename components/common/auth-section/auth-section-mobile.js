'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import UserDropdownMobile from "@/components/common/user-dropdown/user-dropdown-mobile"

const AuthSectionMobile = ({ user }) => {
  if (!user) {
    return (
      <div className="space-y-3">
        <Link href="/login">
          <Button variant="outline" className="w-full">Đăng nhập</Button>
        </Link>
        <Link href="/register">
          <Button className="w-full bg-blue-600 hover:bg-blue-500 mt-3">Đăng ký</Button>
        </Link>
      </div>
    )
  }

  return <UserDropdownMobile user={user} />
}

export default AuthSectionMobile
