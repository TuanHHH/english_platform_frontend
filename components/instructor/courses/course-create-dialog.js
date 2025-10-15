"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import { courseSchema } from "@/schema/course"
import { createCourse } from "@/lib/api/course"

const SKILL_OPTIONS = ["Listening", "Reading", "Writing", "Speaking", "Grammar", "Vocabulary"]

export default function CourseCreateDialog({ open, onOpenChange, onSuccess }) {
  // skills chọn từ preset và skills tự nhập
  const [selectedSkills, setSelectedSkills] = useState([])
  const [customSkills, setCustomSkills] = useState([])

  // input tạm cho custom
  const [customInput, setCustomInput] = useState("")
  const customInputRef = useRef(null)

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      language: "",
      thumbnail: "",
      // skillFocus set = mảng allSkills
      priceCents: "",
      currency: "VND",
    },
  })

  const { register, handleSubmit, setValue, reset, formState, setError, clearErrors } = form
  const { errors, isSubmitting } = formState

  // Tổng các skill đã chọn (preset trước, custom sau)
  const allSkills = useMemo(() => [...selectedSkills, ...customSkills], [selectedSkills, customSkills])

  // Chuyển về mảng chữ thường để so sánh không phân biệt hoa/thường
  const toKey = (s) => s.toLocaleLowerCase()
  const selectedLower = useMemo(() => selectedSkills.map(toKey), [selectedSkills])
  const customLower = useMemo(() => customSkills.map(toKey), [customSkills])
  const allLower = useMemo(() => allSkills.map(toKey), [allSkills])

  const existsInSelected = (name) => selectedLower.includes(toKey(name))
  const existsInCustom = (name) => customLower.includes(toKey(name))
  const existsInAll = (name) => existsInSelected(name) || existsInCustom(name)

  // Toggle skill preset
  const toggleSkill = (skill) => {
    // Nếu custom đang có skill trùng (case-insensitive) → chặn
    if (existsInCustom(skill)) {
      toast.error(`"${skill}" đã tồn tại trong danh sách kỹ năng tự nhập`)
      return
    }
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
    clearErrors("skillFocus")
  }

  // Thêm custom skill
  const addCustomSkill = () => {
    const raw = customInput.trim()
    if (!raw) return
    if (existsInAll(raw)) {
      toast.error(`Kỹ năng "${raw}" đã tồn tại`)
      return
    }
    setCustomSkills((prev) => [...prev, raw])
    setCustomInput("")
    customInputRef.current?.focus()
    clearErrors("skillFocus")
  }

  // Enter để thêm custom, không submit form chính
  const handleCustomKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addCustomSkill()
    }
  }

  // Xóa skill (ưu tiên xóa custom, nếu không có thì xóa ở selected)
  const removeSkill = (skill) => {
    const key = toKey(skill)
    if (customLower.includes(key)) {
      setCustomSkills((prev) => prev.filter((s) => toKey(s) !== key))
    } else if (selectedLower.includes(key)) {
      setSelectedSkills((prev) => prev.filter((s) => toKey(s) !== key))
    }
  }

  // Đồng bộ skillFocus (mảng) vào RHF để schema có thể validate
  useEffect(() => {
    setValue("skillFocus", allSkills, { shouldValidate: false })
    if (allSkills.length > 0) clearErrors("skillFocus")
  }, [allSkills, setValue, clearErrors])

  const onSubmit = async (data) => {
    try {
      if (allSkills.length === 0) {
        setError("skillFocus", { type: "manual", message: "Vui lòng chọn hoặc nhập ít nhất 1 kỹ năng" })
        toast.error("Cần ít nhất 1 kỹ năng")
        return
      }
      // Double-check (case-insensitive)
      const uniqueCount = new Set(allLower).size
      if (uniqueCount !== allSkills.length) {
        setError("skillFocus", { type: "manual", message: "Danh sách kỹ năng đang bị trùng (không phân biệt hoa/thường)" })
        toast.error("Danh sách kỹ năng đang bị trùng")
        return
      }

      const payload = {
        ...data,
        skillFocus: allSkills, 
        priceCents: Number(data.priceCents || 0),
        currency: (data.currency || "VND").toUpperCase(),
      }

      const res = await createCourse(payload)
      const newCourse = res?.data?.result || res?.data

      // Reset
      reset()
      setSelectedSkills([])
      setCustomSkills([])
      setCustomInput("")
      onOpenChange(false)
      toast.success("Đã tạo khóa học mới!")

      if (onSuccess && newCourse) onSuccess(newCourse)
    } catch (err) {
      console.error("Lỗi tạo khóa học:", err)
      toast.error(err?.message || "Không thể tạo khóa học")
    }
  }

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

        {/* FORM CHÍNH */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="mb-2">Tiêu đề *</Label>
            <Input id="title" placeholder="VD: English for Beginners" {...register("title")} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-2">Mô tả</Label>
            <Textarea id="description" placeholder="Mô tả ngắn..." rows={4} {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Language */}
          <div>
            <Label htmlFor="language" className="mb-2">Ngôn ngữ *</Label>
            <Input id="language" placeholder="VD: en, vi" {...register("language")} />
            {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>}
          </div>

          {/* Thumbnail */}
          <div>
            <Label htmlFor="thumbnail" className="mb-2">Ảnh Thumbnail</Label>
            <Input id="thumbnail" placeholder="https://..." {...register("thumbnail")} />
            {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>}
          </div>

          {/* Skill Focus */}
          <div>
            <Label>Kỹ năng trọng tâm</Label>

            {/* Chọn từ danh sách có sẵn */}
            <div className="flex flex-wrap gap-2 mt-2">
              {SKILL_OPTIONS.map((skill) => {
                const isSelected = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-background border-muted hover:bg-muted"
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`Toggle ${skill}`}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>

            {/* Ô thêm custom skill (không tạo form lồng) */}
            <div className="flex gap-2 mt-3">
              <Input
                ref={customInputRef}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                placeholder="Thêm kỹ năng khác..."
                aria-label="Thêm kỹ năng khác"
              />
              <Button type="button" variant="secondary" onClick={addCustomSkill}>
                Thêm
              </Button>
            </div>

            {/* Hiển thị tất cả skill đã chọn/nhập */}
            {allSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {allSkills.map((skill) => (
                  <span
                    key={`${skill}-${toKey(skill)}`}
                    className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                    <X
                      className="ml-1 w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    />
                  </span>
                ))}
              </div>
            )}

            {/* field ẩn để RHF hiểu có field skillFocus (mảng) */}
            <input type="hidden" {...register("skillFocus")} />

            {errors.skillFocus && (
              <p className="text-red-500 text-sm mt-1">{errors.skillFocus.message}</p>
            )}
          </div>

          {/* Price + Currency */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="priceCents" className="mb-2">Giá (VNĐ)</Label>
              <Input id="priceCents" type="number" min="0" {...register("priceCents")} />
              {errors.priceCents && <p className="text-red-500 text-sm mt-1">{errors.priceCents.message}</p>}
            </div>
            <div className="w-32">
              <Label htmlFor="currency" className="mb-2">Tiền tệ</Label>
              <Input id="currency" {...register("currency")} />
              {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-primary">
            {isSubmitting ? "Đang tạo..." : "Tạo khóa học"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
