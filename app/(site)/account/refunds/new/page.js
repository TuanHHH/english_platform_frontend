"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  AlertCircle,
  CreditCard,
  DollarSign,
  FileText,
  CheckCircle
} from "lucide-react"

// Mock payment data - will be replaced with API integration
const mockPayments = {
  "TXN_M4B7C9D2E": {
    paymentId: "TXN_M4B7C9D2E",
    orderId: "ORD20241001001",
    orderShortCode: "M4B7C9",
    invoiceId: "INV20241001001",
    invoiceNumber: "INV-2024-1001",
    method: "MoMo",
    amount: 2000000,
    status: "SUCCESS",
    paidAt: "2024-10-20T17:35:22Z",
    course: {
      name: "Complete TOEIC 650+",
      description: "Khóa học luyện thi TOEIC 650+ toàn diện 4 kỹ năng",
      courseCode: "TOEIC_650_001"
    }
  },
  "VNP_X8K3L5N7P": {
    paymentId: "VNP_X8K3L5N7P",
    orderId: "ORD20241002002",
    orderShortCode: "X8K3L5",
    invoiceId: "INV20241002002",
    invoiceNumber: "INV-2024-1002",
    method: "VNPay",
    amount: 1350000,
    status: "SUCCESS",
    paidAt: "2024-10-18T14:25:45Z",
    course: {
      name: "IELTS Writing Masterclass",
      description: "Khóa học chuyên sâu kỹ năng viết IELTS",
      courseCode: "IELTS_WR_001"
    }
  }
}

function RefundRequestContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("paymentId")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    refundReason: "",
    refundAmount: ""
  })
  const [errors, setErrors] = useState({})

  // Get payment data from mock data (will replace with API call)
  const payment = paymentId ? mockPayments[paymentId] : mockPayments["TXN_M4B7C9D2E"]

  // Set default refund amount to full payment amount
  React.useEffect(() => {
    if (payment && !formData.refundAmount) {
      setFormData(prev => ({
        ...prev,
        refundAmount: payment.amount.toString()
      }))
    }
  }, [payment])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.refundReason.trim()) {
      newErrors.refundReason = "Vui lòng nhập lý do yêu cầu hoàn tiền"
    }

    if (!formData.refundAmount) {
      newErrors.refundAmount = "Vui lòng nhập số tiền muốn hoàn"
    } else {
      const amount = parseInt(formData.refundAmount.replace(/[^\d]/g, ''))
      if (isNaN(amount) || amount <= 0) {
        newErrors.refundAmount = "Số tiền không hợp lệ"
      } else if (amount > payment.amount) {
        newErrors.refundAmount = `Số tiền hoàn không được vượt quá ${formatCurrency(payment.amount)}đ`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }

    if (field === "refundAmount") {
      // Format currency input
      const numericValue = value.replace(/[^\d]/g, '')
      const formattedValue = numericValue ? new Intl.NumberFormat('vi-VN').format(parseInt(numericValue)) : ""
      setFormData(prev => ({ ...prev, refundAmount: formattedValue }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement API call to submit refund request
      console.log("Submitting refund request:", {
        paymentId: payment.paymentId,
        refundReason: formData.refundReason,
        refundAmount: parseInt(formData.refundAmount.replace(/[^\d]/g, ''))
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting refund request:", error)
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFullRefund = () => {
    setFormData(prev => ({
      ...prev,
      refundAmount: new Intl.NumberFormat('vi-VN').format(payment.amount)
    }))
    if (errors.refundAmount) {
      setErrors(prev => ({ ...prev, refundAmount: "" }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Yêu cầu hoàn tiền đã được gửi
                </h1>
                <p className="text-gray-600 mb-8">
                  Yêu cầu hoàn tiền của bạn đã được gửi thành công. Chúng tôi sẽ xử lý và liên hệ lại với bạn trong vòng 2-3 ngày làm việc.
                </p>
                <div className="space-y-4">
                  <Link href="/account/orders">
                    <Button className="w-full">
                      Quay lại đơn hàng
                    </Button>
                  </Link>
                  <Link href="/account/invoices/[id]" as={`/account/invoices/${payment.invoiceId}`}>
                    <Button variant="outline" className="w-full">
                      Xem hóa đơn
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <Link href="/account/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đơn hàng
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Yêu cầu hoàn tiền</h1>
              <p className="text-gray-600 mt-1">Điền thông tin để gửi yêu cầu hoàn tiền</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Thông tin thanh toán
                </CardTitle>
                <CardDescription>
                  Xem lại thông tin giao dịch trước khi yêu cầu hoàn tiền
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Mã giao dịch</Label>
                  <p className="font-mono text-sm font-medium">{payment.paymentId}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Đơn hàng</Label>
                  <p className="font-medium">#{payment.orderShortCode} - {payment.course.name}</p>
                  <p className="text-sm text-gray-600">{payment.course.description}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Phương thức thanh toán</Label>
                  <p className="font-medium">{payment.method}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Thời gian thanh toán</Label>
                  <p className="font-medium">{formatDate(payment.paidAt)}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm text-gray-600">Số tiền đã thanh toán</Label>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(payment.amount)}đ
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Refund Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Thông tin yêu cầu hoàn tiền
                </CardTitle>
                <CardDescription>
                  Vui lòng điền đầy đủ thông tin để xử lý yêu cầu của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Refund Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="refundAmount" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Số tiền muốn hoàn *
                    </Label>
                    <div className="space-y-2">
                      <Input
                        id="refundAmount"
                        placeholder="Nhập số tiền muốn hoàn"
                        value={formData.refundAmount}
                        onChange={(e) => handleInputChange("refundAmount", e.target.value)}
                        className={errors.refundAmount ? "border-red-500" : ""}
                      />
                      {errors.refundAmount && (
                        <p className="text-sm text-red-600">{errors.refundAmount}</p>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleFullRefund}
                        className="text-xs"
                      >
                        Hoàn toàn bộ ({formatCurrency(payment.amount)}đ)
                      </Button>
                    </div>
                  </div>

                  {/* Refund Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="refundReason">
                      Lý do yêu cầu hoàn tiền *
                    </Label>
                    <Textarea
                      id="refundReason"
                      placeholder="Vui lòng mô tả lý do bạn muốn hoàn tiền..."
                      value={formData.refundReason}
                      onChange={(e) => handleInputChange("refundReason", e.target.value)}
                      rows={4}
                      className={errors.refundReason ? "border-red-500" : ""}
                    />
                    {errors.refundReason && (
                      <p className="text-sm text-red-600">{errors.refundReason}</p>
                    )}
                  </div>

                  {/* Alert */}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Yêu cầu hoàn tiền sẽ được xử lý trong vòng 2-3 ngày làm việc.
                      Chúng tôi sẽ liên hệ lại với bạn qua email để xác nhận thông tin.
                    </AlertDescription>
                  </Alert>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu hoàn tiền"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RefundRequestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Đang tải trang yêu cầu hoàn tiền...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <RefundRequestContent />
    </Suspense>
  )
}