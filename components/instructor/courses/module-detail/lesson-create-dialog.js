"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { lessonSchema } from "@/schema/course"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { createLesson } from "@/lib/api/course"

export default function LessonCreateDialog({
  open,
  onOpenChange,
  moduleId,
  onCreateSuccess,
}) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      kind: "VIDEO",
      estimatedMin: 10,
      position: undefined,
      isFree: false,
      content: { body: "" },
      mediaId: "",
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const payload = {
        title: data.title.trim(),
        kind: data.kind,
        estimatedMin: data.estimatedMin,
        position: data.position,
        isFree: data.isFree,
        content: data.content,
        mediaId: data.mediaId || null,
      }

      const res = await createLesson(moduleId, payload)
      if (res.success) {
        toast.success("Tạo bài học thành công!")
        onCreateSuccess?.(res.data)
        onOpenChange(false)
      } else {
        toast.error(res.error || "Không thể tạo bài học")
      }
    } catch (err) {
      console.error("❌ Lỗi tạo bài học:", err)
      toast.error("Đã xảy ra lỗi khi tạo bài học")
    } finally {
      setLoading(false)
    }
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
          <DialogTitle>Tạo bài học mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Tiêu đề bài học *</Label>
            <Input id="title" placeholder="VD: Alphabet and Pronunciation" {...register("title")} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Kind */}
          <div>
            <Label>Phân loại bài học *</Label>
            <Select
              value={watch("kind")}
              onValueChange={(val) => setValue("kind", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại bài học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="TEXT">Bài viết</SelectItem>
                <SelectItem value="QUIZ">Trắc nghiệm</SelectItem>
              </SelectContent>
            </Select>
            {errors.kind && <p className="text-red-500 text-sm mt-1">{errors.kind.message}</p>}
          </div>

          {/* Estimated Duration */}
          <div>
            <Label htmlFor="estimatedMin">Thời lượng dự kiến (phút) *</Label>
            <Input
              id="estimatedMin"
              type="number"
              min="1"
              {...register("estimatedMin", { valueAsNumber: true })}
            />
            {errors.estimatedMin && (
              <p className="text-red-500 text-sm mt-1">{errors.estimatedMin.message}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="position">Thứ tự (tùy chọn)</Label>
            <Input
              id="position"
              type="number"
              placeholder="VD: 1"
              min="1"
              {...register("position", { valueAsNumber: true })}
            />
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
            )}
          </div>

          {/* Is Free */}
          <div className="flex items-center gap-2">
            <input
              id="isFree"
              type="checkbox"
              {...register("isFree")}
            />
            <Label htmlFor="isFree">Miễn phí</Label>
            {errors.isFree && <p className="text-red-500 text-sm">{errors.isFree.message}</p>}
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Nội dung *</Label>
            <Input
              id="content"
              placeholder="Nhập nội dung mô tả ngắn hoặc đoạn văn HTML..."
              {...register("content.body")}
            />
            {errors.content?.body && (
              <p className="text-red-500 text-sm mt-1">{errors.content.body.message}</p>
            )}
          </div>

          {/* Media ID */}
          <div>
            <Label htmlFor="mediaId">Media ID (nếu có)</Label>
            <Input id="mediaId" placeholder="UUID của video / tài liệu" {...register("mediaId")} />
            {errors.mediaId && (
              <p className="text-red-500 text-sm mt-1">{errors.mediaId.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary"
          >
            {loading ? "Đang tạo..." : "Tạo Lesson"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
