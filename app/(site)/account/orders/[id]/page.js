"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Receipt,
  RefreshCw,
  XCircle,
  Calendar,
  CreditCard,
  BookOpen,
  Clock,
  CheckCircle
} from "lucide-react"

// Mock order details data - will be replaced with API integration
const mockOrderDetails = {
  "ORD20241001001": {
    orderId: "ORD20241001001",
    shortCode: "M4B7C9",
    status: "PAID",
    createdAt: "2024-10-20T17:30:45Z",
    updatedAt: "2024-10-20T17:35:22Z",
    totalAmount: 2000000,
    currency: "VND",
    items: [
      {
        id: "item_001",
        courseId: "TOEIC_650_001",
        courseName: "Complete TOEIC 650+",
        description: "Khóa học luyện thi TOEIC 650+ toàn diện 4 kỹ năng",
        price: 2000000,
        quantity: 1,
        thumbnail: "/course-thumbnail.jpg",
        duration: "40 giờ học",
        level: "Trung cấp"
      }
    ],
    payments: [
      {
        id: "PAY_MOMO_001",
        paymentId: "TXN_M4B7C9D2E",
        method: "MoMo",
        amount: 2000000,
        status: "SUCCESS",
        createdAt: "2024-10-20T17:32:10Z",
        transactionId: "TXN_M4B7C9D2E"
      }
    ],
    user: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567"
    },
    refundEligible: true,
    cancellationEligible: false
  },
  "ORD20241003003": {
    orderId: "ORD20241003003",
    shortCode: "Q9R4T6",
    status: "CANCELLED",
    createdAt: "2024-10-15T09:15:20Z",
    updatedAt: "2024-10-15T09:20:45Z",
    totalAmount: 3000000,
    currency: "VND",
    items: [
      {
        id: "item_003",
        courseId: "BIZ_ENG_001",
        courseName: "Business English Pro",
        description: "Khóa học tiếng Anh thương mại chuyên nghiệp",
        price: 3000000,
        quantity: 1,
        thumbnail: "/course-thumbnail.jpg",
        duration: "60 giờ học",
        level: "Nâng cao"
      }
    ],
    payments: [
      {
        id: "PAY_STRIPE_003",
        paymentId: "STP_Q9R4T6U8W",
        method: "Stripe",
        amount: 3000000,
        status: "FAILED",
        createdAt: "2024-10-15T09:18:30Z",
        transactionId: null,
        failureReason: "Payment declined by bank"
      }
    ],
    user: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567"
    },
    refundEligible: false,
    cancellationEligible: false
  },
  "ORD20241004004": {
    orderId: "ORD20241004004",
    shortCode: "Y2U5I8",
    status: "PENDING",
    createdAt: "2024-10-12T16:45:10Z",
    updatedAt: "2024-10-12T16:45:10Z",
    totalAmount: 1800000,
    currency: "VND",
    items: [
      {
        id: "item_004",
        courseId: "GRAMMAR_001",
        courseName: "English Grammar Foundation",
        description: "Nền tảng ngữ pháp tiếng Anh cơ bản",
        price: 1800000,
        quantity: 1,
        thumbnail: "/course-thumbnail.jpg",
        duration: "30 giờ học",
        level: "Sơ cấp"
      }
    ],
    payments: [],
    user: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567"
    },
    refundEligible: false,
    cancellationEligible: true
  }
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id
  const [isProcessing, setIsProcessing] = useState(false)

  // Get order details from mock data (will replace with API call)
  const orderDetails = mockOrderDetails[orderId] || mockOrderDetails["ORD20241001001"]

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

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "PENDING":
        return <Clock className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
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

  const handleViewInvoice = () => {
    // Navigate to invoice page
    router.push(`/account/invoices/INV${orderDetails.orderId}`)
  }

  const handleRequestRefund = () => {
    // Find the first successful payment to use for refund request
    const successfulPayment = orderDetails.payments?.find(payment => payment.status === "SUCCESS")

    if (successfulPayment && successfulPayment.paymentId) {
      // Navigate to refund page with payment ID
      router.push(`/account/refunds/new?paymentId=${successfulPayment.paymentId}`)
    } else {
      alert("Không tìm thấy thông tin thanh toán hợp lệ để yêu cầu hoàn tiền.")
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return
    }

    setIsProcessing(true)
    try {
      // TODO: Implement cancel order API call
      console.log("Cancel order:", orderDetails.orderId)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push('/account/orders')
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-4 mb-4">
              <Link href="/account/orders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Quay lại đơn hàng</span>
                  <span className="sm:hidden">Quay lại</span>
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Mã đơn hàng: <span className="font-mono font-medium">{orderDetails.shortCode}</span>
                </p>
              </div>
              <Badge variant={getStatusVariant(orderDetails.status)} className="text-sm px-3 py-1 self-start sm:self-auto">
                {getStatusText(orderDetails.status)}
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Thông tin đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Mã đơn hàng</p>
                      <p className="font-mono font-medium">{orderDetails.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{formatDate(orderDetails.createdAt)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tổng tiền</p>
                      <p className="text-lg font-bold text-green-600">
                        {orderDetails.totalAmount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cập nhật cuối</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{formatDate(orderDetails.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderDetails.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">{item.courseName}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                            <span>Thời lượng: {item.duration}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Trình độ: {item.level}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="font-semibold text-base sm:text-lg">
                            {item.price.toLocaleString('vi-VN')}đ
                          </p>
                          <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="font-bold text-xl text-green-600">
                      {orderDetails.totalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Lịch sử thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orderDetails.payments.length > 0 ? (
                    <>
                      {/* Mobile Payment Cards */}
                      <div className="block lg:hidden space-y-3">
                        {orderDetails.payments.map((payment) => (
                          <div key={payment.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                {getPaymentStatusIcon(payment.status)}
                                <span className="font-medium">{payment.method}</span>
                              </div>
                              <span className="font-semibold text-green-600">
                                {payment.amount.toLocaleString('vi-VN')}đ
                              </span>
                            </div>

                            <div className="space-y-2 text-sm">
                              {payment.transactionId && (
                                <div>
                                  <span className="text-gray-600">Mã giao dịch: </span>
                                  <span className="font-mono">{payment.transactionId}</span>
                                </div>
                              )}

                              <div>
                                <span className="text-gray-600">Trạng thái: </span>
                                <span>
                                  {payment.status === "SUCCESS" ? "Thành công" :
                                   payment.status === "FAILED" ? "Thất bại" : "Đang xử lý"}
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-600">Thời gian: </span>
                                <span>{formatDate(payment.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Payment Table */}
                      <div className="hidden lg:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Phương thức</TableHead>
                              <TableHead>Mã giao dịch</TableHead>
                              <TableHead>Số tiền</TableHead>
                              <TableHead>Trạng thái</TableHead>
                              <TableHead>Thời gian</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orderDetails.payments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium">{payment.method}</TableCell>
                                <TableCell className="font-mono text-sm">
                                  {payment.transactionId || "-"}
                                </TableCell>
                                <TableCell>
                                  {payment.amount.toLocaleString('vi-VN')}đ
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {getPaymentStatusIcon(payment.status)}
                                    <span className="text-sm">
                                      {payment.status === "SUCCESS" ? "Thành công" :
                                       payment.status === "FAILED" ? "Thất bại" : "Đang xử lý"}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {formatDate(payment.createdAt)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Chưa có thanh toán nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Mobile: Bottom, Desktop: Right */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              <div className="lg:hidden">
                {/* Mobile Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin khách hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Họ tên</p>
                        <p className="font-medium">{orderDetails.user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Điện thoại</p>
                        <p className="font-medium">{orderDetails.user.phone}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-sm break-all">{orderDetails.user.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block space-y-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin khách hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Họ tên</p>
                      <p className="font-medium">{orderDetails.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{orderDetails.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Điện thoại</p>
                      <p className="font-medium">{orderDetails.user.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thao tác</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleViewInvoice}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Xem hóa đơn
                    </Button>

                    {orderDetails.status === "PAID" && orderDetails.refundEligible && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleRequestRefund}
                        disabled={isProcessing}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                        {isProcessing ? "Đang xử lý..." : "Yêu cầu hoàn tiền"}
                      </Button>
                    )}

                    {orderDetails.status === "PENDING" && orderDetails.cancellationEligible && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleCancelOrder}
                        disabled={isProcessing}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {isProcessing ? "Đang xử lý..." : "Hủy đơn hàng"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="lg:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Thao tác</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleViewInvoice}
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Xem hóa đơn
                  </Button>

                  {orderDetails.status === "PAID" && orderDetails.refundEligible && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleRequestRefund}
                      disabled={isProcessing}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                      {isProcessing ? "Đang xử lý..." : "Yêu cầu hoàn tiền"}
                    </Button>
                  )}

                  {orderDetails.status === "PENDING" && orderDetails.cancellationEligible && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleCancelOrder}
                      disabled={isProcessing}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {isProcessing ? "Đang xử lý..." : "Hủy đơn hàng"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}