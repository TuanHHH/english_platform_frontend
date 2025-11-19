"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getMyOrderById, cancelOrder, getOrderInvoice } from "@/lib/api/order"
import { OrderHeader } from "@/components/account/orders/order-detail/order-header"
import { OrderInfo } from "@/components/account/orders/order-detail/order-info"
import { OrderItems } from "@/components/account/orders/order-detail/order-items"
import { PaymentHistory } from "@/components/account/orders/order-detail/payment-history"
import { CustomerInfo } from "@/components/account/orders/order-detail/customer-info"
import { ActionButtons } from "@/components/account/orders/order-detail/action-buttons"
import { CancelOrderDialog } from "@/components/account/orders/order-detail/cancel-order-dialog"
import { ArrowLeft, CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react"

export default function OrderDetailContent({ orderId }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Fetch order details from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return

      setIsLoading(true)
      setError(null)

      try {
        const result = await getMyOrderById(orderId)
        if (result.success) {
          setOrderDetails(result.data)
        } else {
          setError(result.error || "Không thể tải thông tin đơn hàng")
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin đơn hàng")
        console.error("Error fetching order details:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

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
      case "INITIATED":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "PROCESSING":
        return <RefreshCw className="w-4 h-4 text-blue-500" />
      case "REFUNDED":
        return <RefreshCw className="w-4 h-4 text-orange-500" />
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

  const handleViewInvoice = async () => {
    try {
      const result = await getOrderInvoice(orderDetails.id)
      if (result.success && result.data?.fileUrl) {
        window.open(result.data.fileUrl, '_blank')
      } else {
        toast.error(result.error || "Không thể tải hóa đơn")
      }
    } catch (error) {
      console.error("Error fetching invoice:", error)
      toast.error("Có lỗi xảy ra khi tải hóa đơn")
    }
  }

  const handleRequestRefund = () => {
    // Find the first successful payment to use for refund request
    const successfulPayment = orderDetails.payments?.find(payment => payment.status === "SUCCESS")

    if (successfulPayment && successfulPayment.id) {
      // Navigate to refund page with payment ID
      router.push(`/account/refunds/new?paymentId=${successfulPayment.id}`)
    } else {
      toast.error("Không tìm thấy thông tin thanh toán hợp lệ để yêu cầu hoàn tiền.")
    }
  }

  const handlePayAgain = () => {
    // Navigate to payment page for this order
    router.push(`/payment/order/${orderDetails.id}`)
  }

  const handleCancelOrder = () => {
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = async (cancelReason) => {
    setIsProcessing(true)
    try {
      const result = await cancelOrder(orderDetails.id, cancelReason)

      if (result.success) {
        toast.success("Đơn hàng đã được hủy thành công!")
        setShowCancelDialog(false)

        // Refresh order details to show updated status
        const updatedOrder = await getMyOrderById(orderId)
        if (updatedOrder.success) {
          setOrderDetails(updatedOrder.data)
        } else {
          // If refresh fails, redirect to orders list
          router.push('/account/orders')
        }
      } else {
        toast.error(result.error || "Không thể hủy đơn hàng. Vui lòng thử lại.")
      }
    } catch (error) {
      console.error("Error canceling order:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải thông tin đơn hàng...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link href="/account/orders">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại danh sách đơn hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No order data
  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
              <p className="text-gray-600 mb-6">Đơn hàng bạn đang tìm không tồn tại hoặc bạn không có quyền xem nó.</p>
              <Link href="/account/orders">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại danh sách đơn hàng
                </Button>
              </Link>
            </div>
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
          <OrderHeader
            orderDetails={orderDetails}
            getStatusVariant={getStatusVariant}
            getStatusText={getStatusText}
          />

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Order Information */}
              <OrderInfo
                orderDetails={orderDetails}
                formatDate={formatDate}
              />

              {/* Order Items */}
              <OrderItems
                orderDetails={orderDetails}
              />

              {/* Payment History */}
              <PaymentHistory
                orderDetails={orderDetails}
                getPaymentStatusIcon={getPaymentStatusIcon}
                formatDate={formatDate}
              />
            </div>

            {/* Sidebar - Mobile: Bottom, Desktop: Right */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              <div className="lg:hidden">
                {/* Mobile Customer Info */}
                <CustomerInfo
                  orderDetails={orderDetails}
                  isMobile={true}
                />
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block space-y-6">
                {/* Customer Info */}
                <CustomerInfo
                  orderDetails={orderDetails}
                  isMobile={false}
                />

                {/* Action Buttons */}
                <ActionButtons
                  orderDetails={orderDetails}
                  isProcessing={isProcessing}
                  onViewInvoice={handleViewInvoice}
                  onRequestRefund={handleRequestRefund}
                  onPayAgain={handlePayAgain}
                  onCancelOrder={handleCancelOrder}
                />
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="lg:hidden">
              <ActionButtons
                orderDetails={orderDetails}
                isProcessing={isProcessing}
                onViewInvoice={handleViewInvoice}
                onRequestRefund={handleRequestRefund}
                onPayAgain={handlePayAgain}
                onCancelOrder={handleCancelOrder}
              />
            </div>
          </div>

          {/* Cancel Order Dialog */}
          <CancelOrderDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            onConfirm={handleConfirmCancel}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  )
}