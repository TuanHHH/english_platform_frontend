"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart-store"

// Import cart components
import CartItem from "@/components/cart/cart-item"
import CartHeader from "@/components/cart/cart-header"
import CartSummary from "@/components/cart/cart-summary"
import DeleteItemDialog from "@/components/cart/delete-item-dialog"
import ClearCartDialog from "@/components/cart/clear-cart-dialog"
import EmptyCart from "@/components/cart/empty-cart"

export default function CartPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const router = useRouter()

  // Get cart state and actions from Zustand store
  const {
    items,
    summary,
    isLoading,
    isRemovingFromCart,
    isClearingCart,
    hasHydrated,
    removeFromCart,
    clearCart
  } = useCartStore()

  // Create a Set for removing items to maintain compatibility with CartItem component
  const removingItems = itemToDelete ? new Set([itemToDelete.id]) : new Set()

  const handleRemoveFromCart = (courseId, courseTitle) => {
    if (isRemovingFromCart) return
    setItemToDelete({ id: courseId, title: courseTitle })
    setDeleteDialogOpen(true)
  }

  const confirmRemoveFromCart = async () => {
    if (!itemToDelete) return

    const courseId = itemToDelete.id
    setDeleteDialogOpen(false)

    try {
      const result = await removeFromCart(courseId)
      if (result.success) {
        toast.success("Đã xóa khóa học khỏi giỏ hàng")
      } else {
        toast.error(result.error || "Không thể xóa khóa học")
      }
    } catch (error) {
      console.error("Remove from cart error:", error)
      toast.error("Lỗi khi xóa khóa học")
    } finally {
      setItemToDelete(null)
    }
  }

  const handleClearCart = () => {
    setClearAllDialogOpen(true)
  }

  const confirmClearCart = async () => {
    setClearAllDialogOpen(false)

    try {
      const result = await clearCart()
      if (result.success) {
        toast.success("Đã xóa tất cả khóa học khỏi giỏ hàng")
      } else {
        toast.error(result.error || "Không thể xóa giỏ hàng")
      }
    } catch (error) {
      console.error("Clear cart error:", error)
      toast.error("Lỗi khi xóa giỏ hàng")
    }
  }

  const handleCheckout = () => {
    router.push("/payment/checkout")
  }

  // Note: Removed useEffect for fetchCart since the store already handles fetching on hydration
  // This prevents duplicate API calls when the cart page loads

  // Show loading state while store is hydrating or fetching data
  if (!hasHydrated || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  // Only show empty cart after hydration is complete
  if (!items || items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn</h1>
            <p className="text-gray-600">
              {summary.totalPublishedCourses} khóa học trong giỏ hàng
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Thêm khóa học</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CartHeader
                  itemCount={items.length}
                  onClearCart={handleClearCart}
                  clearingCart={isClearingCart}
                  hasActiveRemovals={isRemovingFromCart}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFromCart}
                    removingItems={removingItems}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <CartSummary summary={summary} />
          </div>
        </div>
      </div>

      {/* Delete Item Warning Dialog */}
      <DeleteItemDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        itemTitle={itemToDelete?.title}
        onConfirm={confirmRemoveFromCart}
      />

      {/* Clear Cart Warning Dialog */}
      <ClearCartDialog
        open={clearAllDialogOpen}
        onOpenChange={setClearAllDialogOpen}
        itemCount={items?.length || 0}
        onConfirm={confirmClearCart}
      />
    </div>
  )
}