import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const InstructorListSection = ({ instructors, loading, currentPage, totalPages, onPageChange }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-full col-span-1" />
              <Skeleton className="h-4 w-full col-span-1" />
              <Skeleton className="h-4 w-full col-span-1" />
              <Skeleton className="h-4 w-full col-span-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!instructors || instructors.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Không có giảng viên nào
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảng viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kinh nghiệm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tham gia
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {instructors.map((instructor) => (
              <tr key={instructor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={instructor.avatarUrl} alt={instructor.fullName} />
                      <AvatarFallback>{instructor.fullName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-gray-900">{instructor.fullName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {instructor.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {instructor.experienceYears} năm
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(instructor.createdAt).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            siblingCount={1}
          />
        </div>
      )}
    </div>
  );
};

export default InstructorListSection;
