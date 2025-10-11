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
          Tạo Khóa Học Mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Khóa Học Mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="courseTitle">Tiêu Đề Khóa Học</Label>
            <Input id="courseTitle" placeholder="VD: English for Beginners" />
          </div>
          <div>
            <Label htmlFor="courseDescription">Mô Tả</Label>
            <Textarea id="courseDescription" placeholder="Mô tả ngắn..." rows={4} />
          </div>
          <div>
            <Label htmlFor="thumbnail">URL Ảnh Thumbnail</Label>
            <Input id="thumbnail" placeholder="https://..." />
          </div>
          <Button className="w-full bg-gradient-primary">Tạo Khóa Học</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
