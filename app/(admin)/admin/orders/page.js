"use client"

import Link from "next/link"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar as CalendarIcon,
  User,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

// Mock orders data for admin - will be replaced with API integration
const mockAdminOrders = [
  {
    orderId: "ORD20241021001",
    shortCode: "A1B2C3",
    userId: "USR_001",
    userEmail: "nguyenvana@example.com",
    userName: "Nguyễn Văn A",
    totalAmount: 2500000,
    currency: "VND",
    status: "PENDING",
    createdAt: "2024-10-21T09:30:45Z",
    updatedAt: "2024-10-21T09:30:45Z",
    items: [
      {
        id: "item_001",
        courseId: "TOEIC_650_001",
        courseName: "Complete TOEIC 650+",
        price: 2500000,
        quantity: 1
      }
    ],
    payments: []
  },
  {
    orderId: "ORD20241020002",
    shortCode: "D4E5F6",
    userId: "USR_002",
    userEmail: "tranvanb@example.com",
    userName: "Trần Văn B",
    totalAmount: 1800000,
    currency: "VND",
    status: "PAID",
    createdAt: "2024-10-20T14:22:30Z",
    updatedAt: "2024-10-20T14:35:22Z",
    items: [
      {
        id: "item_002",
        courseId: "IELTS_WR_001",
        courseName: "IELTS Writing Masterclass",
        price: 1800000,
        quantity: 1
      }
    ],
    payments: [
      {
        id: "PAY_MOMO_002",
        paymentId: "TXN_D4E5F6G7",
        method: "MoMo",
        amount: 1800000,
        status: "SUCCESS",
        createdAt: "2024-10-20T14:35:22Z"
      }
    ]
  },
  {
    orderId: "ORD20241019003",
    shortCode: "G7H8I9",
    userId: "USR_003",
    userEmail: "lethic@example.com",
    userName: "Lê Thị C",
    totalAmount: 3200000,
    currency: "VND",
    status: "CANCELLED",
    createdAt: "2024-10-19T16:45:10Z",
    updatedAt: "2024-10-19T17:20:45Z",
    items: [
      {
        id: "item_003",
        courseId: "BIZ_ENG_001",
        courseName: "Business English Pro",
        price: 3200000,
        quantity: 1
      }
    ],
    payments: []
  },
  {
    orderId: "ORD20241018004",
    shortCode: "J0K1L2",
    userId: "USR_004",
    userEmail: "phovand@example.com",
    userName: "Phó Văn D",
    totalAmount: 1500000,
    currency: "VND",
    status: "REFUNDED",
    createdAt: "2024-10-18T11:15:20Z",
    updatedAt: "2024-10-21T10:30:15Z",
    items: [
      {
        id: "item_004",
        courseId: "GRAMMAR_001",
        courseName: "English Grammar Foundation",
        price: 1500000,
        quantity: 1
      }
    ],
    payments: [
      {
        id: "PAY_VNPAY_004",
        paymentId: "VNP_J0K1L2M3",
        method: "VNPay",
        amount: 1500000,
        status: "SUCCESS",
        createdAt: "2024-10-18T11:20:30Z"
      }
    ],
    refunds: [
      {
        refundId: "REF20241021001",
        refundAmount: 1500000,
        status: "COMPLETED",
        processedAt: "2024-10-21T10:30:15Z"
      }
    ]
  },
  {
    orderId: "ORD20241017005",
    shortCode: "M3N4O5",
    userId: "USR_005",
    userEmail: "hoangthie@example.com",
    userName: "Hoàng Thị E",
    totalAmount: 4000000,
    currency: "VND",
    status: "PAID",
    createdAt: "2024-10-17T09:20:15Z",
    updatedAt: "2024-10-17T09:45:30Z",
    items: [
      {
        id: "item_005",
        courseId: "ADV_ENG_001",
        courseName: "Advanced English Communication",
        price: 4000000,
        quantity: 1
      }
    ],
    payments: [
      {
        id: "PAY_STRIPE_005",
        paymentId: "STP_M3N4O5P6",
        method: "Stripe",
        amount: 4000000,
        status: "SUCCESS",
        createdAt: "2024-10-17T09:45:30Z"
      }
    ]
  },
  {
    orderId: "ORD20241016006",
    shortCode: "P6Q7R8",
    userId: "USR_001",
    userEmail: "nguyenvana@example.com",
    userName: "Nguyễn Văn A",
    totalAmount: 2800000,
    currency: "VND",
    status: "PENDING",
    createdAt: "2024-10-16T15:30:45Z",
    updatedAt: "2024-10-16T15:30:45Z",
    items: [
      {
        id: "item_006",
        courseId: "CONV_ENG_001",
        courseName: "Conversational English",
        price: 2800000,
        quantity: 1
      }
    ],
    payments: []
  }
]

