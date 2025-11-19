// // // // // // // // "use client";

// // // // // // // // import React from "react";
// // // // // // // // import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";
// // // // // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// // // // // // // // export default function AdminDashboard() {
// // // // // // // //   const stats = [
// // // // // // // //     {
// // // // // // // //       title: "Tổng người dùng",
// // // // // // // //       value: "12,543",
// // // // // // // //       change: "+12%",
// // // // // // // //       icon: Users,
// // // // // // // //       color: "text-primary",
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       title: "Đề thi đã tạo",
// // // // // // // //       value: "1,247",
// // // // // // // //       change: "+8%",
// // // // // // // //       icon: FileText,
// // // // // // // //       color: "text-accent",
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       title: "Lượt thi tuần này",
// // // // // // // //       value: "8,932",
// // // // // // // //       change: "+24%",
// // // // // // // //       icon: TrendingUp,
// // // // // // // //       color: "text-primary-variant",
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       title: "Tỷ lệ hoàn thành",
// // // // // // // //       value: "87%",
// // // // // // // //       change: "+5%",
// // // // // // // //       icon: BarChart3,
// // // // // // // //       color: "text-accent",
// // // // // // // //     },
// // // // // // // //   ];

// // // // // // // //   const recentActivities = [
// // // // // // // //     "Người dùng mới đăng ký: nguyenvan@email.com",
// // // // // // // //     "Đề thi mới được tạo: TOEIC Full Test #125",
// // // // // // // //     "Báo cáo forum mới từ người dùng ID: 8845",
// // // // // // // //     "Blog mới được đăng: Tips luyện Listening hiệu quả",
// // // // // // // //     "Cập nhật điểm số: Lớp học buổi sáng",
// // // // // // // //   ];

// // // // // // // //   return (
// // // // // // // //     <div>
// // // // // // // //       <div className="mb-8">
// // // // // // // //         <h1 className="text-4xl font-bold mb-4">Tổng quan</h1>
// // // // // // // //         <p className="text-xl text-muted-foreground">
// // // // // // // //           Bảng điều khiển quản trị hệ thống
// // // // // // // //         </p>
// // // // // // // //       </div>

// // // // // // // //       {/* Stats Cards */}
// // // // // // // //       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// // // // // // // //         {stats.map((stat, index) => {
// // // // // // // //           const Icon = stat.icon;
// // // // // // // //           return (
// // // // // // // //             <Card key={index}>
// // // // // // // //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // // // // //                 <CardTitle className="text-sm font-medium">
// // // // // // // //                   {stat.title}
// // // // // // // //                 </CardTitle>
// // // // // // // //                 <Icon className={`w-4 h-4 ${stat.color}`} />
// // // // // // // //               </CardHeader>
// // // // // // // //               <CardContent>
// // // // // // // //                 <div className="text-2xl font-bold">{stat.value}</div>
// // // // // // // //                 <p className="text-xs text-accent font-medium">
// // // // // // // //                   {stat.change} từ tháng trước
// // // // // // // //                 </p>
// // // // // // // //               </CardContent>
// // // // // // // //             </Card>
// // // // // // // //           );
// // // // // // // //         })}
// // // // // // // //       </div>

// // // // // // // //       {/* Recent Activities */}
// // // // // // // //       <div className="grid lg:grid-cols-2 gap-8">
// // // // // // // //         <Card>
// // // // // // // //           <CardHeader>
// // // // // // // //             <CardTitle>Hoạt động gần đây</CardTitle>
// // // // // // // //           </CardHeader>
// // // // // // // //           <CardContent>
// // // // // // // //             <div className="space-y-4">
// // // // // // // //               {recentActivities.map((activity, index) => (
// // // // // // // //                 <div key={index} className="flex items-center space-x-2">
// // // // // // // //                   <div className="w-2 h-2 bg-primary rounded-full" />
// // // // // // // //                   <span className="text-sm">{activity}</span>
// // // // // // // //                 </div>
// // // // // // // //               ))}
// // // // // // // //             </div>
// // // // // // // //           </CardContent>
// // // // // // // //         </Card>

// // // // // // // //         <Card>
// // // // // // // //           <CardHeader>
// // // // // // // //             <CardTitle>Thống kê nhanh</CardTitle>
// // // // // // // //           </CardHeader>
// // // // // // // //           <CardContent className="space-y-4">
// // // // // // // //             <div className="flex justify-between">
// // // // // // // //               <span>Đăng ký mới hôm nay:</span>
// // // // // // // //               <span className="font-bold">23</span>
// // // // // // // //             </div>
// // // // // // // //             <div className="flex justify-between">
// // // // // // // //               <span>Lượt thi hôm nay:</span>
// // // // // // // //               <span className="font-bold">156</span>
// // // // // // // //             </div>
// // // // // // // //             <div className="flex justify-between">
// // // // // // // //               <span>Báo cáo chờ xử lý:</span>
// // // // // // // //               <span className="font-bold text-destructive">4</span>
// // // // // // // //             </div>
// // // // // // // //             <div className="flex justify-between">
// // // // // // // //               <span>Blog chờ duyệt:</span>
// // // // // // // //               <span className="font-bold text-accent">7</span>
// // // // // // // //             </div>
// // // // // // // //           </CardContent>
// // // // // // // //         </Card>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }
// // // // // // // // app/admin/dashboard/page.js  (hoặc components/AdminDashboard.js)
// // // // // // // "use client";

// // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // import { BarChart3, Users, FileText, TrendingUp, DollarSign, BookOpen, AlertCircle, Clock } from "lucide-react";
// // // // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // // // // // import { Skeleton } from "@/components/ui/skeleton";
// // // // // // // import { Badge } from "@/components/ui/badge";
// // // // // // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // // // // // import { formatCurrency } from "@/lib/utils";
// // // // // // // import {
// // // // // // //   getAdminOverview,
// // // // // // //   getRevenueStats,
// // // // // // //   getUserGrowthStats,
// // // // // // //   getTopCourses,
// // // // // // // } from "@/lib/api/admin-overview";

// // // // // // // export default function AdminDashboard() {
// // // // // // //   const [overview, setOverview] = useState(null);
// // // // // // //   const [revenue, setRevenue] = useState([]);
// // // // // // //   const [userGrowth, setUserGrowth] = useState([]);
// // // // // // //   const [topCourses, setTopCourses] = useState([]);
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [error, setError] = useState(null);

// // // // // // //   useEffect(() => {
// // // // // // //     const fetchData = async () => {
// // // // // // //       try {
// // // // // // //         setLoading(true);
// // // // // // //         setError(null);

// // // // // // //         const [overviewRes, revenueRes, growthRes, topRes] = await Promise.all([
// // // // // // //           getAdminOverview(),
// // // // // // //           getRevenueStats({ groupBy: "day" }),
// // // // // // //           getUserGrowthStats({ groupBy: "day" }),
// // // // // // //           getTopCourses({ limit: 5 }),
// // // // // // //         ]);

// // // // // // //         if (overviewRes.success) setOverview(overviewRes.data);
// // // // // // //         if (revenueRes.success) setRevenue(revenueRes.data || []);
// // // // // // //         if (growthRes.success) setUserGrowth(growthRes.data || []);
// // // // // // //         if (topRes.success) setTopCourses(topRes.data || []);

// // // // // // //       } catch (err) {
// // // // // // //         setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
// // // // // // //         console.error("Dashboard load error:", err);
// // // // // // //       } finally {
// // // // // // //         setLoading(false);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     fetchData();
// // // // // // //   }, []);

// // // // // // //   // Mock recent activities (có thể thay bằng API sau)
// // // // // // //   const recentActivities = overview?.recentActivities || [
// // // // // // //     "Người dùng mới đăng ký: nguyenvan@email.com",
// // // // // // //     "Đề thi mới được tạo: TOEIC Full Test #125",
// // // // // // //     "Báo cáo forum mới từ người dùng ID: 8845",
// // // // // // //     "Blog mới được đăng: Tips luyện Listening hiệu quả",
// // // // // // //     "Cập nhật điểm số: Lớp học buổi sáng",
// // // // // // //   ];

// // // // // // //   if (loading) {
// // // // // // //     return <DashboardSkeleton />;
// // // // // // //   }

// // // // // // //   if (error) {
// // // // // // //     return (
// // // // // // //       <Alert variant="destructive">
// // // // // // //         <AlertCircle className="h-4 w-4" />
// // // // // // //         <AlertDescription>{error}</AlertDescription>
// // // // // // //       </Alert>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   const stats = [
// // // // // // //     {
// // // // // // //       title: "Tổng người dùng",
// // // // // // //       value: overview?.totalUsers?.toLocaleString() || "0",
// // // // // // //       change: `+${overview?.userGrowthThisMonth || 0}%`,
// // // // // // //       icon: Users,
// // // // // // //       color: "text-blue-600",
// // // // // // //     },
// // // // // // //     {
// // // // // // //       title: "Đề thi đã tạo",
// // // // // // //       value: overview?.totalQuizzes?.toLocaleString() || "0",
// // // // // // //       change: `+${overview?.quizGrowthThisMonth || 0}%`,
// // // // // // //       icon: FileText,
// // // // // // //       color: "text-green-600",
// // // // // // //     },
// // // // // // //     {
// // // // // // //       title: "Lượt thi tuần này",
// // // // // // //       value: overview?.weeklyAttempts?.toLocaleString() || "0",
// // // // // // //       change: `+${overview?.attemptGrowth || 0}%`,
// // // // // // //       icon: TrendingUp,
// // // // // // //       color: "text-purple-600",
// // // // // // //     },
// // // // // // //     {
// // // // // // //       title: "Tỷ lệ hoàn thành",
// // // // // // //       value: `${overview?.completionRate || 0}%`,
// // // // // // //       change: `+${overview?.completionRateChange || 0}%`,
// // // // // // //       icon: BarChart3,
// // // // // // //       color: "text-orange-600",
// // // // // // //     },
// // // // // // //   ];

// // // // // // //   return (
// // // // // // //     <div className="space-y-8">
// // // // // // //       {/* Header */}
// // // // // // //       <div>
// // // // // // //         <h1 className="text-4xl font-bold mb-2">Tổng quan Admin</h1>
// // // // // // //         <p className="text-muted-foreground">
// // // // // // //           Theo dõi hiệu suất hệ thống và hoạt động người dùng
// // // // // // //         </p>
// // // // // // //       </div>

// // // // // // //       {/* Stats Grid */}
// // // // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // // // // // //         {stats.map((stat, i) => {
// // // // // // //           const Icon = stat.icon;
// // // // // // //           return (
// // // // // // //             <Card key={i} className="hover:shadow-lg transition-shadow">
// // // // // // //               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
// // // // // // //                 <CardTitle className="text-sm font-medium text-muted-foreground">
// // // // // // //                   {stat.title}
// // // // // // //                 </CardTitle>
// // // // // // //                 <Icon className={`w-5 h-5 ${stat.color}`} />
// // // // // // //               </CardHeader>
// // // // // // //               <CardContent>
// // // // // // //                 <div className="text-2xl font-bold">{stat.value}</div>
// // // // // // //                 <p className="text-xs text-muted-foreground mt-1">
// // // // // // //                   <span className="text-green-600 font-medium">{stat.change}</span> so với tháng trước
// // // // // // //                 </p>
// // // // // // //               </CardContent>
// // // // // // //             </Card>
// // // // // // //           );
// // // // // // //         })}
// // // // // // //       </div>

// // // // // // //       {/* Main Content Grid */}
// // // // // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // // // // //         {/* Recent Activities */}
// // // // // // //         <Card className="lg:col-span-2">
// // // // // // //           <CardHeader>
// // // // // // //             <CardTitle className="flex items-center gap-2">
// // // // // // //               <Clock className="w-5 h-5" />
// // // // // // //               Hoạt động gần đây
// // // // // // //             </CardTitle>
// // // // // // //           </CardHeader>
// // // // // // //           <CardContent>
// // // // // // //             <div className="space-y-3">
// // // // // // //               {recentActivities.map((activity, i) => (
// // // // // // //                 <div key={i} className="flex items-start gap-3 text-sm">
// // // // // // //                   <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
// // // // // // //                   <span className="text-muted-foreground">{activity}</span>
// // // // // // //                 </div>
// // // // // // //               ))}
// // // // // // //             </div>
// // // // // // //           </CardContent>
// // // // // // //         </Card>

// // // // // // //         {/* Quick Stats */}
// // // // // // //         <Card>
// // // // // // //           <CardHeader>
// // // // // // //             <CardTitle className="flex items-center gap-2">
// // // // // // //               <DollarSign className="w-5 h-5" />
// // // // // // //               Thống kê nhanh
// // // // // // //             </CardTitle>
// // // // // // //           </CardHeader>
// // // // // // //           <CardContent className="space-y-4">
// // // // // // //             <div className="flex justify-between items-center">
// // // // // // //               <span className="text-sm text-muted-foreground">Doanh thu hôm nay</span>
// // // // // // //               <span className="font-bold text-lg">
// // // // // // //                 {formatCurrency(overview?.todayRevenue || 0)}
// // // // // // //               </span>
// // // // // // //             </div>
// // // // // // //             <div className="flex justify-between items-center">
// // // // // // //               <span className="text-sm text-muted-foreground">Đơn hàng mới</span>
// // // // // // //               <Badge variant="secondary" className="font-bold">
// // // // // // //                 {overview?.todayOrders || 0}
// // // // // // //               </Badge>
// // // // // // //             </div>
// // // // // // //             <div className="flex justify-between items-center">
// // // // // // //               <span className="text-sm text-muted-foreground">Báo cáo chờ xử lý</span>
// // // // // // //               <Badge variant="destructive" className="font-bold">
// // // // // // //                 {overview?.pendingReports || 0}
// // // // // // //               </Badge>
// // // // // // //             </div>
// // // // // // //             <div className="flex justify-between items-center">
// // // // // // //               <span className="text-sm text-muted-foreground">Khóa học chờ duyệt</span>
// // // // // // //               <Badge variant="outline" className="font-bold text-orange-600">
// // // // // // //                 {overview?.pendingCourses || 0}
// // // // // // //               </Badge>
// // // // // // //             </div>
// // // // // // //           </CardContent>
// // // // // // //         </Card>
// // // // // // //       </div>

// // // // // // //       {/* Revenue & Top Courses */}
// // // // // // //       <div className="grid lg:grid-cols-2 gap-6">
// // // // // // //         {/* Revenue Chart Placeholder */}
// // // // // // //         <Card>
// // // // // // //           <CardHeader>
// // // // // // //             <CardTitle>Doanh thu 7 ngày gần nhất</CardTitle>
// // // // // // //           </CardHeader>
// // // // // // //           <CardContent>
// // // // // // //             <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
// // // // // // //               <p className="text-center">
// // // // // // //                 Biểu đồ doanh thu sẽ được tích hợp ở đây
// // // // // // //                 <br />
// // // // // // //                 <span className="text-xs">Dữ liệu: {revenue.length} ngày</span>
// // // // // // //               </p>
// // // // // // //             </div>
// // // // // // //           </CardContent>
// // // // // // //         </Card>

// // // // // // //         {/* Top Courses */}
// // // // // // //         <Card>
// // // // // // //           <CardHeader>
// // // // // // //             <CardTitle className="flex items-center gap-2">
// // // // // // //               <BookOpen className="w-5 h-5" />
// // // // // // //               Top 5 khóa học bán chạy
// // // // // // //             </CardTitle>
// // // // // // //           </CardHeader>
// // // // // // //           <CardContent>
// // // // // // //             {topCourses.length > 0 ? (
// // // // // // //               <div className="space-y-3">
// // // // // // //                 {topCourses.map((course, i) => (
// // // // // // //                   <div key={course.id} className="flex items-center justify-between">
// // // // // // //                     <div className="flex items-center gap-3">
// // // // // // //                       <span className="text-sm font-medium text-muted-foreground">
// // // // // // //                         #{i + 1}
// // // // // // //                       </span>
// // // // // // //                       <div>
// // // // // // //                         <p className="font-medium text-sm">{course.title}</p>
// // // // // // //                         <p className="text-xs text-muted-foreground">
// // // // // // //                           {course.enrollments} lượt mua
// // // // // // //                         </p>
// // // // // // //                       </div>
// // // // // // //                     </div>
// // // // // // //                     <span className="font-bold text-sm">
// // // // // // //                       {formatCurrency(course.revenue)}
// // // // // // //                     </span>
// // // // // // //                   </div>
// // // // // // //                 ))}
// // // // // // //               </div>
// // // // // // //             ) : (
// // // // // // //               <p className="text-center text-muted-foreground py-8">
// // // // // // //                 Chưa có dữ liệu khóa học
// // // // // // //               </p>
// // // // // // //             )}
// // // // // // //           </CardContent>
// // // // // // //         </Card>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // // // Loading Skeleton
// // // // // // // function DashboardSkeleton() {
// // // // // // //   return (
// // // // // // //     <div className="space-y-8">
// // // // // // //       <div>
// // // // // // //         <Skeleton className="h-10 w-64 mb-2" />
// // // // // // //         <Skeleton className="h-5 w-96" />
// // // // // // //       </div>
// // // // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // // // // // //         {[...Array(4)].map((_, i) => (
// // // // // // //           <Card key={i}>
// // // // // // //             <CardHeader className="flex flex-row items-center justify-between pb-2">
// // // // // // //               <Skeleton className="h-4 w-32" />
// // // // // // //               <Skeleton className="h-5 w-5 rounded-full" />
// // // // // // //             </CardHeader>
// // // // // // //             <CardContent>
// // // // // // //               <Skeleton className="h-8 w-24 mb-2" />
// // // // // // //               <Skeleton className="h-3 w-20" />
// // // // // // //             </CardContent>
// // // // // // //           </Card>
// // // // // // //         ))}
// // // // // // //       </div>
// // // // // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // // // // //         <Card className="lg:col-span-2">
// // // // // // //           <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
// // // // // // //           <CardContent>
// // // // // // //             {[...Array(5)].map((_, i) => (
// // // // // // //               <div key={i} className="flex items-center gap-3 mb-3">
// // // // // // //                 <Skeleton className="h-2 w-2 rounded-full" />
// // // // // // //                 <Skeleton className="h-4 w-full" />
// // // // // // //               </div>
// // // // // // //             ))}
// // // // // // //           </CardContent>
// // // // // // //         </Card>
// // // // // // //         <Card>
// // // // // // //           <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
// // // // // // //           <CardContent>
// // // // // // //             {[...Array(4)].map((_, i) => (
// // // // // // //               <div key={i} className="flex justify-between mb-3">
// // // // // // //                 <Skeleton className="h-4 w-32" />
// // // // // // //                 <Skeleton className="h-4 w-16" />
// // // // // // //               </div>
// // // // // // //             ))}
// // // // // // //           </CardContent>
// // // // // // //         </Card>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }
// // // // // // // AdminDashboard.js (hoặc app/admin/dashboard/page.js)
// // // // // // "use client";

