import Link from "next/link"
import { BookOpen, Users, Trophy, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
      icon: Trophy,
      title: "Phương pháp hiệu quả",
      description:
        "Giúp bạn tiến bộ nhanh chóng với lộ trình học thông minh",
      color: "text-blue-600",
    },
    {
      icon: Clock,
      title: "Lịch học linh hoạt",
      description: "Tự do học mọi lúc mọi nơi với kế hoạch cá nhân hóa",
      color: "text-green-600",
    },
  ]

  const stats = [
    { number: "50K+", label: "Học viên" },
    { number: "2000+", label: "Bài học & bài tập" },
    { number: "90%", label: "Cải thiện kỹ năng" },
    { number: "24/7", label: "Hỗ trợ" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Học tiếng Anh trực tuyến
              <span className="block text-4xl md:text-5xl mt-2">
                hiệu quả & linh hoạt
              </span>
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              English Pro cung cấp nền tảng học tiếng Anh toàn diện: tài liệu
              phong phú, cộng đồng sôi động và công cụ cá nhân hóa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/practice">Bắt đầu học</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Xem demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tại sao chọn English Pro?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi mang đến trải nghiệm học tiếng Anh toàn diện, chất lượng
              và dễ tiếp cận cho mọi người.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="bg-white border rounded-lg shadow hover:shadow-lg transition"
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Sẵn sàng bắt đầu hành trình học tiếng Anh?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Tham gia cùng hàng ngàn học viên khác và nâng cao kỹ năng tiếng Anh
            của bạn ngay hôm nay.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/practice">Bắt đầu ngay</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
