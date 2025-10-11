"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, UserPlus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { getUsers, toggleUserStatus } from "@/lib/api/user";
import { Pagination } from "@/components/ui/pagination";
import ConfirmModal from "@/components/admin/users/confirm-modal";
import UserList from "@/components/admin/users/user-list";
import { toast } from "sonner";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("DESC");
  const [page, setPageInternal] = useState(1);

  const setPage = (newPage) => {
    if (newPage < 1) {
      console.error("[BLOCKED] Attempted to set page to", newPage);
      return;
    }

    setPageInternal(newPage);
  };
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  const isMounted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(timer);
  }, [search]);

  // === Fetch API ===
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const { success, data } = await getUsers({
        page,
        size: pageSize,
        searchTerm: debouncedSearch,
        sortBy,
        sortDir,
      });

      if (success && data) {
        setUsers(data.result ?? []);
        setTotalPages(data.meta?.pages ?? 1);
      }
    } catch (error) {
      console.error("[ERROR] Fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, sortBy, sortDir]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
  }, [page]);

  // Filter client-side
  const filteredUsers = useMemo(() => {
    if (status === "all") return users;
    const wantActive = status === "active";
    return users.filter((u) => !!u.isActive === wantActive);
  }, [users, status]);

  // Toggle user status
  const handleToggle = (user) => setModalUser(user);

  const handleConfirmToggle = async () => {
    if (!modalUser) return;
    try {
      const res = await toggleUserStatus(modalUser.id);
      if (res.success) {
        await fetchUsers();
      }
    } catch (error) {
      toast.error("Thay đổi trạng thái thất bại");
      console.error("[ERROR] Toggling user status:", error);
    } finally {
      setModalUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Quản lí người dùng</h1>
            <p className="text-xl text-muted-foreground">
              Quản lý tài khoản và quyền hạn người dùng
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <Select
            value={status}
            onValueChange={(value) => {
              setPage(1);
              setStatus(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Tạm khóa</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setPage(1);
              setSortDir((d) => (d === "ASC" ? "DESC" : "ASC"));
            }}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {sortBy === "createdAt" ? "Thời gian tạo" : "Tên"} ({sortDir})
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
              </div>
            ) : (
              <UserList users={filteredUsers} onToggle={handleToggle} />
            )}

            {!loading && filteredUsers.length > 0 && (
              <div className="mt-6">

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmModal
        isOpen={!!modalUser}
        onClose={() => setModalUser(null)}
        onConfirm={handleConfirmToggle}
        willLock={modalUser?.isActive ?? true}
      />
    </div>
  );
};

export default UserManagement;