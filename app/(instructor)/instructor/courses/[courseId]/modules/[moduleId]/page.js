"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import LessonCard from "@/components/instructor/courses/module-detail/lesson-card"
import LessonEditDialog from "@/components/instructor/courses/module-detail/lesson-edit-dialog"
import LessonDeleteDialog from "@/components/instructor/courses/module-detail/lesson-delete-dialog"
import { listCourseLessons, getCourseModuleDetail } from "@/lib/api/course"
import { FullPageLoader } from "@/components/ui/full-page-loader"

export default function ModuleDetailPage() {
  const params = useParams()
  const { courseId, moduleId } = params

  const [module, setModule] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)

  // === Fetch module detail + lessons ===
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !moduleId) return
      setLoading(true)
      try {
        const [modRes, lessonRes] = await Promise.all([
          getCourseModuleDetail(courseId, moduleId),
          listCourseLessons(moduleId),
        ])

        if (modRes.success) setModule(modRes.data)
        else toast.error(modRes.error || "Không thể tải thông tin module")

        if (lessonRes.success) setLessons(lessonRes.data || [])
        else toast.error(lessonRes.error || "Không thể tải danh sách bài học")
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu module:", err)
        toast.error("Không thể tải dữ liệu module")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, moduleId])

  // === Handlers ===
  const handleEdit = (lesson) => {
    setSelectedLesson(lesson)
    setEditDialogOpen(true)
  }

  const handleDelete = (lesson) => {
    setSelectedLesson(lesson)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    toast.success(`Đã xóa bài học "${selectedLesson?.title}"`)
    setDeleteDialogOpen(false)
  }

  const handleLessonUpdated = (updatedLesson) => {
    if (!updatedLesson) return
    setLessons((prev) =>
      prev.map((l) => (l.id === updatedLesson.id ? updatedLesson : l))
    )
  }

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <FullPageLoader />
      </div>
    )
  }

  if (!module) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        Không tìm thấy thông tin module.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Nút quay lại */}
      <Link href={`/instructor/courses/${courseId}`}>
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại khóa học
        </Button>
      </Link>

      {/* Module Info */}
      <Card className="shadow-elegant bg-gradient-to-br from-card to-muted/30">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-2xl">
              {module.position || 1}
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{module.title}</CardTitle>
              {module.description && (
                <p className="text-muted-foreground">{module.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="outline">
                  {module.lessonCount ?? lessons.length} bài học
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Danh sách bài học</h2>
          <p className="text-muted-foreground mt-1">Quản lý nội dung bài học</p>
        </div>

        <Link href={`/instructor/courses/${courseId}/modules/${moduleId}/lessons/new`}>
          <Button className="bg-gradient-primary shadow-glow">
            <Plus className="h-4 w-4 mr-2" />
            Thêm bài học
          </Button>
        </Link>
      </div>

      {lessons.length === 0 ? (
        <p className="text-muted-foreground mt-4">
          Chưa có bài học nào trong module này.
        </p>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              courseId={courseId}
              moduleId={moduleId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <LessonEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        lesson={selectedLesson}
        onUpdateSuccess={handleLessonUpdated}
      />
      <LessonDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        lesson={selectedLesson}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
