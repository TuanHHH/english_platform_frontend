"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteLesson } from "@/lib/api/course"

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
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId, lessonId } = params
  const kindLabel = getKindLabel(lesson.kind)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await deleteLesson(moduleId, lessonId)
      if (res.success) {
        toast.success("Xóa bài học thành công!")
        router.push(`/instructor/courses/${courseId}/modules/${moduleId}`)
      } else {
        toast.error(res.error || "Không thể xóa bài học")
      }
    } catch (err) {
      console.error(err)
      toast.error("Đã xảy ra lỗi khi xóa bài học")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
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

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Link href={`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa Lesson
                </Button>
              </Link>
              <Button
                variant="destructive" className="hover:cursor-pointer"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa bài học
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa bài học này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bài học sẽ bị xóa vĩnh viễn khỏi module.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
