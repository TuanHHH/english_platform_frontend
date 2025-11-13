"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner"; // NEW: toast
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  adminSearchPostsPaged,
  adminPublishPost,
  adminUnpublishPost,
  adminDeletePost,
} from "@/lib/api/content/posts";
import { Pagination } from "@/components/ui/pagination";
import useDebouncedValue from "@/hooks/use-debounced-value";

// Dùng dialog xác nhận xóa (tái sử dụng @/components/ui/alert-dialog)
import DeleteItemDialog from "@/components/content/delete-content-dialog";

// studio_fire_base/16 v5_v3_AnswerAttempt with contextText/english_platform_frontend/components/content/delete-content-dialog.js
export default function AdminPostsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword, 1500);

  const [published, setPublished] = useState("all"); // "all" | "true" | "false"

  // Pagination (0-based cho UI)
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalPages, setTotalPages] = useState(0);

  // Dialog xóa
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  // Helper: rút message lỗi từ response server (nếu có)
  function getErr(e) {
    try {
      // tuỳ lib fetch/axios của project; giữ phòng thủ
      if (typeof e === "string") return e;
      if (e?.message) return e.message;
      if (e?.response?.data?.message) return e.response.data.message;
      if (e?.data?.message) return e.data.message;
      return "Có lỗi xảy ra. Vui lòng thử lại.";
    } catch {
      return "Có lỗi xảy ra. Vui lòng thử lại.";
    }
  }

  async function load(p = page) {
    setLoading(true);
    try {
      // const params = { page: p + 1, pageSize };
      const params = { page: p, pageSize };
      // const params = { page: (p ?? page) + 1, pageSize };
      if (debouncedKeyword?.trim()) params.keyword = debouncedKeyword.trim();
      if (published !== "all") params.published = published === "true";

      const { items, meta } = await adminSearchPostsPaged(params);

      // Bảo đảm chia đúng theo published ngay cả khi BE trả trộn
      let filtered = items;
      if (published !== "all") {
        const expect = published === "true";
        filtered = items.filter((x) => !!x.published === expect);
      }
      if (debouncedKeyword?.trim()) {
        const q = debouncedKeyword.toLowerCase();
        filtered = filtered.filter((x) =>
          (x.title || "").toLowerCase().includes(q)
        );
      }

      setItems(filtered);
      setTotalPages(meta?.pages ?? 0);
    } catch (e) {
      toast.error(`Tải danh sách thất bại: ${getErr(e)}`);
    } finally {
      setLoading(false);
    }
  }

  // Reset về trang 0 khi đổi filter sau debounce
  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, published]);

  // Tải dữ liệu khi page/filters ổn định
  useEffect(() => {
    load(page);
  }, [page, debouncedKeyword, published]);

  // Mở dialog xóa
  function openDeleteDialog(post) {
    setDeleteId(post.id);
    setDeleteTitle(post.title || "(không tiêu đề)");
    setOpenDelete(true);
  }

  // Xác nhận xóa
  async function handleConfirmDelete() {
    if (!deleteId) return;
    await toast.promise(adminDeletePost(deleteId), {
      loading: "Đang xóa bài...",
      success: "Đã xóa bài",
      error: (e) => `Xóa thất bại: ${getErr(e)}`,
    });
    setOpenDelete(false);
    setDeleteId(null);
    setDeleteTitle("");
    await load();
  }

  // Publish / Unpublish với toast
  async function handlePublish(id, title) {
    await toast.promise(adminPublishPost(id), {
      loading: "Đang publish...",
      success: `Đã publish: "${title || "bài viết"}"`,
      error: (e) => `Publish thất bại: ${getErr(e)}`,
    });
    await load();
  }

  async function handleUnpublish(id, title) {
    await toast.promise(adminUnpublishPost(id), {
      loading: "Đang chuyển về nháp...",
      success: `Đã chuyển về nháp: "${title || "bài viết"}"`,
      error: (e) => `Thao tác thất bại: ${getErr(e)}`,
    });
    await load();
  }

  return (
    <div className="flex">
      {/* <AdminSidebar /> */}
      <div className="p-4 w-full space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Quản lý bài viết</h1>
          <Button asChild>
            <Link href="/admin/content/posts/new">Tạo bài</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-2">
            <Input
              placeholder="Tìm theo tiêu đề..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Select value={published} onValueChange={setPublished}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Đã publish</SelectItem>
                <SelectItem value="false">Nháp</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setKeyword("");
                setPublished("all");
              }}
            >
              Xóa lọc
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              "Đang tải..."
            ) : (
              <>
                <div className="grid gap-2 mb-4">
                  {items?.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border rounded-md p-3"
                    >
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.slug || "(chưa có slug)"} •{" "}
                          {p.published ? "Đã publish" : "Nháp"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline">
                          <Link href={`/admin/content/posts/${p.id}/edit`}>
                            Sửa
                          </Link>
                        </Button>
                        {p.published ? (
                          <Button
                            variant="secondary"
                            onClick={() => handleUnpublish(p.id, p.title)}
                          >
                            Unpublish
                          </Button>
                        ) : (
                          <Button onClick={() => handlePublish(p.id, p.title)}>
                            Publish
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          onClick={() => openDeleteDialog(p)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Dialog cảnh báo xóa (dùng @/components/ui/alert-dialog) */}
        <DeleteItemDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          itemTitle={deleteTitle}
          onConfirm={handleConfirmDelete}
          title="Xóa bài viết"
          description={`Bạn có chắc chắn muốn xóa bài viết "${deleteTitle}"?\n\nHành động này không thể hoàn tác.`}
          confirmText="Xóa"
          cancelText="Hủy"
        />
      </div>
    </div>
  );
}
