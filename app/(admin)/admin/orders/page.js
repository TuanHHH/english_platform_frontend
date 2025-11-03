"use client"

import { useOrders } from "@/hooks/use-orders"
import { OrdersStatistics } from "@/components/admin/orders/orders-statistics"
import { OrdersFilters } from "@/components/admin/orders/orders-filters"
import { OrdersTable } from "@/components/admin/orders/orders-table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { calculateStats } from "@/components/admin/orders/order-helpers"

export default function AdminOrdersPage() {
  const {
    orders,
    loading,
    error,
    pagination,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    currentPage,
    setCurrentPage,
    loadOrders,
    clearFilters
  } = useOrders()

  const stats = calculateStats(orders, pagination)

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Xem và quản lý tất cả đơn hàng trong hệ thống</p>
          </div>

          <OrdersStatistics stats={stats} formatCurrency={formatCurrency} />

          <OrdersFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            clearFilters={clearFilters}
          />

          <OrdersTable
            orders={orders}
            loading={loading}
            error={error}
            pagination={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            loadOrders={loadOrders}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  )
}