"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Bell } from "lucide-react"
import LoadingSkeleton from "@/components/my-course/loading-skeleton"
import CoursesList from "@/components/my-course/courses-list"
import RemindersList from "@/components/my-course/reminders-list"
import { useEnrollmentStore } from "@/store/enrollment-store"

export default function MyCoursesLearningPage() {
    const [activeTab, setActiveTab] = useState("courses")

    // Zustand store
    const enrollments = useEnrollmentStore((state) => state.enrollments)
    const pagination = useEnrollmentStore((state) => state.pagination)
    const loading = useEnrollmentStore((state) => state.loading)
    const initialized = useEnrollmentStore((state) => state.initialized)
    const fetchEnrollments = useEnrollmentStore((state) => state.fetchEnrollments)
    const setPage = useEnrollmentStore((state) => state.setPage)

    // Mock data for study reminders
    const mockReminders = [
        {
            id: 1,
            courseTitle: "[IELTS Fundamentals] Từ vựng và ngữ pháp cơ bản IELTS",
            reminderTime: "09:00",
            days: ["Mon", "Wed", "Fri"],
            isActive: true,
        },
        {
            id: 2,
            courseTitle: "Advanced English Grammar",
            reminderTime: "14:30",
            days: ["Tue", "Thu"],
            isActive: true,
        },
        {
            id: 3,
            courseTitle: "TOEIC Listening Practice",
            reminderTime: "20:00",
            days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            isActive: false,
        },
    ]

    useEffect(() => {
        // Only fetch if not already loaded (store will handle caching)
        fetchEnrollments()
    }, [fetchEnrollments])

    const handlePageChange = (page) => {
        setPage(page)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            ACTIVE: { label: "Đang học", variant: "default" },
            COMPLETED: { label: "Hoàn thành", variant: "success" },
            INACTIVE: { label: "Tạm dừng", variant: "secondary" },
        }
        const config = statusConfig[status] || { label: status, variant: "default" }
        return (
            <Badge variant={config.variant} className="text-xs">
                {config.label}
            </Badge>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Khóa học của tôi
                </h1>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="courses" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Danh sách khóa học
                    </TabsTrigger>
                    <TabsTrigger value="reminders" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Nhắc nhở học tập
                    </TabsTrigger>
                </TabsList>

                {/* Courses Tab */}
                <TabsContent value="courses">
                    {!initialized || loading ? (
                        <LoadingSkeleton />
                    ) : (
                        <CoursesList
                            enrollments={enrollments}
                            pagination={pagination}
                            formatDate={formatDate}
                            getStatusBadge={getStatusBadge}
                            onPageChange={handlePageChange}
                        />
                    )}
                </TabsContent>

                {/* Study Reminders Tab */}
                <TabsContent value="reminders">
                    <RemindersList reminders={mockReminders} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
