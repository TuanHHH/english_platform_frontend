// "use client"

// import { useState, useEffect } from "react"
// import { getAllCourses, changeCourseStatus } from "@/lib/api/course"
// import { Pagination } from "@/components/ui/pagination"
// import { toast } from "sonner"
// import CoursesHeader from "@/components/admin/courses/courses-header"
// import CourseFilters from "@/components/admin/courses/course-filters"

// import CourseTable from "@/components/admin/courses/course-table"

// export default function AdminCoursesPage() {
//   const [courses, setCourses] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [pagination, setPagination] = useState({
//     page: 1,
//     pageSize: 10,
//     pages: 0,
//     total: 0
//   })
//   const [filters, setFilters] = useState({
//     keyword: "",
//     status: "",
//     skills: "ALL",
//     sort: "createdAt,desc"
//   })
//   const [searchInput, setSearchInput] = useState("")

//   const fetchCourses = async (page = 1, overrideFilters = null) => {
//     setLoading(true)
//     try {
//       const currentFilters = overrideFilters || filters
//       const params = {
//         page,
//         size: pagination.pageSize,
//         sort: currentFilters.sort || "createdAt,desc"
//       }

//       if (currentFilters.keyword) params.keyword = currentFilters.keyword
//       if (currentFilters.status) params.status = currentFilters.status
//       if (currentFilters.skills && currentFilters.skills !== 'ALL') params.skills = [currentFilters.skills]
//       if (currentFilters.sort) params.sort = currentFilters.sort

//       const response = await getAllCourses(params)

//       if (response.success) {
//         const coursesData = response.data.result || []
//         setCourses(coursesData)
//         setPagination({
//           page: response.data.meta?.page || 1,
//           pageSize: response.data.meta?.pageSize || 10,
//           pages: response.data.meta?.pages || 0,
//           total: response.data.meta?.total || 0
//         })
//       }
//     } catch (error) {
//       console.error("Failed to fetch courses:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchCourses()
//   }, [])

//   const handleSearch = () => {
//     const newFilters = { ...filters, keyword: searchInput }
//     setFilters(newFilters)
//     fetchCourses(1, newFilters)
//   }

//   const handleStatusFilter = (status) => {
//     const actualStatus = status === 'ALL' ? '' : status
//     const newFilters = { ...filters, status: actualStatus }
//     setFilters(newFilters)
//     fetchCourses(1, newFilters)
//   }

//   const handleSkillsFilter = (skills) => {
//     const actualSkills = skills === 'ALL' ? '' : skills
//     const newFilters = { ...filters, skills: actualSkills }
//     setFilters(newFilters)
//     fetchCourses(1, newFilters)
//   }

//   const handleSortChange = (sort) => {
//     const newFilters = { ...filters, sort }
//     setFilters(newFilters)
//     fetchCourses(1, newFilters)
//   }

//   const handlePageChange = (page) => {
//     fetchCourses(page)
//   }

//   const handleStatusUpdate = async (courseId, newStatus) => {
//     try {
//       const response = await changeCourseStatus(courseId, newStatus)
//       if (response.success) {
//         toast.success(`Cập nhật trạng thái khóa học thành công`)
//         // Refresh the courses list to show the updated status
//         fetchCourses(pagination.page)
//       } else {
//         toast.error(response.error || "Không thể cập nhật trạng thái khóa học")
//       }
//     } catch (error) {
//       console.error("Failed to update course status:", error)
//       toast.error("Không thể cập nhật trạng thái khóa học")
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <CoursesHeader />

//       {/* Filters */}
//       <CourseFilters
//         searchInput={searchInput}
//         setSearchInput={setSearchInput}
//         statusFilter={filters.status || "ALL"}
//         onStatusFilterChange={handleStatusFilter}
//         skillsFilter={filters.skills || "ALL"}
//         onSkillsFilterChange={handleSkillsFilter}
//         sortBy={filters.sort}
//         onSortChange={handleSortChange}
//         onSearch={handleSearch}
//       />

