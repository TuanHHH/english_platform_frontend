"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

import CourseCard from "@/components/instructor/courses/course-card";
import CourseCreateDialog from "@/components/instructor/courses/course-create-dialog";
import CourseEditDialog from "@/components/instructor/courses/course-edit-dialog";
import CourseDeleteDialog from "@/components/instructor/courses/course-delete-dialog";
import { Pagination } from "@/components/ui/pagination";
import { FullPageLoader } from "@/components/ui/full-page-loader";
import { getCourses } from "@/lib/api/course";

const sortOptions = [
    { value: "title,asc", label: "Tên (A → Z)" },
    { value: "title,desc", label: "Tên (Z → A)" },
    { value: "createdAt,desc", label: "Ngày tạo (mới → cũ)" },
    { value: "createdAt,asc", label: "Ngày tạo (cũ → mới)" },
    { value: "updatedAt,desc", label: "Ngày cập nhật (mới → cũ)" },
    { value: "updatedAt,asc", label: "Ngày cập nhật (cũ → mới)" },
];

export default function InstructorCourses() {
    // ==== STATE ====
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("createdAt,desc");

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // ==== REFS ====
    const mounted = useRef(false);
    const debounceTimer = useRef(null);
    const currentFetchKey = useRef("");

    // === CORE FETCH ===
    const fetchCourses = async (params) => {
        const key = JSON.stringify(params);
        if (key === currentFetchKey.current) return;
        currentFetchKey.current = key;

        try {
            setLoading(true);
            const res = await getCourses(params);
            const data = res?.data || {};
            const meta = data?.meta || {};
            setCourses(data?.result || []);
            setTotalPages(meta?.pages || 1);
        } catch (err) {
            console.error("API error:", err);
            toast.error("Không thể tải danh sách khóa học");
        } finally {
            setLoading(false);
        }
    };

    // MOUNT LẦN ĐẦU
    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;
        fetchCourses({ page: 1, size: 6, sort: sortOption });
    }, []);

    // PAGE CHANGE
    useEffect(() => {
        if (!mounted.current) return;
        fetchCourses({ page, size: 6, sort: sortOption, keyword: searchTerm || undefined });
    }, [page]);

    // SORT CHANGE
    useEffect(() => {
        if (!mounted.current) return;
        setPage(1);
        fetchCourses({ page: 1, size: 6, sort: sortOption, keyword: searchTerm || undefined });
    }, [sortOption]);

    // SEARCH DEBOUNCE — bỏ qua lần đầu
    const firstSearch = useRef(true);
    useEffect(() => {
        if (!mounted.current) return;

        // bỏ qua lần đầu (mount)
        if (firstSearch.current) {
            firstSearch.current = false;
            return;
        }

        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setPage(1);
            fetchCourses({ page: 1, size: 6, sort: sortOption, keyword: searchTerm || undefined });
        }, 600);

        return () => clearTimeout(debounceTimer.current);
    }, [searchTerm]);

    // ==== HANDLERS ====
    const handleEdit = (course) => {
        setSelectedCourse(course);
        setEditDialogOpen(true);
    };

    const handleDelete = (course) => {
        setSelectedCourse(course);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        toast.success(`Khóa học "${selectedCourse?.title}" đã được xóa.`);
        setDeleteDialogOpen(false);
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-foreground">Quản lý khóa học</h2>
                <CourseCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
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
                            <CourseCard
                                key={course.id}
                                course={course}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    <div className="pt-8 flex justify-center">
                        <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
                    </div>
                </>
            )}

            {/* Dialogs */}
            <CourseEditDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                course={selectedCourse}
                onSaved={() =>
                    fetchCourses({ page, size: 6, sort: sortOption, keyword: searchTerm || undefined })
                }
            />
            <CourseDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                course={selectedCourse}
                onConfirm={confirmDelete}
            />
        </div>
    );
}

