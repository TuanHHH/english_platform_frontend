"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateCourseModule } from "@/lib/api/course"

export default function ModuleEditDialog({ open, onOpenChange, module, courseId, onUpdateSuccess }) {
  const [title, setTitle] = useState("")
  const [position, setPosition] = useState("")
  const [loading, setLoading] = useState(false)

  // Reset field khi mở dialog
  useEffect(() => {
    if (module) {
      setTitle(module.title || "")
      setPosition(module.order?.toString() || "")
    }
  }, [module])

  if (!module) return null

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề module")
      return
    }

    setLoading(true)
    try {
      const payload = {
        id: module.id,
        title: title.trim(),
        position: position ? Number(position) : module.order,
      }
      const res = await updateCourseModule(courseId, payload)
      if (res.success) {
        // Optimistic update
        onUpdateSuccess?.({
          ...module,
          title: res.data?.title ?? title,
          position: res.data?.position ?? payload.position,
          lessonCount: module.lessonCount ?? 0,
        })
        onOpenChange(false)
      } else {
        toast.error(res.error || "Không thể cập nhật module")
      }
    } catch (err) {
      console.error(err)
      toast.error("Lỗi khi cập nhật module")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa module</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="editTitle" className="mb-1">
              Tiêu đề module
            </Label>
            <Input
              id="editTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="editPosition" className="mb-1">
              Số thứ tự
            </Label>
            <Input
              id="editPosition"
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            className="w-full bg-gradient-primary"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Cập nhật module"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
