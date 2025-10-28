import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { BookOpen, Calendar } from "lucide-react"

export function OrderInfo({ orderDetails, formatDate }) {
  return (
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
            <p className="font-mono font-medium">{orderDetails.id}</p>
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
              {formatCurrency(orderDetails.totalCents)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ngày thanh toán</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-medium">
                {orderDetails.paidAt ? formatDate(orderDetails.paidAt) : "Chưa thanh toán"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}