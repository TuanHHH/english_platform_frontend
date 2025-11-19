"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
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

import { listQuizTypes } from "@/lib/api/quiz/quiz-type";
import {
  pageQuizSections,
  pageQuizSectionsByType,
  deleteQuizSection,
  createQuizSection,
  updateQuizSection,
} from "@/lib/api/quiz/quiz-section";
import QuizSectionForm from "@/components/quiz/quiz-section-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const SKILLS = ["LISTENING", "READING", "SPEAKING", "WRITING"];

export default function AdminQuizSectionsPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 20, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const [types, setTypes] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const [keyword, setKeyword] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({ name: "", quizTypeId: "", skill: "" });

  // State cho delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  const typeMap = useMemo(
    () => Object.fromEntries(types.map((t) => [String(t.id), t.name])),
    [types]
  );

  // Helper function để lấy message từ API response
  const getErrorMessage = (error) => {
    // Kiểm tra format: { success: false, code: 7, message: "...", data: null }
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    // Fallback
    return error?.message || "Có lỗi xảy ra";
  };

  const load = async () => {
    try {
      let response;
      if (filterType && filterType !== "all") {
        response = await pageQuizSectionsByType(filterType, { page, pageSize, keyword });
      } else {
        response = await pageQuizSections({ page, pageSize, keyword });
      }

      const data = response?.data || response;
      let rows = Array.isArray(data?.result) ? data.result : [];

      if (keyword) {
        const kw = keyword.trim().toLowerCase();
        rows = rows.filter((x) => String(x?.name || "").toLowerCase().includes(kw));
      }

      setItems(rows);
      setMeta(data?.meta || { page, pageSize, pages: 1, total: rows.length });
    } catch (e) {
      console.error("Load quiz sections failed:", e);
      toast.error("Không thể tải dữ liệu phần thi");
    }
  };

  // load types
  useEffect(() => {
    (async () => {
      try {
        const result = await listQuizTypes();
        const typesList = result?.data || result || [];
        setTypes(Array.isArray(typesList) ? typesList : []);
      } catch (error) {
        console.error("Failed to load quiz types:", error);
        setTypes([]);
      }
    })();
  }, []);

  // load list khi page/filter/keyword đổi
  useEffect(() => {
    if (keyword) setPage(1);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterType, keyword]);

  const onCreate = async (payload) => {
    try {
      await createQuizSection(payload);
      toast.success("Đã tạo section");
      setPage(1);
      await load();
    } catch (e) {
      console.error(e);
      // Lấy message từ API response
      const errorMsg = getErrorMessage(e);
      toast.error(errorMsg);
    }
  };

  // Hàm mở dialog xác nhận xóa
  const openDeleteDialog = (section) => {
    setSectionToDelete(section);
    setDeleteDialogOpen(true);
  };

  // Hàm xử lý xóa sau khi xác nhận
  const handleDeleteSection = async () => {
    if (!sectionToDelete) return;
    try {
      const response = await deleteQuizSection(sectionToDelete.id);

      // Kiểm tra response từ API
      if (response?.success === false) {
        // API trả về lỗi nhưng status 200
        toast.error(response?.message || "Xóa thất bại");
        setDeleteDialogOpen(false);
        setSectionToDelete(null);
        return;
      }

      // Xóa thành công
      toast.success("Đã xóa section thành công");
      setDeleteDialogOpen(false);
      setSectionToDelete(null);
      await load();
    } catch (e) {
      console.error(e);
      // Lấy message từ API response
      const errorMsg = getErrorMessage(e);
      toast.error(errorMsg);
    }
  };

  const startEdit = (it) => {
    setEditingId(String(it.id));
    setEditRow({
      name: it.name || "",
      quizTypeId: String(it.quizTypeId || ""),
      skill: String(it.skill || it.sectionSkill || it.quizSkill || "").toUpperCase() || "READING",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRow({ name: "", quizTypeId: "", skill: "" });
  };

  const saveEdit = async (id) => {
    try {
      const payload = {
        name: editRow.name?.trim(),
        quizTypeId: editRow.quizTypeId,
        skill: editRow.skill,
      };

      if (!payload.name || !payload.quizTypeId) {
        toast.error("Vui lòng nhập tên và chọn loại đề");
        return;
      }

      const response = await updateQuizSection(id, payload);

      // Kiểm tra response từ API
      if (response?.success === false) {
        // API trả về lỗi
        toast.error(response?.message || "Cập nhập thất bại");
        return;
      }

      // Cập nhập thành công
      setItems((prev) =>
        prev.map((x) =>
          String(x.id) === String(id)
            ? {
                ...x,
                name: payload.name,
                quizTypeId: payload.quizTypeId,
                quizTypeName: typeMap[payload.quizTypeId] || x.quizTypeName,
                skill: payload.skill,
              }
            : x
        )
      );

      toast.success("Đã cập nhập section thành công");
      cancelEdit();
    } catch (e) {
      console.error(e);
      // Lấy message từ API response
      const errorMsg = getErrorMessage(e);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quiz Sections</h1>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-center">
          <div className="w-64">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-72">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by name…"
            />
          </div>
        </CardContent>
      </Card>

      {/* New Section */}
      <Card>
        <CardHeader>
          <CardTitle>New Section</CardTitle>
        </CardHeader>
        <CardContent>
          <QuizSectionForm onSubmit={onCreate} />
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-red-500">Không tìm thấy dữ liệu phần thi.</div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => {
                const isEditing = String(editingId) === String(it.id);
                return (
                  <div
                    key={it.id}
                    className="border rounded-lg p-3 hover:bg-gray-50 transition"
                  >
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                        {/* name */}
                        <Input
                          value={editRow.name}
                          onChange={(e) =>
                            setEditRow((r) => ({ ...r, name: e.target.value }))
                          }
                          placeholder="Section name"
                        />

                        {/* quiz type */}
                        <Select
                          value={editRow.quizTypeId}
                          onValueChange={(v) =>
                            setEditRow((r) => ({ ...r, quizTypeId: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại đề" />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((t) => (
                              <SelectItem key={t.id} value={String(t.id)}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* skill */}
                        <Select
                          value={editRow.skill}
                          onValueChange={(v) =>
                            setEditRow((r) => ({ ...r, skill: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn skill" />
                          </SelectTrigger>
                          <SelectContent>
                            {SKILLS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* actions */}
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" onClick={() => saveEdit(it.id)}>
                            Lưu
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{it.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Type: {it.quizTypeName} · Skill:{" "}
                            {String(it.skill || it.sectionSkill || it.quizSkill || "")}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(it)}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openDeleteDialog(it)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.pages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa quiz section</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa section{" "}
              <strong>"{sectionToDelete?.name}"</strong>?
              {sectionToDelete && (
                <div className="mt-2 text-sm">
                  <div>Type: {sectionToDelete.quizTypeName}</div>
                  <div>Skill: {sectionToDelete.skill || sectionToDelete.sectionSkill || sectionToDelete.quizSkill || "N/A"}</div>
                </div>
              )}
              <div className="mt-2 text-orange-600 font-medium">
                Hành động này không thể hoàn tác.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}