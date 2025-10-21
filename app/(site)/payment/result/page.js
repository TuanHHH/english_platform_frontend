"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResultIcon } from "@/components/payment/result-icon"
import { TransactionStatus } from "@/components/payment/transaction-status"
import { Home, Receipt } from "lucide-react"
import { Suspense } from "react"

// Mock data function - will be replaced with API integration
function getMockPaymentResult(provider, status) {
  const mockData = {
    momo: {
      success: {
        status: "success",
        message: "Thanh toán thành công qua MoMo",
        orderId: "MOMO_20241020_001",
        transactionId: "TXN_M4B7C9D2E",
        provider: "MoMo",
        amount: 2000000,
        paymentTime: "20/10/2024, 17:30:45",
        courseTitle: "Complete TOEIC 650+"
      },
      failure: {
        status: "failure",
        message: "Thanh toán thất bại qua MoMo",
        orderId: "MOMO_20241020_002",
        transactionId: null,
        provider: "MoMo",
        amount: 2000000,
        paymentTime: "20/10/2024, 17:35:12",
        courseTitle: "Complete TOEIC 650+",
        error: "Giao dịch bị hủy hoặc hết thời gian"
      },
      cancellation: {
        status: "cancellation",
        message: "Đã hủy giao dịch MoMo",
        orderId: "MOMO_20241020_003",
        transactionId: null,
        provider: "MoMo",
        amount: 2000000,
        paymentTime: "20/10/2024, 17:40:28",
        courseTitle: "Complete TOEIC 650+",
        error: "Người dùng đã hủy giao dịch"
      }
    },
    vnpay: {
      success: {
        status: "success",
        message: "Thanh toán thành công qua VNPay",
        orderId: "VNPAY_20241020_001",
        transactionId: "VNP_X8K3L5N7P",
        provider: "VNPay",
        amount: 2000000,
        paymentTime: "20/10/2024, 16:45:30",
        courseTitle: "Complete TOEIC 650+"
      },
      failure: {
        status: "failure",
        message: "Thanh toán thất bại qua VNPay",
        orderId: "VNPAY_20241020_002",
        transactionId: null,
        provider: "VNPay",
        amount: 2000000,
        paymentTime: "20/10/2024, 16:50:15",
        courseTitle: "Complete TOEIC 650+",
        error: "Lỗi hệ thống hoặc thông tin không hợp lệ"
      },
      cancellation: {
        status: "cancellation",
        message: "Đã hủy giao dịch VNPay",
        orderId: "VNPAY_20241020_003",
        transactionId: null,
        provider: "VNPay",
        amount: 2000000,
        paymentTime: "20/10/2024, 16:55:42",
        courseTitle: "Complete TOEIC 650+",
        error: "Người dùng đã hủy giao dịch"
      }
    },
    stripe: {
      success: {
        status: "success",
        message: "Thanh toán thành công qua Stripe",
        orderId: "STRIPE_20241020_001",
        transactionId: "STP_Q9R4T6U8W",
        provider: "Stripe",
        amount: 2000000,
        paymentTime: "20/10/2024, 15:20:10",
        courseTitle: "Complete TOEIC 650+"
      },
      failure: {
        status: "failure",
        message: "Thanh toán thất bại qua Stripe",
        orderId: "STRIPE_20241020_002",
        transactionId: null,
        provider: "Stripe",
        amount: 2000000,
        paymentTime: "20/10/2024, 15:25:33",
        courseTitle: "Complete TOEIC 650+",
        error: "Thẻ bị từ chối hoặc thông tin không chính xác"
      },
      cancellation: {
        status: "cancellation",
        message: "Đã hủy giao dịch Stripe",
        orderId: "STRIPE_20241020_003",
        transactionId: null,
        provider: "Stripe",
        amount: 2000000,
        paymentTime: "20/10/2024, 15:30:55",
        courseTitle: "Complete TOEIC 650+",
        error: "Người dùng đã hủy giao dịch"
      }
    }
  }

  return mockData[provider]?.[status] || mockData.momo.success
}

function PaymentResultContent() {
  const searchParams = useSearchParams()

  // Get payment parameters from URL
  const provider = searchParams.get('provider') || 'momo'
  const status = searchParams.get('status') || 'success'

  // Get mock data (will replace with API call later)
  const paymentResult = getMockPaymentResult(provider, status)

  const handleViewInvoice = () => {
    // TODO: Implement invoice viewing
    console.log("View invoice:", paymentResult.orderId)
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'success':
        return 'default'
      case 'failure':
        return 'destructive'
      case 'cancellation':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Kết quả thanh toán</h1>
          <p className="text-muted-foreground">
            {paymentResult.courseTitle}
          </p>
        </div>

        {/* Main Result Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <ResultIcon status={paymentResult.status} />
              <h2 className="text-2xl font-semibold mt-4 mb-2">
                {paymentResult.message}
              </h2>
              <Badge variant={getStatusVariant(paymentResult.status)}>
                <TransactionStatus status={paymentResult.status} />
              </Badge>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4 bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Chi tiết giao dịch</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                  <p className="font-mono font-medium">{paymentResult.orderId}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                  <p className="font-medium">{paymentResult.provider}</p>
                </div>

                {paymentResult.transactionId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Mã giao dịch</p>
                    <p className="font-mono font-medium">{paymentResult.transactionId}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Số tiền</p>
                  <p className="font-medium text-lg">
                    {paymentResult.amount.toLocaleString('vi-VN')}đ
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Thời gian thanh toán</p>
                  <p className="font-medium">{paymentResult.paymentTime}</p>
                </div>
              </div>

              {paymentResult.error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">
                    <strong>Lỗi:</strong> {paymentResult.error}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {paymentResult.status === 'success' && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleViewInvoice}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Xem hóa đơn
            </Button>
          )}

          <Link href="/" className="flex-1">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
          </Link>
        </div>

        {/* Additional Information */}
        {paymentResult.status === 'success' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Các bước tiếp theo</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Kiểm tra email của bạn để nhận xác nhận đơn hàng</li>
                <li>• Khóa học đã được thêm vào tài khoản của bạn</li>
                <li>• Bạn có thể bắt đầu học ngay bây giờ</li>
                <li>• Nếu có vấn đề, hãy liên hệ hỗ trợ khách hàng</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {paymentResult.status === 'failure' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Cần giúp đỡ?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Kiểm tra lại thông tin thanh toán</li>
                <li>• Đảm bảo tài khoản của bạn có đủ số dư</li>
                <li>• Thử lại với phương thức thanh toán khác</li>
                <li>• Liên hệ hỗ trợ nếu vấn đề tiếp diễn</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải kết quả thanh toán...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  )
}