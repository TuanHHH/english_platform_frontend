"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { createCourseModule } from "@/lib/api/course"

export default function ModuleCreateDialog({ open, onOpenChange, courseId, onCreateSuccess }) {
  const [title, setTitle] = useState("")
  const [position, setPosition] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề module")
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: title.trim(),
        position: position ? Number(position) : undefined,
      }

      const res = await createCourseModule(courseId, payload)
      if (res.success) {
        onCreateSuccess?.(res.data)
        setTitle("")
        setPosition("")
        onOpenChange(false)
      } else {
        toast.error(res.error || "Không thể tạo module")
      }
    } catch (err) {
      console.error(err)
      toast.error("Lỗi khi tạo module")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Thêm module mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo module mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-1">
              Tiêu đề module
            </Label>
            <Input
              id="title"
              placeholder="VD: Introduction to English"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="position" className="mb-1">
              Số thứ tự
            </Label>
            <Input
              id="position"
              type="number"
              placeholder="VD: 1"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button className="w-full bg-gradient-primary" onClick={handleCreate} disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo module"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
