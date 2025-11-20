"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, CreditCard, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getInstructorWalletBalance, getInstructorWalletTransactions } from "@/lib/api/instructor";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import BankAccountDialog from "@/components/instructor/wallet/bank-account-dialog";

export default function WalletPage() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [bankAccountDialogOpen, setBankAccountDialogOpen] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    fetchBalance();
    fetchTransactions(1);
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
      console.error("Error fetching wallet balance:", error);
      toast.error("Đã xảy ra lỗi khi tải số dư ví");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (pageNum) => {
    setTransactionsLoading(true);
    try {
      const result = await getInstructorWalletTransactions(pageNum, pageSize);
      if (result.success) {
        setTransactions(result.data.result);
        setMeta(result.data.meta);
        setPage(pageNum);
      } else {
        toast.error(result.error || "Không thể tải lịch sử giao dịch");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Đã xảy ra lỗi khi tải lịch sử giao dịch");
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      fetchTransactions(page - 1);
    }
  };

  const handleNextPage = () => {
    if (meta && page < meta.pages) {
      fetchTransactions(page + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Ví của tôi</h2>
          <p className="text-muted-foreground mt-1">
            Quản lý số dư và giao dịch của bạn
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/instructor/wallet/withdrawals">
            <Button variant="default">
              <Download className="h-4 w-4 mr-2" />
              Rút tiền
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setBankAccountDialogOpen(true)}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Tài khoản nhận tiền
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <>
            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardContent>
            </Card>
            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Số dư khả dụng
                </CardTitle>
                <Wallet className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {(balance?.availableBalanceCents || 0).toLocaleString()} VND
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Số tiền này đã được chiết khấu 15% phí hoạt động của nền tảng
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Số dư chờ xử lý
                </CardTitle>
                <Clock className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {(balance?.pendingBalanceCents || 0).toLocaleString()} VND
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(balance?.pendingBalanceCents || 0).toLocaleString()} cents
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Thông tin ví</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Tổng số dư</p>
                  <p className="text-sm text-muted-foreground">
                    Bao gồm số dư khả dụng và chờ xử lý
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {loading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    `${((balance?.availableBalanceCents || 0) + (balance?.pendingBalanceCents || 0)).toLocaleString()} VND`
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactionsLoading ? (
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
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có giao dịch nào
              </div>
            ) : (
              <>
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        transaction.type === "SALE" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {transaction.type === "SALE" ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm")} • Số dư sau GD: {(transaction.balanceAfterCents || 0).toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === "SALE" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.amountCents >= 0 ? "+" : ""}{Math.round(transaction.amountCents || 0).toLocaleString()} {transaction.currency || "VND"}
                      </p>
                    </div>
                  </div>
                ))}

                {meta && meta.pages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Trang {page} / {meta.pages} • Tổng {meta.total} giao dịch
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

      <BankAccountDialog
        open={bankAccountDialogOpen}
        onOpenChange={setBankAccountDialogOpen}
      />
    </div>
  );
}
