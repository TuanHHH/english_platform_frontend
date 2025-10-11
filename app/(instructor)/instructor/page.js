"use client";

import { BookOpen, Users, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { title: "Tổng khóa học", value: "12", icon: BookOpen, color: "text-primary" },
  { title: "Học viên", value: "1,234", icon: Users, color: "text-secondary" },
  { title: "Giờ nội dung", value: "48", icon: Clock, color: "text-accent" },
  { title: "Tỷ lệ hoàn thành", value: "87%", icon: TrendingUp, color: "text-success" },
];

const recentCourses = [
  { name: "English for Beginners", students: 234, status: "Đã xuất bản", progress: 100 },
  { name: "Business English", students: 156, status: "Đang soạn", progress: 65 },
  { name: "IELTS Preparation", students: 89, status: "Chờ duyệt", progress: 90 },
];

export default function InstructorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Chào mừng trở lại!</h2>
        <p className="text-muted-foreground mt-1">
          Đây là tổng quan về hoạt động giảng dạy của bạn
        </p>
      </div>

      {/* --- Stats Section --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Recent Courses --- */}
      <Card className="shadow-elegant">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Khóa Học Gần Đây</CardTitle>
          <Link href="/instructor/courses">
            <Button variant="outline" size="sm">
              Xem Tất Cả
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {recentCourses.map((course, index) => (
              <Link key={course.name} href={`/instructor/courses/${index + 1}`}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{course.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.students} học viên
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{course.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.progress}% hoàn thành
                      </p>
                    </div>

                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
