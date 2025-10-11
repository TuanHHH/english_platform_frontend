"use client"

import { CheckCircle, Clock, XCircle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { title: "Chờ Phê Duyệt", value: "8", icon: Clock, color: "text-warning" },
  { title: "Đã Phê Duyệt", value: "45", icon: CheckCircle, color: "text-success" },
  { title: "Từ Chối", value: "3", icon: XCircle, color: "text-destructive" },
  { title: "Tổng Instructors", value: "23", icon: Users, color: "text-primary" },
]

export default function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="shadow-elegant hover:shadow-glow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
