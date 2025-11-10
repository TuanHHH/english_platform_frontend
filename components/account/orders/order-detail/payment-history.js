import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { CreditCard } from "lucide-react"

export function PaymentHistory({ orderDetails, getPaymentStatusIcon, formatDate }) {
  const getPaymentStatusText = (status) => {
    return status === "SUCCESS" ? "Thành công" :
      status === "FAILED" ? "Thất bại" :
        status === "INITIATED" ? "Khởi tạo" :
          status === "PROCESSING" ? "Đang xử lý" :
            status === "REFUNDED" ? "Đã hoàn tiền" : "Không xác định"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Lịch sử thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orderDetails.payments.length > 0 ? (
          <>
            {/* Mobile Payment Cards */}
            <div className="block lg:hidden space-y-3">
              {orderDetails.payments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getPaymentStatusIcon(payment.status)}
                      <span className="font-medium">{payment.provider}</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(payment.amountCents)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Trạng thái: </span>
                      <span>{getPaymentStatusText(payment.status)}</span>
                    </div>

                    <div>
                      <span className="text-gray-600">Thời gian: </span>
                      <span>{formatDate(payment.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Payment Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.provider}</TableCell>
                      <TableCell>
                        {formatCurrency(payment.amountCents)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentStatusIcon(payment.status)}
                          <span className="text-sm">
                            {getPaymentStatusText(payment.status)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có thanh toán nào</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}