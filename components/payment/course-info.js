"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Clock, Users, Award } from "lucide-react"
import Image from "next/image"

export function CourseInfo({ course }) {
  const [formattedStudents, setFormattedStudents] = useState(course.students)

  useEffect(() => {
    setFormattedStudents(course.students.toLocaleString("vi-VN"))
  }, [course.students])

  return (
    <Card className="overflow-hidden gap-0 p-0">
      <Image
        src={ "/course-placeholder.jpeg"}
        alt={course.title}
        className="w-full h-48 object-cover"
        width={800}
        height={300}
        priority
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
        <p className="text-muted-foreground mb-4">
          Giảng viên: {course.instructor}
        </p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <span>{course.rating} ⭐</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{formattedStudents} học viên</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {course.level}
          </span>
        </div>
      </div>
    </Card>
  )
}