// // // // // // import React, { useEffect, useState } from "react";
// // // // // // import { BarChart3, Users, FileText, TrendingUp, DollarSign, BookOpen, AlertCircle, Clock } from "lucide-react";
// // // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // // // // import { Skeleton } from "@/components/ui/skeleton";
// // // // // // import { Badge } from "@/components/ui/badge";
// // // // // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // // // // import { formatCurrency } from "@/lib/utils";
// // // // // // import { getAdminOverview, mockOverview } from "@/lib/api/admin-overview"; // Import mock fallback

// // // // // // export default function AdminDashboard() {
// // // // // //   const [overview, setOverview] = useState(null);
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [error, setError] = useState(null);

// // // // // //   useEffect(() => {
// // // // // //     const fetchData = async () => {
// // // // // //       try {
// // // // // //         setLoading(true);
// // // // // //         setError(null);

// // // // // //         // Chỉ gọi 1 API chính (có sẵn từ controller)
// // // // // //         const overviewRes = await getAdminOverview();

// // // // // //         if (overviewRes.success) {
// // // // // //           // Map real data từ DashboardSummaryResponse (cấu trúc từ controller)
// // // // // //           const realData = mapRealOverviewData(overviewRes.data);
// // // // // //           setOverview(realData);
// // // // // //         } else {
// // // // // //           // Fallback mock nếu API fail (dev mode)
// // // // // //           console.warn("API fail, using mock data:", overviewRes.error);
// // // // // //           setOverview(mockOverview);
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         setError("Không thể tải dữ liệu. Sử dụng dữ liệu mẫu.");
// // // // // //         console.error("Dashboard load error:", err);
// // // // // //         // Fallback mock ngay lập tức
// // // // // //         setOverview(mockOverview);
// // // // // //       } finally {
// // // // // //         setLoading(false);
// // // // // //       }
// // // // // //     };

// // // // // //     fetchData();
// // // // // //   }, []);

// // // // // //   // Hàm map real data từ API response (dựa trên DTO từ controller)
// // // // // //   function mapRealOverviewData(apiData) {
// // // // // //     if (!apiData) return mockOverview;

// // // // // //     return {
// // // // // //       // Users
// // // // // //       totalUsers: apiData.users?.total || 0,
// // // // // //       activeUsers: apiData.users?.active || 0,
// // // // // //       userGrowthThisMonth: apiData.users?.weekGrowth || 0,
// // // // // //       userGrowthPercentage: apiData.users?.activePercentage || 0,

// // // // // //       // Quizzes
// // // // // //       totalQuizzes: apiData.quizzes?.totalQuizzes || 0,
// // // // // //       quizGrowthThisMonth: 0, // Có thể tính từ API khác sau

// // // // // //       // Learning (attempts & completion)
// // // // // //       weeklyAttempts: apiData.learning?.totalAttempts || 0,
// // // // // //       attemptGrowth: 0, // Mock tạm
// // // // // //       completionRate: apiData.learning?.averageProgress || 0,
// // // // // //       completionRateChange: 0, // Mock tạm

// // // // // //       // Revenue (tính VND từ cents)
// // // // // //       todayRevenue: (apiData.revenue?.totalCentsThisMonth || 0) / 100, // Giả sử cents → VND
// // // // // //       monthlyRevenue: (apiData.revenue?.totalCentsThisMonth || 0) / 100,
// // // // // //       revenueGrowth: apiData.revenue?.growthPercentage || 0,

// // // // // //       // Orders
// // // // // //       todayOrders: apiData.orders?.totalOrdersThisMonth || 0,

// // // // // //       // Pending (từ InstructorStats, ContentStats, etc.)
// // // // // //       pendingCourses: apiData.courses?.draft || 0,
// // // // // //       pendingReports: apiData.content?.lockedThreads || 0, // Hoặc từ forum reports

// // // // // //       // Recent activities (mock hoặc từ PendingActionsResponse nếu gọi thêm)
// // // // // //       recentActivities: apiData.recentActivities || mockOverview.recentActivities,

// // // // // //       // Top courses (mock hoặc từ API sau)
// // // // // //       topCourses: apiData.topCourses || mockOverview.topCourses,

// // // // // //       // Full raw data để debug
// // // // // //       raw: apiData,
// // // // // //     };
// // // // // //   }

// // // // // //   if (loading) {
// // // // // //     return <DashboardSkeleton />;
// // // // // //   }

// // // // // //   // Kiểm tra nếu dùng mock
// // // // // //   const isMock = !overview?.raw || Object.keys(overview.raw).length === 0;
// // // // // //   const recentActivities = overview?.recentActivities || mockOverview.recentActivities;
// // // // // //   const topCourses = overview?.topCourses || [];

// // // // // //   const stats = [
// // // // // //     {
// // // // // //       title: "Tổng người dùng",
// // // // // //       value: overview?.totalUsers?.toLocaleString() || "0",
// // // // // //       change: `+${overview?.userGrowthPercentage || 0}%`,
// // // // // //       icon: Users,
// // // // // //       color: "text-blue-600",
// // // // // //     },
// // // // // //     {
// // // // // //       title: "Đề thi đã tạo",
// // // // // //       value: overview?.totalQuizzes?.toLocaleString() || "0",
// // // // // //       change: `+${overview?.quizGrowthThisMonth || 0}%`,
// // // // // //       icon: FileText,
// // // // // //       color: "text-green-600",
// // // // // //     },
// // // // // //     {
// // // // // //       title: "Lượt thi tuần này",
// // // // // //       value: overview?.weeklyAttempts?.toLocaleString() || "0",
// // // // // //       change: `+${overview?.attemptGrowth || 0}%`,
// // // // // //       icon: TrendingUp,
// // // // // //       color: "text-purple-600",
// // // // // //     },
// // // // // //     {
// // // // // //       title: "Tỷ lệ hoàn thành",
// // // // // //       value: `${overview?.completionRate || 0}%`,
// // // // // //       change: `+${overview?.completionRateChange || 0}%`,
// // // // // //       icon: BarChart3,
// // // // // //       color: "text-orange-600",
// // // // // //     },
// // // // // //   ];

// // // // // //   return (
// // // // // //     <div className="space-y-8">
// // // // // //       {/* Header */}
// // // // // //       <div>
// // // // // //         <h1 className="text-4xl font-bold mb-2">Tổng quan Admin</h1>
// // // // // //         <p className="text-muted-foreground">
// // // // // //           Theo dõi hiệu suất hệ thống và hoạt động người dùng
// // // // // //           {isMock && (
// // // // // //             <Badge variant="secondary" className="ml-2">
// // // // // //               Dữ liệu mẫu (API chưa sẵn sàng)
// // // // // //             </Badge>
// // // // // //           )}
// // // // // //         </p>
// // // // // //         {error && (
// // // // // //           <Alert variant="destructive" className="mt-2">
// // // // // //             <AlertCircle className="h-4 w-4" />
// // // // // //             <AlertDescription>{error}</AlertDescription>
// // // // // //           </Alert>
// // // // // //         )}
// // // // // //       </div>

// // // // // //       {/* Stats Grid */}
// // // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // // // // //         {stats.map((stat, i) => {
// // // // // //           const Icon = stat.icon;
// // // // // //           return (
// // // // // //             <Card key={i} className="hover:shadow-lg transition-shadow">
// // // // // //               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
// // // // // //                 <CardTitle className="text-sm font-medium text-muted-foreground">
// // // // // //                   {stat.title}
// // // // // //                 </CardTitle>
// // // // // //                 <Icon className={`w-5 h-5 ${stat.color}`} />
// // // // // //               </CardHeader>
// // // // // //               <CardContent>
// // // // // //                 <div className="text-2xl font-bold">{stat.value}</div>
// // // // // //                 <p className="text-xs text-muted-foreground mt-1">
// // // // // //                   <span className="text-green-600 font-medium">{stat.change}</span> so với tháng trước
// // // // // //                 </p>
// // // // // //               </CardContent>
// // // // // //             </Card>
// // // // // //           );
// // // // // //         })}
// // // // // //       </div>

// // // // // //       {/* Main Content Grid */}
// // // // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // // // //         {/* Recent Activities */}
// // // // // //         <Card className="lg:col-span-2">
// // // // // //           <CardHeader>
// // // // // //             <CardTitle className="flex items-center gap-2">
// // // // // //               <Clock className="w-5 h-5" />
// // // // // //               Hoạt động gần đây
// // // // // //             </CardTitle>
// // // // // //           </CardHeader>
// // // // // //           <CardContent>
// // // // // //             <div className="space-y-3">
// // // // // //               {recentActivities.slice(0, 5).map((activity, i) => (
// // // // // //                 <div key={i} className="flex items-start gap-3 text-sm">
// // // // // //                   <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
// // // // // //                   <span className="text-muted-foreground">{activity}</span>
// // // // // //                 </div>
// // // // // //               ))}
// // // // // //             </div>
// // // // // //           </CardContent>
// // // // // //         </Card>

// // // // // //         {/* Quick Stats */}
// // // // // //         <Card>
// // // // // //           <CardHeader>
// // // // // //             <CardTitle className="flex items-center gap-2">
// // // // // //               <DollarSign className="w-5 h-5" />
// // // // // //               Thống kê nhanh
// // // // // //             </CardTitle>
// // // // // //           </CardHeader>
// // // // // //           <CardContent className="space-y-4">
// // // // // //             <div className="flex justify-between items-center">
// // // // // //               <span className="text-sm text-muted-foreground">Doanh thu hôm nay</span>
// // // // // //               <span className="font-bold text-lg">
// // // // // //                 {formatCurrency(overview?.todayRevenue || 0)}
// // // // // //               </span>
// // // // // //             </div>
// // // // // //             <div className="flex justify-between items-center">
// // // // // //               <span className="text-sm text-muted-foreground">Đơn hàng mới</span>
// // // // // //               <Badge variant="secondary" className="font-bold">
// // // // // //                 {overview?.todayOrders || 0}
// // // // // //               </Badge>
// // // // // //             </div>
// // // // // //             <div className="flex justify-between items-center">
// // // // // //               <span className="text-sm text-muted-foreground">Báo cáo chờ xử lý</span>
// // // // // //               <Badge variant="destructive" className="font-bold">
// // // // // //                 {overview?.pendingReports || 0}
// // // // // //               </Badge>
// // // // // //             </div>
// // // // // //             <div className="flex justify-between items-center">
// // // // // //               <span className="text-sm text-muted-foreground">Khóa học chờ duyệt</span>
// // // // // //               <Badge variant="outline" className="font-bold text-orange-600">
// // // // // //                 {overview?.pendingCourses || 0}
// // // // // //               </Badge>
// // // // // //             </div>
// // // // // //           </CardContent>
// // // // // //         </Card>
// // // // // //       </div>

// // // // // //       {/* Revenue & Top Courses */}
// // // // // //       <div className="grid lg:grid-cols-2 gap-6">
// // // // // //         {/* Revenue Chart Placeholder (có thể thêm Recharts sau) */}
// // // // // //         <Card>
// // // // // //           <CardHeader>
// // // // // //             <CardTitle>Doanh thu tháng này</CardTitle>
// // // // // //           </CardHeader>
// // // // // //           <CardContent>
// // // // // //             <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
// // // // // //               <p className="text-center">
// // // // // //                 Biểu đồ doanh thu sẽ được tích hợp ở đây
// // // // // //                 <br />
// // // // // //                 <span className="text-xs">Tăng trưởng: +{overview?.revenueGrowth || 0}%</span>
// // // // // //               </p>
// // // // // //             </div>
// // // // // //           </CardContent>
// // // // // //         </Card>

// // // // // //         {/* Top Courses */}
// // // // // //         <Card>
// // // // // //           <CardHeader>
// // // // // //             <CardTitle className="flex items-center gap-2">
// // // // // //               <BookOpen className="w-5 h-5" />
// // // // // //               Top 5 khóa học bán chạy
// // // // // //             </CardTitle>
// // // // // //           </CardHeader>
// // // // // //           <CardContent>
// // // // // //             {topCourses.length > 0 ? (
// // // // // //               <div className="space-y-3">
// // // // // //                 {topCourses.map((course, i) => (
// // // // // //                   <div key={course.id} className="flex items-center justify-between">
// // // // // //                     <div className="flex items-center gap-3">
// // // // // //                       <span className="text-sm font-medium text-muted-foreground">#{i + 1}</span>
// // // // // //                       <div>
// // // // // //                         <p className="font-medium text-sm">{course.title}</p>
// // // // // //                         <p className="text-xs text-muted-foreground">{course.enrollments} lượt mua</p>
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                     <span className="font-bold text-sm">{formatCurrency(course.revenue)}</span>
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             ) : (
// // // // // //               <p className="text-center text-muted-foreground py-8">Chưa có dữ liệu khóa học</p>
// // // // // //             )}
// // // // // //           </CardContent>
// // // // // //         </Card>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // // Loading Skeleton (giữ nguyên)
// // // // // // function DashboardSkeleton() {
// // // // // //   return (
// // // // // //     <div className="space-y-8">
// // // // // //       <div>
// // // // // //         <Skeleton className="h-10 w-64 mb-2" />
// // // // // //         <Skeleton className="h-5 w-96" />
// // // // // //       </div>
// // // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // // // // //         {[...Array(4)].map((_, i) => (
// // // // // //           <Card key={i}>
// // // // // //             <CardHeader className="flex flex-row items-center justify-between pb-2">
// // // // // //               <Skeleton className="h-4 w-32" />
// // // // // //               <Skeleton className="h-5 w-5 rounded-full" />
// // // // // //             </CardHeader>
// // // // // //             <CardContent>
// // // // // //               <Skeleton className="h-8 w-24 mb-2" />
// // // // // //               <Skeleton className="h-3 w-20" />
// // // // // //             </CardContent>
// // // // // //           </Card>
// // // // // //         ))}
// // // // // //       </div>
// // // // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // // // //         <Card className="lg:col-span-2">
// // // // // //           <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
// // // // // //           <CardContent>
// // // // // //             {[...Array(5)].map((_, i) => (
// // // // // //               <div key={i} className="flex items-center gap-3 mb-3">
// // // // // //                 <Skeleton className="h-2 w-2 rounded-full" />
// // // // // //                 <Skeleton className="h-4 w-full" />
// // // // // //               </div>
// // // // // //             ))}
// // // // // //           </CardContent>
// // // // // //         </Card>
// // // // // //         <Card>
// // // // // //           <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
// // // // // //           <CardContent>
// // // // // //             {[...Array(4)].map((_, i) => (
// // // // // //               <div key={i} className="flex justify-between mb-3">
// // // // // //                 <Skeleton className="h-4 w-32" />
// // // // // //                 <Skeleton className="h-4 w-16" />
// // // // // //               </div>
// // // // // //             ))}
// // // // // //           </CardContent>
// // // // // //         </Card>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // "use client";

// // // // // import React, { useEffect, useState } from "react";
// // // // // import { BarChart3, Users, FileText, TrendingUp, DollarSign, BookOpen, AlertCircle, Clock } from "lucide-react";
// // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // // // import { Skeleton } from "@/components/ui/skeleton";
// // // // // import { Badge } from "@/components/ui/badge";
// // // // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // // // import { formatCurrency } from "@/lib/utils";
// // // // // import { getAdminOverview } from "@/lib/api/admin-overview";

// // // // // // Mock data cho recentActivities & topCourses (backend chưa trả về)
// // // // // const mockRecentActivities = [
// // // // //   "Người dùng mới đăng ký: admin@example.com",
// // // // //   "Đề thi mới được tạo: Listening Practice #1",
// // // // //   "Blog mới: Hướng dẫn luyện TOEIC",
// // // // //   "Cập nhật khóa học: TOEIC Full Course",
// // // // //   "Báo cáo forum: Thread #2",
// // // // // ];

// // // // // const mockTopCourses = [
// // // // //   { id: "1", title: "TOEIC Full Course", enrollments: 1, revenue: 500000 },
// // // // //   { id: "2", title: "IELTS Speaking", enrollments: 0, revenue: 0 },
// // // // // ];

// // // // // export default function AdminDashboard() {
// // // // //   const [overview, setOverview] = useState(null);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [error, setError] = useState(null);

// // // // //   useEffect(() => {
// // // // //     const fetchData = async () => {
// // // // //       try {
// // // // //         setLoading(true);
// // // // //         setError(null);

// // // // //         const overviewRes = await getAdminOverview();

// // // // //         if (overviewRes.success && overviewRes.data) {
// // // // //           setOverview(mapRealOverviewData(overviewRes.data));
// // // // //         } else {
// // // // //           throw new Error(overviewRes.error || "Lỗi không xác định");
// // // // //         }
// // // // //       } catch (err) {
// // // // //         setError("Không thể tải dữ liệu. Vui lòng thử lại.");
// // // // //         console.error("Dashboard error:", err);
// // // // //         // Fallback mock
// // // // //         setOverview({
// // // // //           totalUsers: 2,
// // // // //           totalQuizzes: 1,
// // // // //           weeklyAttempts: 1,
// // // // //           completionRate: 0,
// // // // //           todayRevenue: 0,
// // // // //           todayOrders: 0,
// // // // //           pendingReports: 0,
// // // // //           pendingCourses: 0,
// // // // //           recentActivities: mockRecentActivities,
// // // // //           topCourses: mockTopCourses,
// // // // //         });
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };

// // // // //     fetchData();
// // // // //   }, []);

// // // // //   // Map dữ liệu thật từ API → UI
// // // // //   function mapRealOverviewData(apiData) {
// // // // //     const data = apiData || {};

// // // // //     return {
// // // // //       // Users
// // // // //       totalUsers: data.users?.total || 0,
// // // // //       activeUsers: data.users?.active || 0,
// // // // //       userGrowthThisMonth: data.users?.weekGrowth || 0,
// // // // //       userGrowthPercentage: data.users?.activePercentage || 0,

// // // // //       // Quizzes
// // // // //       totalQuizzes: data.quizzes?.totalQuizzes || 0,
// // // // //       quizGrowthThisMonth: 0, // Không có trong response

// // // // //       // Learning
// // // // //       weeklyAttempts: data.learning?.totalAttempts || 0,
// // // // //       attemptGrowth: 0,
// // // // //       completionRate: data.learning?.averageProgress || 0,
// // // // //       completionRateChange: 0,

// // // // //       // Revenue (chuyển cents → VND)
// // // // //       todayRevenue: (data.revenue?.totalCentsThisMonth || 0) / 100,
// // // // //       monthlyRevenue: (data.revenue?.totalCentsThisMonth || 0) / 100,
// // // // //       revenueGrowth: data.revenue?.growthPercentage || 0,

// // // // //       // Orders
// // // // //       todayOrders: data.orders?.totalOrdersThisMonth || 0,

// // // // //       // Pending
// // // // //       pendingCourses: data.courses?.draft || 0,
// // // // //       pendingReports: data.content?.lockedThreads || 0,

// // // // //       // Dùng mock cho phần chưa có
// // // // //       recentActivities: mockRecentActivities,
// // // // //       topCourses: mockTopCourses,

// // // // //       // Raw data để debug
// // // // //       raw: data,
// // // // //     };
// // // // //   }

