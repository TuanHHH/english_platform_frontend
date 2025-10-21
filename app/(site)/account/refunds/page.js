"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
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
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  User
} from "lucide-react"

// Mock refund data - will be replaced with API integration
const mockRefunds = [
  {
    refundId: "REF20241021001",
    paymentId: "TXN_M4B7C9D2E",
    orderId: "ORD20241001001",
    invoiceId: "INV20241001001",
    refundAmount: 2000000,
    currency: "VND",
    status: "COMPLETED",
    refundReason: "Khóa học không phù hợp với lịch trình cá nhân. Tôi cần chuyển sang lịch học khác nhưng không có lịch phù hợp.",
    adminFeedback: "Yêu cầu hoàn tiền đã được duyệt. Số tiền 2.000.000đ sẽ được chuyển về tài khoản MoMo của bạn trong vòng 3-5 ngày làm việc.",
    createdAt: "2024-10-21T09:15:30Z",
    updatedAt: "2024-10-21T14:30:45Z",
    processedAt: "2024-10-21T14:30:45Z",
    processedBy: "Admin - Nguyễn Thị B",
    paymentMethod: "MoMo",
    course: {
      name: "Complete TOEIC 650+",
      description: "Khóa học luyện thi TOEIC 650+ toàn diện 4 kỹ năng",
      courseCode: "TOEIC_650_001"
    }
  },
  {
    refundId: "REF20241020002",
    paymentId: "VNP_X8K3L5N7P",
    orderId: "ORD20241002002",
    invoiceId: "INV20241002002",
    refundAmount: 1350000,
    currency: "VND",
    status: "PENDING",
    refundReason: "Chỉ sau buổi học đầu tiên, tôi nhận thấy nội dung khóa học không phù hợp với trình độ hiện tại của mình. Nội dung quá nâng cao so với expectations.",
    adminFeedback: null,
    createdAt: "2024-10-20T16:45:20Z",
    updatedAt: "2024-10-20T16:45:20Z",
    processedAt: null,
    processedBy: null,
    paymentMethod: "VNPay",
    course: {
      name: "IELTS Writing Masterclass",
      description: "Khóa học chuyên sâu kỹ năng viết IELTS",
      courseCode: "IELTS_WR_001"
    }
  },
  {
    refundId: "REF20241018003",
    paymentId: "TXN_P9L8K6M4",
    orderId: "ORD20241018003",
    invoiceId: "INV20241018003",
    refundAmount: 3000000,
    currency: "VND",
    status: "REJECTED",
    refundReason: "Tôi muốn hoàn tiền vì đã tìm thấy khóa học tương tự với giá rẻ hơn.",
    adminFeedback: "Yêu cầu hoàn tiền bị từ chối theo chính sách hoàn tiền của chúng tôi. Chính sách cho phép hoàn tiền trong vòng 7 ngày sau khi bắt đầu khóa học, nhưng yêu cầu của bạn gửi sau 14 ngày học.",
    createdAt: "2024-10-18T11:20:15Z",
    updatedAt: "2024-10-19T09:15:30Z",
    processedAt: "2024-10-19T09:15:30Z",
    processedBy: "Admin - Trần Văn C",
    paymentMethod: "MoMo",
    course: {
      name: "Business English Pro",
      description: "Khóa học tiếng Anh thương mại chuyên nghiệp",
      courseCode: "BIZ_ENG_001"
    }
  },
  {
    refundId: "REF20241015004",
    paymentId: "STP_R5T9Y2U8",
    orderId: "ORD20241015004",
    invoiceId: "INV20241015004",
    refundAmount: 1800000,
    currency: "VND",
    status: "APPROVED",
    refundReason: "Lý do cá nhân - chuyển công việc đột xuất, không thể tiếp tục tham gia khóa học.",
    adminFeedback: "Yêu cầu hoàn tiền đã được phê duyệt. Chúng tôi đang chờ xóa truy cập của bạn khỏi hệ thống học tập trước khi tiến hành hoàn tiền. Quá trình này mất khoảng 24 giờ.",
    createdAt: "2024-10-15T14:30:45Z",
    updatedAt: "2024-10-16T10:20:15Z",
    processedAt: "2024-10-16T10:20:15Z",
    processedBy: "Admin - Lê Thị D",
    paymentMethod: "Stripe",
    course: {
      name: "English Grammar Foundation",
      description: "Nền tảng ngữ pháp tiếng Anh cơ bản",
      courseCode: "GRAMMAR_001"
    }
  }
]

