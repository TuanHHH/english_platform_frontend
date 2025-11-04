"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { courseSchema } from "@/schema/course"
import { updateCourse, uploadMedia, getCourseById } from "@/lib/api/course"
import { FullPageLoader } from "@/components/ui/full-page-loader"

import BasicInfoSection from "@/components/instructor/courses/course-create/basic-info-section"
import ThumbnailUploadSection from "@/components/instructor/courses/course-create/thumbnail-upload-section"
import SkillFocusSection from "@/components/instructor/courses/course-create/skill-focus-section"
import PricingSection from "@/components/instructor/courses/course-create/pricing-section"

const SKILL_OPTIONS = ["Listening", "Reading", "Writing", "Speaking", "Grammar", "Vocabulary"]

export default function EditCoursePage() {
  const router = useRouter()
  const { courseId } = useParams()

  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)

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

  const { register, handleSubmit, setValue, reset, formState, setError, clearErrors } = form
  const { errors, isSubmitting } = formState

  // Fetch course data on mount
  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) return

      setLoading(true)
      try {
        const res = await getCourseById(courseId)
        if (res.success && res.data) {
          const courseData = res.data

          // Check if course is published
          if (courseData.published) {
            toast.error("Khóa học đã được xuất bản. Vui lòng hủy xuất bản trước khi chỉnh sửa")
            router.push(`/instructor/courses/${courseId}`)
            return
          }

          setCourse(courseData)

          // Set form values
          reset({
            title: courseData.title || "",
            description: courseData.description || "",
            detailedDescription: courseData.detailedDescription || "",
            language: courseData.language || "",
            thumbnail: courseData.thumbnail || "",
            priceCents: typeof courseData.priceCents === "number" ? String(courseData.priceCents) : (courseData.priceCents ?? ""),
            currency: courseData.currency || "VND",
          })

          // Set detailed description
          setDetailedDescription(courseData.detailedDescription || "")

          // Parse skills into preset and custom
          const initial = Array.isArray(courseData.skillFocus) ? courseData.skillFocus : []
          const lowerSet = new Set(initial.map((s) => s.trim().toLocaleLowerCase()))
          const preset = SKILL_OPTIONS.filter((s) => lowerSet.has(s.toLocaleLowerCase()))
          const custom = initial.filter(
            (s) => !SKILL_OPTIONS.map((x) => x.toLocaleLowerCase()).includes(s.trim().toLocaleLowerCase())
          )
          setSelectedSkills(preset)
          setCustomSkills(custom)
        } else {
          toast.error(res.error || "Không thể tải thông tin khóa học")
          router.push("/instructor/courses")
        }
      } catch (err) {
        console.error(err)
        toast.error("Đã xảy ra lỗi khi tải thông tin khóa học")
        router.push("/instructor/courses")
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId, reset, router])

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

      await updateCourse(courseId, payload)

      toast.success("Đã cập nhật khóa học!")

      // Navigate back to course detail or courses list
      router.push(`/instructor/courses/${courseId}`)
    } catch (err) {
      console.error("Lỗi cập nhật khóa học:", err)
      toast.error(err?.message || "Không thể cập nhật khóa học")
    }
  }

  if (loading) {
    return <FullPageLoader />
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <p className="text-center text-muted-foreground">Không tìm thấy khóa học</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/instructor/courses/${courseId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Chỉnh sửa khóa học</h1>
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
            onClick={() => router.push(`/instructor/courses/${courseId}`)}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-primary"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật khóa học"}
          </Button>
        </div>
      </form>
    </div>
  )
}
