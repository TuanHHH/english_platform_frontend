"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "@/lib/api/forum";

export default function AdminForumCategoriesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const result = await adminGetCategories();
    if (result.success) {
      setItems(result.data);
    } else {
      toast.error(result.error || "Không thể tải danh sách danh mục");
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    
    setLoading(true);
    try {
      const result = editingId
        ? await adminUpdateCategory(editingId, form)
        : await adminCreateCategory(form);

      if (result.success) {
        toast.success(editingId ? "Cập nhật danh mục thành công" : "Thêm danh mục thành công");
        setEditingId(null);
        setForm({ name: "", slug: "", description: "" });
        await load();
      } else {
        toast.error(result.error || "Không thể lưu danh mục");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const result = await adminDeleteCategory(id);
    if (result.success) {
      toast.success("Xóa danh mục thành công");
      await load();
    } else {
      toast.error(result.error || "Không thể xóa danh mục");
    }
  }

  return (
    <div className="flex">
      {/* <AdminSidebar /> */}
      <div className="p-4 w-full space-y-4">
        <h1 className="text-2xl font-semibold">Forum • Danh mục</h1>

        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Sửa danh mục" : "Thêm danh mục"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Input
              placeholder="Tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Slug (tùy chọn)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
            <Input
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={save} disabled={loading}>
                {loading ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm"}
              </Button>
              {editingId && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", slug: "", description: "" });
                  }}
                  disabled={loading}
                >
                  Hủy
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {items.map((c) => (
              <div
                key={c.id}
                className="border rounded-md p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.slug}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingId(c.id);
                      setForm({
                        name: c.name,
                        slug: c.slug,
                        description: c.description || "",
                      });
                    }}
                  >
                    Sửa
                  </Button>

                  {/* 2. Thay thế đoạn confirm cũ bằng AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Xóa</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Danh mục "{c.name}" sẽ bị xóa vĩnh viễn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        {/* Gọi hàm xóa ở đây */}
                        <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-red-600 hover:bg-red-700">
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* Kết thúc phần sửa đổi */}

                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Chưa có danh mục
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}