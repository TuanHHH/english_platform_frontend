"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Download, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, AlertCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { createWithdrawal, getWithdrawalHistory, getInstructorWalletBalance, cancelWithdrawal } from "@/lib/api/instructor";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";

const STATUS_CONFIG = {
  PENDING: { label: "Đang chờ", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  PROCESSING: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800 border-blue-200", icon: AlertCircle },
  COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  FAILED: { label: "Thất bại", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
};

export default function WithdrawalsPage() {
  const [balance, setBalance] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [amountVND, setAmountVND] = useState("");
  const [creating, setCreating] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    fetchBalance();
    fetchWithdrawals(1);
  }, []);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const result = await getInstructorWalletBalance();
      if (result.success) {
        setBalance(result.data);
      } else {
        toast.error(result.error || "Không thể tải số dư ví");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Đã xảy ra lỗi khi tải số dư ví");
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async (pageNum) => {
    setWithdrawalsLoading(true);
    try {
      const result = await getWithdrawalHistory(pageNum, pageSize);
      if (result.success) {
        setWithdrawals(result.data.result);
        setMeta(result.data.meta);
        setPage(pageNum);
      } else {
        toast.error(result.error || "Không thể tải lịch sử rút tiền");
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast.error("Đã xảy ra lỗi khi tải lịch sử rút tiền");
    } finally {
      setWithdrawalsLoading(false);
    }
  };

  const handleCreateWithdrawal = async (e) => {
    e.preventDefault();

    const amount = parseInt(amountVND);
    if (!amount || amount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (amount > (balance?.availableBalanceCents || 0)) {
      toast.error("Số dư không đủ để rút tiền");
      return;
    }

    setCreating(true);
    try {
      const result = await createWithdrawal(amount, "VND");
      if (result.success) {
        toast.success("Tạo yêu cầu rút tiền thành công");
        setAmountVND("");
        await fetchBalance();
        await fetchWithdrawals(1);
      } else {
        toast.error(result.error || "Không thể tạo yêu cầu rút tiền");
      }
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      toast.error("Đã xảy ra lỗi khi tạo yêu cầu rút tiền");
    } finally {
      setCreating(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      fetchWithdrawals(page - 1);
    }
  };

  const handleNextPage = () => {
    if (meta && page < meta.pages) {
      fetchWithdrawals(page + 1);
    }
  };

  const formatAmount = (amountCents) => {
    return amountCents ? amountCents.toLocaleString() : "0";
  };

  const handleCancelWithdrawal = async () => {
    if (!selectedWithdrawal) return;

    setCancelling(true);
    try {
      const result = await cancelWithdrawal(selectedWithdrawal.id);
      if (result.success) {
        toast.success("Hủy yêu cầu rút tiền thành công");
        setCancelDialogOpen(false);
        setSelectedWithdrawal(null);
        await fetchBalance();
        await fetchWithdrawals(page);
      } else {
        toast.error(result.error || "Không thể hủy yêu cầu rút tiền");
      }
    } catch (error) {
      console.error("Error cancelling withdrawal:", error);
      toast.error("Đã xảy ra lỗi khi hủy yêu cầu rút tiền");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/instructor/wallet">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Rút tiền</h2>
          <p className="text-muted-foreground mt-1">
            Tạo yêu cầu rút tiền và theo dõi lịch sử
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Số dư khả dụng</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-12 w-48" />
            ) : (
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">
                  {formatAmount(balance?.availableBalanceCents)} VND
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatAmount(balance?.availableBalanceCents)} cents
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Tạo yêu cầu rút tiền</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateWithdrawal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền (VND cents)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Nhập số tiền muốn rút"
                  value={amountVND}
                  onChange={(e) => setAmountVND(e.target.value)}
                  disabled={creating || loading}
                  min="1"
                  step="1"
                />
                <p className="text-xs text-muted-foreground">
                  Số dư khả dụng: {formatAmount(balance?.availableBalanceCents)} VND
                </p>
              </div>
              <Button type="submit" disabled={creating || loading} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {creating ? "Đang xử lý..." : "Tạo yêu cầu"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Lịch sử rút tiền</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawalsLoading ? (
              <>
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </>
            ) : withdrawals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có yêu cầu rút tiền nào
              </div>
            ) : (
              <>
                {withdrawals.map((withdrawal) => {
                  const statusConfig = STATUS_CONFIG[withdrawal.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={withdrawal.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          withdrawal.status === "COMPLETED" ? "bg-green-100" : 
                          withdrawal.status === "REJECTED" || withdrawal.status === "FAILED" ? "bg-red-100" : 
                          "bg-yellow-100"
                        }`}>
                          <StatusIcon className={`h-5 w-5 ${
                            withdrawal.status === "COMPLETED" ? "text-green-600" : 
                            withdrawal.status === "REJECTED" || withdrawal.status === "FAILED" ? "text-red-600" : 
                            "text-yellow-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              Rút {withdrawal.amountFormatted} ({formatAmount(withdrawal.originalAmountCents)} VND)
                            </p>
                            <Badge variant="outline" className={`${statusConfig.color} border`}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(withdrawal.createdAt), "dd/MM/yyyy HH:mm")}
                            {withdrawal.completedAt && ` • Hoàn thành: ${format(new Date(withdrawal.completedAt), "dd/MM/yyyy HH:mm")}`}
                          </p>
                          {withdrawal.exchangeRate && (
                            <p className="text-xs text-muted-foreground">
                              Tỷ giá: 1 VND = {withdrawal.exchangeRate} USD
                            </p>
                          )}
                          {withdrawal.adminNote && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Ghi chú: {withdrawal.adminNote}
                            </p>
                          )}
                        </div>
                      </div>
                      {withdrawal.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWithdrawal(withdrawal);
                            setCancelDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Hủy
                        </Button>
                      )}
                    </div>
                  );
                })}

                {meta && meta.pages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Trang {page} / {meta.pages} • Tổng {meta.total} yêu cầu
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={page === meta.pages}
                      >
                        Sau
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy yêu cầu rút tiền</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <div>
                  Bạn có chắc chắn muốn hủy yêu cầu rút tiền này?
                </div>
                {selectedWithdrawal && (
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm">
                      <strong>Số tiền:</strong> {selectedWithdrawal.amountFormatted} ({formatAmount(selectedWithdrawal.originalAmountCents)} VND)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tạo lúc: {format(new Date(selectedWithdrawal.createdAt), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Không</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelWithdrawal}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
