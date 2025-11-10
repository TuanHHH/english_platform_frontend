import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

export function OrderHeader({ orderDetails, getStatusVariant, getStatusText }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-4 mb-4">
        <Link href="/account/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Quay lại đơn hàng</span>
            <span className="sm:hidden">Quay lại</span>
          </Button>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Mã đơn hàng: <span className="font-mono font-medium">{orderDetails.id}</span>
          </p>
        </div>
        <Badge variant={getStatusVariant(orderDetails.status)} className="text-sm px-3 py-1 self-start sm:self-auto">
          {getStatusText(orderDetails.status)}
        </Badge>
      </div>
    </div>
  )
}