// // // // //   if (loading) return <DashboardSkeleton />;
// // // // //   if (error) {
// // // // //     return (
// // // // //       <Alert variant="destructive">
// // // // //         <AlertCircle className="h-4 w-4" />
// // // // //         <AlertDescription>{error}</AlertDescription>
// // // // //       </Alert>
// // // // //     );
// // // // //   }

// // // // //   const stats = [
// // // // //     {
// // // // //       title: "Tổng người dùng",
// // // // //       value: overview?.totalUsers?.toLocaleString() || "0",
// // // // //       change: `+${overview?.userGrowthThisMonth || 0}`,
// // // // //       icon: Users,
// // // // //       color: "text-blue-600",
// // // // //     },
// // // // //     {
// // // // //       title: "Đề thi đã tạo",
// // // // //       value: overview?.totalQuizzes?.toLocaleString() || "0",
// // // // //       change: `+0%`,
// // // // //       icon: FileText,
// // // // //       color: "text-green-600",
// // // // //     },
// // // // //     {
// // // // //       title: "Lượt thi tuần này",
// // // // //       value: overview?.weeklyAttempts?.toLocaleString() || "0",
// // // // //       change: `+0%`,
// // // // //       icon: TrendingUp,
// // // // //       color: "text-purple-600",
// // // // //     },
// // // // //     {
// // // // //       title: "Tỷ lệ hoàn thành",
// // // // //       value: `${overview?.completionRate || 0}%`,
// // // // //       change: `+0%`,
// // // // //       icon: BarChart3,
// // // // //       color: "text-orange-600",
// // // // //     },
// // // // //   ];

// // // // //   return (
// // // // //     <div className="space-y-8">
// // // // //       {/* Header */}
// // // // //       <div>
// // // // //         <h1 className="text-4xl font-bold mb-2">Tổng quan Admin</h1>
// // // // //         <p className="text-muted-foreground">
// // // // //           Theo dõi hiệu suất hệ thống và hoạt động người dùng
// // // // //         </p>
// // // // //       </div>

// // // // //       {/* Stats Grid */}
// // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // // // //         {stats.map((stat, i) => {
// // // // //           const Icon = stat.icon;
// // // // //           return (
// // // // //             <Card key={i} className="hover:shadow-lg transition-shadow">
// // // // //               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
// // // // //                 <CardTitle className="text-sm font-medium text-muted-foreground">
// // // // //                   {stat.title}
// // // // //                 </CardTitle>
// // // // //                 <Icon className={`w-5 h-5 ${stat.color}`} />
// // // // //               </CardHeader>
// // // // //               <CardContent>
// // // // //                 <div className="text-2xl font-bold">{stat.value}</div>
// // // // //                 <p className="text-xs text-muted-foreground mt-1">
// // // // //                   <span className="text-green-600 font-medium">{stat.change}</span> so với tuần trước
// // // // //                 </p>
// // // // //               </CardContent>
// // // // //             </Card>
// // // // //           );
// // // // //         })}
// // // // //       </div>

// // // // //       {/* Main Content */}
// // // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // // //         {/* Recent Activities */}
// // // // //         <Card className="lg:col-span-2">
// // // // //           <CardHeader>
// // // // //             <CardTitle className="flex items-center gap-2">
// // // // //               <Clock className="w-5 h-5" />
// // // // //               Hoạt động gần đây
// // // // //             </CardTitle>
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="space-y-3">
// // // // //               {overview.recentActivities.slice(0, 5).map((activity, i) => (
// // // // //                 <div key={i} className="flex items-start gap-3 text-sm">
// // // // //                   <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
// // // // //                   <span className="text-muted-foreground">{activity}</span>
// // // // //                 </div>
// // // // //               ))}
// // // // //             </div>
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         {/* Quick Stats */}
// // // // //         <Card>
// // // // //           <CardHeader>
// // // // //             <CardTitle className="flex items-center gap-2">
// // // // //               <DollarSign className="w-5 h-5" />
// // // // //               Thống kê nhanh
// // // // //             </CardTitle>
// // // // //           </CardHeader>
// // // // //           <CardContent className="space-y-4">
// // // // //             <div className="flex justify-between items-center">
// // // // //               <span className="text-sm text-muted-foreground">Doanh thu hôm nay</span>
// // // // //               <span className="font-bold text-lg">
// // // // //                 {formatCurrency(overview.todayRevenue)}
// // // // //               </span>
// // // // //             </div>
// // // // //             <div className="flex justify-between items-center">
// // // // //               <span className="text-sm text-muted-foreground">Đơn hàng mới</span>
// // // // //               <Badge variant="secondary" className="font-bold">
// // // // //                 {overview.todayOrders}
// // // // //               </Badge>
// // // // //             </div>
// // // // //             <div className="flex justify-between items-center">
// // // // //               <span className="text-sm text-muted-foreground">Báo cáo chờ xử lý</span>
// // // // //               <Badge variant="destructive" className="font-bold">
// // // // //                 {overview.pendingReports}
// // // // //               </Badge>
// // // // //             </div>
// // // // //             <div className="flex justify-between items-center">
// // // // //               <span className="text-sm text-muted-foreground">Khóa học chờ duyệt</span>
// // // // //               <Badge variant="outline" className="font-bold text-orange-600">
// // // // //                 {overview.pendingCourses}
// // // // //               </Badge>
// // // // //             </div>
// // // // //           </CardContent>
// // // // //         </Card>
// // // // //       </div>

