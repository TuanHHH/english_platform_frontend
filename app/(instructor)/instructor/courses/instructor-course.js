"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"

import CourseCard from "@/components/instructor/courses/course-card"
import CourseCreateDialog from "@/components/instructor/courses/course-create-dialog"
import CourseEditDialog from "@/components/instructor/courses/course-edit-dialog"
import CourseDeleteDialog from "@/components/instructor/courses/course-delete-dialog"
import { Pagination } from "@/components/ui/pagination"
import { FullPageLoader } from "@/components/ui/full-page-loader"
import { getCourses, deleteCourse } from "@/lib/api/course"

const sortOptions = [
    { value: "title,asc", label: "Tên (A → Z)" },
    { value: "title,desc", label: "Tên (Z → A)" },
    { value: "createdAt,desc", label: "Ngày tạo (mới → cũ)" },
    { value: "createdAt,asc", label: "Ngày tạo (cũ → mới)" },
    { value: "updatedAt,desc", label: "Ngày cập nhật (mới → cũ)" },
    { value: "updatedAt,asc", label: "Ngày cập nhật (cũ → mới)" },
]

export default function InstructorCourses() {
    // ==== STATE ====
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOption, setSortOption] = useState("createdAt,desc")

    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)

    // ==== REFS ====
    const mounted = useRef(false)
    const deletingRef = useRef(false)
    const debounceTimer = useRef(null)
    const currentFetchKey = useRef("")

    // === CORE FETCH ===
    const fetchCourses = async (params) => {
        const key = JSON.stringify(params)
        if (key === currentFetchKey.current) return
        currentFetchKey.current = key

        try {
            setLoading(true)
            const res = await getCourses(params)
            const data = res?.data || {}
            const meta = data?.meta || {}
            setCourses(data?.result || [])
            setTotalPages(meta?.pages || 1)
        } catch (err) {
            console.error("API error:", err)
            toast.error("Không thể tải danh sách khóa học")
        } finally {
            setLoading(false)
        }
    }

    // === FIRST MOUNT ===
    useEffect(() => {
        if (mounted.current) return
        mounted.current = true
        fetchCourses({ page: 1, size: 6, sort: sortOption })
    }, [])

    // === PAGE CHANGE ===
    useEffect(() => {
        if (!mounted.current) return
        fetchCourses({ page, size: 6, sort: sortOption, keyword: searchTerm || undefined })
    }, [page])

    // === SORT CHANGE ===
    useEffect(() => {
        if (!mounted.current) return
        setPage(1)
        fetchCourses({ page: 1, size: 6, sort: sortOption, keyword: searchTerm || undefined })
    }, [sortOption])

    // === SEARCH DEBOUNCE ===
    const firstSearch = useRef(true)
    useEffect(() => {
        if (!mounted.current) return
        if (firstSearch.current) {
            firstSearch.current = false
            return
        }

        clearTimeout(debounceTimer.current)
        debounceTimer.current = setTimeout(() => {
            setPage(1)
            fetchCourses({ page: 1, size: 6, sort: sortOption, keyword: searchTerm || undefined })
        }, 600)

        return () => clearTimeout(debounceTimer.current)
    }, [searchTerm])

    // ==== HANDLERS ====
    const handleEdit = (course) => {
        setSelectedCourse(course)
        setEditDialogOpen(true)
    }

    const handleDelete = (course) => {
        setSelectedCourse(course)
        setDeleteDialogOpen(true)
    }

    // === Optimistic DELETE ===
    const confirmDelete = useCallback(async () => {
        if (deletingRef.current) return
        if (!selectedCourse?.id) return
        deletingRef.current = true

        try {
            const res = await deleteCourse(selectedCourse.id)
            if (res.success) {
                // Xóa ngay khỏi UI
                setCourses(prev => prev.filter(c => c.id !== selectedCourse.id))

                // Nếu xóa xong trang rỗng → lùi 1 trang
                if (courses.length === 1 && page > 1) {
                    setPage(p => p - 1)
                }

                toast.success(`Đã xóa khóa học "${selectedCourse.title}"`)
            } else {
                toast.error(res.error || "Không thể xóa khóa học")
            }
        } catch (err) {
            console.error(err)
            toast.error("Lỗi khi xóa khóa học")
        } finally {
            setDeleteDialogOpen(false)
            deletingRef.current = false
        }
    }, [selectedCourse?.id, selectedCourse?.title, courses.length, page])

    // Xử lý khi tạo khóa học thành công (Optimistic Update)
    const handleCreateSuccess = (newCourse) => {
        if (!newCourse) {
            // Fallback: nếu không có newCourse, fetch lại từ server
            setPage(1)
            fetchCourses({ page: 1, size: 6, sort: sortOption, keyword: searchTerm || undefined })
            return
        }

        // Nếu đang ở trang 1 và đang sort theo createdAt,desc (mới nhất)
        if (page === 1 && sortOption === "createdAt,desc") {
            // Thêm course mới vào đầu danh sách
            setCourses((prev) => {
                const updated = [newCourse, ...prev]
                // Giữ tối đa 6 items (page size)
                return updated.slice(0, 6)
            })
        } else {
            // Nếu đang ở trang khác hoặc sort khác, về trang 1 và fetch lại
            setPage(1)
            fetchCourses({ page: 1, size: 6, sort: sortOption, keyword: searchTerm || undefined })
        }
    }

    // Xử lý khi cập nhật khóa học thành công (Optimistic Update)
    const handleEditSuccess = (updatedCourse) => {
        if (!updatedCourse?.id) {
            // Fallback: nếu không có data, fetch lại
            fetchCourses({ page, size: 6, sort: sortOption, keyword: searchTerm || undefined })
            return
        }

        let found = false
        setCourses((prev) => {
            const next = prev.map((course) => {
                if (course.id === updatedCourse.id) {
                    found = true
                    // Cập nhật course tại vị trí hiện tại
                    return { ...course, ...updatedCourse }
                }
                return course
            })
            return next
        })

        // Cập nhật selectedCourse để hiển thị đúng trong dialog/preview
        setSelectedCourse((prev) =>
            prev?.id === updatedCourse.id ? { ...prev, ...updatedCourse } : prev
        )

        if (!found) {
            // Nếu course không có trong trang hiện tại, fetch lại
            fetchCourses({ page, size: 6, sort: sortOption, keyword: searchTerm || undefined })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-foreground">Quản lý khóa học</h2>
                <CourseCreateDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    onSuccess={handleCreateSuccess}
                />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm khóa học..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sắp xếp theo" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <FullPageLoader />
                </div>
            ) : courses.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">Không có khóa học nào.</p>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>

                    <div className="pt-8 flex justify-center">
                        <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
                    </div>
                </>
            )}

            {selectedCourse && (
                <CourseEditDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    course={selectedCourse}
                    onSuccess={handleEditSuccess}
                />
            )}

            {selectedCourse && (
                <CourseDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    course={selectedCourse}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    )
}