"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Eye, CheckCircle, XCircle, EyeOff } from "lucide-react"
import CourseTableHeader from "./course-table-header"
import CourseTableRow from "./course-table-row"

// Helper functions for mobile layout
const getStatusColor = (status) => {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800'
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800'
    case 'PENDING_REVIEW':
      return 'bg-yellow-100 text-yellow-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    case 'UNPUBLISHED':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const canApprove = (course) => {
  return course.status === 'PENDING_REVIEW'
}

const canReject = (course) => {
  return course.status === 'PENDING_REVIEW' || course.status === 'PUBLISHED'
}

export default function CourseTable({
  courses,
  loading,
  onStatusUpdate
}) {
  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (courses.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy khóa học nào</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Mobile: Card layout (< 768px) */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {courses.map((course) => (
              <div key={course.id} className="p-4 space-y-3">
                {/* Title and Status */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate mb-1" title={course.title}>
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2" title={course.description}>
                      {course.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge className={`${getStatusColor(course.status)} text-xs`}>
                      {course.status}
                    </Badge>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {course.skillFocus?.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()}
                    </Badge>
                  ))}
                  {course.skillFocus?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.skillFocus.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Giá:</span>
                    <div className="font-medium text-gray-900">
                      {formatCurrency(course.priceCents, course.currency)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày tạo:</span>
                    <div className="text-gray-900">
                      {formatDate(course.createdAt)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Chương:</span>
                    <div className="text-gray-900">{course.moduleCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Bài học:</span>
                    <div className="text-gray-900">{course.lessonCount}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                  {/* View button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-8 w-8"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {/* Status-based actions */}
                  {canApprove(course) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-8 w-8 text-green-600 hover:text-green-800"
                      onClick={() => onStatusUpdate && onStatusUpdate(course.id, 'PUBLISHED')}
                      title="Phê duyệt"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}

                  {canReject(course) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-8 w-8 text-red-600 hover:text-red-800"
                      onClick={() => onStatusUpdate && onStatusUpdate(course.id, 'REJECTED')}
                      title="Từ chối"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}

                  {course.status === 'PUBLISHED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-8 w-8 text-orange-600 hover:text-orange-800"
                      onClick={() => onStatusUpdate && onStatusUpdate(course.id, 'UNPUBLISHED')}
                      title="Gỡ xuất bản"
                    >
                      <EyeOff className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet & Desktop: Table layout (≥ 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <CourseTableHeader />
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <CourseTableRow
                    key={course.id}
                    course={course}
                    onStatusUpdate={onStatusUpdate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}