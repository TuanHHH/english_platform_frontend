"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Editor from "@/components/common/editor"

export default function LessonEditDialog({ open, onOpenChange, lesson }) {
  const contentRef = useRef(lesson?.content || "")

  if (!lesson) return null

  const handleContentChange = (newContent) => {
    contentRef.current = newContent
  }

  const handleUpdate = () => {
    // TODO: Save content to backend along with contentRef.current
    console.log("Updated content:", contentRef.current)
    toast.success(`Đã cập nhật lesson "${lesson.title}"`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Lesson</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editTitle">Tiêu Đề Lesson</Label>
            <Input id="editTitle" defaultValue={lesson.title} />
          </div>
          <div>
            <Label htmlFor="editDuration">Thời Lượng</Label>
            <Input id="editDuration" defaultValue={lesson.duration} />
          </div>
          <div>
            <Label>Nội Dung Lesson</Label>
            <Editor
              initialContent={lesson.content || ""}
              onContentChange={handleContentChange}
            />
          </div>
          <Button className="w-full bg-gradient-primary" onClick={handleUpdate}>
            Cập Nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