export default function MyRefundsPage() {
  const [selectedRefund, setSelectedRefund] = useState(null)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const formatDate = (dateString) => {
    // Parse UTC date components directly to avoid timezone issues
    const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
    if (match) {
      const [, year, month, day, hours, minutes] = match
      return `${day}/${month}/${year} ${hours}:${minutes}`
    }

    // Fallback for any other date format
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
      case "COMPLETED":
        return "default"
      case "APPROVED":
        return "secondary"
      case "PENDING":
        return "outline"
      case "REJECTED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Đã hoàn tiền"
      case "APPROVED":
        return "Đã phê duyệt"
      case "PENDING":
        return "Chờ xử lý"
      case "REJECTED":
        return "Bị từ chối"
      default:
        return "Không xác định"
    }
  }

  const handleViewDetails = (refund) => {
    setSelectedRefund(refund)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <Link href="/account/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đơn hàng
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Yêu cầu hoàn tiền của tôi</h1>
              <p className="text-gray-600 mt-1">Theo dõi trạng thái các yêu cầu hoàn tiền của bạn</p>
            </div>
          </div>

          {/* Refunds Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Danh sách yêu cầu hoàn tiền
              </CardTitle>
              <CardDescription>
                {mockRefunds.length} yêu cầu hoàn tiền được tìm thấy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã hoàn tiền</TableHead>
                      <TableHead>Mã thanh toán</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Cập nhật lần cuối</TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRefunds.map((refund) => (
                      <TableRow key={refund.refundId} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-mono text-sm font-medium">
                          {refund.refundId}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {refund.paymentId}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(refund.refundAmount)}đ
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(refund.status)}
                            <Badge variant={getStatusVariant(refund.status)}>
                              {getStatusText(refund.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(refund.updatedAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(refund)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Chi tiết yêu cầu hoàn tiền
                                </DialogTitle>
                                <DialogDescription>
                                  {selectedRefund?.refundId}
                                </DialogDescription>
                              </DialogHeader>

                              {selectedRefund && (
                                <div className="space-y-6">
                                  {/* Status and Basic Info */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-sm text-gray-600">Trạng thái:</span>
                                      <div className="flex items-center gap-2 mt-1">
                                        {getStatusIcon(selectedRefund.status)}
                                        <Badge variant={getStatusVariant(selectedRefund.status)}>
                                          {getStatusText(selectedRefund.status)}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Số tiền hoàn:</span>
                                      <p className="font-semibold text-green-600">
                                        {formatCurrency(selectedRefund.refundAmount)}đ
                                      </p>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Course Information */}
                                  <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <User className="w-4 h-4" />
                                      Thông tin khóa học
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <span className="text-gray-600">Tên khóa học:</span>
                                        <p className="font-medium">{selectedRefund.course.name}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Mã khóa học:</span>
                                        <p className="font-mono text-sm">{selectedRefund.course.courseCode}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Mô tả:</span>
                                        <p className="text-gray-800">{selectedRefund.course.description}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Refund Reason */}
                                  <div>
                                    <h4 className="font-semibold mb-3">Lý do yêu cầu hoàn tiền</h4>
                                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">
                                      {selectedRefund.refundReason}
                                    </p>
                                  </div>

                                  {/* Admin Feedback */}
                                  {selectedRefund.adminFeedback && (
                                    <div>
                                      <h4 className="font-semibold mb-3">Phản hồi từ quản trị viên</h4>
                                      <div className="bg-blue-50 p-3 rounded-lg text-sm">
                                        <p className="text-gray-800">{selectedRefund.adminFeedback}</p>
                                        {selectedRefund.processedBy && (
                                          <p className="text-xs text-gray-600 mt-2">
                                            Xử lý bởi: {selectedRefund.processedBy}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Timeline */}
                                  <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      Lịch sử
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Ngày tạo yêu cầu:</span>
                                        <span>{formatDate(selectedRefund.createdAt)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Cập nhật lần cuối:</span>
                                        <span>{formatDate(selectedRefund.updatedAt)}</span>
                                      </div>
                                      {selectedRefund.processedAt && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Ngày xử lý:</span>
                                          <span>{formatDate(selectedRefund.processedAt)}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Payment Method */}
                                  <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <DollarSign className="w-4 h-4" />
                                      Phương thức hoàn tiền
                                    </h4>
                                    <p className="text-gray-800">{selectedRefund.paymentMethod}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {mockRefunds.map((refund) => (
                  <Card key={refund.refundId} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with ID and Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Mã hoàn tiền</p>
                            <p className="font-mono text-sm font-medium">{refund.refundId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(refund.status)}
                            <Badge variant={getStatusVariant(refund.status)} className="text-xs">
                              {getStatusText(refund.status)}
                            </Badge>
                          </div>
                        </div>

                        {/* Payment Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Mã thanh toán</p>
                            <p className="font-mono text-xs">{refund.paymentId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Số tiền</p>
                            <p className="font-semibold text-green-600 text-sm">
                              {formatCurrency(refund.refundAmount)}đ
                            </p>
                          </div>
                        </div>

                        {/* Course Info */}
                        <div>
                          <p className="text-xs text-gray-500">Khóa học</p>
                          <p className="font-medium text-sm">{refund.course.name}</p>
                          <p className="text-xs text-gray-600">{refund.course.courseCode}</p>
                        </div>

                        {/* Update Date */}
                        <div>
                          <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
                          <p className="text-xs text-gray-600">{formatDate(refund.updatedAt)}</p>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end pt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(refund)}
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Xem chi tiết
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-lg">
                                  <FileText className="w-5 h-5" />
                                  Chi tiết yêu cầu hoàn tiền
                                </DialogTitle>
                                <DialogDescription className="text-sm">
                                  {selectedRefund?.refundId}
                                </DialogDescription>
                              </DialogHeader>

                              {selectedRefund && (
                                <div className="space-y-6">
                                  {/* Status and Basic Info */}
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <span className="text-sm text-gray-600">Trạng thái:</span>
                                      <div className="flex items-center gap-2 mt-1">
                                        {getStatusIcon(selectedRefund.status)}
                                        <Badge variant={getStatusVariant(selectedRefund.status)}>
                                          {getStatusText(selectedRefund.status)}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Số tiền hoàn:</span>
                                      <p className="font-semibold text-green-600 text-lg">
                                        {formatCurrency(selectedRefund.refundAmount)}đ
                                      </p>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Course Information */}
                                  <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <User className="w-4 h-4" />
                                      Thông tin khóa học
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <span className="text-gray-600">Tên khóa học:</span>
                                        <p className="font-medium">{selectedRefund.course.name}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Mã khóa học:</span>
                                        <p className="font-mono text-sm">{selectedRefund.course.courseCode}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Mô tả:</span>
                                        <p className="text-gray-800">{selectedRefund.course.description}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Refund Reason */}
                                  <div>
                                    <h4 className="font-semibold mb-3">Lý do yêu cầu hoàn tiền</h4>
                                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">
                                      {selectedRefund.refundReason}
                                    </p>
                                  </div>

                                  {/* Admin Feedback */}
                                  {selectedRefund.adminFeedback && (
                                    <div>
                                      <h4 className="font-semibold mb-3">Phản hồi từ quản trị viên</h4>
                                      <div className="bg-blue-50 p-3 rounded-lg text-sm">
                                        <p className="text-gray-800">{selectedRefund.adminFeedback}</p>
                                        {selectedRefund.processedBy && (
                                          <p className="text-xs text-gray-600 mt-2">
                                            Xử lý bởi: {selectedRefund.processedBy}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Timeline */}
                                  <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      Lịch sử
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Ngày tạo yêu cầu:</span>
                                        <span>{formatDate(selectedRefund.createdAt)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Cập nhật lần cuối:</span>
                                        <span>{formatDate(selectedRefund.updatedAt)}</span>
                                      </div>
                                      {selectedRefund.processedAt && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Ngày xử lý:</span>
                                          <span>{formatDate(selectedRefund.processedAt)}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Payment Method */}
                                  <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <DollarSign className="w-4 h-4" />
                                      Phương thức hoàn tiền
                                    </h4>
                                    <p className="text-gray-800">{selectedRefund.paymentMethod}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Empty State (if no refunds) */}
          {mockRefunds.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <RefreshCw className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có yêu cầu hoàn tiền nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Bạn chưa gửi yêu cầu hoàn tiền nào. Hãy xem lại đơn hàng của bạn nếu cần yêu cầu hoàn tiền.
                </p>
                <Link href="/account/orders">
                  <Button>
                    Xem đơn hàng của tôi
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}