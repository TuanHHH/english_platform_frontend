import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Receipt, RefreshCw, XCircle } from "lucide-react"

export function ActionButtons({
  orderDetails,
  isProcessing,
  onViewInvoice,
  onRequestRefund,
  onCancelOrder
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={onViewInvoice}
        >
          <Receipt className="w-4 h-4 mr-2" />
          Xem hóa đơn
        </Button>

        {orderDetails.status === "PAID" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onRequestRefund}
            disabled={isProcessing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? "Đang xử lý..." : "Yêu cầu hoàn tiền"}
          </Button>
        )}

        {orderDetails.status === "PENDING" && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={onCancelOrder}
            disabled={isProcessing}
          >
            <XCircle className="w-4 h-4 mr-2" />
            {isProcessing ? "Đang xử lý..." : "Hủy đơn hàng"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}