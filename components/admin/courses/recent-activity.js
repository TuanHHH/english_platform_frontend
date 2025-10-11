"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recentActivity = [
  { course: "English for Beginners", instructor: "Nguyễn Văn A", action: "Gửi phê duyệt", time: "2 giờ trước" },
  { course: "Business English", instructor: "Trần Thị B", action: "Đã phê duyệt", time: "5 giờ trước" },
  { course: "IELTS Preparation", instructor: "Lê Văn C", action: "Cập nhật nội dung", time: "1 ngày trước" },
  { course: "TOEIC Mastery", instructor: "Phạm Thị D", action: "Từ chối", time: "2 ngày trước" },
]

export default function RecentActivity() {
  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle>Hoạt Động Gần Đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{activity.course}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.instructor} • {activity.action}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
