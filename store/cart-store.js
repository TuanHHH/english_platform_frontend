'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { addToCart, getCart, removeFromCart, clearCart } from '@/lib/api/cart'

// Ignore this flag after first bootstrap
// (to avoid multiple re-fetches in dev mode with React StrictMode)
let didBootstrap = false

export const useCartStore = create()(
  persist(
    (set, get) => ({
      // persisted
      items: [],
      summary: {
        totalPublishedCourses: 0,
        totalPriceCents: 0,
        currency: 'USD'
      },

      // runtime-only
      hasHydrated: false,
      isLoading: false,
      isAddingToCart: false,
      isRemovingFromCart: false,
      isClearingCart: false,

      // setters
      setHasHydrated: (v) => set({ hasHydrated: v }),

      // fetch cart data from API
      fetchCart: async (force = false) => {
        const s = get()
        if (!force && s.isLoading) return

        set({ isLoading: true })
        try {
          const result = await getCart()
          if (result.success) {
            set({
              items: result.data.items || [],
              summary: result.data.summary || {
                totalPublishedCourses: 0,
                totalPriceCents: 0,
                currency: 'USD'
              }
            })
          }
        } catch (err) {
          console.error('fetchCart error:', err)
          set({
            items: [],
            summary: {
              totalPublishedCourses: 0,
              totalPriceCents: 0,
              currency: 'USD'
            }
          })
        } finally {
          set({ isLoading: false })
        }
      },

      // add course to cart
      addToCart: async (courseId) => {
        const s = get()
        if (s.isAddingToCart) return

        set({ isAddingToCart: true })
        try {
          const result = await addToCart(courseId)
          if (result.success) {
            // Refresh cart after adding
            await get().fetchCart(true)
            return { success: true }
          }
          return { success: false, error: result.error }
        } catch (err) {
          console.error('addToCart error:', err)
          return { success: false, error: 'Lỗi khi thêm vào giỏ hàng' }
        } finally {
          set({ isAddingToCart: false })
        }
      },

      // remove specific course from cart
      removeFromCart: async (courseId) => {
        const s = get()
        if (s.isRemovingFromCart) return

        set({ isRemovingFromCart: true })
        try {
          const result = await removeFromCart(courseId)
          if (result.success) {
            // Update local state optimistically
            const currentItems = get().items
            const updatedItems = currentItems.filter(item => item.course.id !== courseId)
            const updatedSummary = {
              ...get().summary,
              totalPublishedCourses: updatedItems.length,
              totalPriceCents: updatedItems.reduce((total, item) => total + item.course.priceCents, 0)
            }
            set({
              items: updatedItems,
              summary: updatedSummary
            })

            // Refresh cart to ensure consistency
            await get().fetchCart(true)
            return { success: true }
          }
          return { success: false, error: result.error }
        } catch (err) {
          console.error('removeFromCart error:', err)
          return { success: false, error: 'Lỗi khi xóa khỏi giỏ hàng' }
        } finally {
          set({ isRemovingFromCart: false })
        }
      },

      // clear entire cart
      clearCart: async () => {
        const s = get()
        if (s.isClearingCart) return

        set({ isClearingCart: true })
        try {
          const result = await clearCart()
          if (result.success) {
            // Clear local state immediately
            set({
              items: [],
              summary: {
                totalPublishedCourses: 0,
                totalPriceCents: 0,
                currency: 'USD'
              }
            })
            return { success: true }
          }
          return { success: false, error: result.error }
        } catch (err) {
          console.error('clearCart error:', err)
          return { success: false, error: 'Lỗi khi xóa giỏ hàng' }
        } finally {
          set({ isClearingCart: false })
        }
      },

      // get cart item count (for badges, etc.)
      getCartItemCount: () => {
        return get().items.length
      },

      // check if course is in cart
      isInCart: (courseId) => {
        const items = get().items
        return items.some(item => item.course.id === courseId)
      },

      // get total price formatted
      getFormattedTotal: () => {
        const summary = get().summary
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: summary.currency || 'USD'
        }).format((summary.totalPriceCents || 0) / 100)
      },

      // view cart data (getter function)
      getCartData: () => {
        return {
          items: get().items,
          summary: get().summary,
          isEmpty: get().items.length === 0
        }
      }
    }),
    {
      name: 'engpro-cart-storage',
      storage: createJSONStorage(() => localStorage),

      // Only persist cart items and summary (not loading states)
      partialize: (state) => ({
        items: state.items,
        summary: state.summary,
      }),

      // After rehydrate: fetch latest cart data from server
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.setHasHydrated(true)

        if (!didBootstrap) {
          didBootstrap = true
          // Always fetch fresh cart data on app start to ensure consistency
          state.fetchCart(true)
        }
      },
    }
  )
)