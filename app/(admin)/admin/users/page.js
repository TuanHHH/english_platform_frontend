"use client";
import React from "react";
import { Search, UserPlus, Edit, Ban, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSidebar from "@/components/common/AdminSidebar";

const UserManagement = () => {
  const users = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "nguyenvanan@email.com",
      role: "Học viên",
      joinDate: "15/03/2024",
      lastActive: "Hôm nay",
      testsCompleted: 45,
      avgScore: 78.5,
      status: "Hoạt động"
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tranthibinh@email.com", 
      role: "Học viên",
      joinDate: "08/03/2024",
      lastActive: "2 giờ trước",
      testsCompleted: 23,
      avgScore: 85.2,
      status: "Hoạt động"
    },
    {
      id: 3,
      name: "Lê Hoàng Nam",
      email: "lehoangnam@email.com",
      role: "Giảng viên",
      joinDate: "01/01/2024",
      lastActive: "1 ngày trước",
      testsCompleted: 0,
      avgScore: 0,
      status: "Hoạt động"
    },
    {
      id: 4,
      name: "Phạm Thị Hoa",
      email: "phamthihoa@email.com",
      role: "Học viên",
      joinDate: "20/02/2024",
      lastActive: "3 ngày trước",
      testsCompleted: 67,
      avgScore: 92.1,
      status: "Tạm khóa"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoạt động":
        return "bg-accent/10 text-accent";
      case "Tạm khóa":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Giảng viên":
        return "bg-primary/10 text-primary";
      case "Học viên":
        return "bg-accent/10 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
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

        {/* Search & Filter */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,543</div>
              <p className="text-xs text-accent font-medium">+234 tháng này</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Học viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11,890</div>
              <p className="text-xs text-primary font-medium">94.8% tổng số</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giảng viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">653</div>
              <p className="text-xs text-accent font-medium">5.2% tổng số</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoạt động hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,341</div>
              <p className="text-xs text-primary font-medium">18.7% tổng số</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-soft transition-smooth">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground mt-2">
                        <span>Tham gia: {user.joinDate}</span>
                        <span>Hoạt động: {user.lastActive}</span>
                        <span>Đề thi: {user.testsCompleted}</span>
                        <span>Điểm TB: {user.avgScore > 0 ? user.avgScore : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Ban className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;