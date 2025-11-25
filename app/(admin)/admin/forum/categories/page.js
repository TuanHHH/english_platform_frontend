"use client";
import { useEffect, useState } from "react";
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
  adminForumListCategories,
  adminForumCreateCategory,
  adminForumUpdateCategory,
  adminForumDeleteCategory,
} from "@/lib/api/forum";

export default function AdminForumCategoriesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setItems(await adminForumListCategories());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (editingId) {
      await adminForumUpdateCategory(editingId, form);
      setEditingId(null);
    } else {
      await adminForumCreateCategory(form);
    }
    setForm({ name: "", slug: "", description: "" });
    await load();
  }

  // Tách hàm xóa ra cho gọn
  async function handleDelete(id) {
    await adminForumDeleteCategory(id);
    await load();
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
              <Button onClick={save}>{editingId ? "Cập nhật" : "Thêm"}</Button>
              {editingId && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", slug: "", description: "" });
                  }}
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