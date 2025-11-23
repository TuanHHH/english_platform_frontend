"use client";
import React, { useEffect, useState } from "react";
import CategoryForm from "@/components/content/category-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteItemDialog from "@/components/content/delete-content-dialog";
import { toast } from "sonner";
import {
  listCategories,
  createCategory,
  deleteCategory,
} from "@/lib/api/content/categories";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await listCategories();
      
      if (res.success) {
        const data = res.data;
        const categories = Array.isArray(data?.result) 
          ? data.result 
          : Array.isArray(data?.content) 
          ? data.content 
          : Array.isArray(data) 
          ? data 
          : [];
        setItems(categories);
      } else {
        toast.error(res.error || "Tải danh mục thất bại");
      }
    } catch (err) {
      toast.error("Tải danh mục thất bại");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(payload) {
    setCreating(true);
    try {
      const res = await createCategory(payload);
      if (res.success) {
        toast.success("Tạo danh mục thành công");
        await load();
      } else {
        toast.error(res.error || "Tạo danh mục thất bại");
      }
    } finally {
      setCreating(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      const res = await deleteCategory(deleteId);
      if (res.success) {
        toast.success("Đã xoá danh mục");
      } else {
        toast.error(res.error || "Xoá danh mục thất bại");
      }
    } catch (err) {
      toast.error("Xoá danh mục thất bại");
    } finally {
      setOpenDelete(false);
      setDeleteId(null);
      setDeleteTitle("");
      await load();
    }
  }

  function askDelete(cat) {
    setDeleteId(cat.id);
    setDeleteTitle(cat.name || "(không tên)");
    setOpenDelete(true);
  }

  return (
    <div className="flex">
      {/* <AdminSidebar /> */}
      <div className="p-4 w-full space-y-4">
        <h1 className="text-2xl font-semibold">Quản lý danh mục</h1>

        <Card>
          <CardHeader>
            <CardTitle>Tạo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm onSubmit={onCreate} submitting={creating} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid gap-2">
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-9 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-2">
                {items?.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.slug}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      // onClick={() => onDelete(c.id)}
                      onClick={() => askDelete(c)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <DeleteItemDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          itemTitle={deleteTitle}
          onConfirm={confirmDelete}
          title="Xóa danh mục"
          description={`Bạn có chắc chắn muốn xóa danh mục "${deleteTitle}"?\n\nHành động này không thể hoàn tác.`}
          confirmText="Xóa"
          cancelText="Hủy"
        />
      </div>
    </div>
  );
}
