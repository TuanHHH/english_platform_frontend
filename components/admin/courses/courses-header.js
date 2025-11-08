"use client"

export default function CoursesHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
        Quản lý khóa học
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        Quản lý và phê duyệt các khóa học trong hệ thống
      </p>
    </div>
  )
}