"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Bell, Badge, Plus } from "lucide-react"
import LoadingSkeleton from "@/components/my-course/loading-skeleton"
import CoursesList from "@/components/my-course/courses-list"
import SchedulesList from "@/components/my-course/schedules-list"
import CreateScheduleDialog from "@/components/my-course/create-schedule-dialog"
import EditScheduleDialog from "@/components/my-course/edit-schedule-dialog"
import { useEnrollmentStore } from "@/store/enrollment-store"
import { getMySchedule } from "@/lib/api/schedule"

export default function LearningContent() {
    const [activeTab, setActiveTab] = useState("courses")

    // Zustand store for courses
    const enrollments = useEnrollmentStore((state) => state.enrollments)
    const pagination = useEnrollmentStore((state) => state.pagination)
    const loading = useEnrollmentStore((state) => state.loading)
    const initialized = useEnrollmentStore((state) => state.initialized)
    const fetchEnrollments = useEnrollmentStore((state) => state.fetchEnrollments)
    const setPage = useEnrollmentStore((state) => state.setPage)

    // State for study schedules
    const [studyPlans, setStudyPlans] = useState([])
    const [schedulesPagination, setSchedulesPagination] = useState(null)
    const [schedulesLoading, setSchedulesLoading] = useState(false)
    const [schedulesPage, setSchedulesPage] = useState(1)
    const [schedulesSort, setSchedulesSort] = useState("createdAt,desc")
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)

    useEffect(() => {
        // Only fetch if not already loaded (store will handle caching)
        fetchEnrollments()
    }, [fetchEnrollments])

    useEffect(() => {
        // Fetch schedules when reminders tab is active or when sort/page changes
        if (activeTab === "reminders") {
            fetchSchedules(schedulesPage, schedulesSort)
        }
    }, [activeTab, schedulesPage, schedulesSort])

    const fetchSchedules = async (page, sort) => {
        setSchedulesLoading(true)
        try {
            const result = await getMySchedule(page, 5, sort)
            if (result.success) {
                setStudyPlans(result.data?.result || [])
                setSchedulesPagination(result.data?.meta || null)
            }
        } catch (error) {
            console.error("Failed to fetch schedules:", error)
        } finally {
            setSchedulesLoading(false)
        }
    }

    const handlePageChange = (page) => {
        setPage(page)
    }

    const handleSchedulesPageChange = (page) => {
        setSchedulesPage(page)
    }

    const handleSchedulesSortChange = (sort) => {
        setSchedulesSort(sort)
        setSchedulesPage(1) // Reset to first page when sorting changes
    }

    const handleCreateSuccess = () => {
        // Refresh the schedules list after successful creation
        fetchSchedules(schedulesPage, schedulesSort)
    }

    const handleEdit = (plan) => {
        setSelectedPlan(plan)
        setEditDialogOpen(true)
    }

    const handleEditSuccess = (updatedPlan) => {
        // Optimistic UI update - update the local state without refetching
        setStudyPlans((prevPlans) =>
            prevPlans.map((plan) =>
                plan.id === updatedPlan.id ? updatedPlan : plan
            )
        )
    }

    const handleDelete = (planId) => {
        // Optimistic UI update - remove the plan from local state
        setStudyPlans((prevPlans) =>
            prevPlans.filter((plan) => plan.id !== planId)
        )
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="courses" className="flex items-center gap-2 flex-1 sm:flex-none">
                            <BookOpen className="w-4 h-4" />
                            <span className="hidden sm:inline">Danh sách khóa học</span>
                            <span className="sm:hidden">Khóa học</span>
                        </TabsTrigger>
                        <TabsTrigger value="reminders" className="flex items-center gap-2 flex-1 sm:flex-none">
                            <Bell className="w-4 h-4" />
                            <span className="hidden sm:inline">Nhắc nhở học tập</span>
                            <span className="sm:hidden">Lịch học</span>
                        </TabsTrigger>
                    </TabsList>

                    {activeTab === "reminders" && (
                        <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Tạo kế hoạch mới</span>
                            <span className="sm:hidden">Tạo kế hoạch</span>
                        </Button>
                    )}
                </div>

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
                    {schedulesLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <SchedulesList
                            studyPlans={studyPlans}
                            pagination={schedulesPagination}
                            onPageChange={handleSchedulesPageChange}
                            sortValue={schedulesSort}
                            onSortChange={handleSchedulesSortChange}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </TabsContent>
            </Tabs>

            {/* Create Schedule Dialog */}
            <CreateScheduleDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Schedule Dialog */}
            <EditScheduleDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
                studyPlan={selectedPlan}
            />
        </div>
    )
}
