"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2, XCircle } from "lucide-react"
import { getOrderById, updateOrderStatus } from "@/lib/api/order"
import { toast } from "sonner"
import { getStatusIcon, getStatusVariant, getStatusText } from "@/components/admin/orders/order-helpers"
import { CustomerInfo } from "@/components/admin/orders/order-detail/customer-info"
import { OrderItems } from "@/components/admin/orders/order-detail/order-items"
import { PaymentInfo } from "@/components/admin/orders/order-detail/payment-info"
import { OrderSummary } from "@/components/admin/orders/order-detail/order-summary"
import { StatusUpdateDialog } from "@/components/admin/orders/order-detail/status-update-dialog"

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id

  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusUpdateReason, setStatusUpdateReason] = useState("")
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  // Load order details from API
  useEffect(() => {
    const loadOrderDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getOrderById(orderId)

        if (result.success) {
          setOrderDetails(result.data)
          setNewStatus(result.data.status)
        } else {
          setError(result.error || "Không thể tải thông tin đơn hàng")
        }
      } catch (err) {
        console.error("Load order details error:", err)
        setError("Có lỗi xảy ra khi tải thông tin đơn hàng")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      loadOrderDetails()
    }
  }, [orderId])

  const handleStatusUpdate = async () => {
    if (newStatus === orderDetails.status) {
      setShowStatusDialog(false)
      return
    }

    // Validate cancel reason if status is CANCELLED
    if (newStatus === "CANCELLED" && (statusUpdateReason.length < 15 || statusUpdateReason.length > 200)) {
      toast.error("Lý do hủy đơn phải từ 15-200 ký tự")
      return
    }

    setIsUpdatingStatus(true)

    try {
      const result = await updateOrderStatus(
        orderDetails.id,
        newStatus,
        newStatus === "CANCELLED" ? statusUpdateReason : null
      )

      if (result.success) {
        toast.success("Cập nhật trạng thái đơn hàng thành công!")
        setShowStatusDialog(false)
        setStatusUpdateReason("")

        // Refresh order details
        const updatedOrder = await getOrderById(orderId)
        if (updatedOrder.success) {
          setOrderDetails(updatedOrder.data)
          setNewStatus(updatedOrder.data.status)
        }
      } else {
        toast.error(result.error || "Không thể cập nhật trạng thái đơn hàng")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.")
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <p className="ml-3 text-gray-600">Đang tải thông tin đơn hàng...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>
            <Card>
              <CardContent className="text-center py-12">
                <XCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {error || "Không tìm thấy đơn hàng"}
                </h3>
                <p className="text-gray-600 mb-4">
                  Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.
                </p>
                <Link href="/admin/orders" className="mt-1">
                  <Button>
                    Quay lại danh sách đơn hàng
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header - Responsive */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-4">
                <Link href="/admin/orders" className="mt-1">
                  <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
                    <ArrowLeft className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Quay lại</span>
                  </Button>
                </Link>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                    Chi tiết đơn hàng
                  </h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs sm:text-sm text-gray-600 font-mono truncate max-w-[200px] sm:max-w-none">
                      {orderDetails.id}
                    </span>
                    <Badge variant={getStatusVariant(orderDetails.status)} className="text-xs">
                      {getStatusIcon(orderDetails.status)}
                      <span className="ml-1">{getStatusText(orderDetails.status)}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex sm:block">
                <StatusUpdateDialog
                  orderDetails={orderDetails}
                  showStatusDialog={showStatusDialog}
                  setShowStatusDialog={setShowStatusDialog}
                  newStatus={newStatus}
                  setNewStatus={setNewStatus}
                  statusUpdateReason={statusUpdateReason}
                  setStatusUpdateReason={setStatusUpdateReason}
                  isUpdatingStatus={isUpdatingStatus}
                  handleStatusUpdate={handleStatusUpdate}
                  isStatusUpdateAllowed={isStatusUpdateAllowed}
                />
              </div>
            </div>
          </div>

          {/* Content - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content - Order on mobile: 2 (after summary) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
              <CustomerInfo user={orderDetails.user} />
              <OrderItems items={orderDetails.items} totalCents={orderDetails.totalCents} />
              <PaymentInfo payments={orderDetails.payments} />
            </div>

            {/* Sidebar - Order on mobile: 1 (before main content) */}
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <OrderSummary orderDetails={orderDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}