"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function QuizEditDialog({ open, onOpenChange, lesson, onUpdated }) {
  const [quizItems, setQuizItems] = useState(lesson.content?.quizItems || [])

  const addQuestion = () => {
    setQuizItems([
      ...quizItems,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ])
  }

  const updateQuestion = (idx, field, value) => {
    const newItems = [...quizItems]
    newItems[idx][field] = value
    setQuizItems(newItems)
  }

  const updateOption = (qIdx, oIdx, value) => {
    const newItems = [...quizItems]
    newItems[qIdx].options[oIdx] = value
    setQuizItems(newItems)
  }

  const saveQuiz = async () => {
    try {
      // TODO: call API update lesson content
      onUpdated({ ...lesson, content: { quizItems } })
      toast.success("Cập nhật quiz thành công")
      onOpenChange(false)
    } catch {
      toast.error("Lỗi khi lưu quiz")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Quiz: {lesson.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {quizItems.map((q, qIdx) => (
            <div key={qIdx} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <Label>Câu hỏi {qIdx + 1}</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setQuizItems(quizItems.filter((_, i) => i !== qIdx))}
                >
                  Xóa
                </Button>
              </div>
              <Textarea
                value={q.question}
                onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                placeholder="Nhập nội dung câu hỏi"
              />
              <div className="grid grid-cols-2 gap-2">
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
                      checked={q.correctAnswer === oIdx}
                      onChange={() => updateQuestion(qIdx, "correctAnswer", oIdx)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button onClick={addQuestion} variant="outline" className="w-full">
            + Thêm câu hỏi
          </Button>
        </div>

        <DialogFooter>
          <Button onClick={saveQuiz}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
