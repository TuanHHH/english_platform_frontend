"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Editor from "@/components/common/editor"

export default function LessonContentDialog({ open, onOpenChange, lesson }) {
  console.log(lesson)

  // Extract HTML content from lesson structure (without title)
  const getInitialContent = () => {
    if (lesson?.content?.body) {
      // Combine intro and sections HTML
      let htmlContent = ""
      if (lesson.content.body.intro) {
        htmlContent += `<p>${lesson.content.body.intro}</p>`
      }
      if (lesson.content.body.sections) {
        lesson.content.body.sections.forEach(section => {
          if (section.html) {
            htmlContent += section.html
          }
        })
      }
      return htmlContent
    }
    return lesson?.content || lesson?.textContent || ""
  }

  const [title, setTitle] = useState(lesson?.title || "")
  const contentRef = useRef(getInitialContent())

  if (!lesson) return null

  const handleContentChange = (newContent) => {
    contentRef.current = newContent
  }

  const handleUpdate = () => {
    // TODO: Save content to backend along with contentRef.current and title
    console.log("Updated title:", title)
    console.log("Updated content:", contentRef.current)
    toast.success("Nội dung bài học đã được cập nhật")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl h-[90vh] flex flex-col w-full p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Chỉnh sửa nội dung</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-shrink-0">
            <Label htmlFor="lessonTitle">Tiêu Đề</Label>
            <Input
              id="lessonTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài học"
              className="mt-1"
            />
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <Label className="flex-shrink-0 mb-2">Nội Dung</Label>
            <div className="flex-1 overflow-auto min-h-0">
              <Editor
                initialContent={getInitialContent()}
                onContentChange={handleContentChange}
              />
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 pt-4">
          <Button className="w-full bg-gradient-primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
