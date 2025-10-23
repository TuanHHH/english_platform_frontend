"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"

export default function CourseFilters({
  searchInput,
  setSearchInput,
  statusFilter,
  onStatusFilterChange,
  skillsFilter,
  onSkillsFilterChange,
  sortBy,
  onSortChange,
  onSearch
}) {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Responsive filter layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
            {/* Search input - full width on mobile, 4 cols on desktop */}
            <div className="lg:col-span-4 order-1 lg:order-none">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm khóa học..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                  className="pl-10 w-full text-sm"
                />
              </div>
            </div>

            {/* Status filter - full width on mobile, 3 cols on desktop */}
            <div className="lg:col-span-3 order-2 lg:order-none">
              <Select value={statusFilter || "ALL"} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-full text-sm">
                  <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="DRAFT">Nháp</SelectItem>
                  <SelectItem value="PENDING_REVIEW">Chờ phê duyệt</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                  <SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
                  <SelectItem value="UNPUBLISHED">Chưa xuất bản</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skills filter - full width on mobile, 3 cols on desktop */}
            <div className="lg:col-span-3 order-3 lg:order-none">
              <Select value={skillsFilter} onValueChange={onSkillsFilterChange}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Kỹ năng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả kỹ năng</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="pronunciation">Pronunciation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort filter - full width on mobile, 2 cols on desktop */}
            <div className="lg:col-span-2 order-4 lg:order-none">
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt,desc">Mới nhất</SelectItem>
                  <SelectItem value="createdAt,asc">Cũ nhất</SelectItem>
                  <SelectItem value="title,asc">Tên A-Z</SelectItem>
                  <SelectItem value="title,desc">Tên Z-A</SelectItem>
                  <SelectItem value="priceCents,asc">Giá tăng dần</SelectItem>
                  <SelectItem value="priceCents,desc">Giá giảm dần</SelectItem>
                  <SelectItem value="moduleCount,desc">Nhiều bài học nhất</SelectItem>
                  <SelectItem value="moduleCount,asc">Ít bài học nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}