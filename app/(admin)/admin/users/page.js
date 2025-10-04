"use client";
import React, { useEffect, useState } from "react";
import { Search, UserPlus, Edit, Mail, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSidebar from "@/components/common/AdminSidebar";
import { getUsers, toggleUserStatus } from "@/lib/api/user";
import { Pagination } from "@/components/ui/pagination";

// Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, willLock }) => {
  if (!isOpen) return null;

  const actionText = willLock ? "khóa" : "mở khóa";

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4">
          Xác nhận {willLock ? "khóa" : "mở khóa"} tài khoản
        </h3>
        <p className="text-sm mb-4">
          Bạn có chắc chắn muốn {actionText} tài khoản này?
        </p>
        <div className="flex justify-end space-x-4">
          {/* Nút Hủy với màu xám */}
          <Button
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
            onClick={onClose}
          >
            Hủy
          </Button>

          {/* Nút Xác nhận với màu đỏ nếu khóa và xanh nếu mở khóa */}
          <Button
            onClick={onConfirm}
            className={
              willLock
                ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                : "bg-green-500 text-white hover:bg-green-600 hover:text-white"
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
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // 0-based
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await getUsers(page + 1, pageSize, searchTerm);
    if (data) {
      setUsers(data.data?.result || []);
      setTotalPages(data.data?.meta?.pages || 0);
    } else {
      setUsers([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchTerm]);

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    const res = await toggleUserStatus(selectedUser.id);
    if (res.success) {
      await fetchUsers();
    } else {
      alert(res.error || "Thao tác thất bại");
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (isActive) =>
    isActive
      ? "bg-accent/10 text-accent"
      : "bg-destructive/10 text-destructive";

  // Tạo cấu hình cho nút hành động theo trạng thái hiện tại
  const getToggleAction = (isActive) => {
    // Nếu đang hoạt động -> hành động là KHÓA
    // Nếu đang tạm khóa -> hành động là MỞ KHÓA
    return isActive
      ? {
          label: "Khóa",
          icon: <Lock className="w-4 h-4" />,
          className: "text-destructive hover:text-destructive",
          willLock: true,
        }
      : {
          label: "Mở khóa",
          icon: <Unlock className="w-4 h-4" />,
          // className: "text-accent hover:text-accent",
          className: "text-black",
          willLock: false,
        };
  };

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
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users List */}
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
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-soft transition-smooth"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {user.fullName?.charAt(0) || "?"}
                        </div>
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

                        {/* Nút hành động khóa/mở khóa theo trạng thái hiện tại */}
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

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </Card>
      </div>

      {/* Confirmation Modal */}
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
