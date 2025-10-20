"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { Search, Calendar, ArrowUpDown, Eye } from "lucide-react"
import Link from "next/link"

// Mock data - will be replaced with API integration
const mockOrders = [
  {
    id: "ORD20241001001",
    shortCode: "M4B7C9",
    creationDate: "2024-10-20T17:30:45Z",
    totalAmount: 2000000,
    status: "PAID",
    provider: "MoMo",
    courseTitle: "Complete TOEIC 650+",
    transactionId: "TXN_M4B7C9D2E"
  },
  {
    id: "ORD20241002002",
    shortCode: "X8K3L5",
    creationDate: "2024-10-18T14:22:30Z",
    totalAmount: 1500000,
    status: "PAID",
    provider: "VNPay",
    courseTitle: "IELTS Writing Masterclass",
    transactionId: "VNP_X8K3L5N7P"
  },
  {
    id: "ORD20241003003",
    shortCode: "Q9R4T6",
    creationDate: "2024-10-15T09:15:20Z",
    totalAmount: 3000000,
    status: "CANCELLED",
    provider: "Stripe",
    courseTitle: "Business English Pro",
    transactionId: null
  },
  {
    id: "ORD20241004004",
    shortCode: "Y2U5I8",
    creationDate: "2024-10-12T16:45:10Z",
    totalAmount: 1800000,
    status: "PENDING",
    provider: "MoMo",
    courseTitle: "English Grammar Foundation",
    transactionId: null
  },
  {
    id: "ORD20241005005",
    shortCode: "P7N3M1",
    creationDate: "2024-10-10T11:30:55Z",
    totalAmount: 2500000,
    status: "PAID",
    provider: "VNPay",
    courseTitle: "Speaking Confidence Course",
    transactionId: "VNP_P7N3M1K9L"
  },
  {
    id: "ORD20241006006",
    shortCode: "L9K2F5",
    creationDate: "2024-10-08T13:20:40Z",
    totalAmount: 1200000,
    status: "REFUNDED",
    provider: "Stripe",
    courseTitle: "Pronunciation Workshop",
    transactionId: "STP_L9K2F5G8H"
  },
  {
    id: "ORD20241007007",
    shortCode: "H4G8D2",
    creationDate: "2024-10-05T10:15:35Z",
    totalAmount: 2200000,
    status: "PAID",
    provider: "MoMo",
    courseTitle: "Advanced Vocabulary Builder",
    transactionId: "TXN_H4G8D2J6K"
  },
  {
    id: "ORD20241008008",
    shortCode: "F6J1N9",
    creationDate: "2024-10-03T15:40:25Z",
    totalAmount: 1700000,
    status: "PENDING",
    provider: "VNPay",
    courseTitle: "Reading Comprehension Skills",
    transactionId: null
  }
]

// Generate more mock orders for pagination testing
const generateMockOrders = () => {
  const statuses = ["PENDING", "PAID", "CANCELLED", "REFUNDED"]
  const providers = ["MoMo", "VNPay", "Stripe"]
  const courses = [
    "Complete TOEIC 650+",
    "IELTS Writing Masterclass",
    "Business English Pro",
    "English Grammar Foundation",
    "Speaking Confidence Course",
    "Pronunciation Workshop",
    "Advanced Vocabulary Builder",
    "Reading Comprehension Skills"
  ]

  const additionalOrders = []
  for (let i = 9; i <= 25; i++) {
    additionalOrders.push({
      id: `ORD202410${String(i).padStart(3, '0')}`,
      shortCode: `${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      creationDate: new Date(2024, 9, Math.max(1, 25 - i), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString(),
      totalAmount: Math.floor(Math.random() * 3000000) + 1000000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      provider: providers[Math.floor(Math.random() * providers.length)],
      courseTitle: courses[Math.floor(Math.random() * courses.length)],
      transactionId: Math.random() > 0.3 ? `${providers[Math.floor(Math.random() * providers.length)]}_${Math.random().toString(36).substr(2, 8).toUpperCase()}` : null
    })
  }

  return [...mockOrders, ...additionalOrders]
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("date-desc")
  const [currentPage, setCurrentPage] = useState(1)

  const ordersPerPage = 10
  const allOrders = generateMockOrders()

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = allOrders.filter(order => {
      const matchesSearch = searchTerm === "" ||
        order.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort orders
    filtered.sort((a, b) => {
      const dateA = new Date(a.creationDate)
      const dateB = new Date(b.creationDate)

      switch (sortBy) {
        case "date-desc":
          return dateB - dateA
        case "date-asc":
          return dateA - dateB
        case "amount-desc":
          return b.totalAmount - a.totalAmount
        case "amount-asc":
          return a.totalAmount - b.totalAmount
        default:
          return dateB - dateA
      }
    })

    return filtered
  }, [allOrders, searchTerm, statusFilter, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const paginatedOrders = filteredAndSortedOrders.slice(startIndex, startIndex + ordersPerPage)

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
              <Link href="/account">
                <Button variant="outline">
                  Quay lại tài khoản
                </Button>
              </Link>
            </div>
            <p className="text-gray-600">Xem và quản lý lịch sử đơn hàng của bạn</p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="w-full lg:flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm theo mã đơn hàng, mã ngắn hoặc tên khóa học..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="w-full sm:w-auto">
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                      <SelectItem value="PAID">Đã thanh toán</SelectItem>
                      <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                      <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="w-full sm:w-auto">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Mới nhất</SelectItem>
                      <SelectItem value="date-asc">Cũ nhất</SelectItem>
                      <SelectItem value="amount-desc">Giá giảm dần</SelectItem>
                      <SelectItem value="amount-asc">Giá tăng dần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600">
                Hiển thị {paginatedOrders.length} trên {filteredAndSortedOrders.length} đơn hàng
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              {paginatedOrders.length > 0 ? (
                <>
                  {/* Mobile Card View */}
                  <div className="block lg:hidden">
                    <div className="divide-y">
                      {paginatedOrders.map((order) => (
                        <div key={order.id} className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-mono text-sm font-medium">{order.shortCode}</div>
                              <div className="text-xs text-gray-500">{order.id}</div>
                            </div>
                            <Badge variant={getStatusVariant(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <div className="font-medium">{order.courseTitle}</div>
                              <div className="text-xs text-gray-500">{order.provider}</div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(order.creationDate)}</span>
                              </div>
                              <div className="font-medium">
                                {order.totalAmount.toLocaleString('vi-VN')}đ
                              </div>
                            </div>

                            <div className="pt-2">
                              <Link href={`/account/orders/${order.id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Chi tiết
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Mã đơn hàng</TableHead>
                          <TableHead className="text-center">Khóa học</TableHead>
                          <TableHead className="text-center">Ngày đặt</TableHead>
                          <TableHead className="text-center">Tổng tiền</TableHead>
                          <TableHead className="text-center">Trạng thái</TableHead>
                          <TableHead className="text-center">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="text-center">
                              <div>
                                <div className="font-mono text-sm font-medium">{order.shortCode}</div>
                                <div className="text-xs text-gray-500">{order.id}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium truncate">{order.courseTitle}</div>
                                <div className="text-xs text-gray-500">{order.provider}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{formatDate(order.creationDate)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="font-medium">
                                {order.totalAmount.toLocaleString('vi-VN')}đ
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                <Badge variant={getStatusVariant(order.status)}>
                                  {getStatusText(order.status)}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Link href={`/account/orders/${order.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Chi tiết
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-2">Không tìm thấy đơn hàng nào</div>
                  <div className="text-sm text-gray-400">
                    Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}