// // // // //       {/* Revenue & Top Courses */}
// // // // //       <div className="grid lg:grid-cols-2 gap-6">
// // // // //         {/* Revenue */}
// // // // //         <Card>
// // // // //           <CardHeader>
// // // // //             <CardTitle>Doanh thu tháng này</CardTitle>
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
// // // // //               <p className="text-2xl font-bold">{formatCurrency(overview.monthlyRevenue)}</p>
// // // // //               <p className="text-sm mt-1">Tăng trưởng: +{overview.revenueGrowth}%</p>
// // // // //             </div>
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         {/* Top Courses */}
// // // // //         <Card>
// // // // //           <CardHeader>
// // // // //             <CardTitle className="flex items-center gap-2">
// // // // //               <BookOpen className="w-5 h-5" />
// // // // //               Top khóa học
// // // // //             </CardTitle>
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             {overview.topCourses.length > 0 ? (
// // // // //               <div className="space-y-3">
// // // // //                 {overview.topCourses.map((course, i) => (
// // // // //                   <div key={course.id} className="flex items-center justify-between">
// // // // //                     <div className="flex items-center gap-3">
// // // // //                       <span className="text-sm font-medium text-muted-foreground">#{i + 1}</span>
// // // // //                       <div>
// // // // //                         <p className="font-medium text-sm">{course.title}</p>
// // // // //                         <p className="text-xs text-muted-foreground">{course.enrollments} lượt mua</p>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     <span className="font-bold text-sm">{formatCurrency(course.revenue)}</span>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //             ) : (
// // // // //               <p className="text-center text-muted-foreground py-8">Chưa có dữ liệu</p>
// // // // //             )}
// // // // //           </CardContent>
// // // // //         </Card>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // // Skeleton
// // // // // function DashboardSkeleton() {
// // // // //   return (
// // // // //     <div className="space-y-8">
// // // // //       <div>
// // // // //         <Skeleton className="h-10 w-64 mb-2" />
// // // // //         <Skeleton className="h-5 w-96" />
// // // // //       </div>
// // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // // // //         {[...Array(4)].map((_, i) => (
// // // // //           <Card key={i}>
// // // // //             <CardHeader className="flex flex-row items-center justify-between pb-2">
// // // // //               <Skeleton className="h-4 w-32" />
// // // // //               <Skeleton className="h-5 w-5 rounded-full" />
// // // // //             </CardHeader>
// // // // //             <CardContent>
// // // // //               <Skeleton className="h-8 w-24 mb-2" />
// // // // //               <Skeleton className="h-3 w-20" />
// // // // //             </CardContent>
// // // // //           </Card>
// // // // //         ))}
// // // // //       </div>
// // // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // // //         <Card className="lg:col-span-2">
// // // // //           <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
// // // // //           <CardContent>
// // // // //             {[...Array(5)].map((_, i) => (
// // // // //               <div key={i} className="flex items-center gap-3 mb-3">
// // // // //                 <Skeleton className="h-2 w-2 rounded-full" />
// // // // //                 <Skeleton className="h-4 w-full" />
// // // // //               </div>
// // // // //             ))}
// // // // //           </CardContent>
// // // // //         </Card>
// // // // //         <Card>
// // // // //           <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
// // // // //           <CardContent>
// // // // //             {[...Array(4)].map((_, i) => (
// // // // //               <div key={i} className="flex justify-between mb-3">
// // // // //                 <Skeleton className="h-4 w-32" />
// // // // //                 <Skeleton className="h-4 w-16" />
// // // // //               </div>
// // // // //             ))}
// // // // //           </CardContent>
// // // // //         </Card>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // "use client";

// // // // import React, { useEffect, useState } from "react";
// // // // import {
// // // //   BarChart3,
// // // //   Users,
// // // //   FileText,
// // // //   TrendingUp,
// // // //   DollarSign,
// // // //   BookOpen,
// // // //   AlertCircle,
// // // //   Clock,
// // // //   CreditCard,
// // // //   Layers,
// // // //   MessageCircle,
// // // //   ShoppingCart,
// // // //   CheckCircle,
// // // //   Activity,
// // // // } from "lucide-react";
// // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // // import { Skeleton } from "@/components/ui/skeleton";
// // // // import { Badge } from "@/components/ui/badge";
// // // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // // import { Separator } from "@/components/ui/separator";
// // // // import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/table";
// // // // import { getAdminOverview } from "@/lib/api/admin-overview";
// // // // import { formatCurrency } from "@/lib/utils";

// // // // // Mock cho phần chưa có backend
// // // // const mockRecentActivities = [
// // // //   "Người dùng mới đăng ký: admin@example.com",
// // // //   "Đề thi mới được tạo: Listening Practice #1",
// // // //   "Blog mới: Hướng dẫn luyện TOEIC",
// // // //   "Cập nhật khóa học: TOEIC Full Course",
// // // //   "Báo cáo forum: Thread #2",
// // // // ];

// // // // export default function AdminDashboard() {
// // // //   const [overview, setOverview] = useState(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState(null);

// // // //   useEffect(() => {
// // // //     let mounted = true;

// // // //     async function fetchData() {
// // // //       try {
// // // //         setLoading(true);
// // // //         setError(null);
// // // //         const res = await getAdminOverview();

// // // //         if (res && res.success && res.data) {
// // // //           if (mounted) setOverview(mapRealOverviewData(res.data));
// // // //         } else {
// // // //           throw new Error(res?.error || "API trả về lỗi");
// // // //         }
// // // //       } catch (err) {
// // // //         console.error("getAdminOverview error", err);
// // // //         setError("Không thể tải dữ liệu. Đã chuyển sang dữ liệu dự phòng.");
// // // //         // fallback
// // // //         if (mounted)
// // // //           setOverview(mapRealOverviewData({
// // // //             users: { total: 2, active: 2, verified: 2, weekGrowth: 2, activePercentage: 100 },
// // // //             instructors: { totalInstructors: 1 },
// // // //             courses: { totalCourses: 2, published: 2, totalModules: 3, totalLessons: 2, freeLessons: 1 },
// // // //             quizzes: { totalQuizzes: 2, totalQuestions: 1, published: 1, draft: 1 },
// // // //             revenue: { totalCentsThisMonth: 0, currency: "VND", growthPercentage: 0 },
// // // //             orders: { totalOrdersThisMonth: 0 },
// // // //             payments: { totalPayments: 0 },
// // // //             learning: { totalEnrollments: 0, totalAttempts: 1, attemptsGrading: 1 },
// // // //             content: { totalBlogPosts: 1, totalComments: 42, totalForumPosts: 28, totalViews: 31 },
// // // //           }));
// // // //       } finally {
// // // //         if (mounted) setLoading(false);
// // // //       }
// // // //     }

// // // //     fetchData();

// // // //     return () => {
// // // //       mounted = false;
// // // //     };
// // // //   }, []);

// // // //   function mapRealOverviewData(data) {
// // // //     const d = data || {};

// // // //     return {
// // // //       // Users
// // // //       users: {
// // // //         total: d.users?.total ?? 0,
// // // //         active: d.users?.active ?? 0,
// // // //         verified: d.users?.verified ?? 0,
// // // //         inactive: d.users?.inactive ?? 0,
// // // //         weekGrowth: d.users?.weekGrowth ?? 0,
// // // //         activePercentage: d.users?.activePercentage ?? 0,
// // // //         verifiedPercentage: d.users?.verifiedPercentage ?? 0,
// // // //       },

// // // //       // Instructors
// // // //       instructors: {
// // // //         total: d.instructors?.totalInstructors ?? 0,
// // // //         pendingRequests: d.instructors?.pendingRequests ?? 0,
// // // //         pendingOver7Days: d.instructors?.pendingOver7Days ?? 0,
// // // //         pendingUnder3Days: d.instructors?.pendingUnder3Days ?? 0,
// // // //         pending3To7Days: d.instructors?.pending3To7Days ?? 0,
// // // //       },

// // // //       // Courses
// // // //       courses: {
// // // //         total: d.courses?.totalCourses ?? 0,
// // // //         published: d.courses?.published ?? 0,
// // // //         draft: d.courses?.draft ?? 0,
// // // //         archived: d.courses?.archived ?? 0,
// // // //         totalModules: d.courses?.totalModules ?? 0,
// // // //         totalLessons: d.courses?.totalLessons ?? 0,
// // // //         freeLessons: d.courses?.freeLessons ?? 0,
// // // //         publishedPercentage: d.courses?.publishedPercentage ?? 0,
// // // //         freeLessonsPercentage: d.courses?.freeLessonsPercentage ?? 0,
// // // //       },

// // // //       // Quizzes
// // // //       quizzes: {
// // // //         total: d.quizzes?.totalQuizzes ?? 0,
// // // //         byReading: d.quizzes?.byReading ?? 0,
// // // //         byListening: d.quizzes?.byListening ?? 0,
// // // //         byWriting: d.quizzes?.byWriting ?? 0,
// // // //         bySpeaking: d.quizzes?.bySpeaking ?? 0,
// // // //         totalQuestions: d.quizzes?.totalQuestions ?? 0,
// // // //         published: d.quizzes?.published ?? 0,
// // // //         draft: d.quizzes?.draft ?? 0,
// // // //       },

// // // //       // Revenue
// // // //       revenue: {
// // // //         totalCentsThisMonth: d.revenue?.totalCentsThisMonth ?? 0,
// // // //         currency: d.revenue?.currency ?? "VND",
// // // //         growthPercentage: d.revenue?.growthPercentage ?? 0,
// // // //         totalCentsVND: d.revenue?.totalCentsVND ?? 0,
// // // //         totalCentsUSD: d.revenue?.totalCentsUSD ?? 0,
// // // //         vndPercentage: d.revenue?.vndPercentage ?? 0,
// // // //         usdPercentage: d.revenue?.usdPercentage ?? 0,
// // // //       },

// // // //       // Orders
// // // //       orders: {
// // // //         totalThisMonth: d.orders?.totalOrdersThisMonth ?? 0,
// // // //         completed: d.orders?.completed ?? 0,
// // // //         pending: d.orders?.pending ?? 0,
// // // //         cancelled: d.orders?.cancelled ?? 0,
// // // //         unpaidCarts: d.orders?.unpaidCarts ?? 0,
// // // //         completedPercentage: d.orders?.completedPercentage ?? 0,
// // // //         averageOrderValue: d.orders?.averageOrderValue ?? 0,
// // // //       },

// // // //       // Payments
// // // //       payments: {
// // // //         totalPayments: d.payments?.totalPayments ?? 0,
// // // //         byStripe: d.payments?.byStripe ?? 0,
// // // //         byPayOS: d.payments?.byPayOS ?? 0,
// // // //         succeeded: d.payments?.succeeded ?? 0,
// // // //         failed: d.payments?.failed ?? 0,
// // // //         refunded: d.payments?.refunded ?? 0,
// // // //         successRate: d.payments?.successRate ?? 0,
// // // //         stripePercentage: d.payments?.stripePercentage ?? 0,
// // // //         payOSPercentage: d.payments?.payOSPercentage ?? 0,
// // // //       },

// // // //       // Learning
// // // //       learning: {
// // // //         totalEnrollments: d.learning?.totalEnrollments ?? 0,
// // // //         completed: d.learning?.completed ?? 0,
// // // //         suspended: d.learning?.suspended ?? 0,
// // // //         averageProgress: d.learning?.averageProgress ?? 0,
// // // //         totalAttempts: d.learning?.totalAttempts ?? 0,
// // // //         attemptsCompleted: d.learning?.attemptsCompleted ?? 0,
// // // //         attemptsInProgress: d.learning?.attemptsInProgress ?? 0,
// // // //         attemptsGrading: d.learning?.attemptsGrading ?? 0,
// // // //         averageScore: d.learning?.averageScore ?? 0,
// // // //       },

// // // //       // Content
// // // //       content: {
// // // //         totalBlogPosts: d.content?.totalBlogPosts ?? 0,
// // // //         publishedPosts: d.content?.publishedPosts ?? 0,
// // // //         draftPosts: d.content?.draftPosts ?? 0,
// // // //         totalCategories: d.content?.totalCategories ?? 0,
// // // //         totalComments: d.content?.totalComments ?? 0,
// // // //         totalThreads: d.content?.totalThreads ?? 0,
// // // //         totalForumPosts: d.content?.totalForumPosts ?? 0,
// // // //         totalViews: d.content?.totalViews ?? 0,
// // // //         lockedThreads: d.content?.lockedThreads ?? 0,
// // // //       },

// // // //       recentActivities: mockRecentActivities,
// // // //       topCourses: d.topCourses || [],

// // // //       // raw for debugging
// // // //       raw: d,
// // // //     };
// // // //   }

// // // //   if (loading) return <DashboardSkeleton />;

// // // //   return (
// // // //     <div className="space-y-8">
// // // //       <div>
// // // //         <h1 className="text-4xl font-bold mb-2">Tổng quan Admin</h1>
// // // //         <p className="text-muted-foreground">Theo dõi hiệu suất hệ thống và hoạt động người dùng</p>
// // // //       </div>

// // // //       {error && (
// // // //         <Alert variant="destructive">
// // // //           <AlertCircle className="h-4 w-4" />
// // // //           <AlertDescription>{error}</AlertDescription>
// // // //         </Alert>
// // // //       )}

// // // //       {/* Top summary cards */}
// // // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
// // // //         <StatCard title="Người dùng tổng" value={overview.users.total} change={`+${overview.users.weekGrowth}%`} Icon={Users} />
// // // //         <StatCard title="Người dùng đang hoạt động" value={overview.users.active} change={`${overview.users.activePercentage}%`} Icon={Activity} />
// // // //         <StatCard title="Giảng viên" value={overview.instructors.total} change={`Chờ ${overview.instructors.pendingRequests}`} Icon={Layers} />
// // // //         <StatCard title="Khóa học" value={overview.courses.total} change={`Đã xuất bản ${overview.courses.published}`} Icon={BookOpen} />
// // // //         <StatCard title="Đề thi" value={overview.quizzes.total} change={`Câu hỏi ${overview.quizzes.totalQuestions}`} Icon={FileText} />
// // // //         <StatCard title="Doanh thu (tháng)" value={formatCurrency((overview.revenue.totalCentsThisMonth || 0) / 100)} change={`+${overview.revenue.growthPercentage}%`} Icon={DollarSign} />
// // // //       </div>

// // // //       {/* Detailed grids */}
// // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // //         {/* Users */}
// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="flex items-center gap-2">
// // // //               <Users className="w-5 h-5" /> Thông tin người dùng
// // // //             </CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <Table>
// // // //               <TBody>
// // // //                 <Tr><Td>Tổng</Td><Td className="text-right">{overview.users.total}</Td></Tr>
// // // //                 <Tr><Td>Hoạt động</Td><Td className="text-right">{overview.users.active}</Td></Tr>
// // // //                 <Tr><Td>Đã xác minh</Td><Td className="text-right">{overview.users.verified}</Td></Tr>
// // // //                 <Tr><Td>Không hoạt động</Td><Td className="text-right">{overview.users.inactive}</Td></Tr>
// // // //                 <Tr><Td>Tăng tuần</Td><Td className="text-right">{overview.users.weekGrowth}</Td></Tr>
// // // //                 <Tr><Td>% hoạt động</Td><Td className="text-right">{overview.users.activePercentage}%</Td></Tr>
// // // //               </TBody>
// // // //             </Table>
// // // //           </CardContent>
// // // //         </Card>

// // // //         {/* Courses */}
// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5"/> Khóa học</CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <Table>
// // // //               <TBody>
// // // //                 <Tr><Td>Tổng khóa</Td><Td className="text-right">{overview.courses.total}</Td></Tr>
// // // //                 <Tr><Td>Đã xuất bản</Td><Td className="text-right">{overview.courses.published}</Td></Tr>
// // // //                 <Tr><Td>Bản nháp</Td><Td className="text-right">{overview.courses.draft}</Td></Tr>
// // // //                 <Tr><Td>Khoá bị lưu trữ</Td><Td className="text-right">{overview.courses.archived}</Td></Tr>
// // // //                 <Tr><Td>Tổng module</Td><Td className="text-right">{overview.courses.totalModules}</Td></Tr>
// // // //                 <Tr><Td>Tổng bài học</Td><Td className="text-right">{overview.courses.totalLessons}</Td></Tr>
// // // //                 <Tr><Td>Bài học miễn phí</Td><Td className="text-right">{overview.courses.freeLessons} ({overview.courses.freeLessonsPercentage}%)</Td></Tr>
// // // //               </TBody>
// // // //             </Table>
// // // //           </CardContent>
// // // //         </Card>

// // // //         {/* Quizzes */}
// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Đề thi & Câu hỏi</CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <Table>
// // // //               <TBody>
// // // //                 <Tr><Td>Tổng đề thi</Td><Td className="text-right">{overview.quizzes.total}</Td></Tr>
// // // //                 <Tr><Td>Listening</Td><Td className="text-right">{overview.quizzes.byListening}</Td></Tr>
// // // //                 <Tr><Td>Reading</Td><Td className="text-right">{overview.quizzes.byReading}</Td></Tr>
// // // //                 <Tr><Td>Writing</Td><Td className="text-right">{overview.quizzes.byWriting}</Td></Tr>
// // // //                 <Tr><Td>Speaking</Td><Td className="text-right">{overview.quizzes.bySpeaking}</Td></Tr>
// // // //                 <Tr><Td>Tổng câu hỏi</Td><Td className="text-right">{overview.quizzes.totalQuestions}</Td></Tr>
// // // //                 <Tr><Td>Đã xuất bản</Td><Td className="text-right">{overview.quizzes.published}</Td></Tr>
// // // //                 <Tr><Td>Bản nháp</Td><Td className="text-right">{overview.quizzes.draft}</Td></Tr>
// // // //               </TBody>
// // // //             </Table>
// // // //           </CardContent>
// // // //         </Card>
// // // //       </div>

// // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // //         {/* Revenue */}
// // // //         <Card>
// // // //           <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5"/> Doanh thu</CardTitle></CardHeader>
// // // //           <CardContent>
// // // //             <Table>
// // // //               <TBody>
// // // //                 <Tr><Td>Tháng (cents)</Td><Td className="text-right">{overview.revenue.totalCentsThisMonth}</Td></Tr>
// // // //                 <Tr><Td>Tháng (formatted)</Td><Td className="text-right">{formatCurrency((overview.revenue.totalCentsThisMonth || 0) / 100, overview.revenue.currency)}</Td></Tr>
// // // //                 <Tr><Td>Tăng trưởng</Td><Td className="text-right">{overview.revenue.growthPercentage}%</Td></Tr>
// // // //                 <Tr><Td>% VND</Td><Td className="text-right">{overview.revenue.vndPercentage}%</Td></Tr>
// // // //                 <Tr><Td>% USD</Td><Td className="text-right">{overview.revenue.usdPercentage}%</Td></Tr>
// // // //               </TBody>
// // // //             </Table>
// // // //           </CardContent>
// // // //         </Card>

// // // //         {/* Orders & Payments */}
// // // //         <Card>
// // // //           <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> Đơn hàng & Thanh toán</CardTitle></CardHeader>
// // // //           <CardContent>
// // // //             <Table>
// // // //               <TBody>
// // // //                 <Tr><Td>Đơn trong tháng</Td><Td className="text-right">{overview.orders.totalThisMonth}</Td></Tr>
// // // //                 <Tr><Td>Hoàn tất</Td><Td className="text-right">{overview.orders.completed}</Td></Tr>
// // // //                 <Tr><Td>Chờ</Td><Td className="text-right">{overview.orders.pending}</Td></Tr>
// // // //                 <Tr><Td>Huỷ</Td><Td className="text-right">{overview.orders.cancelled}</Td></Tr>
// // // //                 <Tr><Td>Thanh toán tổng</Td><Td className="text-right">{overview.payments.totalPayments}</Td></Tr>
// // // //                 <Tr><Td>Thành công</Td><Td className="text-right">{overview.payments.succeeded}</Td></Tr>
// // // //                 <Tr><Td>Thất bại</Td><Td className="text-right">{overview.payments.failed}</Td></Tr>
// // // //               </TBody>
// // // //             </Table>
// // // //           </CardContent>
// // // //         </Card>

// // // //         {/* Learning */}
// // // //         <Card>
// // // //           <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Học tập</CardTitle></CardHeader>
// // // //           <CardContent>
// // // //             <Table>
// // // //               <TBody>
// // // //                 <Tr><Td>Tổng đăng ký</Td><Td className="text-right">{overview.learning.totalEnrollments}</Td></Tr>
// // // //                 <Tr><Td>Tổng lượt thi</Td><Td className="text-right">{overview.learning.totalAttempts}</Td></Tr>
// // // //                 <Tr><Td>Đang chấm</Td><Td className="text-right">{overview.learning.attemptsGrading}</Td></Tr>
// // // //                 <Tr><Td>Hoàn thành</Td><Td className="text-right">{overview.learning.completed}</Td></Tr>
// // // //                 <Tr><Td>Progress TB</Td><Td className="text-right">{overview.learning.averageProgress}%</Td></Tr>
// // // //               </TBody>
// // // //             </Table>
// // // //           </CardContent>
// // // //         </Card>
// // // //       </div>

// // // //       {/* Content, Recent activities, Top courses */}
// // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // //         <Card>
// // // //           <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5"/> Nội dung & Diễn đàn</CardTitle></CardHeader>
// // // //           <CardContent>
// // // //             <Table>
// // // //               <TBody>
// // // //                 <Tr><Td>Bài blog</Td><Td className="text-right">{overview.content.totalBlogPosts}</Td></Tr>
// // // //                 <Tr><Td>Bài viết diễn đàn</Td><Td className="text-right">{overview.content.totalForumPosts}</Td></Tr>
// // // //                 <Tr><Td>Bình luận</Td><Td className="text-right">{overview.content.totalComments}</Td></Tr>
// // // //                 <Tr><Td>Tổng view</Td><Td className="text-right">{overview.content.totalViews}</Td></Tr>
// // // //                 <Tr><Td>Luồng khoá</Td><Td className="text-right">{overview.content.lockedThreads}</Td></Tr>
// // // //               </TBody>
// // // //             </Table>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card className="lg:col-span-2">
// // // //           <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/> Hoạt động gần đây</CardTitle></CardHeader>
// // // //           <CardContent>
// // // //             <div className="space-y-2">
// // // //               {(overview.recentActivities || []).slice(0, 10).map((a, i) => (
// // // //                 <div key={i} className="flex items-start gap-3 text-sm">
// // // //                   <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
// // // //                   <div className="text-muted-foreground">{a}</div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>

// // // //             <Separator className="my-4" />

// // // //             <CardTitle className="text-sm">Top khóa học</CardTitle>
// // // //             <div className="space-y-3">
// // // //               {(overview.topCourses || []).length === 0 && <div className="text-muted-foreground text-sm">Chưa có dữ liệu</div>}
// // // //               {(overview.topCourses || []).map((c, i) => (
// // // //                 <div key={c.id || i} className="flex items-center justify-between">
// // // //                   <div>
// // // //                     <div className="font-medium">{c.title}</div>
// // // //                     <div className="text-xs text-muted-foreground">{c.enrollments} lượt đăng ký</div>
// // // //                   </div>
// // // //                   <div className="font-bold">{formatCurrency(c.revenue)}</div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </CardContent>
// // // //         </Card>
// // // //       </div>

// // // //       {/* Raw debug */}
// // // //       <Card>
// // // //         <CardHeader><CardTitle>Raw API (Debug)</CardTitle></CardHeader>
// // // //         <CardContent>
// // // //           <pre className="text-xs max-h-72 overflow-auto">{JSON.stringify(overview.raw, null, 2)}</pre>
// // // //         </CardContent>
// // // //       </Card>
// // // //     </div>
// // // //   );
// // // // }

// // // // function StatCard({ title, value, change, Icon }) {
// // // //   return (
// // // //     <Card>
// // // //       <CardHeader className="flex items-center justify-between">
// // // //         <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
// // // //         <Icon className="w-5 h-5" />
// // // //       </CardHeader>
// // // //       <CardContent>
// // // //         <div className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
// // // //         <p className="text-xs text-muted-foreground mt-1">
// // // //           <span className="text-green-600 font-medium">{change}</span> so với tuần trước
// // // //         </p>
// // // //       </CardContent>
// // // //     </Card>
// // // //   );
// // // // }

// // // // function DashboardSkeleton() {
// // // //   return (
// // // //     <div className="space-y-8">
// // // //       <div>
// // // //         <Skeleton className="h-10 w-64 mb-2" />
// // // //         <Skeleton className="h-5 w-96" />
// // // //       </div>
// // // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
// // // //         {[...Array(6)].map((_, i) => (
// // // //           <Card key={i}>
// // // //             <CardHeader className="flex flex-row items-center justify-between pb-2">
// // // //               <Skeleton className="h-4 w-32" />
// // // //               <Skeleton className="h-5 w-5 rounded-full" />
// // // //             </CardHeader>
// // // //             <CardContent>
// // // //               <Skeleton className="h-8 w-24 mb-2" />
// // // //               <Skeleton className="h-3 w-20" />
// // // //             </CardContent>
// // // //           </Card>
// // // //         ))}
// // // //       </div>
// // // //       <div className="grid lg:grid-cols-3 gap-6">
// // // //         <Card className="lg:col-span-1"><CardHeader><Skeleton className="h-6 w-40"/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
// // // //         <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-40"/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   BarChart3,
// // //   Users,
// // //   FileText,
// // //   TrendingUp,
// // //   DollarSign,
// // //   BookOpen,
// // //   AlertCircle,
// // //   Clock,
// // //   CreditCard,
// // //   Layers,
// // //   MessageCircle,
// // //   ShoppingCart,
// // //   CheckCircle,
// // //   Activity,
// // // } from "lucide-react";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Skeleton } from "@/components/ui/skeleton";
// // // import { Badge } from "@/components/ui/badge";
// // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // import { Separator } from "@/components/ui/separator";

// // // import { getAdminOverview } from "@/lib/api/admin-overview";
// // // import { formatCurrency } from "@/lib/utils";

// // // // Mock cho phần chưa có backend
// // // const mockRecentActivities = [
// // //   "Người dùng mới đăng ký: admin@example.com",
// // //   "Đề thi mới được tạo: Listening Practice #1",
// // //   "Blog mới: Hướng dẫn luyện TOEIC",
// // //   "Cập nhật khóa học: TOEIC Full Course",
// // //   "Báo cáo forum: Thread #2",
// // // ];

// // // export default function AdminDashboard() {
// // //   const [overview, setOverview] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   useEffect(() => {
// // //     let mounted = true;
  
// // //     async function fetchData() {
// // //       try {
// // //         setLoading(true);
// // //         setError(null);
  
// // //         const overviewRes = await getAdminOverview();
// // //         // Debug: luôn log response để biết cấu trúc trả về
// // //         console.log("getAdminOverview raw:", overviewRes);
  
// // //         // Hỗ trợ cả 2 dạng:
// // //         // 1) getAdminOverview() trả về { success, code, message, data: { ... } }
// // //         // 2) getAdminOverview() trả về chỉ phần data { users: ..., ... }
// // //         const apiData = overviewRes?.data ?? overviewRes ?? null;
  
// // //         if (!apiData) throw new Error("API trả về định dạng không hợp lệ");
  
// // //         if (mounted) setOverview(mapRealOverviewData(apiData));
// // //       } catch (err) {
// // //         console.error("Dashboard error:", err);
// // //         setError("Không thể tải dữ liệu. Đã chuyển sang dữ liệu dự phòng.");
  
// // //         if (mounted) {
// // //           // fallback data (giữ giống trước)
// // //           setOverview(mapRealOverviewData({
// // //             users: { total: 2, active: 2, verified: 2, weekGrowth: 2, activePercentage: 100, verifiedPercentage: 100 },
// // //             instructors: { totalInstructors: 1, pendingRequests: 0 },
// // //             courses: { totalCourses: 2, published: 2, draft: 0, archived: 0, totalModules: 3, totalLessons: 2, freeLessons: 1, freeLessonsPercentage: 50 },
// // //             quizzes: { totalQuizzes: 2, byListening: 2, totalQuestions: 1, published: 1, draft: 1 },
// // //             revenue: { totalCentsThisMonth: 0, currency: "VND", growthPercentage: 0, vndPercentage: 0, usdPercentage: 0 },
// // //             orders: { totalOrdersThisMonth: 0, completed: 0, pending: 0, cancelled: 0 },
// // //             payments: { totalPayments: 0, succeeded: 0, failed: 0 },
// // //             learning: { totalEnrollments: 0, totalAttempts: 1, attemptsGrading: 1, averageProgress: 0 },
// // //             content: { totalBlogPosts: 1, totalComments: 42, totalForumPosts: 28, totalViews: 31 },
// // //             topCourses: [],
// // //           }));
// // //         }
// // //       } finally {
// // //         if (mounted) setLoading(false);
// // //       }
// // //     }
  
// // //     fetchData();
  
// // //     return () => { mounted = false; };
// // //   }, []);
  
// // //   // mapRealOverviewData: dùng apiData thẳng (apiData có thể là api.data hoặc api)
// // //   function mapRealOverviewData(apiData) {
// // //     const data = apiData || {};
  
// // //     return {
// // //       users: {
// // //         total: Number(data.users?.total ?? 0),
// // //         active: Number(data.users?.active ?? 0),
// // //         verified: Number(data.users?.verified ?? 0),
// // //         inactive: Number(data.users?.inactive ?? 0),
// // //         weekGrowth: Number(data.users?.weekGrowth ?? 0),
// // //         activePercentage: Number(data.users?.activePercentage ?? 0),
// // //         verifiedPercentage: Number(data.users?.verifiedPercentage ?? 0),
// // //       },
  
// // //       instructors: {
// // //         total: Number(data.instructors?.totalInstructors ?? 0),
// // //         pendingRequests: Number(data.instructors?.pendingRequests ?? 0),
// // //         pendingOver7Days: Number(data.instructors?.pendingOver7Days ?? 0),
// // //         pendingUnder3Days: Number(data.instructors?.pendingUnder3Days ?? 0),
// // //         pending3To7Days: Number(data.instructors?.pending3To7Days ?? 0),
// // //       },
  
// // //       courses: {
// // //         total: Number(data.courses?.totalCourses ?? 0),
// // //         published: Number(data.courses?.published ?? 0),
// // //         draft: Number(data.courses?.draft ?? 0),
// // //         archived: Number(data.courses?.archived ?? 0),
// // //         totalModules: Number(data.courses?.totalModules ?? 0),
// // //         totalLessons: Number(data.courses?.totalLessons ?? 0),
// // //         freeLessons: Number(data.courses?.freeLessons ?? 0),
// // //         publishedPercentage: Number(data.courses?.publishedPercentage ?? 0),
// // //         freeLessonsPercentage: Number(data.courses?.freeLessonsPercentage ?? 0),
// // //       },
  
// // //       quizzes: {
// // //         total: Number(data.quizzes?.totalQuizzes ?? 0),
// // //         byReading: Number(data.quizzes?.byReading ?? 0),
// // //         byListening: Number(data.quizzes?.byListening ?? 0),
// // //         byWriting: Number(data.quizzes?.byWriting ?? 0),
// // //         bySpeaking: Number(data.quizzes?.bySpeaking ?? 0),
// // //         totalQuestions: Number(data.quizzes?.totalQuestions ?? 0),
// // //         published: Number(data.quizzes?.published ?? 0),
// // //         draft: Number(data.quizzes?.draft ?? 0),
// // //       },
  
// // //       revenue: {
// // //         totalCentsThisMonth: Number(data.revenue?.totalCentsThisMonth ?? 0),
// // //         currency: data.revenue?.currency ?? "VND",
// // //         growthPercentage: Number(data.revenue?.growthPercentage ?? 0),
// // //         totalCentsVND: Number(data.revenue?.totalCentsVND ?? 0),
// // //         totalCentsUSD: Number(data.revenue?.totalCentsUSD ?? 0),
// // //         vndPercentage: Number(data.revenue?.vndPercentage ?? 0),
// // //         usdPercentage: Number(data.revenue?.usdPercentage ?? 0),
// // //       },
  
// // //       orders: {
// // //         totalThisMonth: Number(data.orders?.totalOrdersThisMonth ?? 0),
// // //         completed: Number(data.orders?.completed ?? 0),
// // //         pending: Number(data.orders?.pending ?? 0),
// // //         cancelled: Number(data.orders?.cancelled ?? 0),
// // //         unpaidCarts: Number(data.orders?.unpaidCarts ?? 0),
// // //         completedPercentage: Number(data.orders?.completedPercentage ?? 0),
// // //         averageOrderValue: Number(data.orders?.averageOrderValue ?? 0),
// // //       },
  
// // //       payments: {
// // //         totalPayments: Number(data.payments?.totalPayments ?? 0),
// // //         byStripe: Number(data.payments?.byStripe ?? 0),
// // //         byPayOS: Number(data.payments?.byPayOS ?? 0),
// // //         succeeded: Number(data.payments?.succeeded ?? 0),
// // //         failed: Number(data.payments?.failed ?? 0),
// // //         refunded: Number(data.payments?.refunded ?? 0),
// // //         successRate: Number(data.payments?.successRate ?? 0),
// // //         stripePercentage: Number(data.payments?.stripePercentage ?? 0),
// // //         payOSPercentage: Number(data.payments?.payOSPercentage ?? 0),
// // //       },
  
// // //       learning: {
// // //         totalEnrollments: Number(data.learning?.totalEnrollments ?? 0),
// // //         completed: Number(data.learning?.completed ?? 0),
// // //         suspended: Number(data.learning?.suspended ?? 0),
// // //         averageProgress: Number(data.learning?.averageProgress ?? 0),
// // //         totalAttempts: Number(data.learning?.totalAttempts ?? 0),
// // //         attemptsCompleted: Number(data.learning?.attemptsCompleted ?? 0),
// // //         attemptsInProgress: Number(data.learning?.attemptsInProgress ?? 0),
// // //         attemptsGrading: Number(data.learning?.attemptsGrading ?? 0),
// // //         averageScore: Number(data.learning?.averageScore ?? 0),
// // //       },
  
// // //       content: {
// // //         totalBlogPosts: Number(data.content?.totalBlogPosts ?? 0),
// // //         publishedPosts: Number(data.content?.publishedPosts ?? 0),
// // //         draftPosts: Number(data.content?.draftPosts ?? 0),
// // //         totalCategories: Number(data.content?.totalCategories ?? 0),
// // //         totalComments: Number(data.content?.totalComments ?? 0),
// // //         totalThreads: Number(data.content?.totalThreads ?? 0),
// // //         totalForumPosts: Number(data.content?.totalForumPosts ?? 0),
// // //         totalViews: Number(data.content?.totalViews ?? 0),
// // //         lockedThreads: Number(data.content?.lockedThreads ?? 0),
// // //       },
  
// // //       recentActivities: data.recentActivities ?? mockRecentActivities,
// // //       topCourses: data.topCourses ?? [],
  
// // //       raw: data,
// // //     };
// // //   }

// // //   function mapRealOverviewData(data) {
// // //     const d = data || {};

// // //     return {
// // //       // Users
// // //       users: {
// // //         total: d.users?.total ?? 0,
// // //         active: d.users?.active ?? 0,
// // //         verified: d.users?.verified ?? 0,
// // //         inactive: d.users?.inactive ?? 0,
// // //         weekGrowth: d.users?.weekGrowth ?? 0,
// // //         activePercentage: d.users?.activePercentage ?? 0,
// // //         verifiedPercentage: d.users?.verifiedPercentage ?? 0,
// // //       },

// // //       // Instructors
// // //       instructors: {
// // //         total: d.instructors?.totalInstructors ?? 0,
// // //         pendingRequests: d.instructors?.pendingRequests ?? 0,
// // //         pendingOver7Days: d.instructors?.pendingOver7Days ?? 0,
// // //         pendingUnder3Days: d.instructors?.pendingUnder3Days ?? 0,
// // //         pending3To7Days: d.instructors?.pending3To7Days ?? 0,
// // //       },

// // //       // Courses
// // //       courses: {
// // //         total: d.courses?.totalCourses ?? 0,
// // //         published: d.courses?.published ?? 0,
// // //         draft: d.courses?.draft ?? 0,
// // //         archived: d.courses?.archived ?? 0,
// // //         totalModules: d.courses?.totalModules ?? 0,
// // //         totalLessons: d.courses?.totalLessons ?? 0,
// // //         freeLessons: d.courses?.freeLessons ?? 0,
// // //         publishedPercentage: d.courses?.publishedPercentage ?? 0,
// // //         freeLessonsPercentage: d.courses?.freeLessonsPercentage ?? 0,
// // //       },

// // //       // Quizzes
// // //       quizzes: {
// // //         total: d.quizzes?.totalQuizzes ?? 0,
// // //         byReading: d.quizzes?.byReading ?? 0,
// // //         byListening: d.quizzes?.byListening ?? 0,
// // //         byWriting: d.quizzes?.byWriting ?? 0,
// // //         bySpeaking: d.quizzes?.bySpeaking ?? 0,
// // //         totalQuestions: d.quizzes?.totalQuestions ?? 0,
// // //         published: d.quizzes?.published ?? 0,
// // //         draft: d.quizzes?.draft ?? 0,
// // //       },

// // //       // Revenue
// // //       revenue: {
// // //         totalCentsThisMonth: d.revenue?.totalCentsThisMonth ?? 0,
// // //         currency: d.revenue?.currency ?? "VND",
// // //         growthPercentage: d.revenue?.growthPercentage ?? 0,
// // //         totalCentsVND: d.revenue?.totalCentsVND ?? 0,
// // //         totalCentsUSD: d.revenue?.totalCentsUSD ?? 0,
// // //         vndPercentage: d.revenue?.vndPercentage ?? 0,
// // //         usdPercentage: d.revenue?.usdPercentage ?? 0,
// // //       },

// // //       // Orders
// // //       orders: {
// // //         totalThisMonth: d.orders?.totalOrdersThisMonth ?? 0,
// // //         completed: d.orders?.completed ?? 0,
// // //         pending: d.orders?.pending ?? 0,
// // //         cancelled: d.orders?.cancelled ?? 0,
// // //         unpaidCarts: d.orders?.unpaidCarts ?? 0,
// // //         completedPercentage: d.orders?.completedPercentage ?? 0,
// // //         averageOrderValue: d.orders?.averageOrderValue ?? 0,
// // //       },

// // //       // Payments
// // //       payments: {
// // //         totalPayments: d.payments?.totalPayments ?? 0,
// // //         byStripe: d.payments?.byStripe ?? 0,
// // //         byPayOS: d.payments?.byPayOS ?? 0,
// // //         succeeded: d.payments?.succeeded ?? 0,
// // //         failed: d.payments?.failed ?? 0,
// // //         refunded: d.payments?.refunded ?? 0,
// // //         successRate: d.payments?.successRate ?? 0,
// // //         stripePercentage: d.payments?.stripePercentage ?? 0,
// // //         payOSPercentage: d.payments?.payOSPercentage ?? 0,
// // //       },

// // //       // Learning
// // //       learning: {
// // //         totalEnrollments: d.learning?.totalEnrollments ?? 0,
// // //         completed: d.learning?.completed ?? 0,
// // //         suspended: d.learning?.suspended ?? 0,
// // //         averageProgress: d.learning?.averageProgress ?? 0,
// // //         totalAttempts: d.learning?.totalAttempts ?? 0,
// // //         attemptsCompleted: d.learning?.attemptsCompleted ?? 0,
// // //         attemptsInProgress: d.learning?.attemptsInProgress ?? 0,
// // //         attemptsGrading: d.learning?.attemptsGrading ?? 0,
// // //         averageScore: d.learning?.averageScore ?? 0,
// // //       },

// // //       // Content
// // //       content: {
// // //         totalBlogPosts: d.content?.totalBlogPosts ?? 0,
// // //         publishedPosts: d.content?.publishedPosts ?? 0,
// // //         draftPosts: d.content?.draftPosts ?? 0,
// // //         totalCategories: d.content?.totalCategories ?? 0,
// // //         totalComments: d.content?.totalComments ?? 0,
// // //         totalThreads: d.content?.totalThreads ?? 0,
// // //         totalForumPosts: d.content?.totalForumPosts ?? 0,
// // //         totalViews: d.content?.totalViews ?? 0,
// // //         lockedThreads: d.content?.lockedThreads ?? 0,
// // //       },

// // //       recentActivities: mockRecentActivities,
// // //       topCourses: d.topCourses || [],

// // //       // raw for debugging
// // //       raw: d,
// // //     };
// // //   }

// // //   if (loading) return <DashboardSkeleton />;

// // //   return (
// // //     <div className="space-y-8">
// // //       <div>
// // //         <h1 className="text-4xl font-bold mb-2">Tổng quan Admin</h1>
// // //         <p className="text-muted-foreground">Theo dõi hiệu suất hệ thống và hoạt động người dùng</p>
// // //       </div>

// // //       {error && (
// // //         <Alert variant="destructive">
// // //           <AlertCircle className="h-4 w-4" />
// // //           <AlertDescription>{error}</AlertDescription>
// // //         </Alert>
// // //       )}

// // //       {/* Top summary cards */}
// // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
// // //         <StatCard title="Người dùng tổng" value={overview.users.total} change={`+${overview.users.weekGrowth}%`} Icon={Users} />
// // //         <StatCard title="Người dùng đang hoạt động" value={overview.users.active} change={`${overview.users.activePercentage}%`} Icon={Activity} />
// // //         <StatCard title="Giảng viên" value={overview.instructors.total} change={`Chờ ${overview.instructors.pendingRequests}`} Icon={Layers} />
// // //         <StatCard title="Khóa học" value={overview.courses.total} change={`Đã xuất bản ${overview.courses.published}`} Icon={BookOpen} />
// // //         <StatCard title="Đề thi" value={overview.quizzes.total} change={`Câu hỏi ${overview.quizzes.totalQuestions}`} Icon={FileText} />
// // //         <StatCard title="Doanh thu (tháng)" value={formatCurrency((overview.revenue.totalCentsThisMonth || 0) / 100)} change={`+${overview.revenue.growthPercentage}%`} Icon={DollarSign} />
// // //       </div>

// // //       {/* Detailed grids */}
// // //       <div className="grid lg:grid-cols-3 gap-6">
// // //         {/* Users */}
// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2">
// // //               <Users className="w-5 h-5" /> Thông tin người dùng
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="overflow-auto"><table className="w-full text-sm">
// // //               <tbody>
// // //                 <tr><td>Tổng</td><td className="text-right">{overview.users.total}</td></tr>
// // //                 <tr><td>Hoạt động</td><td className="text-right">{overview.users.active}</td></tr>
// // //                 <tr><td>Đã xác minh</td><td className="text-right">{overview.users.verified}</td></tr>
// // //                 <tr><td>Không hoạt động</td><td className="text-right">{overview.users.inactive}</td></tr>
// // //                 <tr><td>Tăng tuần</td><td className="text-right">{overview.users.weekGrowth}</td></tr>
// // //                 <tr><td>% hoạt động</td><td className="text-right">{overview.users.activePercentage}%</td></tr>
// // //               </tbody>
// // //             </table></div>
// // //           </CardContent>
// // //         </Card>

// // //         {/* Courses */}
// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5"/> Khóa học</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="overflow-auto"><table className="w-full text-sm">
// // //               <tbody>
// // //                 <tr><td>Tổng khóa</td><td className="text-right">{overview.courses.total}</td></tr>
// // //                 <tr><td>Đã xuất bản</td><td className="text-right">{overview.courses.published}</td></tr>
// // //                 <tr><td>Bản nháp</td><td className="text-right">{overview.courses.draft}</td></tr>
// // //                 <tr><td>Khoá bị lưu trữ</td><td className="text-right">{overview.courses.archived}</td></tr>
// // //                 <tr><td>Tổng module</td><td className="text-right">{overview.courses.totalModules}</td></tr>
// // //                 <tr><td>Tổng bài học</td><td className="text-right">{overview.courses.totalLessons}</td></tr>
// // //                 <tr><td>Bài học miễn phí</td><td className="text-right">{overview.courses.freeLessons} ({overview.courses.freeLessonsPercentage}%)</td></tr>
// // //               </tbody>
// // //             </table></div>
// // //           </CardContent>
// // //         </Card>

// // //         {/* Quizzes */}
// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Đề thi & Câu hỏi</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="overflow-auto"><table className="w-full text-sm">
// // //               <tbody>
// // //                 <tr><td>Tổng đề thi</td><td className="text-right">{overview.quizzes.total}</td></tr>
// // //                 <tr><td>Listening</td><td className="text-right">{overview.quizzes.byListening}</td></tr>
// // //                 <tr><td>Reading</td><td className="text-right">{overview.quizzes.byReading}</td></tr>
// // //                 <tr><td>Writing</td><td className="text-right">{overview.quizzes.byWriting}</td></tr>
// // //                 <tr><td>Speaking</td><td className="text-right">{overview.quizzes.bySpeaking}</td></tr>
// // //                 <tr><td>Tổng câu hỏi</td><td className="text-right">{overview.quizzes.totalQuestions}</td></tr>
// // //                 <tr><td>Đã xuất bản</td><td className="text-right">{overview.quizzes.published}</td></tr>
// // //                 <tr><td>Bản nháp</td><td className="text-right">{overview.quizzes.draft}</td></tr>
// // //               </tbody>
// // //             </table></div>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       <div className="grid lg:grid-cols-3 gap-6">
// // //         {/* Revenue */}
// // //         <Card>
// // //           <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5"/> Doanh thu</CardTitle></CardHeader>
// // //           <CardContent>
// // //             <div className="overflow-auto"><table className="w-full text-sm">
// // //               <tbody>
// // //                 <tr><td>Tháng (cents)</td><td className="text-right">{overview.revenue.totalCentsThisMonth}</td></tr>
// // //                 <tr><td>Tháng (formatted)</td><td className="text-right">{formatCurrency((overview.revenue.totalCentsThisMonth || 0) / 100, overview.revenue.currency)}</td></tr>
// // //                 <tr><td>Tăng trưởng</td><td className="text-right">{overview.revenue.growthPercentage}%</td></tr>
// // //                 <tr><td>% VND</td><td className="text-right">{overview.revenue.vndPercentage}%</td></tr>
// // //                 <tr><td>% USD</td><td className="text-right">{overview.revenue.usdPercentage}%</td></tr>
// // //               </tbody>
// // //             </table></div>
// // //           </CardContent>
// // //         </Card>

// // //         {/* Orders & Payments */}
// // //         <Card>
// // //           <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> Đơn hàng & Thanh toán</CardTitle></CardHeader>
// // //           <CardContent>
// // //             <div className="overflow-auto"><table className="w-full text-sm">
// // //               <tbody>
// // //                 <tr><td>Đơn trong tháng</td><td className="text-right">{overview.orders.totalThisMonth}</td></tr>
// // //                 <tr><td>Hoàn tất</td><td className="text-right">{overview.orders.completed}</td></tr>
// // //                 <tr><td>Chờ</td><td className="text-right">{overview.orders.pending}</td></tr>
// // //                 <tr><td>Huỷ</td><td className="text-right">{overview.orders.cancelled}</td></tr>
// // //                 <tr><td>Thanh toán tổng</td><td className="text-right">{overview.payments.totalPayments}</td></tr>
// // //                 <tr><td>Thành công</td><td className="text-right">{overview.payments.succeeded}</td></tr>
// // //                 <tr><td>Thất bại</td><td className="text-right">{overview.payments.failed}</td></tr>
// // //               </tbody>
// // //             </table></div>
// // //           </CardContent>
// // //         </Card>

// // //         {/* Learning */}
// // //         <Card>
// // //           <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Học tập</CardTitle></CardHeader>
// // //           <CardContent>
// // //             <div className="overflow-auto"><table className="w-full text-sm">
// // //               <tbody>
// // //                 <tr><td>Tổng đăng ký</td><td className="text-right">{overview.learning.totalEnrollments}</td></tr>
// // //                 <tr><td>Tổng lượt thi</td><td className="text-right">{overview.learning.totalAttempts}</td></tr>
// // //                 <tr><td>Đang chấm</td><td className="text-right">{overview.learning.attemptsGrading}</td></tr>
// // //                 <tr><td>Hoàn thành</td><td className="text-right">{overview.learning.completed}</td></tr>
// // //                 <tr><td>Progress TB</td><td className="text-right">{overview.learning.averageProgress}%</td></tr>
// // //               </tbody>
// // //             </table></div>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       {/* Content, Recent activities, Top courses */}
// // //       <div className="grid lg:grid-cols-3 gap-6">
// // //         <Card>
// // //           <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5"/> Nội dung & Diễn đàn</CardTitle></CardHeader>
// // //           <CardContent>
// // //             <div className="overflow-auto"><table className="w-full text-sm">
// // //               <tbody>
// // //                 <tr><td>Bài blog</td><td className="text-right">{overview.content.totalBlogPosts}</td></tr>
// // //                 <tr><td>Bài viết diễn đàn</td><td className="text-right">{overview.content.totalForumPosts}</td></tr>
// // //                 <tr><td>Bình luận</td><td className="text-right">{overview.content.totalComments}</td></tr>
// // //                 <tr><td>Tổng view</td><td className="text-right">{overview.content.totalViews}</td></tr>
// // //                 <tr><td>Luồng khoá</td><td className="text-right">{overview.content.lockedThreads}</td></tr>
// // //               </tbody>
// // //             </table></div>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="lg:col-span-2">
// // //           <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/> Hoạt động gần đây</CardTitle></CardHeader>
// // //           <CardContent>
// // //             <div className="space-y-2">
// // //               {(overview.recentActivities || []).slice(0, 10).map((a, i) => (
// // //                 <div key={i} className="flex items-start gap-3 text-sm">
// // //                   <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
// // //                   <div className="text-muted-foreground">{a}</div>
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             <Separator className="my-4" />

// // //             <CardTitle className="text-sm">Top khóa học</CardTitle>
// // //             <div className="space-y-3">
// // //               {(overview.topCourses || []).length === 0 && <div className="text-muted-foreground text-sm">Chưa có dữ liệu</div>}
// // //               {(overview.topCourses || []).map((c, i) => (
// // //                 <div key={c.id || i} className="flex items-center justify-between">
// // //                   <div>
// // //                     <div className="font-medium">{c.title}</div>
// // //                     <div className="text-xs text-muted-foreground">{c.enrollments} lượt đăng ký</div>
// // //                   </div>
// // //                   <div className="font-bold">{formatCurrency(c.revenue)}</div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       {/* Raw debug */}
// // //       <Card>
// // //         <CardHeader><CardTitle>Raw API (Debug)</CardTitle></CardHeader>
// // //         <CardContent>
// // //           <pre className="text-xs max-h-72 overflow-auto">{JSON.stringify(overview.raw, null, 2)}</pre>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   );
// // // }

// // // function StatCard({ title, value, change, Icon }) {
// // //   return (
// // //     <Card>
// // //       <CardHeader className="flex items-center justify-between">
// // //         <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
// // //         <Icon className="w-5 h-5" />
// // //       </CardHeader>
// // //       <CardContent>
// // //         <div className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
// // //         <p className="text-xs text-muted-foreground mt-1">
// // //           <span className="text-green-600 font-medium">{change}</span> so với tuần trước
// // //         </p>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // }

// // // function DashboardSkeleton() {
// // //   return (
// // //     <div className="space-y-8">
// // //       <div>
// // //         <Skeleton className="h-10 w-64 mb-2" />
// // //         <Skeleton className="h-5 w-96" />
// // //       </div>
// // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
// // //         {[...Array(6)].map((_, i) => (
// // //           <Card key={i}>
// // //             <CardHeader className="flex flex-row items-center justify-between pb-2">
// // //               <Skeleton className="h-4 w-32" />
// // //               <Skeleton className="h-5 w-5 rounded-full" />
// // //             </CardHeader>
// // //             <CardContent>
// // //               <Skeleton className="h-8 w-24 mb-2" />
// // //               <Skeleton className="h-3 w-20" />
// // //             </CardContent>
// // //           </Card>
// // //         ))}
// // //       </div>
// // //       <div className="grid lg:grid-cols-3 gap-6">
// // //         <Card className="lg:col-span-1"><CardHeader><Skeleton className="h-6 w-40"/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
// // //         <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-40"/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import React, { useEffect, useState } from "react";
// // import {
// //   BarChart3,
// //   Users,
// //   FileText,
// //   TrendingUp,
// //   DollarSign,
// //   BookOpen,
// //   AlertCircle,
// //   Clock,
// //   CreditCard,
// //   Layers,
// //   MessageCircle,
// //   ShoppingCart,
// //   CheckCircle,
// //   Activity,
// // } from "lucide-react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { Badge } from "@/components/ui/badge";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { Separator } from "@/components/ui/separator";

// // import { getAdminOverview } from "@/lib/api/admin-overview";
// // import { formatCurrency } from "@/lib/utils";

// // // Mock cho phần chưa có backend
// // const mockRecentActivities = [
// //   "Người dùng mới đăng ký: admin@example.com",
// //   "Đề thi mới được tạo: Listening Practice #1",
// //   "Blog mới: Hướng dẫn luyện TOEIC",
// //   "Cập nhật khóa học: TOEIC Full Course",
// //   "Báo cáo forum: Thread #2",
// // ];

// // export default function AdminDashboard() {
// //   const [overview, setOverview] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const [recentActs, setRecentActs] = useState([]);
// //   const [topCourses, setTopCourses] = useState([]);
// //   const [revenueData, setRevenueData] = useState([]);
// //   const [userGrowthData, setUserGrowthData] = useState([])

// //   useEffect(() => {
// //     let mounted = true;

// //     const fetchAll = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         const [
// //           overviewRes,
// //           activitiesRes,
// //           topCoursesRes,
// //           revenueRes,
// //           growthRes,
// //         ] = await Promise.all([
// //           getAdminOverview(),
// //           getRecentActivities({ limit: 10 }),
// //           getTopCourses({ limit: 5 }),
// //           getRevenueStats({ groupBy: "day", days: 7 }),
// //           getUserGrowthStats({ groupBy: "day", days: 7 }),
// //         ]);

// //         if (!mounted) return;

// //         if (overviewRes.success) {
// //           setOverview(mapRealOverviewData(overviewRes.data));
// //         }

// //         setRecentActs(activitiesRes.success ? activitiesRes.data : []);
// //         setTopCourses(topCoursesRes.success ? topCoursesRes.data : []);
// //         setRevenueData(revenueRes.success ? revenueRes.data : []);
// //         setUserGrowthData(growthRes.success ? growthRes.data : []);

// //       } catch (err) {
// //         if (mounted) {
// //           setError("Một số dữ liệu không tải được. Hiển thị dữ liệu mẫu.");
// //           console.error(err);
// //           // Fallback
// //           setOverview(mapRealOverviewData());
// //           setRecentActs(getMockActivities());
// //           setTopCourses(getMockTopCourses());
// //         }
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     };

// //     fetchAll();
// //     return () => { mounted = false; };
// //   }, []);

// //   // Unified mapper: maps API payload to UI-friendly object (numbers normalized)
// //   function mapRealOverviewData(payload) {
// //     const d = payload || {};

// //     return {
// //       users: {
// //         total: Number(d.users?.total ?? 0),
// //         active: Number(d.users?.active ?? 0),
// //         verified: Number(d.users?.verified ?? 0),
// //         inactive: Number(d.users?.inactive ?? 0),
// //         weekGrowth: Number(d.users?.weekGrowth ?? 0),
// //         activePercentage: Number(d.users?.activePercentage ?? 0),
// //         verifiedPercentage: Number(d.users?.verifiedPercentage ?? 0),
// //       },

// //       instructors: {
// //         total: Number(d.instructors?.totalInstructors ?? 0),
// //         pendingRequests: Number(d.instructors?.pendingRequests ?? 0),
// //         pendingOver7Days: Number(d.instructors?.pendingOver7Days ?? 0),
// //         pendingUnder3Days: Number(d.instructors?.pendingUnder3Days ?? 0),
// //         pending3To7Days: Number(d.instructors?.pending3To7Days ?? 0),
// //       },

// //       courses: {
// //         total: Number(d.courses?.totalCourses ?? 0),
// //         published: Number(d.courses?.published ?? 0),
// //         draft: Number(d.courses?.draft ?? 0),
// //         archived: Number(d.courses?.archived ?? 0),
// //         totalModules: Number(d.courses?.totalModules ?? 0),
// //         totalLessons: Number(d.courses?.totalLessons ?? 0),
// //         freeLessons: Number(d.courses?.freeLessons ?? 0),
// //         publishedPercentage: Number(d.courses?.publishedPercentage ?? 0),
// //         freeLessonsPercentage: Number(d.courses?.freeLessonsPercentage ?? 0),
// //       },

// //       quizzes: {
// //         total: Number(d.quizzes?.totalQuizzes ?? 0),
// //         byReading: Number(d.quizzes?.byReading ?? 0),
// //         byListening: Number(d.quizzes?.byListening ?? 0),
// //         byWriting: Number(d.quizzes?.byWriting ?? 0),
// //         bySpeaking: Number(d.quizzes?.bySpeaking ?? 0),
// //         totalQuestions: Number(d.quizzes?.totalQuestions ?? 0),
// //         published: Number(d.quizzes?.published ?? 0),
// //         draft: Number(d.quizzes?.draft ?? 0),
// //       },

// //       revenue: {
// //         totalCentsThisMonth: Number(d.revenue?.totalCentsThisMonth ?? 0),
// //         currency: d.revenue?.currency ?? "VND",
// //         growthPercentage: Number(d.revenue?.growthPercentage ?? 0),
// //         totalCentsVND: Number(d.revenue?.totalCentsVND ?? 0),
// //         totalCentsUSD: Number(d.revenue?.totalCentsUSD ?? 0),
// //         vndPercentage: Number(d.revenue?.vndPercentage ?? 0),
// //         usdPercentage: Number(d.revenue?.usdPercentage ?? 0),
// //       },

// //       orders: {
// //         totalThisMonth: Number(d.orders?.totalOrdersThisMonth ?? 0),
// //         completed: Number(d.orders?.completed ?? 0),
// //         pending: Number(d.orders?.pending ?? 0),
// //         cancelled: Number(d.orders?.cancelled ?? 0),
// //         unpaidCarts: Number(d.orders?.unpaidCarts ?? 0),
// //         completedPercentage: Number(d.orders?.completedPercentage ?? 0),
// //         averageOrderValue: Number(d.orders?.averageOrderValue ?? 0),
// //       },

// //       payments: {
// //         totalPayments: Number(d.payments?.totalPayments ?? 0),
// //         byStripe: Number(d.payments?.byStripe ?? 0),
// //         byPayOS: Number(d.payments?.byPayOS ?? 0),
// //         succeeded: Number(d.payments?.succeeded ?? 0),
// //         failed: Number(d.payments?.failed ?? 0),
// //         refunded: Number(d.payments?.refunded ?? 0),
// //         successRate: Number(d.payments?.successRate ?? 0),
// //         stripePercentage: Number(d.payments?.stripePercentage ?? 0),
// //         payOSPercentage: Number(d.payments?.payOSPercentage ?? 0),
// //       },

// //       learning: {
// //         totalEnrollments: Number(d.learning?.totalEnrollments ?? 0),
// //         completed: Number(d.learning?.completed ?? 0),
// //         suspended: Number(d.learning?.suspended ?? 0),
// //         averageProgress: Number(d.learning?.averageProgress ?? 0),
// //         totalAttempts: Number(d.learning?.totalAttempts ?? 0),
// //         attemptsCompleted: Number(d.learning?.attemptsCompleted ?? 0),
// //         attemptsInProgress: Number(d.learning?.attemptsInProgress ?? 0),
// //         attemptsGrading: Number(d.learning?.attemptsGrading ?? 0),
// //         averageScore: Number(d.learning?.averageScore ?? 0),
// //       },

// //       content: {
// //         totalBlogPosts: Number(d.content?.totalBlogPosts ?? 0),
// //         publishedPosts: Number(d.content?.publishedPosts ?? 0),
// //         draftPosts: Number(d.content?.draftPosts ?? 0),
// //         totalCategories: Number(d.content?.totalCategories ?? 0),
// //         totalComments: Number(d.content?.totalComments ?? 0),
// //         totalThreads: Number(d.content?.totalThreads ?? 0),
// //         totalForumPosts: Number(d.content?.totalForumPosts ?? 0),
// //         totalViews: Number(d.content?.totalViews ?? 0),
// //         lockedThreads: Number(d.content?.lockedThreads ?? 0),
// //       },

// //       recentActivities: d.recentActivities ?? mockRecentActivities,
// //       topCourses: d.topCourses ?? [],

// //       raw: d,
// //     };
// //   }

// //   if (loading) return <DashboardSkeleton />;

// //   // safety: if overview somehow null after loading, show empty fallback
// //   if (!overview)
// //     return (
// //       <Alert variant="destructive">
// //         <AlertCircle className="h-4 w-4" />
// //         <AlertDescription>Không có dữ liệu để hiển thị.</AlertDescription>
// //       </Alert>
// //     );

// //   return (
// //     <div className="space-y-8">
// //       <div>
// //         <h1 className="text-4xl font-bold mb-2">Tổng quan Admin</h1>
// //         <p className="text-muted-foreground">Theo dõi hiệu suất hệ thống và hoạt động người dùng</p>
// //       </div>

// //       {error && (
// //         <Alert variant="destructive">
// //           <AlertCircle className="h-4 w-4" />
// //           <AlertDescription>{error}</AlertDescription>
// //         </Alert>
// //       )}

// //       {/* Top summary cards */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
// //         <StatCard title="Người dùng tổng" value={overview.users.total} change={`+${overview.users.weekGrowth}%`} Icon={Users} />
// //         <StatCard title="Người dùng đang hoạt động" value={overview.users.active} change={`${overview.users.activePercentage}%`} Icon={Activity} />
// //         <StatCard title="Giảng viên" value={overview.instructors.total} change={`Chờ ${overview.instructors.pendingRequests}`} Icon={Layers} />
// //         <StatCard title="Khóa học" value={overview.courses.total} change={`Đã xuất bản ${overview.courses.published}`} Icon={BookOpen} />
// //         <StatCard title="Đề thi" value={overview.quizzes.total} change={`Câu hỏi ${overview.quizzes.totalQuestions}`} Icon={FileText} />
// //         <StatCard
// //           title="Doanh thu (tháng)"
// //           value={formatCurrency((overview.revenue.totalCentsThisMonth || 0) / 100, overview.revenue.currency)}
// //           change={`+${overview.revenue.growthPercentage}%`}
// //           Icon={DollarSign}
// //         />
// //       </div>

// //       {/* Detailed grids */}
// //       <div className="grid lg:grid-cols-3 gap-6">
// //         {/* Users */}
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Users className="w-5 h-5" /> Thông tin người dùng
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="overflow-auto">
// //               <table className="w-full text-sm">
// //                 <tbody>
// //                   <tr><td>Tổng</td><td className="text-right">{overview.users.total}</td></tr>
// //                   <tr><td>Hoạt động</td><td className="text-right">{overview.users.active}</td></tr>
// //                   <tr><td>Đã xác minh</td><td className="text-right">{overview.users.verified}</td></tr>
// //                   <tr><td>Không hoạt động</td><td className="text-right">{overview.users.inactive}</td></tr>
// //                   <tr><td>Tăng tuần</td><td className="text-right">{overview.users.weekGrowth}</td></tr>
// //                   <tr><td>% hoạt động</td><td className="text-right">{overview.users.activePercentage}%</td></tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Courses */}
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5"/> Khóa học</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="overflow-auto">
// //               <table className="w-full text-sm">
// //                 <tbody>
// //                   <tr><td>Tổng khóa</td><td className="text-right">{overview.courses.total}</td></tr>
// //                   <tr><td>Đã xuất bản</td><td className="text-right">{overview.courses.published}</td></tr>
// //                   <tr><td>Bản nháp</td><td className="text-right">{overview.courses.draft}</td></tr>
// //                   <tr><td>Khoá bị lưu trữ</td><td className="text-right">{overview.courses.archived}</td></tr>
// //                   <tr><td>Tổng module</td><td className="text-right">{overview.courses.totalModules}</td></tr>
// //                   <tr><td>Tổng bài học</td><td className="text-right">{overview.courses.totalLessons}</td></tr>
// //                   <tr><td>Bài học miễn phí</td><td className="text-right">{overview.courses.freeLessons} ({overview.courses.freeLessonsPercentage}%)</td></tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Quizzes */}
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Đề thi & Câu hỏi</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="overflow-auto">
// //               <table className="w-full text-sm">
// //                 <tbody>
// //                   <tr><td>Tổng đề thi</td><td className="text-right">{overview.quizzes.total}</td></tr>
// //                   <tr><td>Listening</td><td className="text-right">{overview.quizzes.byListening}</td></tr>
// //                   <tr><td>Reading</td><td className="text-right">{overview.quizzes.byReading}</td></tr>
// //                   <tr><td>Writing</td><td className="text-right">{overview.quizzes.byWriting}</td></tr>
// //                   <tr><td>Speaking</td><td className="text-right">{overview.quizzes.bySpeaking}</td></tr>
// //                   <tr><td>Tổng câu hỏi</td><td className="text-right">{overview.quizzes.totalQuestions}</td></tr>
// //                   <tr><td>Đã xuất bản</td><td className="text-right">{overview.quizzes.published}</td></tr>
// //                   <tr><td>Bản nháp</td><td className="text-right">{overview.quizzes.draft}</td></tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <div className="grid lg:grid-cols-3 gap-6">
// //         {/* Revenue */}
// //         <Card>
// //           <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5"/> Doanh thu</CardTitle></CardHeader>
// //           <CardContent>
// //             <div className="overflow-auto">
// //               <table className="w-full text-sm">
// //                 <tbody>
// //                   <tr><td>Tháng (cents)</td><td className="text-right">{overview.revenue.totalCentsThisMonth}</td></tr>
// //                   <tr><td>Tháng (formatted)</td><td className="text-right">{formatCurrency((overview.revenue.totalCentsThisMonth || 0) / 100, overview.revenue.currency)}</td></tr>
// //                   <tr><td>Tăng trưởng</td><td className="text-right">{overview.revenue.growthPercentage}%</td></tr>
// //                   <tr><td>% VND</td><td className="text-right">{overview.revenue.vndPercentage}%</td></tr>
// //                   <tr><td>% USD</td><td className="text-right">{overview.revenue.usdPercentage}%</td></tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Orders & Payments */}
// //         <Card>
// //           <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> Đơn hàng & Thanh toán</CardTitle></CardHeader>
// //           <CardContent>
// //             <div className="overflow-auto">
// //               <table className="w-full text-sm">
// //                 <tbody>
// //                   <tr><td>Đơn trong tháng</td><td className="text-right">{overview.orders.totalThisMonth}</td></tr>
// //                   <tr><td>Hoàn tất</td><td className="text-right">{overview.orders.completed}</td></tr>
// //                   <tr><td>Chờ</td><td className="text-right">{overview.orders.pending}</td></tr>
// //                   <tr><td>Huỷ</td><td className="text-right">{overview.orders.cancelled}</td></tr>
// //                   <tr><td>Thanh toán tổng</td><td className="text-right">{overview.payments.totalPayments}</td></tr>
// //                   <tr><td>Thành công</td><td className="text-right">{overview.payments.succeeded}</td></tr>
// //                   <tr><td>Thất bại</td><td className="text-right">{overview.payments.failed}</td></tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Learning */}
// //         <Card>
// //           <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Học tập</CardTitle></CardHeader>
// //           <CardContent>
// //             <div className="overflow-auto">
// //               <table className="w-full text-sm">
// //                 <tbody>
// //                   <tr><td>Tổng đăng ký</td><td className="text-right">{overview.learning.totalEnrollments}</td></tr>
// //                   <tr><td>Tổng lượt thi</td><td className="text-right">{overview.learning.totalAttempts}</td></tr>
// //                   <tr><td>Đang chấm</td><td className="text-right">{overview.learning.attemptsGrading}</td></tr>
// //                   <tr><td>Hoàn thành</td><td className="text-right">{overview.learning.completed}</td></tr>
// //                   <tr><td>Progress TB</td><td className="text-right">{overview.learning.averageProgress}%</td></tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Content, Recent activities, Top courses */}
// //       <div className="grid lg:grid-cols-3 gap-6">
// //         <Card>
// //           <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5"/> Nội dung & Diễn đàn</CardTitle></CardHeader>
// //           <CardContent>
// //             <div className="overflow-auto">
// //               <table className="w-full text-sm">
// //                 <tbody>
// //                   <tr><td>Bài blog</td><td className="text-right">{overview.content.totalBlogPosts}</td></tr>
// //                   <tr><td>Bài viết diễn đàn</td><td className="text-right">{overview.content.totalForumPosts}</td></tr>
// //                   <tr><td>Bình luận</td><td className="text-right">{overview.content.totalComments}</td></tr>
// //                   <tr><td>Tổng view</td><td className="text-right">{overview.content.totalViews}</td></tr>
// //                   <tr><td>Luồng khoá</td><td className="text-right">{overview.content.lockedThreads}</td></tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="lg:col-span-2">
// //           <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/> Hoạt động gần đây</CardTitle></CardHeader>
// //           <CardContent>
// //             <div className="space-y-2">
// //               {(overview.recentActivities || []).slice(0, 10).map((a, i) => (
// //                 <div key={i} className="flex items-start gap-3 text-sm">
// //                   <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
// //                   <div className="text-muted-foreground">{a}</div>
// //                 </div>
// //               ))}
// //             </div>

// //             <Separator className="my-4" />

// //             <CardTitle className="text-sm">Top khóa học</CardTitle>
// //             <div className="space-y-3">
// //               {(overview.topCourses || []).length === 0 && <div className="text-muted-foreground text-sm">Chưa có dữ liệu</div>}
// //               {(overview.topCourses || []).map((c, i) => (
// //                 <div key={c.id || i} className="flex items-center justify-between">
// //                   <div>
// //                     <div className="font-medium">{c.title}</div>
// //                     <div className="text-xs text-muted-foreground">{c.enrollments} lượt đăng ký</div>
// //                   </div>
// //                   <div className="font-bold">{formatCurrency(c.revenue)}</div>
// //                 </div>
// //               ))}
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Raw debug */}
// //       <Card>
// //         <CardHeader><CardTitle>Raw API (Debug)</CardTitle></CardHeader>
// //         <CardContent>
// //           <pre className="text-xs max-h-72 overflow-auto">{JSON.stringify(overview.raw, null, 2)}</pre>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }

