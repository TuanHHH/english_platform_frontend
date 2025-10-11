"use client"

import DashboardStats from "@/components/admin/courses/dashboard-stats"
import RecentActivity from "@/components/admin/courses/recent-activity"
import CourseApprovalTable from "@/components/admin/courses/course-approval-table"
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard Admin</h2>
        <p className="text-muted-foreground mt-1">
          Tổng quan về hoạt động phê duyệt khóa học
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Course Approval Table */}
      <CourseApprovalTable />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
