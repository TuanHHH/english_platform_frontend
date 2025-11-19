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