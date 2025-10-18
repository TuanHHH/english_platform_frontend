"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FullPageLoader } from "@/components/ui/full-page-loader"

import LessonHeader from "@/components/instructor/courses/lesson-detail/lesson-header"
import LessonTabs from "@/components/instructor/courses/lesson-detail/lesson-tabs"
import LessonContentDialog from "@/components/instructor/courses/lesson-detail/lesson-content-dialog"
import QuizEditDialog from "@/components/instructor/courses/lesson-detail/quiz-edit-dialog"

import { getLessonDetail, updateLesson } from "@/lib/api/course"

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { courseId, moduleId, lessonId } = params

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const handleVideoUploaded = async (mediaId) => {
    try {
      // Build full lesson payload with existing data
      const payload = {
        title: lesson.title,
        kind: lesson.kind,
        estimatedMin: lesson.estimatedMin,
        position: lesson.position,
        isFree: lesson.isFree,
        content: lesson.content,
        mediaId: mediaId,
      }

      const updateResult = await updateLesson(moduleId, lessonId, payload)

      if (!updateResult.success) {
        toast.error(updateResult.error || "Không thể cập nhật video cho bài học")
        return
      }

      // Refresh lesson data
      const res = await getLessonDetail(moduleId, lessonId)
      if (res.success) {
        setLesson(res.data)
        toast.success("Video đã được cập nhật cho bài học")
      }
    } catch (err) {
      console.error("Error updating lesson with media:", err)
      toast.error("Đã xảy ra lỗi khi cập nhật bài học")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href={`/instructor/courses/${courseId}/modules/${moduleId}`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
      </div>

      <LessonHeader lesson={lesson} />

      <Card className="shadow-elegant">
        <CardContent className="p-6">
          {!isQuizLesson ? (
            <LessonTabs
              lesson={lesson}
              onEditContent={() => setEditContentDialogOpen(true)}
              onVideoUploaded={handleVideoUploaded}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Quiz: {lesson.title}</h2>
                <Button onClick={() => setQuizDialogOpen(true)}>Chỉnh sửa Quiz</Button>
              </div>

              {lesson.content?.body?.questions?.length > 0 ? (
                <ul className="space-y-3">
                  {lesson.content.body.questions.map((q, idx) => (
                    <li
                      key={idx}
                      className="border rounded-lg p-4 hover:bg-muted/40 transition"
                    >
                      <p className="font-medium">
                        {idx + 1}. {q.question}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className={
                              i === q.answer
                                ? "bg-green-50 border border-green-500 rounded px-3 py-1.5 text-sm"
                                : "px-3 py-1.5 text-sm text-muted-foreground"
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