// // function StatCard({ title, value, change, Icon }) {
// //   return (
// //     <Card>
// //       <CardHeader className="flex items-center justify-between">
// //         <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
// //         <Icon className="w-5 h-5" />
// //       </CardHeader>
// //       <CardContent>
// //         <div className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
// //         <p className="text-xs text-muted-foreground mt-1">
// //           <span className="text-green-600 font-medium">{change}</span> so với tuần trước
// //         </p>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// // function DashboardSkeleton() {
// //   return (
// //     <div className="space-y-8">
// //       <div>
// //         <Skeleton className="h-10 w-64 mb-2" />
// //         <Skeleton className="h-5 w-96" />
// //       </div>
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
// //         {[...Array(6)].map((_, i) => (
// //           <Card key={i}>
// //             <CardHeader className="flex flex-row items-center justify-between pb-2">
// //               <Skeleton className="h-4 w-32" />
// //               <Skeleton className="h-5 w-5 rounded-full" />
// //             </CardHeader>
// //             <CardContent>
// //               <Skeleton className="h-8 w-24 mb-2" />
// //               <Skeleton className="h-3 w-20" />
// //             </CardContent>
// //           </Card>
// //         ))}
// //       </div>
// //       <div className="grid lg:grid-cols-3 gap-6">
// //         <Card className="lg:col-span-1"><CardHeader><Skeleton className="h-6 w-40"/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
// //         <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-40"/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
// //       </div>
// //     </div>
// //   );
// // }

