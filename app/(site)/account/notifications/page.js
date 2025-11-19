"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/notification-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import NotificationItem from "@/components/notification/notification-item";
import { Pagination } from "@/components/ui/pagination";

export default function NotificationsPage() {
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    removeAll,
    pagination
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const handlePageChange = (page) => {
    fetchNotifications(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" /> 
          Thông báo của bạn
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => markAllAsRead()} disabled={notifications.length === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Đọc tất cả
          </Button>
          <Button variant="destructive" size="sm" onClick={() => {
              if(confirm("Bạn có chắc chắn muốn xóa toàn bộ thông báo?")) removeAll();
          }} disabled={notifications.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa tất cả
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading && notifications.length === 0 ? (
            <div className="p-8 text-center">Đang tải thông báo...</div>
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onRead={markAsRead}
                  onDelete={removeNotification}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <Bell className="h-12 w-12 opacity-30" />
              </div>
              <h3 className="text-lg font-medium">Bạn chưa có thông báo nào</h3>
              <p>Các cập nhật về khóa học và hệ thống sẽ xuất hiện ở đây.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}