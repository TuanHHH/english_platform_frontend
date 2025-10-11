"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import LessonCard from "@/components/instructor/courses/module-detail/lesson-card"
import LessonCreateDialog from "@/components/instructor/courses/module-detail/lesson-create-dialog"
import LessonEditDialog from "@/components/instructor/courses/module-detail/lesson-edit-dialog"
import LessonDeleteDialog from "@/components/instructor/courses/module-detail/lesson-delete-dialog"

const mockModuleDetail = {
  id: 1,
  courseId: 1,
  courseTitle: "English for Beginners",
  title: "Introduction to English",
  order: 1,
  description: "Làm quen với các khái niệm cơ bản trong tiếng Anh",
  lessons: [
    { id: 1, title: "Alphabet and Pronunciation", order: 1, type: "video", duration: "15 phút", status: "published" },
    { id: 2, title: "Basic Greetings", order: 2, type: "text", duration: "10 phút", status: "published" },
    { id: 3, title: "Numbers 1-100", order: 3, type: "video", duration: "12 phút", status: "draft" },
    { id: 4, title: "Common Phrases", order: 4, type: "text", duration: "18 phút", status: "published" },
    { id: 5, title: "Practice Quiz", order: 5, type: "quiz", duration: "20 phút", status: "published" },
  ],
}

export default function ModuleDetailPage() {
  const params = useParams()
  const { courseId, moduleId } = params
  const module = mockModuleDetail

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)

  const handleEdit = (lesson) => {
    setSelectedLesson(lesson)
    setEditDialogOpen(true)
  }

  const handleDelete = (lesson) => {
    setSelectedLesson(lesson)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    toast.success(`Đã xóa lesson "${selectedLesson?.title}"`)
    setDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <Link href={`/instructor/courses/${courseId}`}>
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Về Course: {module.courseTitle}
        </Button>
      </Link>

      <Card className="shadow-elegant bg-gradient-to-br from-card to-muted/30">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-2xl">
              {module.order}
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{module.title}</CardTitle>
              <p className="text-muted-foreground">{module.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="outline">{module.lessons.length} bài học</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lessons Trong Module</h2>
          <p className="text-muted-foreground mt-1">Quản lý nội dung bài học</p>
        </div>
        <LessonCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </div>

      <div className="space-y-3">
        {module.lessons.map((lesson) => (
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

      <LessonEditDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} lesson={selectedLesson} />
      <LessonDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} lesson={selectedLesson} onConfirm={confirmDelete} />
    </div>
  )
}
