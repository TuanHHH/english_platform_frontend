"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { courseSchema } from "@/schema/course"
import { createCourse, uploadMedia } from "@/lib/api/course"

import BasicInfoSection from "@/components/instructor/courses/course-create/basic-info-section"
import ThumbnailUploadSection from "@/components/instructor/courses/course-create/thumbnail-upload-section"
import SkillFocusSection from "@/components/instructor/courses/course-create/skill-focus-section"
import PricingSection from "@/components/instructor/courses/course-create/pricing-section"

export default function CreateCoursePage() {
  const router = useRouter()

  // skills chọn từ preset và skills tự nhập
  const [selectedSkills, setSelectedSkills] = useState([])
  const [customSkills, setCustomSkills] = useState([])

  // input tạm cho custom
  const [customInput, setCustomInput] = useState("")
  const customInputRef = useRef(null)

  // Image upload states
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Detailed description state
  const [detailedDescription, setDetailedDescription] = useState("")

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      detailedDescription: "",
      language: "",
      thumbnail: "",
      priceCents: "",
      currency: "VND",
    },
  })

  const { register, handleSubmit, setValue, formState, setError, clearErrors } = form
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

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB")
      return
    }

    setThumbnailFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnailPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle remove image
  const handleRemoveImage = () => {
    setThumbnailFile(null)
    setThumbnailPreview("")
    setValue("thumbnail", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle upload image
  const handleUploadImage = async () => {
    if (!thumbnailFile) return

    setUploading(true)
    try {
      const res = await uploadMedia(thumbnailFile, "course_thumbnail")
      if (res.success && res.data?.url) {
        setValue("thumbnail", res.data.url)
        toast.success("Tải ảnh lên thành công!")
        return res.data.url
      } else {
        toast.error(res.error || "Không thể tải ảnh lên")
        return null
      }
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Đã xảy ra lỗi khi tải ảnh")
      return null
    } finally {
      setUploading(false)
    }
  }

  // Đồng bộ skillFocus (mảng) vào RHF để schema có thể validate
  useEffect(() => {
    setValue("skillFocus", allSkills, { shouldValidate: false })
    if (allSkills.length > 0) clearErrors("skillFocus")
  }, [allSkills, setValue, clearErrors])

  // Sync detailed description with form
  useEffect(() => {
    setValue("detailedDescription", detailedDescription, { shouldValidate: false })
  }, [detailedDescription, setValue])

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

      // Upload image if file is selected
      let thumbnailUrl = data.thumbnail
      if (thumbnailFile && !uploading) {
        const uploadedUrl = await handleUploadImage()
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl
        } else {
          toast.error("Vui lòng thử tải ảnh lên lại")
          return
        }
      }

      const payload = {
        ...data,
        thumbnail: thumbnailUrl,
        detailedDescription: detailedDescription || null,
        skillFocus: allSkills,
        priceCents: Number(data.priceCents || 0),
        currency: (data.currency || "VND").toUpperCase(),
      }

      const res = await createCourse(payload)
      const newCourse = res?.data?.result || res?.data

      toast.success("Đã tạo khóa học mới!")

      // Navigate to courses list or course detail
      if (newCourse?.id) {
        router.push(`/instructor/courses/${newCourse.id}`)
      } else {
        router.push("/instructor/courses")
      }
    } catch (err) {
      console.error("Lỗi tạo khóa học:", err)
      toast.error(err?.message || "Không thể tạo khóa học")
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Tạo khóa học mới</h1>
      </div>

      {/* FORM CHÍNH */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection
          register={register}
          errors={errors}
          detailedDescription={detailedDescription}
          setDetailedDescription={setDetailedDescription}
        />

        <ThumbnailUploadSection
          thumbnailPreview={thumbnailPreview}
          thumbnailFile={thumbnailFile}
          uploading={uploading}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          handleRemoveImage={handleRemoveImage}
          handleUploadImage={handleUploadImage}
          errors={errors}
        />

        <SkillFocusSection
          selectedSkills={selectedSkills}
          customSkills={customSkills}
          customInput={customInput}
          customInputRef={customInputRef}
          setCustomInput={setCustomInput}
          toggleSkill={toggleSkill}
          addCustomSkill={addCustomSkill}
          handleCustomKeyDown={handleCustomKeyDown}
          removeSkill={removeSkill}
          toKey={toKey}
          register={register}
          errors={errors}
        />

        <PricingSection
          register={register}
          errors={errors}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-primary"
          >
            {isSubmitting ? "Đang tạo..." : "Tạo khóa học"}
          </Button>
        </div>
      </form>
    </div>
  )
}
