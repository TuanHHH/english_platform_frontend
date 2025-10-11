"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import CourseCard from "@/components/instructor/courses/course-card"
import CourseCreateDialog from "@/components/instructor/courses/course-create-dialog"
import CourseEditDialog from "@/components/instructor/courses/course-edit-dialog"
import CourseDeleteDialog from "@/components/instructor/courses/course-delete-dialog"

const mockCourses = [
  {
    id: 1,
    title: "English for Beginners",
    description: "Khóa học tiếng Anh cơ bản cho người mới bắt đầu",
    students: 234,
    modules: 8,
    lessons: 42,
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
  },
  {
    id: 2,
    title: "Business English",
    description: "Tiếng Anh thương mại cho môi trường công sở",
    students: 156,
    modules: 6,
    lessons: 35,
    status: "draft",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
  },
  {
    id: 3,
    title: "IELTS Preparation",
    description: "Chuẩn bị cho kỳ thi IELTS với chiến lược hiệu quả",
    students: 89,
    modules: 10,
    lessons: 58,
    status: "pending",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
  },
]

export default function InstructorCourses() {
  const [searchTerm, setSearchTerm] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const handleEdit = (course) => {
    setSelectedCourse(course)
    setEditDialogOpen(true)
  }

  const handleDelete = (course) => {
    setSelectedCourse(course)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    toast.success(`Khóa học "${selectedCourse?.title}" đã được xóa thành công.`)
    setDeleteDialogOpen(false)
  }

  const filteredCourses = mockCourses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Quản lý Khóa Học</h2>
        </div>
        <CourseCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CourseEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        course={selectedCourse}
      />

      <CourseDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        course={selectedCourse}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
