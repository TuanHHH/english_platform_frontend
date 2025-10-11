"use client"

import Link from "next/link"
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const statusConfig = {
    published: { label: "Đã Xuất Bản", color: "bg-success" },
    draft: { label: "Đang Soạn", color: "bg-muted" },
    pending: { label: "Chờ Duyệt", color: "bg-warning" },
}

export default function CourseCard({ course, onEdit, onDelete }) {
    return (
        <Card className="overflow-hidden shadow-elegant hover:shadow-glow transition-shadow">
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
                <Badge
                    className={`absolute top-2 right-2 ${statusConfig[course.status].color
                        }`}
                >
                    {statusConfig[course.status].label}
                </Badge>
            </div>
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <Link href={`/instructor/courses/${course.id}`} className="hover:underline">
                            <h3 className="font-semibold text-lg text-foreground">
                                {course.title}
                            </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                            {course.description}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover z-50">
                            <Link href={`/instructor/courses/${course.id}`}>
                                <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" /> Xem Chi Tiết
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => onEdit(course)}>
                                <Edit className="h-4 w-4 mr-2" /> Chỉnh Sửa
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

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{course.students} học viên</span>
                    <span>•</span>
                    <span>{course.modules} modules</span>
                    <span>•</span>
                    <span>{course.lessons} bài học</span>
                </div>
            </CardContent>
        </Card>
    )
}
