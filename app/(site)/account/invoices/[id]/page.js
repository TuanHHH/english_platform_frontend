"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  Mail,
  CreditCard,
  User,
  Phone,
  MapPin
} from "lucide-react"

// Mock invoice data - will be replaced with API integration
const mockInvoices = {
  "INV20241001001": {
    invoiceId: "INV20241001001",
    invoiceNumber: "INV-2024-1001",
    orderId: "ORD20241001001",
    orderShortCode: "M4B7C9",
    status: "PAID",
    createdAt: "2024-10-20T17:30:45Z",
    paidAt: "2024-10-20T17:35:22Z",
    dueDate: "2024-10-20T17:30:45Z",
    currency: "VND",
    subtotal: 2000000,
    tax: 0,
    discount: 0,
    total: 2000000,

    // Company Information
    company: {
      name: "English Pro",
      address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      phone: "0901234567",
      email: "support@englishpro.vn",
      taxCode: "0312345678",
      website: "www.englishpro.vn"
    },

    // Customer Information
    customer: {
      userId: "USR_001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      address: "456 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh"
    },

    // Invoice Items
    items: [
      {
        id: "item_001",
        description: "Complete TOEIC 650+",
        details: "Khóa học luyện thi TOEIC 650+ toàn diện 4 kỹ năng",
        quantity: 1,
        unitPrice: 2000000,
        total: 2000000,
        courseCode: "TOEIC_650_001"
      }
    ],

    // Payment Information
    payment: {
      method: "MoMo",
      transactionId: "TXN_M4B7C9D2E",
      amount: 2000000,
      status: "SUCCESS",
      paidAt: "2024-10-20T17:35:22Z"
    }
  },

  "INV20241002002": {
    invoiceId: "INV20241002002",
    invoiceNumber: "INV-2024-1002",
    orderId: "ORD20241002002",
    orderShortCode: "X8K3L5",
    status: "PAID",
    createdAt: "2024-10-18T14:22:30Z",
    paidAt: "2024-10-18T14:25:45Z",
    dueDate: "2024-10-18T14:22:30Z",
    currency: "VND",
    subtotal: 1500000,
    tax: 0,
    discount: 150000,
    total: 1350000,

    company: {
      name: "English Pro",
      address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      phone: "0901234567",
      email: "support@englishpro.vn",
      taxCode: "0312345678",
      website: "www.englishpro.vn"
    },

    customer: {
      userId: "USR_001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      address: "456 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh"
    },

    items: [
      {
        id: "item_002",
        description: "IELTS Writing Masterclass",
        details: "Khóa học chuyên sâu kỹ năng viết IELTS",
        quantity: 1,
        unitPrice: 1500000,
        total: 1500000,
        courseCode: "IELTS_WR_001"
      }
    ],

    payment: {
      method: "VNPay",
      transactionId: "VNP_X8K3L5N7P",
      amount: 1350000,
      status: "SUCCESS",
      paidAt: "2024-10-18T14:25:45Z"
    }
  }
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.id
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  // Get invoice data from mock data (will replace with API call)
  const invoice = mockInvoices[invoiceId] || mockInvoices["INV20241001001"]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    // Format manually to avoid timezone issues
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  const formatDateOnly = (dateString) => {
    const date = new Date(dateString)
    // Format manually to avoid timezone issues
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      // TODO: Implement PDF download
      console.log("Downloading PDF for invoice:", invoice.invoiceId)

      // Simulate PDF generation and download
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create a mock PDF download
      const link = document.createElement('a')
      link.href = '#'
      link.download = `Invoice-${invoice.invoiceNumber}.pdf`
      link.click()

      alert("Đã tải xuống hóa đơn thành công!")
    } catch (error) {
      alert("Có lỗi xảy ra khi tải xuống. Vui lòng thử lại.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrint = () => {
    setIsPrinting(true)
    try {
      window.print()
      setTimeout(() => setIsPrinting(false), 1000)
    } catch (error) {
      setIsPrinting(false)
      alert("Có lỗi xảy ra khi in. Vui lòng thử lại.")
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "PAID":
        return "default"
      case "PENDING":
        return "secondary"
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
      default:
        return "Không xác định"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Actions */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link href="/account/orders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại đơn hàng
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hóa đơn #{invoice.invoiceNumber}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">Mã đơn hàng: {invoice.orderShortCode}</span>
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {getStatusText(invoice.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                <Download className={`w-4 h-4 mr-2 ${isDownloading ? 'animate-bounce' : ''}`} />
                {isDownloading ? "Đang tải..." : "Tải PDF"}
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={isPrinting}
              >
                <Printer className={`w-4 h-4 mr-2 ${isPrinting ? 'animate-pulse' : ''}`} />
                {isPrinting ? "Đang in..." : "In hóa đơn"}
              </Button>
            </div>
          </div>

          {/* Printable Invoice Content */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:border print:border-gray-300">
            {/* Invoice Header */}
            <div className="p-6 sm:p-8 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Company Logo and Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{invoice.company.name}</h2>
                    <div className="text-sm text-gray-600 space-y-1 mt-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{invoice.company.address}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{invoice.company.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{invoice.company.email}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Mã số thuế: {invoice.company.taxCode} | Website: {invoice.company.website}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="text-right">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-600 font-medium">HÓA ĐƠN</div>
                    <div className="text-2xl font-bold text-blue-900 mt-1">{invoice.invoiceNumber}</div>
                    <div className="text-xs text-blue-700 mt-2 space-y-1">
                      <div>Ngày lập: {formatDateOnly(invoice.createdAt)}</div>
                      <div>Ngày thanh toán: {formatDateOnly(invoice.paidAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer and Invoice Info */}
            <div className="p-6 sm:p-8 border-b">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Họ tên:</span>
                      <p className="font-medium">{invoice.customer.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium">{invoice.customer.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Điện thoại:</span>
                      <p className="font-medium">{invoice.customer.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Địa chỉ:</span>
                      <p className="font-medium">{invoice.customer.address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Mã khách hàng:</span>
                      <p className="font-mono text-sm">{invoice.customer.userId}</p>
                    </div>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Thông tin hóa đơn
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Mã hóa đơn:</span>
                      <p className="font-mono text-sm">{invoice.invoiceId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Đơn hàng liên quan:</span>
                      <p className="font-medium">{invoice.orderShortCode}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <div className="mt-1">
                        <Badge variant={getStatusVariant(invoice.status)}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="p-6 sm:p-8 border-b">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết khóa học</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Khóa học</TableHead>
                      <TableHead className="text-center">Số lượng</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.description}</div>
                            <div className="text-sm text-gray-600">{item.details}</div>
                            <div className="text-xs text-gray-500">Mã khóa: {item.courseCode}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {item.unitPrice.toLocaleString('vi-VN')}đ
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.total.toLocaleString('vi-VN')}đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Summary and Payment */}
            <div className="p-6 sm:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Thông tin thanh toán
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Phương thức:</span>
                      <p className="font-medium">{invoice.payment.method}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Mã giao dịch:</span>
                      <p className="font-mono text-sm">{invoice.payment.transactionId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Số tiền thanh toán:</span>
                      <p className="font-medium text-green-600">
                        {invoice.payment.amount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Thời gian thanh toán:</span>
                      <p className="font-medium">{formatDate(invoice.payment.paidAt)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <p className="font-medium text-green-600">Thành công</p>
                    </div>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng cộng</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span>{invoice.subtotal.toLocaleString('vi-VN')}đ</span>
                      </div>

                      {invoice.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá:</span>
                          <span>-{invoice.discount.toLocaleString('vi-VN')}đ</span>
                        </div>
                      )}

                      {invoice.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thuế (10%):</span>
                          <span>{invoice.tax.toLocaleString('vi-VN')}đ</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {invoice.total.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-8 pt-6 border-t">
                <div className="text-center text-sm text-gray-600">
                  <p className="font-medium mb-2">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của English Pro!</p>
                  <p>Đây là hóa đơn điện tử có giá trị pháp lý. Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi.</p>
                  <div className="mt-4 flex justify-center items-center gap-6 text-xs text-gray-500">
                    <span>Email: {invoice.company.email}</span>
                    <span>Hotline: {invoice.company.phone}</span>
                    <span>Website: {invoice.company.website}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Non-printable actions */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 print:hidden">
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 sm:flex-none"
            >
              <Download className={`w-4 h-4 mr-2 ${isDownloading ? 'animate-bounce' : ''}`} />
              {isDownloading ? "Đang tải xuống PDF..." : "Tải xuống hóa đơn (PDF)"}
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1 sm:flex-none"
            >
              <Printer className={`w-4 h-4 mr-2 ${isPrinting ? 'animate-pulse' : ''}`} />
              {isPrinting ? "Đang in..." : "In hóa đơn"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}