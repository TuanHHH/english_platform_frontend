"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function LessonContentDialog({ open, onOpenChange, lesson }) {
  if (!lesson) return null

  const handleUpdate = () => {
    toast.success("Nội dung bài học đã được cập nhật")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Nội Dung</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {lesson.type === "video" && (
            <div>
              <Label htmlFor="videoUrl">URL Video</Label>
              <Input id="videoUrl" defaultValue={lesson.videoUrl} placeholder="https://..." />
            </div>
          )}
          {lesson.type === "text" && (
            <div>
              <Label htmlFor="textContent">Nội Dung</Label>
              <Textarea id="textContent" defaultValue={lesson.textContent} rows={8} />
            </div>
          )}
          <Button className="w-full bg-gradient-primary" onClick={handleUpdate}>
            Cập Nhật Nội Dung
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
