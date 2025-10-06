"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Edit,
  Mail,
  Lock,
  Unlock,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AdminSidebar from "@/components/common/AdminSidebar";
import { getUsers, toggleUserStatus } from "@/lib/api/user";
import { Pagination } from "@/components/ui/pagination";

// Modal xác nhận
const ConfirmModal = ({ isOpen, onClose, onConfirm, willLock }) => {
  if (!isOpen) return null;
  const actionText = willLock ? "khóa" : "mở khóa";
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4">
          Xác nhận {actionText} tài khoản
        </h3>
        <p className="text-sm mb-4">
          Bạn có chắc chắn muốn {actionText} tài khoản này?
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className={
              willLock
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const getInitials = (nameOrEmail) =>
    (nameOrEmail || "")
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  // dữ liệu thô trả từ server cho trang hiện tại
  const [rawUsers, setRawUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tìm kiếm + debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setSearching(true);
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setSearching(false);
    }, 500); // <= yêu cầu "tìm kiếm để delay"
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Phân trang (Spring 0-based)
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Sort + Filter (UI)
  const [sortBy, setSortBy] = useState("createdAt"); // "createdAt" | "fullName" | "isActive"
  const [sortDir, setSortDir] = useState("DESC"); // "ASC" | "DESC"
  const [status, setStatus] = useState("all"); // "all" | "active" | "inactive" (lọc client-side)

  // Modal toggle
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { success, data } = await getUsers({
      page,
      size: pageSize,
      searchTerm: debouncedSearch,
      sortBy, // gửi sort lên backend
      sortDir,
    });

    if (success && data) {
      setRawUsers(data.result ?? []);
      setTotalPages(data.meta?.pages ?? 0);
    } else {
      setRawUsers([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debouncedSearch, sortBy, sortDir]);

  // Lọc trạng thái + fallback sort client-side (đảm bảo đúng ngay cả khi backend bỏ qua sort)
  const users = useMemo(() => {
    let arr = Array.isArray(rawUsers) ? [...rawUsers] : [];

    // Lọc trạng thái (client-side để không cần sửa backend)
    if (status !== "all") {
      const wantActive = status === "active";
      arr = arr.filter((u) => !!u.isActive === wantActive);
    }

    // Fallback sort client-side (ổn định hiển thị)
    const dir = sortDir === "ASC" ? 1 : -1;
    arr.sort((a, b) => {
      if (sortBy === "createdAt") {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return (da - db) * dir;
      }
      if (sortBy === "fullName") {
        return (
          (a.fullName || "").localeCompare(b.fullName || "", "vi", {
            sensitivity: "base",
          }) * dir
        );
      }
      if (sortBy === "isActive") {
        const va = a.isActive ? 1 : 0;
        const vb = b.isActive ? 1 : 0;
        return (va - vb) * dir;
      }
      return 0;
    });

    return arr;
  }, [rawUsers, status, sortBy, sortDir]);

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    const res = await toggleUserStatus(selectedUser.id);
    if (res.success) await fetchUsers();
    else alert(res.error || "Thao tác thất bại");
    setIsModalOpen(false);
  };

  const getStatusColor = (isActive) =>
    isActive
      ? "bg-accent/10 text-accent"
      : "bg-destructive/10 text-destructive";

  const getToggleAction = (isActive) =>
    isActive
      ? {
          label: "Khóa",
          icon: <Lock className="w-4 h-4" />,
          className: "text-destructive",
          willLock: true,
        }
      : {
          label: "Mở khóa",
          icon: <Unlock className="w-4 h-4" />,
          className: "text-green-600",
          willLock: false,
        };

  const sortFieldLabel = useMemo(() => {
    switch (sortBy) {
      case "fullName":
        return "Tên";
      // case "isActive":
      //   return "Trạng thái";
      default:
        return "Thời gian tạo";
    }
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Quản lí người dùng</h1>
            <p className="text-xl text-muted-foreground">
              Quản lý tài khoản và quyền hạn người dùng
            </p>
          </div>
          <Button size="lg">
            <UserPlus className="w-4 h-4 mr-2" /> Thêm người dùng
          </Button>
        </div>

        {/* Search + Filter + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          {/* Search (debounce 500ms) */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setPage(0);
                setSearchTerm(e.target.value);
              }}
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground animate-pulse">
                Đang tìm...
              </div>
            )}
          </div>

          {/* Lọc trạng thái (client-side) */}
          <select
            className="border rounded-md px-3 py-2 bg-white"
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
            title="Lọc trạng thái"
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm khóa</option>
          </select>

          {/* Chọn trường sắp xếp */}
          <select
            className="border rounded-md px-3 py-2 bg-white"
            value={sortBy}
            onChange={(e) => {
              setPage(0);
              setSortBy(e.target.value);
            }}
            title="Sắp xếp theo"
          >
            <option value="createdAt">Thời gian tạo</option>
            <option value="fullName">Tên</option>
            {/* <option value="isActive">Trạng thái</option> */}
          </select>

          {/* Hướng sắp xếp */}
          <Button
            variant="outline"
            onClick={() => {
              setPage(0);
              setSortDir((d) => (d === "ASC" ? "DESC" : "ASC"));
            }}
            title={`Đảo thứ tự (${sortDir})`}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {sortFieldLabel} ({sortDir})
          </Button>
        </div>

        {/* Danh sách người dùng */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Đang tải...</p>
            ) : users.length === 0 ? (
              <p>Không có người dùng nào.</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => {
                  const action = getToggleAction(user.isActive);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar
                          className={`h-12 w-12 ${
                            user.isActive ? "" : "ring-2 ring-destructive/30"
                          }`}
                        >
                          <AvatarImage
                            src={user.avatarUrl || undefined}
                            alt={user.fullName || user.email || "avatar"}
                            loading="lazy"
                          />
                          <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                            {getInitials(user.fullName || user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold">{user.fullName}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                user.isActive
                              )}`}
                            >
                              {user.isActive ? "Hoạt động" : "Tạm khóa"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={action.className}
                          onClick={() => {
                            setSelectedUser(user);
                            setIsModalOpen(true);
                          }}
                          title={action.label}
                        >
                          {action.icon}
                          <span className="ml-1 hidden sm:inline">
                            {action.label}
                          </span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>

          {/* Lưu ý: Pagination server-side 0-based; nếu component của bạn 1-based, nhớ cộng/trừ */}
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(n) => setPage(n - 1)}
          />
        </Card>
      </div>

      {/* Modal xác nhận khóa/mở */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleToggleStatus}
        willLock={selectedUser?.isActive ?? true}
      />
    </div>
  );
};

export default UserManagement;