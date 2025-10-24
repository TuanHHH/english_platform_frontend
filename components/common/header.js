"use client"

import Link from "next/link"
import { BookOpen, Menu, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { navItems } from "@/lib/constants"
import SearchContainer from "@/components/common/search/search-container"
import AuthSection from "@/components/common/auth-section/auth-section"
import AuthSectionMobile from "@/components/common/auth-section/auth-section-mobile"
import { useCartStore } from "@/store/cart-store"
import { useEffect, useState } from "react"

function CartBadge({ count }) {
  // Prevent hydration issues by only rendering after component mounts
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything during SSR or before mount
  if (!isMounted || count === 0 || count === undefined) {
    return null
  }

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default function Header() {
  const { getCartItemCount } = useCartStore()
  const cartItemCount = getCartItemCount()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">English Pro</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-sm font-medium transition-colors hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <SearchContainer />
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Shopping cart</span>
              <CartBadge count={cartItemCount} />
            </Link>
            <AuthSection />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="text-lg font-medium transition-colors hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  className="flex items-center space-x-3 text-lg font-medium transition-colors hover:text-blue-600 relative"
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <CartBadge count={cartItemCount} />
                  </div>
                  <span>Giỏ hàng</span>
                </Link>
                <div className="pt-4 border-t">
                  <AuthSectionMobile />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="lg:hidden pb-4">
          <SearchContainer isMobile />
        </div>
      </div>
    </header>
  )
}