// // AdminDashboard.js hoặc app/(admin)/admin/page.js (đã sửa đầy đủ)
// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   BarChart3,
//   Users,
//   FileText,
//   TrendingUp,
//   DollarSign,
//   BookOpen,
//   AlertCircle,
//   Clock,
//   CreditCard,
//   Layers,
//   MessageCircle,
//   ShoppingCart,
//   CheckCircle,
//   Activity,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Separator } from "@/components/ui/separator";
// import { getAdminOverview } from "@/lib/api/admin-overview";
// import { formatCurrency } from "@/lib/utils";
// // Mock cho phần chưa có backend
// const mockRecentActivities = [
//   "Người dùng mới đăng ký: admin@example.com",
//   "Đề thi mới được tạo: Listening Practice #1",
//   "Blog mới: Hướng dẫn luyện TOEIC",
//   "Cập nhật khóa học: TOEIC Full Course",
//   "Báo cáo forum: Thread #2",
// ];
// export default function AdminDashboard() {
//   const [overview, setOverview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     let mounted = true;
//     async function fetchData() {
//       try {
//         setLoading(true);
//         setError(null);
//         const overviewRes = await getAdminOverview();
//         // Debug: log response để kiểm tra cấu trúc
//         console.log("getAdminOverview raw:", overviewRes);
//         // IMPORTANT: unwrap possible nesting
//         // Cases:
//         // 1) getAdminOverview() => { success, code, message, data: { users: ... } }
//         // 2) getAdminOverview() => { users: ... } (direct data)
//         // 3) getAdminOverview() might already have been unwrapped by the API helper
//         const apiData =
//           overviewRes?.data?.data ?? // if getAdminOverview returned { data: { data: {...} } }
//           overviewRes?.data ?? // if getAdminOverview returned { data: {...} }
//           overviewRes ?? // if getAdminOverview returned {...} directly
//           null;
//         if (!apiData) throw new Error("API trả về định dạng không hợp lệ");
//         if (mounted) setOverview(mapRealOverviewData(apiData));
//       } catch (err) {
//         console.error("Dashboard error:", err);
//         setError("Không thể tải dữ liệu. Đã chuyển sang dữ liệu dự phòng.");
//         if (mounted) {
//           // fallback data (similar to real sample)
//           setOverview(
//             mapRealOverviewData({
//               users: {
//                 total: 2,
//                 active: 2,
//                 verified: 2,
//                 inactive: 0,
//                 weekGrowth: 2,
//                 activePercentage: 100,
//                 verifiedPercentage: 100,
//               },
//               instructors: { totalInstructors: 1, pendingRequests: 0 },
//               courses: {
//                 totalCourses: 2,
//                 published: 2,
//                 draft: 0,
//                 archived: 0,
//                 totalModules: 3,
//                 totalLessons: 2,
//                 freeLessons: 1,
//                 freeLessonsPercentage: 50,
//               },
//               quizzes: {
//                 totalQuizzes: 2,
//                 byListening: 2,
//                 totalQuestions: 1,
//                 published: 1,
//                 draft: 1,
//               },
//               revenue: {
//                 totalCentsThisMonth: 0,
//                 currency: "VND",
//                 growthPercentage: 0,
//                 vndPercentage: 0,
//                 usdPercentage: 0,
//               },
//               orders: { totalOrdersThisMonth: 0, completed: 0, pending: 0, cancelled: 0 },
//               payments: { totalPayments: 0, succeeded: 0, failed: 0 },
//               learning: { totalEnrollments: 0, totalAttempts: 1, attemptsGrading: 1, averageProgress: 0 },
//               content: { totalBlogPosts: 1, totalComments: 42, totalForumPosts: 28, totalViews: 31 },
//               topCourses: [],
//             })
//           );
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }
//     fetchData();
//     return () => {
//       mounted = false;
//     };
//   }, []);
//   // Unified mapper: maps API payload to UI-friendly object (numbers normalized)
//   function mapRealOverviewData(payload) {
//     const d = payload || {};
//     return {
//       users: {
//         total: Number(d.users?.total ?? 0),
//         active: Number(d.users?.active ?? 0),
//         verified: Number(d.users?.verified ?? 0),
//         inactive: Number(d.users?.inactive ?? 0),
//         weekGrowth: Number(d.users?.weekGrowth ?? 0),
//         activePercentage: Number(d.users?.activePercentage ?? 0),
//         verifiedPercentage: Number(d.users?.verifiedPercentage ?? 0),
//       },
//       instructors: {
//         total: Number(d.instructors?.totalInstructors ?? 0),
//         pendingRequests: Number(d.instructors?.pendingRequests ?? 0),
//         pendingOver7Days: Number(d.instructors?.pendingOver7Days ?? 0),
//         pendingUnder3Days: Number(d.instructors?.pendingUnder3Days ?? 0),
//         pending3To7Days: Number(d.instructors?.pending3To7Days ?? 0),
//       },
//       courses: {
//         total: Number(d.courses?.totalCourses ?? 0),
//         published: Number(d.courses?.published ?? 0),
//         draft: Number(d.courses?.draft ?? 0),
//         archived: Number(d.courses?.archived ?? 0),
//         totalModules: Number(d.courses?.totalModules ?? 0),
//         totalLessons: Number(d.courses?.totalLessons ?? 0),
//         freeLessons: Number(d.courses?.freeLessons ?? 0),
//         publishedPercentage: Number(d.courses?.publishedPercentage ?? 0),
//         freeLessonsPercentage: Number(d.courses?.freeLessonsPercentage ?? 0),
//       },
//       quizzes: {
//         total: Number(d.quizzes?.totalQuizzes ?? 0),
//         byReading: Number(d.quizzes?.byReading ?? 0),
//         byListening: Number(d.quizzes?.byListening ?? 0),
//         byWriting: Number(d.quizzes?.byWriting ?? 0),
//         bySpeaking: Number(d.quizzes?.bySpeaking ?? 0),
//         totalQuestions: Number(d.quizzes?.totalQuestions ?? 0),
//         published: Number(d.quizzes?.published ?? 0),
//         draft: Number(d.quizzes?.draft ?? 0),
//       },
//       revenue: {
//         totalCentsThisMonth: Number(d.revenue?.totalCentsThisMonth ?? 0),
//         currency: d.revenue?.currency ?? "VND",
//         growthPercentage: Number(d.revenue?.growthPercentage ?? 0),
//         totalCentsVND: Number(d.revenue?.totalCentsVND ?? 0),
//         totalCentsUSD: Number(d.revenue?.totalCentsUSD ?? 0),
//         vndPercentage: Number(d.revenue?.vndPercentage ?? 0),
//         usdPercentage: Number(d.revenue?.usdPercentage ?? 0),
//       },
//       orders: {
//         totalThisMonth: Number(d.orders?.totalOrdersThisMonth ?? 0),
//         completed: Number(d.orders?.completed ?? 0),
//         pending: Number(d.orders?.pending ?? 0),
//         cancelled: Number(d.orders?.cancelled ?? 0),
//         unpaidCarts: Number(d.orders?.unpaidCarts ?? 0),
//         completedPercentage: Number(d.orders?.completedPercentage ?? 0),
//         averageOrderValue: Number(d.orders?.averageOrderValue ?? 0),
//       },
//       payments: {
//         totalPayments: Number(d.payments?.totalPayments ?? 0),
//         byStripe: Number(d.payments?.byStripe ?? 0),
//         byPayOS: Number(d.payments?.byPayOS ?? 0),
//         succeeded: Number(d.payments?.succeeded ?? 0),
//         failed: Number(d.payments?.failed ?? 0),
//         refunded: Number(d.payments?.refunded ?? 0),
//         successRate: Number(d.payments?.successRate ?? 0),
//         stripePercentage: Number(d.payments?.stripePercentage ?? 0),
//         payOSPercentage: Number(d.payments?.payOSPercentage ?? 0),
//       },
//       learning: {
//         totalEnrollments: Number(d.learning?.totalEnrollments ?? 0),
//         completed: Number(d.learning?.completed ?? 0),
//         suspended: Number(d.learning?.suspended ?? 0),
//         averageProgress: Number(d.learning?.averageProgress ?? 0),
//         totalAttempts: Number(d.learning?.totalAttempts ?? 0),
//         attemptsCompleted: Number(d.learning?.attemptsCompleted ?? 0),
//         attemptsInProgress: Number(d.learning?.attemptsInProgress ?? 0),
//         attemptsGrading: Number(d.learning?.attemptsGrading ?? 0),
//         averageScore: Number(d.learning?.averageScore ?? 0),
//       },
//       content: {
//         totalBlogPosts: Number(d.content?.totalBlogPosts ?? 0),
//         publishedPosts: Number(d.content?.publishedPosts ?? 0),
//         draftPosts: Number(d.content?.draftPosts ?? 0),
//         totalCategories: Number(d.content?.totalCategories ?? 0),
//         totalComments: Number(d.content?.totalComments ?? 0),
//         totalThreads: Number(d.content?.totalThreads ?? 0),
//         totalForumPosts: Number(d.content?.totalForumPosts ?? 0),
//         totalViews: Number(d.content?.totalViews ?? 0),
//         lockedThreads: Number(d.content?.lockedThreads ?? 0),
//       },
//       recentActivities: d.recentActivities ?? mockRecentActivities,
//       topCourses: d.topCourses ?? [],
//       raw: d,
//     };
//   }
//   if (loading) return <DashboardSkeleton />;
//   // safety: if overview somehow null after loading, show empty fallback
//   if (!overview)
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>Không có dữ liệu để hiển thị.</AlertDescription>
//       </Alert>
//     );
//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-4xl font-bold mb-2">Tổng quan Admin</h1>
//         <p className="text-muted-foreground">Theo dõi hiệu suất hệ thống và hoạt động người dùng</p>
//       </div>
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       {/* Top summary cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
//         <StatCard title="Người dùng tổng" value={overview.users.total} change={`+${overview.users.weekGrowth}%`} Icon={Users} />
//         <StatCard title="Người dùng đang hoạt động" value={overview.users.active} change={`${overview.users.activePercentage}%`} Icon={Activity} />
//         <StatCard title="Giảng viên" value={overview.instructors.total} change={`Chờ ${overview.instructors.pendingRequests}`} Icon={Layers} />
//         <StatCard title="Khóa học" value={overview.courses.total} change={`Đã xuất bản ${overview.courses.published}`} Icon={BookOpen} />
//         <StatCard title="Đề thi" value={overview.quizzes.total} change={`Câu hỏi ${overview.quizzes.totalQuestions}`} Icon={FileText} />
//         <StatCard
//           title="Doanh thu (tháng)"
//           value={formatCurrency((overview.revenue.totalCentsThisMonth || 0) / 100, overview.revenue.currency)}
//           change={`+${overview.revenue.growthPercentage}%`}
//           Icon={DollarSign}
//         />
//       </div>
//       {/* Detailed grids */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Users */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="w-5 h-5" /> Thông tin người dùng
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <tbody>
//                   <tr><td>Tổng</td><td className="text-right">{overview.users.total}</td></tr>
//                   <tr><td>Hoạt động</td><td className="text-right">{overview.users.active}</td></tr>
//                   <tr><td>Đã xác minh</td><td className="text-right">{overview.users.verified}</td></tr>
//                   <tr><td>Không hoạt động</td><td className="text-right">{overview.users.inactive}</td></tr>
//                   <tr><td>Tăng tuần</td><td className="text-right">{overview.users.weekGrowth}</td></tr>
//                   <tr><td>% hoạt động</td><td className="text-right">{overview.users.activePercentage}%</td></tr>
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Courses */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5"/> Khóa học</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <tbody>
//                   <tr><td>Tổng khóa</td><td className="text-right">{overview.courses.total}</td></tr>
//                   <tr><td>Đã xuất bản</td><td className="text-right">{overview.courses.published}</td></tr>
//                   <tr><td>Bản nháp</td><td className="text-right">{overview.courses.draft}</td></tr>
//                   <tr><td>Khoá bị lưu trữ</td><td className="text-right">{overview.courses.archived}</td></tr>
//                   <tr><td>Tổng module</td><td className="text-right">{overview.courses.totalModules}</td></tr>
//                   <tr><td>Tổng bài học</td><td className="text-right">{overview.courses.totalLessons}</td></tr>
//                   <tr><td>Bài học miễn phí</td><td className="text-right">{overview.courses.freeLessons} ({overview.courses.freeLessonsPercentage}%)</td></tr>
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Quizzes */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Đề thi & Câu hỏi</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <tbody>
//                   <tr><td>Tổng đề thi</td><td className="text-right">{overview.quizzes.total}</td></tr>
//                   <tr><td>Listening</td><td className="text-right">{overview.quizzes.byListening}</td></tr>
//                   <tr><td>Reading</td><td className="text-right">{overview.quizzes.byReading}</td></tr>
//                   <tr><td>Writing</td><td className="text-right">{overview.quizzes.byWriting}</td></tr>
//                   <tr><td>Speaking</td><td className="text-right">{overview.quizzes.bySpeaking}</td></tr>
//                   <tr><td>Tổng câu hỏi</td><td className="text-right">{overview.quizzes.totalQuestions}</td></tr>
//                   <tr><td>Đã xuất bản</td><td className="text-right">{overview.quizzes.published}</td></tr>
//                   <tr><td>Bản nháp</td><td className="text-right">{overview.quizzes.draft}</td></tr>
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Revenue */}
//         <Card>
//           <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5"/> Doanh thu</CardTitle></CardHeader>
//           <CardContent>
//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <tbody>
//                   <tr><td>Tháng (cents)</td><td className="text-right">{overview.revenue.totalCentsThisMonth}</td></tr>
//                   <tr><td>Tháng (formatted)</td><td className="text-right">{formatCurrency((overview.revenue.totalCentsThisMonth || 0) / 100, overview.revenue.currency)}</td></tr>
//                   <tr><td>Tăng trưởng</td><td className="text-right">{overview.revenue.growthPercentage}%</td></tr>
//                   <tr><td>% VND</td><td className="text-right">{overview.revenue.vndPercentage}%</td></tr>
//                   <tr><td>% USD</td><td className="text-right">{overview.revenue.usdPercentage}%</td></tr>
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Orders & Payments */}
//         <Card>
//           <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> Đơn hàng & Thanh toán</CardTitle></CardHeader>
//           <CardContent>
//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <tbody>
//                   <tr><td>Đơn trong tháng</td><td className="text-right">{overview.orders.totalThisMonth}</td></tr>
//                   <tr><td>Hoàn tất</td><td className="text-right">{overview.orders.completed}</td></tr>
//                   <tr><td>Chờ</td><td className="text-right">{overview.orders.pending}</td></tr>
//                   <tr><td>Huỷ</td><td className="text-right">{overview.orders.cancelled}</td></tr>
//                   <tr><td>Thanh toán tổng</td><td className="text-right">{overview.payments.totalPayments}</td></tr>
//                   <tr><td>Thành công</td><td className="text-right">{overview.payments.succeeded}</td></tr>
//                   <tr><td>Thất bại</td><td className="text-right">{overview.payments.failed}</td></tr>
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Learning */}
//         <Card>
//           <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Học tập</CardTitle></CardHeader>
//           <CardContent>
//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <tbody>
//                   <tr><td>Tổng đăng ký</td><td className="text-right">{overview.learning.totalEnrollments}</td></tr>
//                   <tr><td>Tổng lượt thi</td><td className="text-right">{overview.learning.totalAttempts}</td></tr>
//                   <tr><td>Đang chấm</td><td className="text-right">{overview.learning.attemptsGrading}</td></tr>
//                   <tr><td>Hoàn thành</td><td className="text-right">{overview.learning.completed}</td></tr>
//                   <tr><td>Progress TB</td><td className="text-right">{overview.learning.averageProgress}%</td></tr>
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       {/* Content, Recent activities, Top courses */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5"/> Nội dung & Diễn đàn</CardTitle></CardHeader>
//           <CardContent>
//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <tbody>
//                   <tr><td>Bài blog</td><td className="text-right">{overview.content.totalBlogPosts}</td></tr>
//                   <tr><td>Bài viết diễn đàn</td><td className="text-right">{overview.content.totalForumPosts}</td></tr>
//                   <tr><td>Bình luận</td><td className="text-right">{overview.content.totalComments}</td></tr>
//                   <tr><td>Tổng view</td><td className="text-right">{overview.content.totalViews}</td></tr>
//                   <tr><td>Luồng khoá</td><td className="text-right">{overview.content.lockedThreads}</td></tr>
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="lg:col-span-2">
//           <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/> Hoạt động gần đây</CardTitle></CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               {(overview.recentActivities || []).slice(0, 10).map((a, i) => (
//                 <div key={i} className="flex items-start gap-3 text-sm">
//                   <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
//                   <div className="text-muted-foreground">{a}</div>
//                 </div>
//               ))}
//             </div>
//             <Separator className="my-4" />
//             <CardTitle className="text-sm">Top khóa học</CardTitle>
//             <div className="space-y-3">
//               {(overview.topCourses || []).length === 0 && <div className="text-muted-foreground text-sm">Chưa có dữ liệu</div>}
//               {(overview.topCourses || []).map((c, i) => (
//                 <div key={c.id || i} className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium">{c.title}</div>
//                     <div className="text-xs text-muted-foreground">{c.enrollments} lượt đăng ký</div>
//                   </div>
//                   <div className="font-bold">{formatCurrency(c.revenue)}</div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       {/* Raw debug */}
//       <Card>
//         <CardHeader><CardTitle>Raw API (Debug)</CardTitle></CardHeader>
//         <CardContent>
//           <pre className="text-xs max-h-72 overflow-auto">{JSON.stringify(overview.raw, null, 2)}</pre>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// function StatCard({ title, value, change, Icon }) {
//   return (
//     <Card>
//       <CardHeader className="flex items-center justify-between">
//         <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
//         <Icon className="w-5 h-5" />
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
//         <p className="text-xs text-muted-foreground mt-1">
//           <span className="text-green-600 font-medium">{change}</span> so với tuần trước
//         </p>
//       </CardContent>
//     </Card>
//   );
// }
// function DashboardSkeleton() {
//   return (
//     <div className="space-y-8">
//       <div>
//         <Skeleton className="h-10 w-64 mb-2" />
//         <Skeleton className="h-5 w-96" />
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
//         {[...Array(6)].map((_, i) => (
//           <Card key={i}>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <Skeleton className="h-4 w-32" />
//               <Skeleton className="h-5 w-5 rounded-full" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-8 w-24 mb-2" />
//               <Skeleton className="h-3 w-20" />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//       <div className="grid lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-1"><CardHeader><Skeleton className="h-6 w-40"/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
//         <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-40"/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  BookOpen,
  AlertCircle,
  Clock,
  CreditCard,
  Layers,
  MessageCircle,
  ShoppingCart,
  CheckCircle,
  Activity,
  Award,
  UserCheck,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getAdminOverview } from "@/lib/api/admin-overview";
