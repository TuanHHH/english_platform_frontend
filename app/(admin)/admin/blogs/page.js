"use client";
import React from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BlogManagement = () => {
  const blogs = [
    {
      id: 1,
      title: "10 Tips luyện thi TOEIC hiệu quả nhất",
      author: "Thầy Minh",
      category: "Tips học tập",
      publishDate: "15/03/2024",
      status: "Đã xuất bản",
      views: 2543,
      likes: 189
    },
    {
      id: 2,
      title: "Cách cải thiện kỹ năng Listening trong 30 ngày",
      author: "Cô Lan",
      category: "Kỹ năng",
      publishDate: "12/03/2024",
      status: "Đã xuất bản",
      views: 1876,
      likes: 145
    },
    {
      id: 3,
      title: "Phân tích đề thi TOEIC mới nhất 2024",
      author: "Thầy John",
      category: "Phân tích đề thi",
      publishDate: "",
      status: "Nháp",
      views: 0,
      likes: 0
    },
    {
      id: 4,
      title: "Từ vựng thiết yếu cho bài thi Reading",
      author: "Cô Hoa",
      category: "Từ vựng",
      publishDate: "08/03/2024",
      status: "Chờ duyệt",
      views: 0,
      likes: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã xuất bản":
        return "bg-accent/10 text-accent";
      case "Chờ duyệt":
        return "bg-primary/10 text-primary";
      case "Nháp":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Quản lí blog</h1>
            <p className="text-base sm:text-xl text-muted-foreground">
              Tạo và quản lý nội dung blog giáo dục
            </p>
          </div>
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Viết blog mới
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng bài viết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">245</div>
              <p className="text-xs text-accent font-medium">+12 tháng này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">198</div>
              <p className="text-xs text-primary font-medium">80.8% tổng số</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">7</div>
              <p className="text-xs text-destructive font-medium">Cần xử lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">125K</div>
              <p className="text-xs text-accent font-medium">+15% tháng này</p>
            </CardContent>
          </Card>
        </div>

        {/* Blogs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách blog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:shadow-sm transition"
                >
                  {/* Thông tin blog */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                        {blog.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${getStatusColor(
                          blog.status
                        )}`}
                      >
                        {blog.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-sm text-muted-foreground">
                      <span>
                        <span className="font-medium text-foreground">Tác giả:</span> {blog.author}
                      </span>
                      <span>
                        <span className="font-medium text-foreground">Danh mục:</span> {blog.category}
                      </span>
                      <span>
                        <span className="font-medium text-foreground">Ngày đăng:</span>{" "}
                        {blog.publishDate || "Chưa đăng"}
                      </span>
                      <span>
                        <span className="font-medium text-foreground">Lượt xem:</span> {blog.views}
                      </span>
                      <span>
                        <span className="font-medium text-foreground">Lượt thích:</span> {blog.likes}
                      </span>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {blog.status === "Chờ duyệt" && (
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Duyệt
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
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

export default BlogManagement;