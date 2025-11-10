import Link from "next/link"
import { Headphones, BookOpen, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import "./homepage-animation.css"

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Tài liệu phong phú",
      description:
        "Kho bài học và bài tập từ cơ bản đến nâng cao, phù hợp nhiều mục tiêu",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Cộng đồng học tập",
      description:
        "Kết nối và trao đổi với hàng ngàn học viên khác qua diễn đàn",
      color: "text-green-600",
    },
    {
      icon: Headphones,
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ hỗ trợ của chúng tôi luôn trực tuyến 24/7 để giúp đỡ bạn bất cứ khi nào bạn cần!",
    },
    {
      icon: BookOpen,
      title: "Truy cập toàn bộ tài liệu",
      description:
        "Chúng tôi cung cấp đầy đủ tài liệu học tập chất lượng cao để giúp bạn học tốt hơn",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top right decorative lines */}
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <svg className="absolute top-20 right-32 w-64 h-64 opacity-20" viewBox="0 0 200 200">
              <path d="M 50 100 Q 100 50 150 100" stroke="#e5e7eb" strokeWidth="2" fill="none" />
              <path d="M 60 120 Q 110 70 160 120" stroke="#e5e7eb" strokeWidth="2" fill="none" />
            </svg>

            {/* Decorative shapes */}
            <div className="absolute top-32 right-64 w-12 h-12 rotate-45">
              <div className="w-full h-full bg-blue-400 rounded-lg opacity-80"></div>
            </div>

            {/* Stars */}
            <svg className="absolute top-24 right-48 w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            <svg className="absolute top-48 right-24 w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            {/* Curved lines */}
            <svg className="absolute top-64 right-16 w-48 h-48 opacity-20" viewBox="0 0 200 200">
              <path d="M 20 100 Q 100 20 180 100 Q 100 180 20 100" stroke="#e5e7eb" strokeWidth="2" fill="none" />
            </svg>

            {/* Squiggly line */}
            <svg className="absolute bottom-32 right-40 w-32 h-16 opacity-30" viewBox="0 0 100 50">
              <path d="M 0 25 Q 12.5 10 25 25 T 50 25 T 75 25 T 100 25" stroke="#9ca3af" strokeWidth="2" fill="none" />
            </svg>
          </div>

          {/* Bottom left decorative elements */}
          <svg className="absolute bottom-32 left-16 w-16 h-16 text-gray-300 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>

          <svg className="absolute bottom-64 left-32 w-12 h-12 text-gray-400 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-10 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                English Pro
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Học tiếng Anh dễ dàng hơn bao giờ hết!
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Trải nghiệm hệ thống học tiếng Anh hiện đại, phù hợp với mọi đối tượng từ cơ bản đến nâng cao
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-base" asChild>
                  <Link href="/practice">Bắt đầu học ngay</Link>
                </Button>
                <Button variant="ghost" size="lg" className="text-gray-900 hover:text-gray-700 px-8 py-6 text-base font-medium" asChild>
                  <Link href="/courses">Xem khóa học</Link>
                </Button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden lg:flex relative h-[500px] items-center justify-center">
              {/* Main illustration container with floating animation */}
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Large background circle with gradient */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 opacity-60 animate-pulse"></div>
                </div>

                {/* Floating book illustration */}
                <div className="relative z-10 animate-float">
                  <svg className="w-80 h-80" viewBox="0 0 200 200" fill="none">
                    {/* Open book */}
                    <g className="drop-shadow-2xl">
                      {/* Left page */}
                      <path d="M 60 50 Q 60 40 70 40 L 95 40 L 95 140 L 70 140 Q 60 140 60 130 Z" 
                            fill="#ffffff" stroke="#e5e7eb" strokeWidth="2"/>
                      
                      {/* Right page */}
                      <path d="M 105 40 L 130 40 Q 140 40 140 50 L 140 130 Q 140 140 130 140 L 105 140 Z" 
                            fill="#ffffff" stroke="#e5e7eb" strokeWidth="2"/>
                      
                      {/* Book spine */}
                      <rect x="95" y="40" width="10" height="100" fill="#3b82f6"/>
                      
                      {/* Text lines on left page */}
                      <line x1="70" y1="60" x2="90" y2="60" stroke="#cbd5e1" strokeWidth="2"/>
                      <line x1="70" y1="70" x2="85" y2="70" stroke="#cbd5e1" strokeWidth="2"/>
                      <line x1="70" y1="80" x2="90" y2="80" stroke="#cbd5e1" strokeWidth="2"/>
                      <line x1="70" y1="90" x2="88" y2="90" stroke="#cbd5e1" strokeWidth="2"/>
                      
                      {/* Text lines on right page */}
                      <line x1="110" y1="60" x2="130" y2="60" stroke="#cbd5e1" strokeWidth="2"/>
                      <line x1="110" y1="70" x2="125" y2="70" stroke="#cbd5e1" strokeWidth="2"/>
                      <line x1="110" y1="80" x2="130" y2="80" stroke="#cbd5e1" strokeWidth="2"/>
                      <line x1="110" y1="90" x2="128" y2="90" stroke="#cbd5e1" strokeWidth="2"/>
                    </g>

                    {/* Floating letters around the book */}
                    <text x="35" y="35" className="text-2xl font-bold fill-blue-500 animate-bounce-slow">A</text>
                    <text x="155" y="45" className="text-2xl font-bold fill-purple-500 animate-bounce-slower">B</text>
                    <text x="25" y="120" className="text-2xl font-bold fill-pink-500 animate-bounce-slow">C</text>
                    <text x="165" y="130" className="text-2xl font-bold fill-indigo-500 animate-bounce-slower">D</text>
                  </svg>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute top-10 left-10 w-16 h-16 bg-blue-400 rounded-full opacity-20 animate-float-delayed"></div>
                <div className="absolute bottom-10 right-10 w-20 h-20 bg-purple-400 rounded-full opacity-20 animate-float"></div>
                <div className="absolute top-1/2 right-0 w-12 h-12 bg-pink-400 rounded-full opacity-20 animate-float-delayed"></div>
                
                {/* Sparkle effects */}
                <div className="absolute top-20 right-20">
                  <svg className="w-8 h-8 text-yellow-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                
                <div className="absolute bottom-32 left-16">
                  <svg className="w-6 h-6 text-blue-400 animate-pulse-slow" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                {/* Achievement badges */}
                <div className="absolute top-1/4 -left-8 bg-white rounded-lg shadow-lg p-3 animate-float-slow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-1/4 -right-8 bg-white rounded-lg shadow-lg p-3 animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-left">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-900" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}