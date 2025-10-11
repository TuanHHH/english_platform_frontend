"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export default function LessonCreateDialog({ open, onOpenChange }) {
  const handleCreate = () => {
    toast.success("Lesson mới đã được tạo")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Thêm Lesson Mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Lesson Mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu Đề Lesson</Label>
            <Input id="title" placeholder="VD: Alphabet and Pronunciation" />
          </div>
          <div>
            <Label htmlFor="type">Loại Lesson</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại lesson" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="duration">Thời Lượng (phút)</Label>
            <Input id="duration" type="number" placeholder="15" />
          </div>
          <Button className="w-full bg-gradient-primary" onClick={handleCreate}>
            Tạo Lesson
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
