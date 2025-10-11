"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ChevronRight, Video, FileText, HelpCircle } from "lucide-react"

const typeConfig = {
  video: { icon: Video, color: "bg-secondary/10 text-secondary", label: "Video" },
  text: { icon: FileText, color: "bg-primary/10 text-primary", label: "Text" },
  quiz: { icon: HelpCircle, color: "bg-accent/10 text-accent", label: "Quiz" },
}

export default function LessonCard({ lesson, courseId, moduleId, onEdit, onDelete }) {
  const config = typeConfig[lesson.type]
  const Icon = config.icon

  return (
    <Card className="shadow-elegant hover:shadow-glow transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-semibold">
            {lesson.order}
          </div>

          <div className={`w-12 h-12 rounded-lg ${config.color} flex items-center justify-center`}>
            <Icon className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{lesson.title}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
              <span>{lesson.duration}</span>
            </div>
          </div>

          <Badge className={lesson.status === "published" ? "bg-success" : "bg-muted"}>
            {lesson.status === "published" ? "Đã xuất bản" : "Nháp"}
          </Badge>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(lesson)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(lesson)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Link href={`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
