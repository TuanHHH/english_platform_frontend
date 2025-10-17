"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FullPageLoader } from "@/components/ui/full-page-loader"

import LessonHeader from "@/components/instructor/courses/lesson-detail/lesson-header"
import LessonTabs from "@/components/instructor/courses/lesson-detail/lesson-tabs"
import LessonEditDialog from "@/components/instructor/courses/lesson-detail/lesson-edit-dialog"
import LessonContentDialog from "@/components/instructor/courses/lesson-detail/lesson-content-dialog"
import QuizEditDialog from "@/components/instructor/courses/lesson-detail/quiz-edit-dialog"

import { getLessonDetail } from "@/lib/api/course"

export default function LessonDetailPage() {
  const params = useParams()
  const { courseId, moduleId, lessonId } = params

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editContentDialogOpen, setEditContentDialogOpen] = useState(false)
  const [quizDialogOpen, setQuizDialogOpen] = useState(false)

  const equalsIgnoreCase = (a, b) => {
    return (
      typeof a === "string" &&
      typeof b === "string" &&
      a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0
    )
  }

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await getLessonDetail(moduleId, lessonId)
        setLesson(res.data)
      } catch (err) {
        console.error(err)
        toast.error("Không thể tải chi tiết bài học")
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [lessonId, moduleId])

  if (loading) return <FullPageLoader />
  if (!lesson)
    return <p className="text-center text-muted-foreground">Không tìm thấy bài học</p>

  const isQuizLesson = equalsIgnoreCase(lesson.kind, "quiz")

  return (
    <div className="space-y-6">
      <Link href={`/instructor/courses/${courseId}/modules/${moduleId}`}>
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </Link>

      <LessonHeader lesson={lesson} onEdit={() => setEditDialogOpen(true)} />

      <Card className="shadow-elegant">
        <CardContent className="p-6">
          {!isQuizLesson ? (
            <LessonTabs
              lesson={lesson}
              onEditContent={() => setEditContentDialogOpen(true)}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Quiz: {lesson.title}</h2>
                <Button onClick={() => setQuizDialogOpen(true)}>Chỉnh sửa Quiz</Button>
              </div>

              {lesson.content?.quizItems?.length > 0 ? (
                <ul className="space-y-3">
                  {lesson.content.quizItems.map((q, idx) => (
                    <li
                      key={idx}
                      className="border rounded-lg p-4 hover:bg-muted/40 transition"
                    >
                      <p className="font-medium">
                        {idx + 1}. {q.question}
                      </p>
                      <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className={
                              i === q.correctAnswer
                                ? "text-green-600 font-semibold"
                                : ""
                            }
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Chưa có câu hỏi nào</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <LessonEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        lesson={lesson}
        onUpdated={setLesson}
      />

      <LessonContentDialog
        open={editContentDialogOpen}
        onOpenChange={setEditContentDialogOpen}
        lesson={lesson}
        onUpdated={setLesson}
      />

      <QuizEditDialog
        open={quizDialogOpen}
        onOpenChange={setQuizDialogOpen}
        lesson={lesson}
        onUpdated={setLesson}
      />
    </div>
  )
}