export default function AdminOrdersPage() {
  const [orders] = useState(mockAdminOrders)
  const [filteredOrders, setFilteredOrders] = useState(mockAdminOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("")
  const [dateFilter, setDateFilter] = useState({ from: null, to: null })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const formatDate = (dateString) => {
    const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
    if (match) {
      const [, year, month, day, hours, minutes] = match
      return `${day}/${month}/${year} ${hours}:${minutes}`
    }

    const date = new Date(dateString)
    const dayNum = date.getDate().toString().padStart(2, '0')
    const monthNum = (date.getMonth() + 1).toString().padStart(2, '0')
    const yearNum = date.getFullYear()
    const hoursNum = date.getHours().toString().padStart(2, '0')
    const minutesNum = date.getMinutes().toString().padStart(2, '0')

    return `${dayNum}/${monthNum}/${yearNum} ${hoursNum}:${minutesNum}`
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "PAID":
        return "default"
      case "PENDING":
        return "secondary"
      case "CANCELLED":
        return "destructive"
      case "REFUNDED":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "REFUNDED":
        return <RefreshCw className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán"
      case "PENDING":
        return "Chờ thanh toán"
      case "CANCELLED":
        return "Đã hủy"
      case "REFUNDED":
        return "Đã hoàn tiền"
      default:
        return "Không xác định"
    }
  }

  // Apply filters
  React.useEffect(() => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // User filter
    if (userFilter) {
      filtered = filtered.filter(order =>
        order.userEmail.toLowerCase().includes(userFilter.toLowerCase()) ||
        order.userName.toLowerCase().includes(userFilter.toLowerCase())
      )
    }

    // Date range filter
    if (dateFilter.from) {
      filtered = filtered.filter(order => new Date(order.createdAt) >= dateFilter.from)
    }
    if (dateFilter.to) {
      filtered = filtered.filter(order => new Date(order.createdAt) <= dateFilter.to)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, userFilter, dateFilter])

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setUserFilter("")
    setDateFilter({ from: null, to: null })
  }

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    paid: orders.filter(o => o.status === "PAID").length,
    cancelled: orders.filter(o => o.status === "CANCELLED").length,
    refunded: orders.filter(o => o.status === "REFUNDED").length,
    totalRevenue: orders.filter(o => o.status === "PAID").reduce((sum, o) => sum + o.totalAmount, 0)
  }

  const uniqueUsers = [...new Set(orders.map(order => ({ email: order.userEmail, name: order.userName })))]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p className="text-gray-600 mt-2">Xem và quản lý tất cả đơn hàng trong hệ thống</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}đ</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Bộ lọc
                  </CardTitle>
                  <CardDescription>
                    Tìm kiếm và lọc đơn hàng theo các tiêu chí
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="hidden sm:flex"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <Label className="text-sm text-gray-600">Trạng thái</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                      <SelectItem value="PAID">Đã thanh toán</SelectItem>
                      <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User Filter */}
                <div>
                  <Label className="text-sm text-gray-600">Người dùng</Label>
                  <Input
                    placeholder="Email hoặc tên người dùng"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  />
                </div>

                {/* Date Range Filter */}
                <div>
                  <Label className="text-sm text-gray-600">Khoảng thời gian</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFilter.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter.from ? (
                          dateFilter.to ? (
                            <>
                              {format(dateFilter.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                              {format(dateFilter.to, "dd/MM/yyyy", { locale: vi })}
                            </>
                          ) : (
                            format(dateFilter.from, "dd/MM/yyyy", { locale: vi })
                          )
                        ) : (
                          "Chọn khoảng thời gian"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateFilter.from,
                          to: dateFilter.to,
                        }}
                        onSelect={(range) => {
                          setDateFilter({
                            from: range?.from || null,
                            to: range?.to || null,
                          })
                        }}
                        numberOfMonths={2}
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Mobile Clear Filter Button */}
              <div className="mt-4 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Danh sách đơn hàng</span>
                <span className="text-sm font-normal text-gray-600">
                  Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.orderId} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-mono text-sm font-medium">{order.orderId}</div>
                            <div className="text-xs text-gray-500">#{order.shortCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.userName}</div>
                            <div className="text-sm text-gray-600">{order.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(order.totalAmount)}đ
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge variant={getStatusVariant(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/orders/${order.orderId}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Cập nhật trạng thái
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy đơn hàng</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}