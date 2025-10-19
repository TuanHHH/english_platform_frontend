"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { publishCourse } from "@/lib/api/course"
import { toast } from "sonner"
import CoursePublishDialog from "./course-publish-dialog"

export default function CourseCard({ course, onEdit, onDelete }) {
  const [isPublished, setIsPublished] = useState(course.published)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [pendingPublishState, setPendingPublishState] = useState(false)

  const skills = Array.isArray(course.skillFocus) ? course.skillFocus : []
  const visibleSkills = skills.slice(0, 3)
  const remainingCount = skills.length - visibleSkills.length

  const handleEditClick = () => {
    if (isPublished) {
      toast.error("Vui lòng hủy xuất bản khóa học trước khi chỉnh sửa")
      return
    }
    onEdit(course)
  }

  const handlePublishClick = () => {
    const newPublishState = !isPublished
    setPendingPublishState(newPublishState)
    setShowPublishDialog(true)
  }

  const handlePublishConfirm = async () => {
    // Optimistic update
    setIsPublished(pendingPublishState)
    setIsUpdating(true)
    setShowPublishDialog(false)

    const result = await publishCourse(course.id, pendingPublishState)

    setIsUpdating(false)

    if (result.success) {
      toast.success(
        pendingPublishState
          ? "Khóa học đã được xuất bản"
          : "Đã hủy xuất bản khóa học"
      )
    } else {
      // Rollback on failure
      setIsPublished(!pendingPublishState)
      toast.error(result.error || "Không thể cập nhật trạng thái xuất bản")
    }
  }

  return (
    <Card className="overflow-hidden shadow-elegant hover:shadow-glow transition-shadow py-0 gap-0">
      {/* --- Thumbnail + trạng thái --- */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={course.thumbnail || "/course-placeholder.jpeg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <Badge
          className={`absolute top-2 right-2 ${
            isPublished ? "bg-green-400" : "bg-gray-400"
          }`}
        >
          {isPublished ? "Đã xuất bản" : "Chưa xuất bản"}
        </Badge>
      </div>

      {/* --- Nội dung --- */}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/instructor/courses/${course.id}`} className="hover:underline">
              <h3 className="font-semibold text-lg text-foreground">{course.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">{course.description}</p>

            {/* --- Skill badges --- */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {visibleSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="capitalize">
                    {skill}
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <Badge variant="outline">+{remainingCount}</Badge>
                )}
              </div>
            )}
          </div>

          {/* --- Menu hành động --- */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover z-50">
              <Link href={`/instructor/courses/${course.id}`}>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" /> Xem chi tiết
                </DropdownMenuItem>
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DropdownMenuItem
                        onClick={handleEditClick}
                        disabled={isPublished}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
                      </DropdownMenuItem>
                    </div>
                  </TooltipTrigger>
                  {isPublished && (
                    <TooltipContent side="left">
                      Vui lòng hủy xuất bản trước khi chỉnh sửa
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuItem
                onClick={handlePublishClick}
                disabled={isUpdating}
              >
                {isPublished ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" /> Hủy xuất bản
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" /> Xuất bản
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(course)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* --- Thống kê --- */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{course.students ?? 0} học viên</span>
          <span>•</span>
          <span>{course.moduleCount} modules</span>
          <span>•</span>
          <span>{course.lessonCount} bài học</span>
        </div>
      </CardContent>

      <CoursePublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        course={course}
        isPublishing={pendingPublishState}
        onConfirm={handlePublishConfirm}
      />
    </Card>
  )
}
