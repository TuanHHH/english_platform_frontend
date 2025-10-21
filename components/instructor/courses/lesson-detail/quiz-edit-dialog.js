"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateLesson } from "@/lib/api/lesson"

export default function QuizEditDialog({ open, onOpenChange, lesson, onUpdated }) {
  const { moduleId, lessonId } = useParams()
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])

  // Initialize questions from lesson data when dialog opens
  useEffect(() => {
    if (open && lesson?.content?.body?.questions) {
      setQuestions(lesson.content.body.questions)
    }
  }, [open, lesson])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", ""], answer: 0 },
    ])
  }

  const updateQuestion = (idx, field, value) => {
    const newQuestions = [...questions]
    newQuestions[idx][field] = value
    setQuestions(newQuestions)
  }

  const updateOption = (qIdx, oIdx, value) => {
    const newQuestions = [...questions]
    newQuestions[qIdx].options[oIdx] = value
    setQuestions(newQuestions)
  }

  const addOption = (qIdx) => {
    const newQuestions = [...questions]
    newQuestions[qIdx].options.push("")
    setQuestions(newQuestions)
  }

  const removeOption = (qIdx, oIdx) => {
    const newQuestions = [...questions]
    if (newQuestions[qIdx].options.length > 2) {
      newQuestions[qIdx].options.splice(oIdx, 1)
      // Adjust answer index if necessary
      if (newQuestions[qIdx].answer >= newQuestions[qIdx].options.length) {
        newQuestions[qIdx].answer = newQuestions[qIdx].options.length - 1
      }
      setQuestions(newQuestions)
    }
  }

  const saveQuiz = async () => {
    setLoading(true)
    try {
      const payload = {
        title: lesson.title,
        kind: lesson.kind,
        estimatedMin: lesson.estimatedMin,
        position: lesson.position,
        isFree: lesson.isFree,
        content: {
          type: "quiz",
          body: {
            questions: questions
          }
        },
        mediaId: lesson.primaryMediaId || null,
      }

      const res = await updateLesson(moduleId, lessonId, payload)
      if (res.success) {
        toast.success("Cập nhật quiz thành công")
        onUpdated(res.data)
        onOpenChange(false)
      } else {
        toast.error(res.error || "Không thể cập nhật quiz")
      }
    } catch (err) {
      console.error(err)
      toast.error("Đã xảy ra lỗi khi cập nhật quiz")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Quiz: {lesson.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <Label>Câu hỏi {qIdx + 1}</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                >
                  Xóa
                </Button>
              </div>
              <Textarea
                value={q.question}
                onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                placeholder="Nhập nội dung câu hỏi"
              />
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                      placeholder={`Lựa chọn ${oIdx + 1}`}
                    />
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.answer === oIdx}
                      onChange={() => updateQuestion(qIdx, "answer", oIdx)}
                      className="cursor-pointer"
                    />
                    {q.options.length > 2 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeOption(qIdx, oIdx)}
                      >
                        X
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addOption(qIdx)}
                  className="w-full"
                >
                  + Thêm lựa chọn
                </Button>
              </div>
            </div>
          ))}

          <Button onClick={addQuestion} variant="outline" className="w-full">
            + Thêm câu hỏi
          </Button>
        </div>

        <DialogFooter>
          <Button onClick={saveQuiz} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
