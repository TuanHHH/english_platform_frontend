"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  listQuizTypes,
  createQuizType,
  updateQuizType,
  deleteQuizType,
} from "@/lib/api/quiz/quiz-type";
import { toast } from "sonner";
import QuizTypeList from "@/components/admin/quiz-type/quiz-type-list";
import QuizTypeFormDialog from "@/components/admin/quiz-type/quiz-type-form-dialog";
import QuizTypeDeleteDialog from "@/components/admin/quiz-type/quiz-type-delete-dialog";

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
        <QuizTypeList
          list={list}
          loading={loading}
          onEdit={onEdit}
          onDelete={openDeleteDialog}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <QuizTypeDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />

      {/* Create/Edit Dialog */}
      <QuizTypeFormDialog
        open={formDialogOpen}
        onOpenChange={handleFormDialogChange}
        form={form}
        setForm={setForm}
        onSubmit={onSubmit}
        editingId={editingId}
      />
    </div>
  );
}
