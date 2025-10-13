"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FullPageLoader } from "@/components/ui/full-page-loader"
import ModuleCard from "@/components/instructor/courses/course-detail/module-card"
import ModuleCreateDialog from "@/components/instructor/courses/course-detail/module-create-dialog"
import ModuleEditDialog from "@/components/instructor/courses/course-detail/module-edit-dialog"
import ModuleDeleteDialog from "@/components/instructor/courses/course-detail/module-delete-dialog"
import { getCourseById, getCourseModules } from "@/lib/api/course"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId

  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [courseData, moduleData] = await Promise.all([
          getCourseById(courseId),
          getCourseModules(courseId),
        ])
        setCourse(courseData)
        setModules(moduleData)
      } catch (err) {
        toast.error("Không thể tải dữ liệu khóa học")
      } finally {
        setLoading(false)
      }
    }

    if (courseId) fetchData()
  }, [courseId])

  const handleEdit = (module) => {
    setSelectedModule(module)
    setEditDialogOpen(true)
  }

  const handleDelete = (module) => {
    setSelectedModule(module)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    toast.success(`Đã xóa module "${selectedModule?.title}"`)
    setDeleteDialogOpen(false)
  }

  if (loading) return <FullPageLoader />
  if (!course) return <p className="text-center text-red-500 mt-10">Không tìm thấy khóa học</p>

  return (
    <div className="space-y-6">
      <Link href="/instructor/courses">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </Link>

      {/* Header */}
      <div className="relative rounded-lg overflow-hidden h-64 mb-6">
        <img
          src={course.thumbnail || "/course-placeholder.jpeg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Badge className={course.published ? "bg-success" : "bg-gray-500"}>
              {course.published ? "Đã xuất bản" : "Chưa xuất bản"}
            </Badge>
            <span className="text-sm">{course.lessonCount ?? 0} bài học</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          <p className="text-white/90">{course.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Module</h2>
          <p className="text-muted-foreground mt-1">{modules.length} modules</p>
        </div>
        <ModuleCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </div>

      {modules.length === 0 ? (
        <p className="text-muted-foreground">Chưa có module nào.</p>
      ) : (
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={{
                id: module.id,
                title: module.title,
                order: module.position,
                lessons: module.lessonCount,
              }}
              courseId={courseId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ModuleEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        module={selectedModule}
      />

      <ModuleDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        module={selectedModule}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
