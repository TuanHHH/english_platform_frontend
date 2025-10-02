"use client";
import React from "react";
import Link from "next/link";
import { BookOpen, Users, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Đề thi đa dạng",
      description: "Hơn 1000 đề thi thực hành từ cơ bản đến nâng cao",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Cộng đồng học tập",
      description: "Kết nối với hàng ngàn học viên khác qua forum",
      color: "text-accent"
    },
    {
      icon: Trophy,
      title: "Chất lượng cao",
      description: "95% học viên đạt điểm mục tiêu sau khóa học",
      color: "text-primary-variant"
    },
    {
      icon: Clock,
      title: "Lịch học linh hoạt",
      description: "Học mọi lúc mọi nơi với lịch học cá nhân hóa",
      color: "text-accent"
    }
  ];

  const stats = [
    { number: "50K+", label: "Học viên" },
    { number: "1000+", label: "Đề thi" },
    { number: "95%", label: "Tỷ lệ đạt mục tiêu" },
    { number: "24/7", label: "Hỗ trợ" }
  ];

  return (
    <div className="min-h-screen bg-background">


      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              English Pro
              <span className="block text-4xl md:text-5xl mt-2">Học và luyện câu hỏi tiếng anh</span>
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Nền tảng luyện thi tiếng Anh trực tuyến với hơn 1000 đề thi thực hành, 
              cộng đồng học tập sôi động và lịch học cá nhân hóa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/practice-tets">Bắt đầu luyện tập</Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                Xem demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tại sao chọn EnglishPro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi cung cấp giải pháp học tiếng Anh toàn diện với chất lượng hàng đầu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-soft hover:shadow-elegant transition-smooth">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Sẵn sàng nâng cao điểm số tiếng Anh của bạn
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Tham gia cùng hàng ngàn học viên khác và đạt được điểm số mơ ước của bạn
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/practice">Bắt đầu ngay hôm nay</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
