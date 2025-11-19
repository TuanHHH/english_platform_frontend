
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  listQuizTypes,
  createQuizType,
  updateQuizType,
  deleteQuizType,
} from "@/lib/api/quiz/quiz-type";
import { toast } from "sonner";

export default function QuizTypesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Load quiz types from API
  async function load() {
    setLoading(true);
    try {
      const res = await listQuizTypes();
      const data = res?.data || res;
      setList(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.name.trim()) {
      toast.error("Lỗi", { description: "Tên Quiz Type không được để trống" });
      return;
    }

    try {
      if (editingId) {
        await updateQuizType(editingId, {
          name: form.name,
          description: form.description,
        });
        toast.success("Cập nhật thành công", { description: "QuizType đã được lưu!" });
      } else {
        await createQuizType(form);
        toast.success("Tạo mới thành công", { description: "QuizType mới đã được thêm!" });
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
      await load();
    } catch (error) {
      console.error(error);
      
      // Handle API error response
      const errorMessage = error?.response?.data?.message || error?.message || "Không thể lưu QuizType";
      const errorCode = error?.response?.data?.code;
      
      toast.error("Lỗi", { 
        description: `${errorMessage}${errorCode ? ` (Mã: ${errorCode})` : ""}` 
      });
    }
  };

  // Edit quiz type
  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || "",
    });
  };

  // Trigger delete confirmation dialog
  const openDeleteDialog = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete quiz type
  const onConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteQuizType(deleteTargetId);
      await load();
      toast.success("Xóa thành công", { description: "QuizType đã bị xóa." });
    } catch (error) {
      console.error(error);
      
      // Handle API error response
      const errorMessage = error?.response?.data?.message || error?.message || "Không thể xóa QuizType này";
      const errorCode = error?.response?.data?.code;
      
      toast.error("Lỗi", { 
        description: `${errorMessage}${errorCode ? ` (Mã: ${errorCode})` : ""}` 
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6 md:p-10 space-y-6">
        <h1 className="text-3xl font-semibold mb-6">Quản lí loại đề thi</h1>

        {/* Form to create or update quiz types */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{editingId ? "Sửa Quiz Type" : "Tạo Quiz Type"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="md:col-span-3 flex gap-2 mt-2">
                <Button type="submit">
                  {editingId ? "Cập nhật" : "Thêm mới"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ name: "", description: "" });
                    }}
                  >
                    Hủy
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List of quiz types */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Danh sách Quiz Types</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Đang tải...</div>
            ) : list.length === 0 ? (
              <div className="text-gray-500 italic">Chưa có dữ liệu</div>
            ) : (
              <div className="space-y-3">
                {list.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 transition"
                  >
                    <div>
                      <div className="font-medium">
                        {it.name}{" "}
                      </div>
                      {it.description && (
                        <div className="text-sm text-muted-foreground">
                          {it.description}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(it)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(it.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa Quiz Type này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
