import Link from "next/link"
import { BookOpen, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { navItems } from "@/lib/constants"
import SearchContainer from "@/components/common/search/search-container"
import AuthSection from "@/components/common/auth-section/auth-section"
import AuthSectionMobile from "@/components/common/auth-section/auth-section-mobile"

export default function Header() {
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
