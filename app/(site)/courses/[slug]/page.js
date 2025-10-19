"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FullPageLoader } from "@/components/ui/full-page-loader"
import { getCourseBySlug } from "@/lib/api/course"
import {
  CourseHeader,
  CourseInfo,
  CourseDescription,
  CoursePurchase,
  CourseModules,
} from "@/components/courses/detail"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (params.slug) {
      fetchCourse()
    }
  }, [params.slug])

  const fetchCourse = async () => {
    setLoading(true)
    setError(null)

    const result = await getCourseBySlug(params.slug)

    if (result.success) {
      setCourse(result.data)
    } else {
      setError(result.error || "Không thể tải thông tin khóa học")
    }

    setLoading(false)
  }

  if (loading) {
    return <FullPageLoader />
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              {error || "Không tìm thấy khóa học"}
            </p>
            <Button onClick={() => router.push("/courses")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách khóa học
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/courses")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Course Header */}
        <CourseHeader course={course} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Info, Description, and Modules */}
          <div className="lg:col-span-2 space-y-8">
            <CourseInfo course={course} />
            <CourseDescription course={course} />
            <CourseModules courseId={course.id} />
          </div>

          {/* Right Column - Purchase Section */}
          <div className="lg:col-span-1">
            <CoursePurchase course={course} />
          </div>
        </div>
      </div>
    </div>
  )
}
