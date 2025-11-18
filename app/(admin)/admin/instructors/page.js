"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminInstructorRequests, getInstructorList } from "@/lib/api/instructor";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";

// Import subcomponents
import InstructorRequestList from "@/components/admin/instructor-management/instructor-request-list";
import InstructorFilters from "@/components/admin/instructor-management/instructor-filters";
import InstructorListSection from "@/components/admin/instructor-management/instructor-list-section";
import InstructorListFilters from "@/components/admin/instructor-management/instructor-list-filters";

const InstructorManagement = () => {
  const [instructorRequests, setInstructorRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPageInternal] = useState(1);

  const setPage = (newPage) => {
    if (newPage < 1) {
      return;
    }
    setPageInternal(newPage);
  };

  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Instructor list states
  const [instructors, setInstructors] = useState([]);
  const [instructorPage, setInstructorPageInternal] = useState(1);

  const setInstructorPage = (newPage) => {
    if (newPage < 1) {
      console.error("[BLOCKED] Attempted to set instructor page to", newPage);
      return;
    }
    setInstructorPageInternal(newPage);
  };

  const [instructorTotalPages, setInstructorTotalPages] = useState(1);
  const [instructorSortField, setInstructorSortField] = useState("createdAt");
  const [instructorSortDir, setInstructorSortDir] = useState("asc");
  const [instructorSearch, setInstructorSearch] = useState("");
  const [instructorDebouncedSearch, setInstructorDebouncedSearch] = useState("");
  const [instructorLoading, setInstructorLoading] = useState(true);
  const [showInstructorList, setShowInstructorList] = useState(false);

  const isMounted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => setInstructorDebouncedSearch(instructorSearch), 1000);
    return () => clearTimeout(timer);
  }, [instructorSearch]);

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

  // === Fetch Instructor List ===
  const fetchInstructors = async () => {
    setInstructorLoading(true);

    try {
      const { success, data } = await getInstructorList(
        instructorPage,
        pageSize,
        instructorSortField,
        instructorSortDir,
        instructorDebouncedSearch || null
      );

      if (success && data) {
        setInstructors(data.result ?? []);
        setInstructorTotalPages(data.meta?.pages ?? 1);
      }
    } catch (error) {
      console.error("[ERROR] Fetching instructors:", error);
      toast.error("Lấy danh sách giảng viên thất bại");
    } finally {
      setInstructorLoading(false);
    }
  };

  // Only fetch when dependencies change
  useEffect(() => {
    fetchInstructorRequests();
  }, [page, status, sortDir]);

  useEffect(() => {
    if (showInstructorList) {
      fetchInstructors();
    }
  }, [instructorPage, instructorSortField, instructorSortDir, instructorDebouncedSearch, showInstructorList]);

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

  // Instructor list handlers
  const handleInstructorSearchChange = (value) => {
    setInstructorSearch(value);
    setInstructorPage(1);
  };

  const handleInstructorSortFieldChange = (value) => {
    setInstructorSortField(value);
    setInstructorPage(1);
  };

  const handleInstructorSortDirToggle = () => {
    setInstructorSortDir((d) => (d === "asc" ? "desc" : "asc"));
    setInstructorPage(1);
  };

  const handleToggleInstructorList = () => {
    setShowInstructorList((prev) => !prev);
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

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách Giảng viên</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleInstructorList}
            className="flex items-center gap-2"
          >
            {showInstructorList ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Ẩn
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Hiển thị
              </>
            )}
          </Button>
        </CardHeader>
        {showInstructorList && (
          <CardContent>
            <InstructorListFilters
              search={instructorSearch}
              onSearchChange={handleInstructorSearchChange}
              sortField={instructorSortField}
              onSortFieldChange={handleInstructorSortFieldChange}
              sortDir={instructorSortDir}
              onSortDirToggle={handleInstructorSortDirToggle}
            />
            <InstructorListSection
              instructors={instructors}
              loading={instructorLoading}
              currentPage={instructorPage}
              totalPages={instructorTotalPages}
              onPageChange={setInstructorPage}
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default InstructorManagement;