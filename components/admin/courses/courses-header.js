"use client"

export default function CoursesHeader() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Quản lý khóa học</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý và phê duyệt các khóa học trong hệ thống
        </p>
      </div>
    </div>
  )
}