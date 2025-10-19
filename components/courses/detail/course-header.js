import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function CourseHeader({ course }) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Image */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
          <Image
            src={course.thumbnail || "/course-placeholder.jpeg"}
            alt={course.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Course Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

          <p className="text-lg text-muted-foreground mb-6">
            {course.description}
          </p>

          {/* Skills */}
          {course.skillFocus && course.skillFocus.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {course.skillFocus.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm capitalize">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
