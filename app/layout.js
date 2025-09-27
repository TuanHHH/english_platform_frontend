import './globals.css'
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import LabanDictFrame from "@/components/common/laban-dict-frame"
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'

export const metadata = {
  title: "English Pro - Học tiếng Anh hiệu quả",
  description: "Làm chủ kỳ thi Tiếng Anh với English Pro",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.ico" />
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <TooltipProvider>
          <Toaster />
          <Header />
          <LabanDictFrame />
          <main className="flex-grow">{children}</main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  )
}
