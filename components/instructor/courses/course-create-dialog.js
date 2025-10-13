"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export default function CourseCreateDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Tạo khóa học mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo khóa học mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-1" htmlFor="courseTitle">Tiêu đề khóa học</Label>
            <Input id="courseTitle" placeholder="VD: English for Beginners" />
          </div>
          <div>
            <Label className="mb-1" htmlFor="courseDescription">Mô tả</Label>
            <Textarea id="courseDescription" placeholder="Mô tả ngắn..." rows={4} />
          </div>
          <div>
            <Label className="mb-1" htmlFor="thumbnail">Ảnh Thumbnail</Label>
            <Input id="thumbnail" placeholder="https://..." />
          </div>
          <Button className="w-full bg-gradient-primary">Tạo khóa học</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
