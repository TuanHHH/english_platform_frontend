"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, AlertCircle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getAdminWithdrawals, processWithdrawal } from "@/lib/api/admin";
import { toast } from "sonner";
import { format } from "date-fns";

const STATUS_CONFIG = {
  PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  APPROVED: { label: "Đã duyệt", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
  PROCESSING: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800 border-blue-200", icon: AlertCircle },
  COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  FAILED: { label: "Thất bại", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "FAILED", label: "Thất bại" },
];

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    fetchWithdrawals(1, statusFilter);
  }, [statusFilter]);

  const fetchWithdrawals = async (pageNum, status) => {
    setLoading(true);
    try {
      const result = await getAdminWithdrawals({
        state: status === "ALL" ? undefined : status,
        page: pageNum,
        size: pageSize,
      });
      if (result.success) {
        setWithdrawals(result.data.result);
        setMeta(result.data.meta);
        setPage(pageNum);
      } else {
        toast.error(result.error || "Không thể tải danh sách yêu cầu rút tiền");
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast.error("Đã xảy ra lỗi khi tải danh sách yêu cầu rút tiền");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      fetchWithdrawals(page - 1, statusFilter);
    }
  };

  const handleNextPage = () => {
    if (meta && page < meta.pages) {
      fetchWithdrawals(page + 1, statusFilter);
    }
  };

  const parseBankInfo = (bankInfoJson) => {
    try {
      return JSON.parse(bankInfoJson);
    } catch {
      return null;
    }
  };

  const handleOpenProcessDialog = (withdrawal, status) => {
    setSelectedWithdrawal(withdrawal);
    setSelectedStatus(status);
    setAdminNote("");
    setProcessDialogOpen(true);
  };

  const handleProcessWithdrawal = async () => {
    if (!selectedWithdrawal || !selectedStatus) return;

    setProcessing(true);
    try {
      const result = await processWithdrawal(selectedWithdrawal.id, selectedStatus, adminNote);
      if (result.success) {
        toast.success("Xử lý yêu cầu rút tiền thành công");
        setProcessDialogOpen(false);
        setSelectedWithdrawal(null);
        setSelectedStatus("");
        setAdminNote("");
        await fetchWithdrawals(page, statusFilter);
      } else {
        toast.error(result.error || "Không thể xử lý yêu cầu rút tiền");
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Đã xảy ra lỗi khi xử lý yêu cầu rút tiền");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Quản lý yêu cầu rút tiền
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Xem và quản lý tất cả yêu cầu rút tiền của giảng viên
            </p>
          </div>
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Bộ lọc
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="w-64">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawals List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách yêu cầu rút tiền</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <>
                    {[...Array(5)].map((_, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : withdrawals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Không có yêu cầu rút tiền nào
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Giảng viên
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Số tiền
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Tỷ giá
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              PayPal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Trạng thái
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Ngày tạo
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                              Hành động
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {withdrawals.map((withdrawal) => {
                            const statusConfig = STATUS_CONFIG[withdrawal.status] || STATUS_CONFIG.PENDING;
                            const StatusIcon = statusConfig.icon;
                            const bankInfo = parseBankInfo(withdrawal.bankInfoJson);

                            return (
                              <tr key={withdrawal.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                  <div>
                                    <p className="font-medium text-sm">{withdrawal.instructorName}</p>
                                    <p className="text-xs text-gray-500">{withdrawal.instructorEmail}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div>
                                    <p className="font-semibold text-sm">
                                      {withdrawal.amountFormatted}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {Math.round(withdrawal.originalAmountCents).toLocaleString()} {withdrawal.originalCurrency}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <p className="text-xs text-gray-600">
                                    1 {withdrawal.originalCurrency} = {withdrawal.exchangeRate} USD
                                  </p>
                                </td>
                                <td className="px-4 py-4">
                                  <p className="text-xs font-mono">
                                    {bankInfo?.paypalEmail || "N/A"}
                                  </p>
                                </td>
                                <td className="px-4 py-4">
                                  <Badge variant="outline" className={`${statusConfig.color} border`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig.label}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4">
                                  <div>
                                    <p className="text-xs text-gray-600">
                                      {format(new Date(withdrawal.createdAt), "dd/MM/yyyy")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {format(new Date(withdrawal.createdAt), "HH:mm")}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex justify-end gap-1">
                                    {withdrawal.status === "PENDING" && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() => handleOpenProcessDialog(withdrawal, "APPROVED")}
                                          className="bg-green-600 hover:bg-green-700 h-7 px-2 text-xs"
                                        >
                                          <CheckCircle className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleOpenProcessDialog(withdrawal, "REJECTED")}
                                          className="h-7 px-2 text-xs"
                                        >
                                          <XCircle className="h-3 w-3" />
                                        </Button>
                                      </>
                                    )}
                                    {withdrawal.status === "APPROVED" && (
                                      <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleOpenProcessDialog(withdrawal, "COMPLETED")}
                                        className="bg-blue-600 hover:bg-blue-700 h-7 px-2 text-xs"
                                      >
                                        <CheckCircle className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

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
        </div>
      </div>

      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStatus === "APPROVED" && "Duyệt yêu cầu rút tiền"}
              {selectedStatus === "REJECTED" && "Từ chối yêu cầu rút tiền"}
              {selectedStatus === "COMPLETED" && "Hoàn thành yêu cầu rút tiền"}
            </DialogTitle>
          </DialogHeader>

          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Giảng viên:</span>
                    <span className="text-sm">{selectedWithdrawal.instructorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Số tiền:</span>
                    <span className="text-sm font-semibold">
                      {selectedWithdrawal.amountFormatted} ({Math.round(selectedWithdrawal.originalAmountCents).toLocaleString()} {selectedWithdrawal.originalCurrency})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">PayPal:</span>
                    <span className="text-sm font-mono">{parseBankInfo(selectedWithdrawal.bankInfoJson)?.paypalEmail || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminNote">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="adminNote"
                  placeholder="Nhập ghi chú cho yêu cầu này..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={4}
                  disabled={processing}
                />
              </div>

              {selectedStatus === "REJECTED" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Cảnh báo:</strong> Yêu cầu rút tiền sẽ bị từ chối và không thể hoàn tác.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProcessDialogOpen(false)}
              disabled={processing}
            >
              Hủy
            </Button>
            <Button
              onClick={handleProcessWithdrawal}
              disabled={processing}
              className={
                selectedStatus === "REJECTED"
                  ? "bg-red-600 hover:bg-red-700"
                  : selectedStatus === "APPROVED"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {processing ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
