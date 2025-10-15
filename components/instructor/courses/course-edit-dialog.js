"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { toast } from "sonner"
import { courseSchema } from "@/schema/course"
import { updateCourse } from "@/lib/api/course"

const SKILL_OPTIONS = ["Listening", "Reading", "Writing", "Speaking", "Grammar", "Vocabulary"]

export default function CourseEditDialog({ open, onOpenChange, course, onSuccess }) {
  if (!course) return null

  const [selectedSkills, setSelectedSkills] = useState([]) 
  const [customSkills, setCustomSkills] = useState([])    
  const [customInput, setCustomInput] = useState("")
  const customInputRef = useRef(null)

  // --- RHF ---
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title || "",
      description: course.description || "",
      language: course.language || "",
      thumbnail: course.thumbnail || "",
      skillFocus: Array.isArray(course.skillFocus) ? course.skillFocus : [],
      priceCents:
        typeof course.priceCents === "number" ? String(course.priceCents) : (course.priceCents ?? ""),
      currency: (course.currency || "VND"),
    },
  })

  // --- tách skillFocus của course thành preset & custom (1 lần / khi course đổi) ---
  useEffect(() => {
    const initial = Array.isArray(course.skillFocus) ? course.skillFocus : []
    const lowerSet = new Set(initial.map((s) => s.trim().toLocaleLowerCase()))
    const preset = SKILL_OPTIONS.filter((s) => lowerSet.has(s.toLocaleLowerCase()))
    const custom = initial.filter(
      (s) => !SKILL_OPTIONS.map((x) => x.toLocaleLowerCase()).includes(s.trim().toLocaleLowerCase())
    )
    setSelectedSkills(preset)
    setCustomSkills(custom)
    reset({
      title: course.title || "",
      description: course.description || "",
      language: course.language || "",
      thumbnail: course.thumbnail || "",
      skillFocus: initial,
      priceCents:
        typeof course.priceCents === "number" ? String(course.priceCents) : (course.priceCents ?? ""),
      currency: (course.currency || "VND"),
    })
  }, [course, reset])

  // --- helpers/validators cho skill (KHÔNG phân biệt hoa/thường) ---
  const toKey = (s) => s.trim().toLocaleLowerCase()
  const allSkills = useMemo(() => [...selectedSkills, ...customSkills], [selectedSkills, customSkills])
  const allLower = useMemo(() => allSkills.map(toKey), [allSkills])
  const selectedLower = useMemo(() => selectedSkills.map(toKey), [selectedSkills])
  const customLower = useMemo(() => customSkills.map(toKey), [customSkills])

  const existsInSelected = (name) => selectedLower.includes(toKey(name))
  const existsInCustom = (name) => customLower.includes(toKey(name))
  const existsInAll = (name) => existsInSelected(name) || existsInCustom(name)

  // --- sync mảng skillFocus vào RHF ---
  useEffect(() => {
    setValue("skillFocus", allSkills, { shouldValidate: true, shouldDirty: true })
    if (allSkills.length > 0) clearErrors("skillFocus")
  }, [allSkills, setValue, clearErrors])

  // --- hành vi UI ---
  const toggleSkill = (skill) => {
    if (existsInCustom(skill)) {
      toast.error(`"${skill}" đã tồn tại trong kỹ năng tự nhập`)
      return
    }
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
    clearErrors("skillFocus")
  }

  const addCustomSkill = () => {
    const raw = customInput.trim()
    if (!raw) return
    if (existsInAll(raw)) {
      toast.error(`Kỹ năng "${raw}" đã tồn tại (không phân biệt hoa/thường)`)
      return
    }
    setCustomSkills((prev) => [...prev, raw])
    setCustomInput("")
    customInputRef.current?.focus()
    clearErrors("skillFocus")
  }

  const handleCustomKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addCustomSkill()
    }
  }

  const removeSkill = (skill) => {
    const key = toKey(skill)
    if (customLower.includes(key)) {
      setCustomSkills((p) => p.filter((s) => toKey(s) !== key))
    } else if (selectedLower.includes(key)) {
      setSelectedSkills((p) => p.filter((s) => toKey(s) !== key))
    }
  }

  // --- submit với optimistic update ---
  const onSubmit = async (data) => {
    try {
      // Validation
      if (allSkills.length === 0) {
        setError("skillFocus", { type: "manual", message: "Vui lòng chọn hoặc nhập ít nhất 1 kỹ năng" })
        toast.error("Cần ít nhất 1 kỹ năng")
        return
      }
      if (new Set(allLower).size !== allLower.length) {
        setError("skillFocus", { type: "manual", message: "Danh sách kỹ năng bị trùng (không phân biệt hoa/thường)" })
        toast.error("Danh sách kỹ năng đang bị trùng")
        return
      }

      const payload = {
        ...data,
        priceCents: Number(data.priceCents || 0),
        currency: (data.currency || "VND").toUpperCase(),
      }

      // Gọi API cập nhật
      const response = await updateCourse(course.id, payload)
      const updatedCourse = response?.data?.result || response?.data

      // Đóng dialog
      onOpenChange(false)

      // Hiển thị toast thành công
      toast.success("Đã cập nhật khóa học")

      // Truyền course đã cập nhật về parent
      if (onSuccess && updatedCourse) {
        onSuccess(updatedCourse)
      }
    } catch (err) {
      console.error("Lỗi cập nhật khóa học:", err)
      toast.error(err?.message || "Không thể cập nhật khóa học")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa khóa học</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="editCourseTitle" className="mb-2">Tiêu đề *</Label>
            <Input id="editCourseTitle" placeholder="VD: English for Beginners" {...register("title")} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="editCourseDescription" className="mb-2">Mô tả</Label>
            <Textarea id="editCourseDescription" rows={4} placeholder="Mô tả ngắn..." {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="editLanguage" className="mb-2">Ngôn ngữ *</Label>
            <Input id="editLanguage" placeholder="VD: en, vi" {...register("language")} />
            {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>}
          </div>

          <div>
            <Label htmlFor="editThumbnail" className="mb-2">URL Ảnh Thumbnail</Label>
            <Input id="editThumbnail" placeholder="https://..." {...register("thumbnail")} />
            {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>}
          </div>

          {/* Skill Focus */}
          <div>
            <Label>Kỹ năng trọng tâm</Label>

            {/* preset skills */}
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
                  >
                    {skill}
                  </button>
                )
              })}
            </div>

            {/* custom add */}
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

            {/* pills */}
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

            {errors.skillFocus && <p className="text-red-500 text-sm mt-1">{errors.skillFocus.message}</p>}
          </div>

          {/* Price + Currency */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="editPrice" className="mb-2">Giá (VNĐ)</Label>
              <Input id="editPrice" type="number" min="0" {...register("priceCents")} />
              {errors.priceCents && <p className="text-red-500 text-sm mt-1">{errors.priceCents.message}</p>}
            </div>
            <div className="w-32">
              <Label htmlFor="editCurrency" className="mb-2">Tiền tệ</Label>
              <Input id="editCurrency" {...register("currency")} />
              {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-primary">
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật khóa học"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}