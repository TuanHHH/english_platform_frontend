"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import ModuleCard from "@/components/instructor/courses/course-detail/module-card"
import ModuleCreateDialog from "@/components/instructor/courses/course-detail/module-create-dialog"
import ModuleEditDialog from "@/components/instructor/courses/course-detail/module-edit-dialog"
import ModuleDeleteDialog from "@/components/instructor/courses/course-detail/module-delete-dialog"

const mockCourseDetail = {
  id: 1,
  title: "English for Beginners",
  description: "Khóa học tiếng Anh cơ bản cho người mới bắt đầu từ con số 0",
  students: 234,
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
  modules: [
    { id: 1, title: "Introduction to English", order: 1, description: "Làm quen với các khái niệm cơ bản trong tiếng Anh", lessons: 8, duration: "2 giờ 30 phút" },
    { id: 2, title: "Grammar Basics", order: 2, description: "Nền tảng ngữ pháp cơ bản", lessons: 12, duration: "4 giờ 15 phút" },
    { id: 3, title: "Vocabulary Building", order: 3, description: "Xây dựng vốn từ vựng thiết yếu", lessons: 10, duration: "3 giờ 45 phút" },
    { id: 4, title: "Speaking Practice", order: 4, description: "Thực hành kỹ năng giao tiếp", lessons: 15, duration: "5 giờ 20 phút" },
  ],
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId
  const course = mockCourseDetail

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)

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

  return (
    <div className="space-y-6">
      <Link href="/instructor/courses">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Về Danh Sách Khóa Học
        </Button>
      </Link>

      {/* Header */}
      <div className="relative rounded-lg overflow-hidden h-64 mb-6">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-success">
              {course.status === "published" ? "Đã Xuất Bản" : "Nháp"}
            </Badge>
            <span className="text-sm">{course.students} học viên</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          <p className="text-white/90">{course.description}</p>
        </div>
      </div>

      {/* Modules header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Modules Trong Khóa Học</h2>
          <p className="text-muted-foreground mt-1">{course.modules.length} modules</p>
        </div>
        <ModuleCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </div>

      {/* Module list */}
      <div className="space-y-4">
        {course.modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            courseId={courseId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Dialogs */}
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
