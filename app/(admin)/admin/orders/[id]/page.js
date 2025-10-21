"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  User,
  Package,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Edit,
  Save,
  AlertTriangle
} from "lucide-react"

// Mock order data for admin - will be replaced with API integration
const mockAdminOrderDetails = {
  "ORD20241020002": {
    orderId: "ORD20241020002",
    shortCode: "D4E5F6",
    userId: "USR_002",
    userEmail: "tranvanb@example.com",
    userName: "Trần Văn B",
    userPhone: "0909876543",
    userAddress: "789 Lê Lợi, Quận 3, TP. Hồ Chí Minh",
    totalAmount: 1800000,
    currency: "VND",
    status: "PAID",
    createdAt: "2024-10-20T14:22:30Z",
    updatedAt: "2024-10-20T14:35:22Z",

    // Order items
    items: [
      {
        id: "item_002",
        courseId: "IELTS_WR_001",
        courseName: "IELTS Writing Masterclass",
        courseDescription: "Khóa học chuyên sâu kỹ năng viết IELTS",
        price: 1800000,
        quantity: 1,
        thumbnail: "/course-thumbnail.jpg",
        duration: "30 giờ học",
        level: "Trung cấp"
      }
    ],

    // Payment information
    payments: [
      {
        id: "PAY_MOMO_002",
        paymentId: "TXN_D4E5F6G7",
        method: "MoMo",
        amount: 1800000,
        status: "SUCCESS",
        createdAt: "2024-10-20T14:35:22Z",
        transactionId: "TXN_D4E5F6G7"
      }
    ],

    // Invoice information
    invoice: {
      invoiceId: "INV20241020002",
      invoiceNumber: "INV-2024-1002",
      issuedAt: "2024-10-20T14:40:15Z"
    },

    // Refund information (if any)
    refunds: [],

    // Order notes
    notes: [
      {
        id: "note_001",
        content: "Khách hàng liên hệ询问 về thời gian học",
        createdBy: "Admin",
        createdAt: "2024-10-20T15:00:00Z"
      }
    ]
  },

  "ORD20241021001": {
    orderId: "ORD20241021001",
    shortCode: "A1B2C3",
    userId: "USR_001",
    userEmail: "nguyenvana@example.com",
    userName: "Nguyễn Văn A",
    userPhone: "0901234567",
    userAddress: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
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
        courseDescription: "Khóa học luyện thi TOEIC 650+ toàn diện 4 kỹ năng",
        price: 2500000,
        quantity: 1,
        thumbnail: "/course-thumbnail.jpg",
        duration: "40 giờ học",
        level: "Trung cấp"
      }
    ],

    payments: [],

    invoice: null,

    refunds: [],

    notes: []
  }
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusUpdateReason, setStatusUpdateReason] = useState("")
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  // Get order details from mock data (will replace with API call)
  const orderDetails = mockAdminOrderDetails[orderId] || mockAdminOrderDetails["ORD20241020002"]

  React.useEffect(() => {
    setNewStatus(orderDetails.status)
  }, [orderDetails.status])

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

  const handleStatusUpdate = async () => {
    if (newStatus === orderDetails.status) {
      setShowStatusDialog(false)
      return
    }

    setIsUpdatingStatus(true)

    try {
      // TODO: Implement API call to update order status
      console.log("Updating order status:", {
        orderId: orderDetails.orderId,
        newStatus,
        reason: statusUpdateReason
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In real implementation, we would refresh the order data
      alert("Cập nhật trạng thái đơn hàng thành công!")
      setShowStatusDialog(false)
      setStatusUpdateReason("")

      // Refresh the page to show updated status
      router.refresh()
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const isStatusUpdateAllowed = (currentStatus, newStatus) => {
    // Define allowed status transitions
    const allowedTransitions = {
      "PENDING": ["PAID", "CANCELLED"],
      "PAID": ["REFUNDED"],
      "CANCELLED": [],
      "REFUNDED": []
    }

    return allowedTransitions[currentStatus]?.includes(newStatus) || false
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại danh sách
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Chi tiết đơn hàng #{orderDetails.shortCode}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">Mã đơn: {orderDetails.orderId}</span>
                  <Badge variant={getStatusVariant(orderDetails.status)}>
                    {getStatusIcon(orderDetails.status)}
                    <span className="ml-1">{getStatusText(orderDetails.status)}</span>
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Update Button */}
            <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Cập nhật trạng thái
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                  <DialogDescription>
                    Thay đổi trạng thái của đơn hàng {orderDetails.orderId}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Trạng thái hiện tại</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(orderDetails.status)}
                      <Badge variant={getStatusVariant(orderDetails.status)}>
                        {getStatusText(orderDetails.status)}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Trạng thái mới</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                        <SelectItem value="PAID">Đã thanh toán</SelectItem>
                        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                        <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                      </SelectContent>
                    </Select>
                    {!isStatusUpdateAllowed(orderDetails.status, newStatus) && newStatus !== orderDetails.status && (
                      <p className="text-sm text-red-600 mt-1">
                        Không thể chuyển từ {getStatusText(orderDetails.status)} sang {getStatusText(newStatus)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Lý do thay đổi (tùy chọn)</label>
                    <textarea
                      className="w-full mt-1 p-2 border rounded-md text-sm"
                      rows={3}
                      placeholder="Nhập lý do thay đổi trạng thái..."
                      value={statusUpdateReason}
                      onChange={(e) => setStatusUpdateReason(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowStatusDialog(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={isUpdatingStatus || !isStatusUpdateAllowed(orderDetails.status, newStatus)}
                    >
                      {isUpdatingStatus ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Cập nhật
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Họ tên</p>
                      <p className="font-medium">{orderDetails.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{orderDetails.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Điện thoại</p>
                      <p className="font-medium">{orderDetails.userPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Địa chỉ</p>
                      <p className="font-medium">{orderDetails.userAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Sản phẩm trong đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Khóa học</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderDetails.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.courseName}</div>
                              <div className="text-sm text-gray-600">{item.courseDescription}</div>
                              <div className="text-xs text-gray-500">
                                Thời lượng: {item.duration} | Cấp độ: {item.level}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.price)}đ
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.price * item.quantity)}đ
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(orderDetails.totalAmount)}đ
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orderDetails.payments.length > 0 ? (
                    <div className="space-y-4">
                      {orderDetails.payments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Phương thức</p>
                              <p className="font-medium">{payment.method}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Số tiền</p>
                              <p className="font-medium text-green-600">
                                {formatCurrency(payment.amount)}đ
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Mã giao dịch</p>
                              <p className="font-mono text-sm">{payment.transactionId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Trạng thái</p>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(payment.status)}
                                <span className="text-sm font-medium">
                                  {payment.status === "SUCCESS" ? "Thành công" : "Thất bại"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Thời gian</p>
                              <p className="font-medium">{formatDate(payment.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Chưa có thanh toán nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-mono text-sm">{orderDetails.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mã rút gọn</p>
                    <p className="font-medium">#{orderDetails.shortCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(orderDetails.status)}
                      <Badge variant={getStatusVariant(orderDetails.status)}>
                        {getStatusText(orderDetails.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày tạo</p>
                    <p className="font-medium">{formatDate(orderDetails.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                    <p className="font-medium">{formatDate(orderDetails.updatedAt)}</p>
                  </div>

                  {orderDetails.invoice && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-600">Hóa đơn</p>
                        <p className="font-mono text-sm">{orderDetails.invoice.invoiceNumber}</p>
                        <p className="text-xs text-gray-500">
                          Ngày xuất: {formatDate(orderDetails.invoice.issuedAt)}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orderDetails.invoice && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/account/invoices/${orderDetails.invoice.invoiceId}`}>
                        <FileText className="w-4 h-4 mr-2" />
                        Xem hóa đơn
                      </Link>
                    </Button>
                  )}

                  {orderDetails.status === "PAID" && !orderDetails.refunds.length && (
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Yêu cầu hoàn tiền
                    </Button>
                  )}

                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Gửi email cho khách hàng
                  </Button>
                </CardContent>
              </Card>

              {/* Order Notes */}
              {orderDetails.notes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ghi chú</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orderDetails.notes.map((note) => (
                        <div key={note.id} className="border-l-2 border-blue-200 pl-3">
                          <p className="text-sm text-gray-800">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {note.createdBy} • {formatDate(note.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}