"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { addToCart } from "@/lib/api/cart"
import { formatCurrency } from "@/lib/utils"
export function CoursePurchase({ course }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    const result = await addToCart(course.id)

    if (result.success) {
      toast.success("Đã thêm khóa học vào giỏ hàng", {
        description: course.title,
      })
    } else {
      toast.error("Không thể thêm vào giỏ hàng", {
        description: result.error,
      })
    }

    setIsAddingToCart(false)
  }

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Giá khóa học</p>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(course.priceCents, course.currency)}
          </p>
        </div>

        <div className="space-y-3">
          <Link href={`/payment/checkout/${course.id}`}>
            <Button
              className="w-full"
              size="lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Mua ngay
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Truy cập trọn đời</li>
            <li>✓ Hỗ trợ tận tâm</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
