"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ChevronRight, Video, FileText, HelpCircle } from "lucide-react"

const kindConfig = {
  VIDEO: {
    icon: Video,
    color: "bg-blue-100 text-blue-700",
    label: "Video",
  },
  TEXT: {
    icon: FileText,
    color: "bg-green-100 text-green-700",
    label: "Bài viết",
  },
  QUIZ: {
    icon: HelpCircle,
    color: "bg-amber-100 text-amber-700",
    label: "Trắc nghiệm",
  },
}


export default function LessonCard({ lesson, courseId, moduleId, onEdit, onDelete }) {
  if (!lesson) return null
  const config = kindConfig[lesson.kind] || kindConfig.TEXT
  const Icon = config.icon

  return (
    <Card className="shadow-elegant hover:shadow-glow transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Số thứ tự */}
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-semibold">
          {lesson.position ?? "-"}
        </div>

        {/* Icon loại bài học */}
        <div className={`w-12 h-12 rounded-lg ${config.color} flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>

        {/* Nội dung cơ bản */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{lesson.title}</h3>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <Badge variant="outline" className="text-xs">
              {config.label}
            </Badge>
            {lesson.estimatedMin && <span>{lesson.estimatedMin} phút</span>}
            {lesson.isFree && (
              <Badge className="bg-emerald-500/15 text-emerald-600 text-xs">Miễn phí</Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit?.(lesson)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete?.(lesson)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          <Link
            href={`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}
            className="flex"
          >
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
