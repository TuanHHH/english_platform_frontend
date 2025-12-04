"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FullPageLoader } from "@/components/ui/full-page-loader"

import ModuleCard from "@/components/instructor/courses/course-detail/module-card"
import ModuleCreateDialog from "@/components/instructor/courses/course-detail/module-create-dialog"
import ModuleEditDialog from "@/components/instructor/courses/course-detail/module-edit-dialog"
import ModuleDeleteDialog from "@/components/instructor/courses/course-detail/module-delete-dialog"

import { getCourseById } from "@/lib/api/course"
import { getCourseModules, deleteCourseModule } from "@/lib/api/course-module"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId

  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  // dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)

  // === Fetch data ban đầu ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [courseData, moduleData] = await Promise.all([
          getCourseById(courseId),
          getCourseModules(courseId),
        ])
        setCourse(courseData.data)
        setModules(moduleData)
      } catch (err) {
        console.error(err)
        toast.error("Không thể tải dữ liệu khóa học")
      } finally {
        setLoading(false)
      }
    }

    if (courseId) fetchData()
  }, [courseId])

  // === Optimistic update: CREATE ===
  const handleCreateModule = (newModuleData) => {
    setModules((prev) => {
      const updated = [
        ...prev,
        {
          id: newModuleData.id,
          title: newModuleData.title,
          position: newModuleData.position,
          lessonCount: newModuleData.lessonCount ?? 0,
        },
      ]
      // Sort theo position trước khi set state
      return updated.sort((a, b) => a.position - b.position)
    })

    setCourse((prev) => ({
      ...prev,
      moduleCount: (prev?.moduleCount ?? 0) + 1,
    }))

    toast.success(`Đã tạo module "${newModuleData.title}"`)
  }



  // === EDIT ===
  const handleEdit = (module) => {
    setSelectedModule(module)
    setEditDialogOpen(true)
  }

  const handleUpdateModule = (updated) => {
    setModules((prev) => {
      const newList = prev.map((m) =>
        m.id === updated.id ? { ...m, ...updated } : m
      )
      // Sort theo position trước khi set state
      return newList.sort((a, b) => a.position - b.position)
    })

    toast.success(`Đã cập nhật module "${updated.title}"`)
  }


  // === DELETE ===
  const handleDelete = (module) => {
    setSelectedModule(module)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedModule) return;
    const { success, error } = await deleteCourseModule(courseId, selectedModule.id);

    if (!success) {
      toast.error(error || `Không thể xóa module "${selectedModule.title}"`);
      setDeleteDialogOpen(false);
      return;
    }

    setModules((prev) => prev.filter((m) => m.id !== selectedModule.id))
    setCourse((prev) => ({
      ...prev,
      moduleCount: Math.max((prev?.moduleCount ?? 1) - 1, 0),
    }))
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

      {/* --- Header --- */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Thumbnail */}
          <div className="lg:col-span-1">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
              <img
                src={course.thumbnail || "/course-placeholder.jpeg"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Course Info */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{course.title}</h1>

            {/* Trạng thái + thống kê */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Badge
                className={
                  course.published ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"
                }
              >
                {course.published ? "Đã xuất bản" : "Chưa xuất bản"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {course.lessonCount ?? 0} bài học
              </span>
              <span className="text-sm text-muted-foreground">
                {course.moduleCount ?? 0} module
              </span>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
              {course.description}
            </p>

            {/* Thông tin phụ */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                💵{" "}
                {course.priceCents
                  ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: course.currency || "VND",
                    minimumFractionDigits: 0,
                  }).format(course.priceCents)
                  : "Miễn phí"}
              </Badge>

              {course.language && (
                <Badge variant="outline" className="capitalize">
                  🌐 {course.language}
                </Badge>
              )}

              {Array.isArray(course.skillFocus) &&
                course.skillFocus.map((skill) => (
                  <Badge key={skill} variant="secondary" className="capitalize">
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Detailed Description --- */}
      {course.detailedDescription && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Mô tả chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: course.detailedDescription }}
            />
          </CardContent>
        </Card>
      )}

      {/* --- Danh sách module --- */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Module</h2>
          <p className="text-muted-foreground mt-1">{modules.length} modules</p>
        </div>

        <ModuleCreateDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          courseId={courseId}
          onCreateSuccess={handleCreateModule}
        />
      </div>

      {modules.length === 0 ? (
        <p className="text-muted-foreground">Chưa có module nào.</p>
      ) : (
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
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
        courseId={courseId}
        onUpdateSuccess={handleUpdateModule}
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
