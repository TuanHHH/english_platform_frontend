export default function CourseTableHeader() {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-3 py-3 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="max-w-full sm:max-w-xs">
            Khóa học
          </div>
        </th>
        <th className="px-3 py-3 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
          Trạng thái
        </th>
        <th className="px-3 py-3 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
          Kỹ năng
        </th>
        <th className="px-3 py-3 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
          Giá
        </th>
        <th className="px-3 py-3 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
          Bài học
        </th>
        <th className="px-3 py-3 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
          Ngày tạo
        </th>
        <th className="px-3 py-3 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Thao tác
        </th>
      </tr>
    </thead>
  )
}