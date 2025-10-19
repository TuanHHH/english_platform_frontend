"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CourseInfo } from "@/components/payment/course-info"
import { PaymentSummary } from "@/components/payment/payment-summary"
import { PaymentMethods } from "@/components/payment/payment-methods"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState("momo")
  const router = useRouter()

  // Mock data
  const courseData = {
    title: "Khóa học Lập trình Web Full-Stack từ Zero đến Hero",
    instructor: "Nguyễn Văn A",
    image: "/course-thumbnail.jpg",
    rating: 4.8,
    students: 15420,
    duration: "40 giờ học",
    level: "Trung cấp",
  }

  const priceData = {
    price: 2990000,
    discount: 990000,
    total: 2000000,
  }

  const handlePayment = () => {
    const paymentNames = {
      momo: "MoMo",
      vnpay: "VNPay",
      stripe: "Stripe",
    }

    toast({
      title: "Đang xử lý thanh toán",
      description: `Chuyển hướng đến cổng thanh toán ${paymentNames[selectedPayment]}...`,
    })
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Thanh toán khóa học</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <CourseInfo course={courseData} />
            <PaymentMethods
              selected={selectedPayment}
              onSelect={setSelectedPayment}
            />
          </div>

          {/* Right Column - Payment Summary */}
          <div className="space-y-6">
            <PaymentSummary
              price={priceData.price}
              discount={priceData.discount}
              total={priceData.total}
            />

            <Button
              size="lg"
              className="w-full"
              onClick={handlePayment}
            >
              Tiến hành thanh toán
            </Button>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Bằng việc thanh toán, bạn đồng ý với</p>
              <p className="text-primary cursor-pointer hover:underline">
                Điều khoản sử dụng & Chính sách bảo mật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
