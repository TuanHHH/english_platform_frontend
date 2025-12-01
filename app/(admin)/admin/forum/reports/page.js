"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  adminGetReports,
  adminResolveReport,
  adminHidePost,
  adminUnhidePost,
  adminDeletePost,
  adminDeleteThread,
} from "@/lib/api/forum";

export default function AdminForumReportsPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 0 });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [type, setType] = useState("THREAD");
  const [onlyOpen, setOnlyOpen] = useState("true");

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    type: null,
    id: null,
  });

  const [isDeleting, setIsDeleting] = useState(false);

  async function load(p = page) {
    const params = { page: p, pageSize, type, onlyOpen: onlyOpen === "true" };
    const result = await adminGetReports(params);
    if (result.success) {
      const data = result.data;
      setItems(data?.content || data?.result || []);
      setMeta(data?.meta || { page: p, pages: data?.totalPages || 0 });
    } else {
      toast.error(result.error || "Không thể tải danh sách báo cáo");
      setItems([]);
      setMeta({ page: p, pages: 0 });
    }
  }

  const openDeleteConfirm = (deleteType, id) => {
    setDeleteConfirm({ open: true, type: deleteType, id });
  };

  const handleDelete = async () => {
    const { type, id } = deleteConfirm;
    if (!type || !id) return;

    setIsDeleting(true);
    try {
      const result = type === "THREAD" 
        ? await adminDeleteThread(id)
        : await adminDeletePost(id);
      
      if (result.success) {
        toast.success(type === "THREAD" ? "Đã xóa chủ đề" : "Đã xóa bài viết");
        await load(page);
      } else {
        toast.error(result.error || `Lỗi khi xóa ${type === "THREAD" ? "chủ đề" : "bài viết"}`);
      }
    } catch (e) {
      console.error(e);
      toast.error(`Lỗi khi xóa ${type === "THREAD" ? "chủ đề" : "bài viết"}`);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ open: false, type: null, id: null });
    }
  };

  useEffect(() => {
    setPage(1);
  }, [type, onlyOpen]);

  useEffect(() => {
    load(page);
  }, [page, type, onlyOpen]);

  async function resolve(id) {
    const result = await adminResolveReport(id);
    if (result.success) {
      toast.success("Đã đánh dấu báo cáo là đã xử lý");
      await load(page);
    } else {
      toast.error(result.error || "Không thể xử lý báo cáo");
    }
  }

  return (
    <div className="flex">
      <div className="p-4 w-full space-y-4">
        <h1 className="text-2xl font-semibold">Forum • Báo cáo</h1>

        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Đối tượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="THREAD">Chủ đề</SelectItem>
                <SelectItem value="POST">Bài viết</SelectItem>
              </SelectContent>
            </Select>
            <Select value={onlyOpen} onValueChange={setOnlyOpen}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Chưa xử lý</SelectItem>
                <SelectItem value="false">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Danh sách</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {items.map((r) => (
              <div key={r.id} className="border rounded-md p-3">
                <div className="text-xs text-muted-foreground">
                  {r.targetType} • {r.targetId} •{" "}
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                </div>

                <div className="mt-2 text-sm">
                  <div>
                    <b>Người báo cáo:</b> {r.reporterName || r.userId}
                  </div>

                  {/* THREAD → Link xem bài */}
                  {r.targetType === "THREAD" && r.targetPreview && (
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Chủ đề bị báo cáo
                      </div>

                      <a
                        href={`/forum/${r.targetPreview}`}
                        target="_blank"
                        className="text-blue-600 underline break-all"
                      >
                        {r.targetPreview}
                      </a>
                    </div>
                  )}

                  {/* POST → preview nội dung */}
                  {r.targetType === "POST" && r.targetPreview && (
                    <div className="mt-1 p-2 rounded bg-muted/40">
                      <div className="text-xs text-muted-foreground mb-1">
                        Nội dung bình luận bị báo cáo
                      </div>
                      <div className="whitespace-pre-wrap">
                        {r.targetPreview}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-1">Nội dung báo cáo: {r.reason}</div>

                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  {/* 1. Nút Xử lý báo cáo */}
                  {r.resolvedAt ? (
                    <span className="text-xs">
                      Đã xử lý lúc {new Date(r.resolvedAt).toLocaleString()} bởi{" "}
                      {r.resolvedBy}
                    </span>
                  ) : (
                    <Button size="sm" onClick={() => resolve(r.id)}>
                      Đánh dấu đã xử lý
                    </Button>
                  )}

                  {/* Nút Xóa THREAD */}
                  {r.targetType === "THREAD" && !r.resolvedAt && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteConfirm("THREAD", r.targetId)}
                    >
                      Xóa chủ đề
                    </Button>
                  )}

                  {/* Các nút hành động cho POST */}
                  {r.targetType === "POST" && !r.resolvedAt && (
                    <>
                      {r.targetPublished === true && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={async () => {
                            const result = await adminHidePost(r.targetId);
                            if (result.success) {
                              toast.success("Đã ẩn bài");
                              await load(page);
                            } else {
                              toast.error(result.error || "Không thể ẩn bài");
                            }
                          }}
                        >
                          Ẩn
                        </Button>
                      )}

                      {r.targetPublished === false && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={async () => {
                            const result = await adminUnhidePost(r.targetId);
                            if (result.success) {
                              toast.success("Đã hiện bài");
                              await load(page);
                            } else {
                              toast.error(result.error || "Không thể hiện bài");
                            }
                          }}
                        >
                          Hiện
                        </Button>
                      )}

                      {r.targetPublished == null && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={async () => {
                              const result = await adminHidePost(r.targetId);
                              if (result.success) {
                                toast.success("Đã ẩn bài");
                                await load(page);
                              } else {
                                toast.error(result.error || "Không thể ẩn bài");
                              }
                            }}
                          >
                            Ẩn
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={async () => {
                              const result = await adminUnhidePost(r.targetId);
                              if (result.success) {
                                toast.success("Đã hiện bài");
                                await load(page);
                              } else {
                                toast.error(result.error || "Không thể hiện bài");
                              }
                            }}
                          >
                            Hiện
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteConfirm("POST", r.targetId)}
                      >
                        Xóa
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Không có báo cáo
              </div>
            )}
          </CardContent>
        </Card>
        
        <Pagination
          currentPage={page}
          totalPages={meta?.pages ?? 0}
          onPageChange={setPage}
        />

        <Dialog
          open={deleteConfirm.open}
          onOpenChange={(open) => {
            if (!isDeleting)
              setDeleteConfirm((prev) => ({ ...prev, open }));
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Xác nhận xóa {deleteConfirm.type === "THREAD" ? "chủ đề" : "bài viết"}?
              </DialogTitle>
              <DialogDescription>
                Hành động này không thể hoàn tác.{" "}
                {deleteConfirm.type === "THREAD"
                  ? "Toàn bộ bài viết trong chủ đề này cũng sẽ bị xóa."
                  : "Bài viết này sẽ bị xóa vĩnh viễn khỏi hệ thống."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                disabled={isDeleting}
                onClick={() => setDeleteConfirm({ open: false, type: null, id: null })}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}