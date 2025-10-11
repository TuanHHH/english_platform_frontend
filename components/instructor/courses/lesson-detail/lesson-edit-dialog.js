"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LessonEditDialog({ open, onOpenChange, lesson }) {
  if (!lesson) return null

  const handleUpdate = () => {
    toast.success(`Đã cập nhật lesson "${lesson.title}"`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
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
          <Button className="w-full bg-gradient-primary" onClick={handleUpdate}>
            Cập Nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
