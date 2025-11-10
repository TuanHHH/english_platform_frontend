import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { BookOpen } from "lucide-react"

export function OrderItems({ orderDetails }) {
  return (
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
              <div className="flex-1 w-0 overflow-hidden">
                <h3
                  className="font-semibold text-base sm:text-lg truncate"
                  title={item.title}
                >
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  Loại sản phẩm: {item.entityType === "COURSE" ? "Khóa học" : item.entityType}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-semibold text-base sm:text-lg">
                  {formatCurrency(item.unitPriceCents)}
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
            {formatCurrency(orderDetails.totalCents)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}