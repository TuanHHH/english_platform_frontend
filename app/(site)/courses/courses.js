"use client"

import React, { useState, useEffect } from "react"
import { Pagination } from "@/components/ui/pagination"
import { getPublishedCourses } from "@/lib/api/course"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CoursesHeader,
  SkillFilters,
  CoursesGrid,
  EmptyState,
} from "@/components/courses"

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSkills, setSelectedSkills] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    pages: 0,
    total: 0,
  })

  useEffect(() => {
    fetchCourses()
  }, [selectedSkills, pagination.page])

  const fetchCourses = async () => {
    setLoading(true)
    const result = await getPublishedCourses({
      page: pagination.page,
      size: 12,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      sort: "createdAt,desc",
    })

    if (result.success) {
      setCourses(result.data.result || [])
      setPagination({
        page: result.data.meta.page,
        pageSize: result.data.meta.pageSize,
        pages: result.data.meta.pages,
        total: result.data.meta.total,
      })
    }
    setLoading(false)
  }

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleClearAllSkills = () => {
    setSelectedSkills([])
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <CoursesHeader />

        <SkillFilters
          selectedSkills={selectedSkills}
          onSkillToggle={handleSkillToggle}
          onClearAll={handleClearAllSkills}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <CoursesGrid courses={courses} />

            {pagination.pages > 1 && (
              <div className="mt-8">
                <Pagination
                  totalPages={pagination.pages}
                  currentPage={pagination.page}
                  onPageChange={handlePageChange}
                  siblingCount={1}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
