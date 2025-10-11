"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CourseEditDialog({ open, onOpenChange, course }) {
  if (!course) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Khóa Học</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editCourseTitle">Tiêu Đề Khóa Học</Label>
            <Input id="editCourseTitle" defaultValue={course.title} />
          </div>
          <div>
            <Label htmlFor="editCourseDescription">Mô Tả</Label>
            <Textarea id="editCourseDescription" defaultValue={course.description} rows={4} />
          </div>
          <div>
            <Label htmlFor="editThumbnail">URL Ảnh Thumbnail</Label>
            <Input id="editThumbnail" defaultValue={course.thumbnail} />
          </div>
          <Button className="w-full bg-gradient-primary">Cập Nhật Khóa Học</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
