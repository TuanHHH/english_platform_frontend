import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function CourseHeader({ course }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Course Image */}
        <div className="lg:col-span-1">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            <Image
              src={course.thumbnail || "/course-placeholder.jpeg"}
              alt={course.title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Course Info - Takes more space */}
        <div className="lg:col-span-2 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{course.title}</h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
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
