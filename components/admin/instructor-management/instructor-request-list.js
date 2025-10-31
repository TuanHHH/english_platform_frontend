"use client";

import React from "react";
import { Pagination } from "@/components/ui/pagination";
import InstructorRequestCard from "./instructor-request-card";

const InstructorRequestList = ({
  requests,
  loading,
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không tìm thấy yêu cầu nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <InstructorRequestCard
          key={request.id}
          request={request}
        />
      ))}

      {requests.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default InstructorRequestList;