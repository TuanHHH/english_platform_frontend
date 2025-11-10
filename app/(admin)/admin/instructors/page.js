"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminInstructorRequests } from "@/lib/api/instructor";
import { toast } from "sonner";

// Import subcomponents
import InstructorRequestList from "@/components/admin/instructor-management/instructor-request-list";
import InstructorFilters from "@/components/admin/instructor-management/instructor-filters";

const InstructorManagement = () => {
  const [instructorRequests, setInstructorRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPageInternal] = useState(1);

  const setPage = (newPage) => {
    if (newPage < 1) {
      console.error("[BLOCKED] Attempted to set page to", newPage);
      return;
    }
    setPageInternal(newPage);
  };

  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const isMounted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(timer);
  }, [search]);

  // === Fetch API ===
  const fetchInstructorRequests = async () => {
    setLoading(true);

    try {
      const { success, data } = await getAdminInstructorRequests(
        status === "all" ? null : status,
        page,
        pageSize,
        sortDir
      );

      if (success && data) {
        setInstructorRequests(data.result ?? []);
        setTotalPages(data.meta?.pages ?? 1);
      }
    } catch (error) {
      console.error("[ERROR] Fetching instructor requests:", error);
      toast.error("Lấy danh sách yêu cầu giảng viên thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Only fetch when dependencies change
  useEffect(() => {
    fetchInstructorRequests();
  }, [page, status, sortDir]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
  }, [page]);

  // Filter client-side for search
  const filteredRequests = useMemo(() => {
    if (!debouncedSearch) return instructorRequests;

    const searchLower = debouncedSearch.toLowerCase();
    return instructorRequests.filter((request) =>
      request.user?.fullName?.toLowerCase().includes(searchLower) ||
      request.user?.email?.toLowerCase().includes(searchLower) ||
      request.qualification?.toLowerCase().includes(searchLower)
    );
  }, [instructorRequests, debouncedSearch]);

  // Handle search change
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  // Handle status change
  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  // Handle sort toggle
  const handleSortToggle = () => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Quản lí Giảng viên</h1>
        </div>
      </div>

      <InstructorFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        sortDir={sortDir}
        onSortToggle={handleSortToggle}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <InstructorRequestList
            requests={filteredRequests}
            loading={loading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorManagement;