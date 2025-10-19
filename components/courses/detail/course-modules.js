"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, FileText, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPublishedModules } from "@/lib/api/course"
import { CourseModulesSkeleton } from "./course-modules-skeleton"

export function CourseModules({ courseId }) {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState(new Set())

  useEffect(() => {
    if (courseId) {
      fetchModules()
    }
  }, [courseId])

  const fetchModules = async () => {
    setLoading(true)
    const result = await getPublishedModules(courseId)

    if (result.success) {
      setModules(result.data || [])
    }

    setLoading(false)
  }

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  if (loading) {
    return <CourseModulesSkeleton />
  }

  if (!modules || modules.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Nội dung khóa học</h2>
          <p className="text-muted-foreground">
            Chưa có nội dung nào được công bố
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Nội dung khóa học</h2>
        <div className="space-y-3">
          {modules.map((module) => {
            const isExpanded = expandedModules.has(module.id)
            return (
              <div
                key={module.id}
                className="border rounded-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{module.title}</span>
                        {module.published && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{module.lessonCount || 0} bài học</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    Chương {module.position}
                  </Badge>
                </button>

                {isExpanded && (
                  <div className="border-t bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">
                      Chương này có {module.lessonCount || 0} bài học. Đăng ký
                      khóa học để xem chi tiết nội dung.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
