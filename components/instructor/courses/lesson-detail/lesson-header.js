"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"

export default function LessonHeader({ lesson, onEdit }) {
  return (
    <Card className="shadow-elegant bg-gradient-to-br from-card to-muted/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline">Lesson {lesson.order}</Badge>
              <Badge
                className={
                  lesson.status === "published" ? "bg-success" : "bg-muted"
                }
              >
                {lesson.status === "published" ? "Đã xuất bản" : "Nháp"}
              </Badge>
            </div>
            <CardTitle className="text-3xl mb-2">{lesson.title}</CardTitle>
            <p className="text-muted-foreground">
              {lesson.courseTitle} / {lesson.moduleTitle}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span>{lesson.type}</span>
              <span>•</span>
              <span>{lesson.duration}</span>
            </div>
          </div>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh Sửa Lesson
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