//       {/* Results Summary */}
//       <div className="flex justify-between items-center">
//         <p className="text-sm text-muted-foreground">
//           Hiển thị {courses.length} trên {pagination.total} khóa học
//         </p>
//       </div>

//       {/* Courses Table */}
//       <CourseTable
//         courses={courses}
//         loading={loading}
//         onStatusUpdate={handleStatusUpdate}
//       />

//       {/* Pagination */}
//       {pagination.pages > 1 && (
//         <div className="flex justify-center">
//           <Pagination
//             totalPages={pagination.pages}
//             currentPage={pagination.page}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { getAllCourses, changeCourseStatus } from "@/lib/api/course"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"
import CoursesHeader from "@/components/admin/courses/courses-header"
import CourseFilters from "@/components/admin/courses/course-filters"
import CourseTable from "@/components/admin/courses/course-table"

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  })
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    skills: "ALL",
    sort: "createdAt,desc",
  })
  const [searchInput, setSearchInput] = useState("")

  const fetchCourses = async (page = 1, overrideFilters = null) => {
    setLoading(true)
    try {
      const currentFilters = overrideFilters || filters
      const params = {
        page,
        size: pagination.pageSize,
        sort: currentFilters.sort || "createdAt,desc",
      }

      if (currentFilters.keyword) params.keyword = currentFilters.keyword
      if (currentFilters.status) params.status = currentFilters.status
      if (currentFilters.skills && currentFilters.skills !== "ALL")
        params.skills = [currentFilters.skills]
      if (currentFilters.sort) params.sort = currentFilters.sort

      const response = await getAllCourses(params)

      if (response.success) {
        const coursesData = response.data.result || []
        setCourses(coursesData)
        setPagination({
          page: response.data.meta?.page || 1,
          pageSize: response.data.meta?.pageSize || 10,
          pages: response.data.meta?.pages || 0,
          total: response.data.meta?.total || 0,
        })
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    const newFilters = { ...filters, keyword: searchInput }
    setFilters(newFilters)
    fetchCourses(1, newFilters)
  }

  const handleStatusFilter = (status) => {
    const actualStatus = status === "ALL" ? "" : status
    const newFilters = { ...filters, status: actualStatus }
    setFilters(newFilters)
    fetchCourses(1, newFilters)
  }

  const handleSkillsFilter = (skills) => {
    const actualSkills = skills === "ALL" ? "" : skills
    const newFilters = { ...filters, skills: actualSkills }
    setFilters(newFilters)
    fetchCourses(1, newFilters)
  }

  const handleSortChange = (sort) => {
    const newFilters = { ...filters, sort }
    setFilters(newFilters)
    fetchCourses(1, newFilters)
  }

  const handlePageChange = (page) => {
    fetchCourses(page)
  }

  const handleStatusUpdate = async (courseId, newStatus) => {
    try {
      const response = await changeCourseStatus(courseId, newStatus)
      if (response.success) {
        toast.success("Cập nhật trạng thái khóa học thành công")
        fetchCourses(pagination.page)
      } else {
        toast.error(response.error || "Không thể cập nhật trạng thái khóa học")
      }
    } catch (error) {
      console.error("Failed to update course status:", error)
      toast.error("Không thể cập nhật trạng thái khóa học")
    }
  }

  return (
    <div className="space-y-6 overflow-x-hidden max-w-full">
      {/* Header */}
      <CoursesHeader />

      {/* Filters */}
      <div className="overflow-x-hidden px-2 sm:px-0">
        <CourseFilters
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          statusFilter={filters.status || "ALL"}
          onStatusFilterChange={handleStatusFilter}
          skillsFilter={filters.skills || "ALL"}
          onSkillsFilterChange={handleSkillsFilter}
          sortBy={filters.sort}
          onSortChange={handleSortChange}
          onSearch={handleSearch}
        />
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center px-2 sm:px-0">
        <p className="text-sm text-muted-foreground truncate">
          Hiển thị {courses.length} trên {pagination.total} khóa học
        </p>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-hidden w-full">
        <CourseTable
          courses={courses}
          loading={loading}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center px-2 sm:px-0">
          <Pagination
            totalPages={pagination.pages}
            currentPage={pagination.page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
