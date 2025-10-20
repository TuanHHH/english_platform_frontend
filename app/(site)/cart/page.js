"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { getCart, removeFromCart, clearCart } from "@/lib/api/cart"

// Import cart components
import CartItem from "@/components/cart/cart-item"
import CartHeader from "@/components/cart/cart-header"
import CartSummary from "@/components/cart/cart-summary"
import DeleteItemDialog from "@/components/cart/delete-item-dialog"
import ClearCartDialog from "@/components/cart/clear-cart-dialog"
import EmptyCart from "@/components/cart/empty-cart"

export default function CartPage() {
  const [cartData, setCartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [removingItems, setRemovingItems] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [clearingCart, setClearingCart] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const router = useRouter()
  const pageSize = 5

  const fetchCart = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const result = await getCart(page, pageSize)

      if (result.success) {
        if (append && cartData) {
          setCartData(prev => ({
            ...result.data,
            result: [...prev.result, ...result.data.result]
          }))
        } else {
          setCartData(result.data)
        }
        setCurrentPage(page)
      } else {
        toast.error(result.error || "Không thể tải giỏ hàng")
      }
    } catch (error) {
      console.error("Cart fetch error:", error)
      toast.error("Lỗi khi tải giỏ hàng")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleRemoveFromCart = (courseId, courseTitle) => {
    if (removingItems.has(courseId)) return
    setItemToDelete({ id: courseId, title: courseTitle })
    setDeleteDialogOpen(true)
  }

  const confirmRemoveFromCart = async () => {
    if (!itemToDelete) return

    const courseId = itemToDelete.id
    setRemovingItems(prev => new Set(prev).add(courseId))
    setDeleteDialogOpen(false)

    try {
      const result = await removeFromCart(courseId)
      if (result.success) {
        setCartData(prev => ({
          ...prev,
          result: prev.result.filter(item => item.course.id !== courseId),
          summary: {
            ...prev.summary,
            totalPublishedCourses: prev.summary.totalPublishedCourses - 1,
            totalPriceCents: prev.summary.totalPriceCents -
              prev.result.find(item => item.course.id === courseId)?.course?.priceCents || 0
          },
          meta: {
            ...prev.meta,
            total: prev.meta.total - 1
          }
        }))
        toast.success("Đã xóa khóa học khỏi giỏ hàng")
      } else {
        toast.error(result.error || "Không thể xóa khóa học")
      }
    } catch (error) {
      console.error("Remove from cart error:", error)
      toast.error("Lỗi khi xóa khóa học")
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(courseId)
        return newSet
      })
      setItemToDelete(null)
    }
  }

  const handleClearCart = () => {
    setClearAllDialogOpen(true)
  }

  const confirmClearCart = async () => {
    setClearingCart(true)
    setClearAllDialogOpen(false)

    try {
      const result = await clearCart()
      if (result.success) {
        setCartData(prev => ({
          ...prev,
          result: [],
          summary: {
            ...prev.summary,
            totalPublishedCourses: 0,
            totalPriceCents: 0
          },
          meta: {
            ...prev.meta,
            total: 0
          }
        }))
        toast.success("Đã xóa tất cả khóa học khỏi giỏ hàng")
      } else {
        toast.error(result.error || "Không thể xóa giỏ hàng")
      }
    } catch (error) {
      console.error("Clear cart error:", error)
      toast.error("Lỗi khi xóa giỏ hàng")
    } finally {
      setClearingCart(false)
    }
  }

  const handleCheckout = () => {
    router.push("/payment/checkout")
  }

  const loadMore = () => {
    if (!loadingMore && cartData?.meta?.page < cartData?.meta?.pages) {
      fetchCart(currentPage + 1, true)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (!cartData || !cartData.result || cartData.result.length === 0) {
    return <EmptyCart />
  }

  const { result: cartItems, meta, summary } = cartData

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
                  itemCount={cartItems.length}
                  onClearCart={handleClearCart}
                  clearingCart={clearingCart}
                  hasActiveRemovals={removingItems.size > 0}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFromCart}
                    removingItems={removingItems}
                  />
                ))}
              </CardContent>

              {meta && meta.page < meta.pages && (
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="w-full"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Xem thêm ({meta.total - cartItems.length} khóa học còn lại)
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
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
        itemCount={cartData?.result?.length || 0}
        onConfirm={confirmClearCart}
      />
    </div>
  )
}