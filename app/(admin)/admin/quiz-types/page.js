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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  listQuizTypes,
  createQuizType,
  updateQuizType,
  deleteQuizType,
} from "@/lib/api/quiz/quiz-type";
import { toast } from "sonner";

export default function QuizTypesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const unwrapData = (res) => (res?.data ?? res);

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
  };

  const handleFormDialogChange = (open) => {
    setFormDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  // Load quiz types from API
  async function load() {
    setLoading(true);
    try {
      const res = await listQuizTypes();
      const data = unwrapData(res);
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
      toast.error("Lỗi", { description: "Tên loại đề thi không được để trống" });
      return;
    }

    try {
      if (editingId) {
        const result = await updateQuizType(editingId, {
          name: form.name,
          description: form.description,
        });
        const updatedItem = unwrapData(result);
        setList((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  ...(updatedItem?.id ? updatedItem : { name: form.name, description: form.description }),
                }
              : item
          )
        );
        toast.success("Cập nhật thành công", { description: "QuizType đã được lưu!" });
      } else {
        const result = await createQuizType(form);
        const createdItem = unwrapData(result);
        if (createdItem?.id) {
          setList((prev) => [createdItem, ...prev]);
        } else {
          await load();
        }
        toast.success("Tạo mới thành công", { description: "QuizType mới đã được thêm!" });
      }
      resetForm();
      setFormDialogOpen(false);
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
    setFormDialogOpen(true);
  };

  const onCreate = () => {
    resetForm();
    setFormDialogOpen(true);
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
      setList((prev) => prev.filter((item) => item.id !== deleteTargetId));
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-semibold">Quản lí loại đề thi</h1>
          <Button onClick={onCreate}>Thêm loại đề thi</Button>
        </div>

        {/* List of quiz types */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Danh sách loại đề thi</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
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
                      <Button size="sm" variant="outline" onClick={() => onEdit(it)}>
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
              Bạn có chắc chắn muốn xóa loại đề thi này?
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

      {/* Create/Edit Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={handleFormDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Sửa loại đề thi" : "Tạo loại đề thi"}</DialogTitle>
            <DialogDescription>
              Điền thông tin cho loại đề thi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => handleFormDialogChange(false)}>
                Hủy
              </Button>
              <Button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