import { formatCurrency } from "@/lib/utils";

// Import các API functions mới
import {
  getPendingActions,
  getUserGrowthChart,
  getRevenueChart,
  getEnrollmentChart,
  getTopCourses,
  getTopRevenueCourses,
  // getQuizPerformance,
} from "@/lib/api/admin-overview";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [pendingActions, setPendingActions] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [enrollmentChart, setEnrollmentChart] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [topRevenueCourses, setTopRevenueCourses] = useState([]);
  // const [quizPerformance, setQuizPerformance] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Get Overview Summary
        const overviewRes = await getAdminOverview();
        console.log("Overview response:", overviewRes);

        if (!overviewRes.success) {
          throw new Error(overviewRes.error || "Failed to fetch overview");
        }

        // Unwrap data - handle both { data: {...} } and { data: { data: {...} } }
        const apiData = overviewRes?.data?.data ?? overviewRes?.data;
        
        if (!apiData) {
          throw new Error("Invalid API response format");
        }

        if (mounted) {
          setOverview(mapOverviewData(apiData));
        }

        // 2. Get Pending Actions
        const pendingRes = await getPendingActions();
        if (pendingRes.success && mounted) {
          const pendingData = pendingRes?.data?.data ?? pendingRes?.data;
          setPendingActions(pendingData);
        }

        // 3. Get User Growth Chart (12 months)
        const userGrowthRes = await getUserGrowthChart(12);
        if (userGrowthRes.success && mounted) {
          const growthData = userGrowthRes?.data?.data ?? userGrowthRes?.data;
          setUserGrowth(growthData?.monthlyData || []);
        }

        // 4. Get Revenue Chart (6 months)
        const revenueRes = await getRevenueChart(6);
        if (revenueRes.success && mounted) {
          const revData = revenueRes?.data?.data ?? revenueRes?.data;
          setRevenueChart(revData?.monthlyRevenue || []);
        }

        // 5. Get Enrollment Chart (6 months)
        const enrollmentRes = await getEnrollmentChart(6);
        if (enrollmentRes.success && mounted) {
          const enrollData = enrollmentRes?.data?.data ?? enrollmentRes?.data;
          setEnrollmentChart(enrollData?.monthlyEnrollment || []);
        }

        // 6. Get Top Courses
        const topCoursesRes = await getTopCourses(10);
        if (topCoursesRes.success && mounted) {
          const coursesData = topCoursesRes?.data?.data ?? topCoursesRes?.data;
          setTopCourses(coursesData?.topCourses || []);
        }

        // 7. Get Top Revenue Courses
        const topRevenueRes = await getTopRevenueCourses(10);
        if (topRevenueRes.success && mounted) {
          const revenueData = topRevenueRes?.data?.data ?? topRevenueRes?.data;
          setTopRevenueCourses(revenueData?.topRevenueCourses || []);
        }

        // // 8. Get Quiz Performance
        // const quizPerfRes = await getQuizPerformance();
        // if (quizPerfRes.success && mounted) {
        //   const quizData = quizPerfRes?.data?.data ?? quizPerfRes?.data;
        //   setQuizPerformance(quizData?.skillPerformances || []);
        // }

      } catch (err) {
        console.error("Dashboard error:", err);
        if (mounted) {
          setError(err.message || "Không thể tải dữ liệu dashboard");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  function mapOverviewData(payload) {
    const d = payload || {};

    return {
      users: {
        total: Number(d.users?.total ?? 0),
        active: Number(d.users?.active ?? 0),
        verified: Number(d.users?.verified ?? 0),
        inactive: Number(d.users?.inactive ?? 0),
        weekGrowth: Number(d.users?.weekGrowth ?? 0),
        activePercentage: Number(d.users?.activePercentage ?? 0),
        verifiedPercentage: Number(d.users?.verifiedPercentage ?? 0),
      },

      instructors: {
        total: Number(d.instructors?.totalInstructors ?? 0),
        pendingRequests: Number(d.instructors?.pendingRequests ?? 0),
        pendingOver7Days: Number(d.instructors?.pendingOver7Days ?? 0),
        pendingUnder3Days: Number(d.instructors?.pendingUnder3Days ?? 0),
        pending3To7Days: Number(d.instructors?.pending3To7Days ?? 0),
      },

      courses: {
        total: Number(d.courses?.totalCourses ?? 0),
        published: Number(d.courses?.published ?? 0),
        draft: Number(d.courses?.draft ?? 0),
        archived: Number(d.courses?.archived ?? 0),
        totalModules: Number(d.courses?.totalModules ?? 0),
        totalLessons: Number(d.courses?.totalLessons ?? 0),
        freeLessons: Number(d.courses?.freeLessons ?? 0),
        publishedPercentage: Number(d.courses?.publishedPercentage ?? 0),
        freeLessonsPercentage: Number(d.courses?.freeLessonsPercentage ?? 0),
      },

      quizzes: {
        total: Number(d.quizzes?.totalQuizzes ?? 0),
        byReading: Number(d.quizzes?.byReading ?? 0),
        byListening: Number(d.quizzes?.byListening ?? 0),
        byWriting: Number(d.quizzes?.byWriting ?? 0),
        bySpeaking: Number(d.quizzes?.bySpeaking ?? 0),
        totalQuestions: Number(d.quizzes?.totalQuestions ?? 0),
        published: Number(d.quizzes?.published ?? 0),
        draft: Number(d.quizzes?.draft ?? 0),
      },

      revenue: {
        totalCentsThisMonth: Number(d.revenue?.totalCentsThisMonth ?? 0),
        currency: d.revenue?.currency ?? "VND",
        growthPercentage: Number(d.revenue?.growthPercentage ?? 0),
        totalCentsVND: Number(d.revenue?.totalCentsVND ?? 0),
        totalCentsUSD: Number(d.revenue?.totalCentsUSD ?? 0),
        vndPercentage: Number(d.revenue?.vndPercentage ?? 0),
        usdPercentage: Number(d.revenue?.usdPercentage ?? 0),
      },

      orders: {
        totalThisMonth: Number(d.orders?.totalOrdersThisMonth ?? 0),
        completed: Number(d.orders?.completed ?? 0),
        pending: Number(d.orders?.pending ?? 0),
        cancelled: Number(d.orders?.cancelled ?? 0),
        unpaidCarts: Number(d.orders?.unpaidCarts ?? 0),
        completedPercentage: Number(d.orders?.completedPercentage ?? 0),
        averageOrderValue: Number(d.orders?.averageOrderValue ?? 0),
      },

      payments: {
        totalPayments: Number(d.payments?.totalPayments ?? 0),
        byStripe: Number(d.payments?.byStripe ?? 0),
        byPayOS: Number(d.payments?.byPayOS ?? 0),
        succeeded: Number(d.payments?.succeeded ?? 0),
        failed: Number(d.payments?.failed ?? 0),
        refunded: Number(d.payments?.refunded ?? 0),
        successRate: Number(d.payments?.successRate ?? 0),
        stripePercentage: Number(d.payments?.stripePercentage ?? 0),
        payOSPercentage: Number(d.payments?.payOSPercentage ?? 0),
      },

      learning: {
        totalEnrollments: Number(d.learning?.totalEnrollments ?? 0),
        completed: Number(d.learning?.completed ?? 0),
        suspended: Number(d.learning?.suspended ?? 0),
        averageProgress: Number(d.learning?.averageProgress ?? 0),
        totalAttempts: Number(d.learning?.totalAttempts ?? 0),
        attemptsCompleted: Number(d.learning?.attemptsCompleted ?? 0),
        attemptsInProgress: Number(d.learning?.attemptsInProgress ?? 0),
        attemptsGrading: Number(d.learning?.attemptsGrading ?? 0),
        averageScore: Number(d.learning?.averageScore ?? 0),
      },

      content: {
        totalBlogPosts: Number(d.content?.totalBlogPosts ?? 0),
        publishedPosts: Number(d.content?.publishedPosts ?? 0),
        draftPosts: Number(d.content?.draftPosts ?? 0),
        totalCategories: Number(d.content?.totalCategories ?? 0),
        totalComments: Number(d.content?.totalComments ?? 0),
        totalThreads: Number(d.content?.totalThreads ?? 0),
        totalForumPosts: Number(d.content?.totalForumPosts ?? 0),
        totalViews: Number(d.content?.totalViews ?? 0),
        lockedThreads: Number(d.content?.lockedThreads ?? 0),
      },
    };
  }

  if (loading) return <DashboardSkeleton />;

  if (!overview) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Không có dữ liệu để hiển thị.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Tổng quan Admin</h1>
        <p className="text-muted-foreground">
          Theo dõi hiệu suất hệ thống và hoạt động người dùng
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Người dùng"
          value={overview.users.total}
          change={`+${overview.users.weekGrowth} tuần này`}
          Icon={Users}
          trend="up"
        />
        {/* <StatCard
          title="Đang hoạt động"
          value={overview.users.active}
          change={`${overview.users.activePercentage}%`}
          Icon={Activity}
          trend="neutral"
        /> */}
        <StatCard
          title="Giảng viên"
          value={overview.instructors.total}
          change={`${overview.instructors.pendingRequests} chờ duyệt`}
          Icon={GraduationCap}
          trend={overview.instructors.pendingRequests > 0 ? "warning" : "neutral"}
        />
        <StatCard
          title="Khóa học"
          value={overview.courses.total}
          change={`${overview.courses.published} đã xuất bản`}
          Icon={BookOpen}
          trend="up"
        />
        <StatCard
          title="Đề thi"
          value={overview.quizzes.total}
          change={`${overview.quizzes.totalQuestions} câu hỏi`}
          Icon={FileText}
          trend="neutral"
        />
        <StatCard
          title="Doanh thu tháng"
          value={formatCurrency(
            (overview.revenue.totalCentsThisMonth || 0) / 100,
            overview.revenue.currency
          )}
          change={`${overview.revenue.growthPercentage >= 0 ? "+" : ""}${overview.revenue.growthPercentage}%`}
          Icon={DollarSign}
          trend={overview.revenue.growthPercentage >= 0 ? "up" : "down"}
        />
      </div>

      {/* Pending Actions Alert */}
      {pendingActions && (
        <PendingActionsSection pendingActions={pendingActions} />
      )}

      {/* Charts Section */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="enrollment">Đăng ký</TabsTrigger>
          {/* <TabsTrigger value="quiz">Quiz Performance</TabsTrigger> */}
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tăng trưởng người dùng (12 tháng)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#8884d8"
                    name="Người dùng mới"
                  />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#82ca9d"
                    name="Người dùng hoạt động"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng (6 tháng)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenueVND" fill="#8884d8" name="VND (cents)" />
                  <Bar dataKey="revenueUSD" fill="#82ca9d" name="USD (cents)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đăng ký khóa học (6 tháng)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={enrollmentChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newEnrollments"
                    stroke="#8884d8"
                    name="Đăng ký mới"
                  />
                  <Line
                    type="monotone"
                    dataKey="completedEnrollments"
                    stroke="#82ca9d"
                    name="Đã hoàn thành"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất Quiz theo kỹ năng</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={quizPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalAttempts" fill="#8884d8" name="Tổng lượt thi" />
                  <Bar
                    dataKey="averageScore"
                    fill="#82ca9d"
                    name="Điểm TB"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* Detailed Statistics Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Người dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng</span>
                <span className="font-medium">{overview.users.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hoạt động</span>
                <span className="font-medium text-green-600">
                  {overview.users.active}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đã xác minh</span>
                <span className="font-medium">{overview.users.verified}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Không hoạt động</span>
                <span className="font-medium text-orange-600">
                  {overview.users.inactive}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tăng tuần</span>
                <Badge variant="secondary">+{overview.users.weekGrowth}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">% Hoạt động</span>
                <Badge variant="outline">{overview.users.activePercentage}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Khóa học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng khóa</span>
                <span className="font-medium">{overview.courses.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đã xuất bản</span>
                <span className="font-medium text-green-600">
                  {overview.courses.published}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bản nháp</span>
                <span className="font-medium text-orange-600">
                  {overview.courses.draft}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đã lưu trữ</span>
                <span className="font-medium">{overview.courses.archived}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modules</span>
                <span className="font-medium">{overview.courses.totalModules}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bài học</span>
                <span className="font-medium">{overview.courses.totalLessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Miễn phí</span>
                <Badge variant="secondary">
                  {overview.courses.freeLessons} (
                  {overview.courses.freeLessonsPercentage}%)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Đề thi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng đề</span>
                <span className="font-medium">{overview.quizzes.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Listening</span>
                <Badge variant="outline">{overview.quizzes.byListening}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reading</span>
                <Badge variant="outline">{overview.quizzes.byReading}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Writing</span>
                <Badge variant="outline">{overview.quizzes.byWriting}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Speaking</span>
                <Badge variant="outline">{overview.quizzes.bySpeaking}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Câu hỏi</span>
                <span className="font-medium">{overview.quizzes.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đã xuất bản</span>
                <Badge variant="secondary">{overview.quizzes.published}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue, Orders, Learning */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tháng này</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(
                    (overview.revenue.totalCentsThisMonth || 0) / 100,
                    overview.revenue.currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tăng trưởng</span>
                <Badge
                  variant={
                    overview.revenue.growthPercentage >= 0 ? "default" : "destructive"
                  }
                >
                  {overview.revenue.growthPercentage >= 0 ? "+" : ""}
                  {overview.revenue.growthPercentage}%
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">VND</span>
                <span className="font-medium">
                  {overview.revenue.vndPercentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">USD</span>
                <span className="font-medium">
                  {overview.revenue.usdPercentage}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Đơn hàng & Thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đơn tháng này</span>
                <span className="font-medium">{overview.orders.totalThisMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hoàn tất</span>
                <span className="font-medium text-green-600">
                  {overview.orders.completed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chờ xử lý</span>
                <span className="font-medium text-orange-600">
                  {overview.orders.pending}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đã hủy</span>
                <span className="font-medium">{overview.orders.cancelled}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thanh toán</span>
                <Badge variant="outline">{overview.payments.totalPayments}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tỷ lệ thành công</span>
                <Badge variant="secondary">{overview.payments.successRate}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Học tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đăng ký</span>
                <span className="font-medium">{overview.learning.totalEnrollments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hoàn thành</span>
                <span className="font-medium text-green-600">
                  {overview.learning.completed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm dừng</span>
                <span className="font-medium">{overview.learning.suspended}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lượt thi</span>
                <span className="font-medium">{overview.learning.totalAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đang chấm</span>
                <Badge variant="secondary">
                  {overview.learning.attemptsGrading}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progress TB</span>
                <Badge variant="outline">
                  {overview.learning.averageProgress}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" /> Top Khóa học (Đăng ký)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
              ) : (
                topCourses.slice(0, 5).map((course, idx) => (
                  <div
                    key={course.id || idx}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{idx + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm">
                          {course.title || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.enrollmentCount || 0} đăng ký
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Top Khóa học (Doanh thu)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topRevenueCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
              ) : (
                topRevenueCourses.slice(0, 5).map((course, idx) => (
                  <div
                    key={course.id || idx}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{idx + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm">
                          {course.title || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.totalOrders || 0} đơn hàng
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">
                      {formatCurrency(
                        (course.totalRevenueCents || 0) / 100,
                        course.currency || "VND"
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content & Forum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Nội dung & Diễn đàn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Blog Posts</p>
              <p className="text-2xl font-bold">{overview.content.totalBlogPosts}</p>
              <p className="text-xs text-muted-foreground">
                {overview.content.publishedPosts} đã xuất bản
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Forum Threads</p>
              <p className="text-2xl font-bold">{overview.content.totalThreads}</p>
              <p className="text-xs text-muted-foreground">
                {overview.content.lockedThreads} đã khóa
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Forum Posts</p>
              <p className="text-2xl font-bold">{overview.content.totalForumPosts}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Comments</p>
              <p className="text-2xl font-bold">{overview.content.totalComments}</p>
              <p className="text-xs text-muted-foreground">
                {overview.content.totalViews} lượt xem
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, change, Icon, trend = "neutral" }) {
  const trendColor = {
    up: "text-green-600",
    down: "text-red-600",
    warning: "text-orange-600",
    neutral: "text-muted-foreground",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <p className={`text-xs mt-1 ${trendColor[trend]}`}>{change}</p>
      </CardContent>
    </Card>
  );
}

function PendingActionsSection({ pendingActions }) {
  const totalPending =
    (pendingActions?.instructorRequestsCount || 0) +
    (pendingActions?.forumReportsCount || 0) +
    (pendingActions?.pendingOrdersCount || 0) +
    (pendingActions?.quizzesGradingCount || 0);

  if (totalPending === 0) return null;

  return (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="font-medium mb-2">Có {totalPending} tác vụ cần xử lý:</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {pendingActions.instructorRequestsCount > 0 && (
            <Badge variant="secondary">
              {pendingActions.instructorRequestsCount} yêu cầu giảng viên
            </Badge>
          )}
          {pendingActions.forumReportsCount > 0 && (
            <Badge variant="secondary">
              {pendingActions.forumReportsCount} báo cáo forum
            </Badge>
          )}
          {pendingActions.pendingOrdersCount > 0 && (
            <Badge variant="secondary">
              {pendingActions.pendingOrdersCount} đơn hàng chờ
            </Badge>
          )}

        </div>
      </AlertDescription>
    </Alert>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}