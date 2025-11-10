"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Eye, CheckCircle, XCircle, EyeOff } from "lucide-react"
import CourseStatusConfirmDialog from "./course-status-confirm-dialog"

export default function CourseTableRow({ course, onStatusUpdate }) {
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800"
      case "DRAFT":
        return "bg-gray-100 text-gray-800"
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "UNPUBLISHED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "Đã xuất bản"
      case "DRAFT":
        return "Nháp"
      case "PENDING_REVIEW":
        return "Chờ phê duyệt"
      case "REJECTED":
        return "Từ chối"
      case "UNPUBLISHED":
        return "Tạm ẩn"
      default:
        return status
    }
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("vi-VN")

  const canApprove = course.status === "PENDING_REVIEW"
  const canReject =
    course.status === "PENDING_REVIEW" || course.status === "PUBLISHED"

  const handleApprove = () => setConfirmDialog({ open: true, action: "approve" })
  const handleReject = () => setConfirmDialog({ open: true, action: "reject" })
  const handleUnpublish = () => setConfirmDialog({ open: true, action: "unpublish" })

  const handleConfirmAction = () => {
    if (!onStatusUpdate) return
    switch (confirmDialog.action) {
      case "approve":
        onStatusUpdate(course.id, "PUBLISHED")
        break
      case "reject":
        onStatusUpdate(course.id, "REJECTED")
        break
      case "unpublish":
        onStatusUpdate(course.id, "UNPUBLISHED")
        break
    }
  }

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-3 py-3 sm:px-4 sm:py-4 align-top min-h-0">
          <div className="flex-1 min-w-0 overflow-hidden">
            {/* Title  */}
            <div
              className="
                text-sm font-medium text-gray-900 mb-1
                line-clamp-1
              "
              title={course.title}
            >
              {course.title}
            </div>

            {/* Description - cắt 3 dòng ở mobile, full ở desktop */}
            <div
              className="
                text-sm text-gray-500 mb-2
                line-clamp-3
              "
              title={course.description}
            >
              {course.description}
            </div>

            <div className="sm:hidden space-y-2">
              {/* Trạng thái + kỹ năng */}
              <div className="flex items-center justify-between gap-2">
                <Badge
                  className={`${getStatusColor(
                    course.status
                  )} text-xs flex-shrink-0 whitespace-nowrap`}
                >
                  {getStatusLabel(course.status)}
                </Badge>
                <div className="flex flex-wrap gap-1 flex-1 justify-end">
                  {course.skillFocus?.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()}
                    </Badge>
                  ))}
                  {course.skillFocus?.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.skillFocus.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Giá + Ngày tạo */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-900">
                  {formatCurrency(course.priceCents, course.currency)}
                </span>
                <span className="text-gray-500">{formatDate(course.createdAt)}</span>
              </div>

              {/* Chương + bài học */}
              <div className="text-xs text-gray-500 break-words">
                {course.moduleCount} chương • {course.lessonCount} bài học
              </div>
            </div>
          </div>
        </td>

        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap hidden sm:table-cell">
          <Badge className={getStatusColor(course.status)}>{getStatusLabel(course.status)}</Badge>
        </td>

        <td className="px-3 py-3 sm:px-4 sm:py-4 hidden lg:table-cell">
          <div className="flex flex-wrap gap-1 max-w-xs break-words">
            {course.skillFocus?.slice(0, 2).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()}
              </Badge>
            ))}
            {course.skillFocus?.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{course.skillFocus.length - 2}
              </Badge>
            )}
          </div>
        </td>

        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
          {formatCurrency(course.priceCents, course.currency)}
        </td>

        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
          <div className="text-xs">
            <div>{course.moduleCount} chương</div>
            <div>{course.lessonCount} bài học</div>
          </div>
        </td>

        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
          {formatDate(course.createdAt)}
        </td>

        <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-1 sm:space-x-2">
            {/* View - only for PUBLISHED courses */}
            {course.status === "PUBLISHED" && (
              <Link href={`/admin/courses/${course.slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-7 w-7 sm:h-8 sm:w-8"
                  title="Xem chi tiết"
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </Link>
            )}

            {/* Approve */}
            {canApprove && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-7 w-7 sm:h-8 sm:w-8 text-green-600 hover:text-green-800"
                onClick={handleApprove}
                title="Phê duyệt"
              >
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            )}

            {/* Reject */}
            {canReject && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-7 w-7 sm:h-8 sm:w-8 text-red-600 hover:text-red-800"
                onClick={handleReject}
                title="Từ chối"
              >
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            )}

            {/* Unpublish */}
            {course.status === "PUBLISHED" && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-7 w-7 sm:h-8 sm:w-8 text-orange-600 hover:text-orange-800"
                onClick={handleUnpublish}
                title="Gỡ xuất bản"
              >
                <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            )}
          </div>
        </td>
      </tr>

      <CourseStatusConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        courseTitle={course.title}
        action={confirmDialog.action}
        onConfirm={handleConfirmAction}
      />
    </>
  )
}