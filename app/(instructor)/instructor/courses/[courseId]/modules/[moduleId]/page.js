"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Plus, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import LessonCard from "@/components/instructor/courses/module-detail/lesson-card"
import LessonDeleteDialog from "@/components/instructor/courses/module-detail/lesson-delete-dialog"
import ModulePublishDialog from "@/components/instructor/courses/module-detail/module-publish-dialog"
import { listCourseLessons, getCourseModuleDetail, publishModule } from "@/lib/api/course"
import { FullPageLoader } from "@/components/ui/full-page-loader"

export default function ModuleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId } = params

  const [module, setModule] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPublished, setIsPublished] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)

  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [pendingPublishState, setPendingPublishState] = useState(false)

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

        if (modRes.success) {
          setModule(modRes.data)
          setIsPublished(modRes.data.published || false)
        } else {
          toast.error(modRes.error || "Không thể tải thông tin module")
        }

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
    // Navigate to the edit page instead of opening a dialog
    router.push(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`)
  }

  const handleDelete = (lesson) => {
    setSelectedLesson(lesson)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    toast.success(`Đã xóa bài học "${selectedLesson?.title}"`)
    setDeleteDialogOpen(false)
  }

  const handlePublishClick = () => {
    const newPublishState = !isPublished
    setPendingPublishState(newPublishState)
    setShowPublishDialog(true)
  }

  const handlePublishConfirm = async () => {
    // Optimistic update
    setIsPublished(pendingPublishState)
    setIsUpdating(true)
    setShowPublishDialog(false)

    const result = await publishModule(courseId, moduleId, pendingPublishState)

    setIsUpdating(false)

    if (result.success) {
      toast.success(
        pendingPublishState
          ? "Module đã được xuất bản"
          : "Đã hủy xuất bản module"
      )
    } else {
      // Rollback on failure
      setIsPublished(!pendingPublishState)
      toast.error(result.error || "Không thể cập nhật trạng thái xuất bản")
    }
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
                <Badge
                  className={`${
                    isPublished ? "bg-green-400" : "bg-gray-400"
                  } text-white`}
                >
                  {isPublished ? "Đã xuất bản" : "Chưa xuất bản"}
                </Badge>
              </div>
            </div>
            <div>
              <Button
                onClick={handlePublishClick}
                disabled={isUpdating}
                variant={isPublished ? "outline" : "default"}
                className={isPublished ? "" : "bg-gradient-primary shadow-glow"}
              >
                {isPublished ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Hủy xuất bản
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Xuất bản
                  </>
                )}
              </Button>
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
      <LessonDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        lesson={selectedLesson}
        onConfirm={confirmDelete}
      />

      <ModulePublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        module={module}
        isPublishing={pendingPublishState}
        onConfirm={handlePublishConfirm}
      />
    </div>
  )
}
