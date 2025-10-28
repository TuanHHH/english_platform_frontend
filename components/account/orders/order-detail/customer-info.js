import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CustomerInfo({ orderDetails, isMobile = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khách hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isMobile ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Họ tên</p>
              <p className="font-medium">{orderDetails.user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-sm break-all">{orderDetails.user.email}</p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="text-sm text-gray-600">Họ tên</p>
              <p className="font-medium">{orderDetails.user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{orderDetails.user.email}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}