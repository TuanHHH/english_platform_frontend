"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"

// Helper: chuyển kind sang tiếng Việt gọn gàng
function getKindLabel(kind) {
  switch (kind?.toLowerCase()) {
    case "video":
      return "Video"
    case "article":
    case "html":
      return "Bài đọc"
    case "quiz":
      return "Bài kiểm tra"
    default:
      return kind || "Không xác định"
  }
}

export default function LessonHeader({ lesson }) {
  const params = useParams()
  const { courseId, moduleId, lessonId } = params
  const kindLabel = getKindLabel(lesson.kind)

  return (
    <Card className="shadow-elegant bg-gradient-to-br from-card to-muted/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Hàng badge */}
            <div className="flex items-center flex-wrap gap-3 mb-2">
              <Badge variant="outline">Lesson {lesson.position}</Badge>

              <Badge
                className={
                  lesson.status?.toLowerCase() === "published"
                    ? "bg-success text-white"
                    : "bg-gray-500 text-white"
                }
              >
                {lesson.status?.toLowerCase() === "published"
                  ? "Đã xuất bản"
                  : "Bản nháp"}
              </Badge>

              {lesson.isFree && (
                <Badge className="bg-emerald-600 text-white">
                  Miễn phí
                </Badge>
              )}
            </div>

            {/* Tiêu đề */}
            <CardTitle className="text-3xl mb-2">{lesson.title}</CardTitle>

            {/* Thông tin phụ */}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span>{kindLabel}</span>
              {lesson.estimatedMin && (
                <>
                  <span>•</span>
                  <span>{lesson.estimatedMin} phút</span>
                </>
              )}
            </div>
          </div>

          {/* Nút chỉnh sửa */}
          <Link href={`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa Lesson
            </Button>
          </Link>
        </div>
      </CardHeader>
    </Card>
  )
}
