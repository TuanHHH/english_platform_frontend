'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import UserDropdown from "@/components/common/user-dropdown/user-dropdown"

const AuthSection = ({ user }) => {
  if (!user) {
    return (
      <>
        <Link href="/login">
          <Button variant="outline" size="sm">Đăng nhập</Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500">Đăng ký</Button>
        </Link>
      </>
    )
  }

  return <UserDropdown user={user} />
}

export default AuthSection
