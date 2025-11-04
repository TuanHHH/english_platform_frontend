"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCourseBySlug } from "@/lib/api/course"
import {
    CourseHeader,
    CourseInfo,
    CourseDescription,
    CourseModules,
} from "@/components/courses/detail"

export default function AdminCourseDetailPage() {
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
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            <p className="ml-3 text-gray-600">Đang tải thông tin khóa học...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/admin/courses">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại danh sách
                            </Button>
                        </Link>
                        <Card>
                            <CardContent className="text-center py-12">
                                <XCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {error || "Không tìm thấy khóa học"}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Khóa học không tồn tại hoặc bạn không có quyền truy cập.
                                </p>
                                <Button onClick={() => router.push("/admin/courses")}>
                                    Quay lại danh sách khóa học
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link href="/admin/courses">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại danh sách
                        </Button>
                    </Link>

                    {/* Course Header */}
                    <CourseHeader course={course} />

                    {/* Main Content - Full Width */}
                    <div className="space-y-6 mt-6">
                        <CourseInfo course={course} />
                        <CourseDescription course={course} />
                        <CourseModules courseId={course.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
