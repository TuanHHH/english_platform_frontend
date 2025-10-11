"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import LessonHeader from "@/components/instructor/courses/lesson-detail/lesson-header"
import LessonTabs from "@/components/instructor/courses/lesson-detail/lesson-tabs"
import LessonEditDialog from "@/components/instructor/courses/lesson-detail/lesson-edit-dialog"
import LessonContentDialog from "@/components/instructor/courses/lesson-detail/lesson-content-dialog"
import QuestionDeleteDialog from "@/components/instructor/courses/lesson-detail/question-delete-dialog"

const mockLessonDetail = {
  id: 1,
  moduleId: 1,
  courseId: 1,
  courseTitle: "English for Beginners",
  moduleTitle: "Introduction to English",
  title: "Alphabet and Pronunciation",
  order: 1,
  type: "video",
  duration: "15 phút",
  status: "published",
  videoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  textContent:
    "In this lesson, you will learn the English alphabet and basic pronunciation rules. Pay attention to vowel sounds and consonant combinations.",
  quiz: [
    {
      id: 1,
      question: "How many letters are in the English alphabet?",
      options: ["24", "26", "28", "30"],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Which of these is a vowel?",
      options: ["B", "C", "E", "F"],
      correctAnswer: 2,
    },
  ],
}

export default function LessonDetailPage() {
  const params = useParams()
  const { courseId, moduleId } = params
  const lesson = mockLessonDetail

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editContentDialogOpen, setEditContentDialogOpen] = useState(false)
  const [deleteQuestionDialogOpen, setDeleteQuestionDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  const handleDeleteQuestion = (question) => {
    setSelectedQuestion(question)
    setDeleteQuestionDialogOpen(true)
  }

  const confirmDeleteQuestion = () => {
    toast.success("Đã xóa câu hỏi khỏi quiz")
    setDeleteQuestionDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <Link href={`/instructor/courses/${courseId}/modules/${moduleId}`}>
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Về Module: {lesson.moduleTitle}
        </Button>
      </Link>

      <LessonHeader lesson={lesson} onEdit={() => setEditDialogOpen(true)} />

      <Card className="shadow-elegant">
        <CardContent className="p-6">
          <LessonTabs
            lesson={lesson}
            onEditContent={() => setEditContentDialogOpen(true)}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </CardContent>
      </Card>

      <LessonEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        lesson={lesson}
      />

      <LessonContentDialog
        open={editContentDialogOpen}
        onOpenChange={setEditContentDialogOpen}
        lesson={lesson}
      />

      <QuestionDeleteDialog
        open={deleteQuestionDialogOpen}
        onOpenChange={setDeleteQuestionDialogOpen}
        onConfirm={confirmDeleteQuestion}
      />
    </div>
  )
}
