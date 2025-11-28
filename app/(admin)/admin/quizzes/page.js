"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { searchQuizzes, updateQuiz, deleteQuiz } from "@/lib/api/quiz/quiz";
import { listQuizTypes } from "@/lib/api/quiz/quiz-type";
import { listPublicQuizSectionsByType } from "@/lib/api/quiz/quiz-section";
import QuizFilters from "@/components/admin/quizzes/quiz-filters";
import QuizList from "@/components/admin/quizzes/quiz-list";
import QuizPagination from "@/components/admin/quizzes/quiz-pagination";
import DeleteQuizDialog from "@/components/admin/quizzes/delete-quiz-dialog";


export default function AdminQuizzesPage() {
  // filters
  const [keyword, setKeyword] = useState("");
  const [quizTypeId, setQuizTypeId] = useState("all");
  const [status, setStatus] = useState("all");
  const [skill, setSkill] = useState("all");
  const [quizSectionId, setQuizSectionId] = useState("all");

  // options
  const [types, setTypes] = useState([]);
  const [sections, setSections] = useState([]);

  // results
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  const handleStatusChange = useCallback(async (id, nextStatus) => {
    try {
      await updateQuiz(id, { status: nextStatus });
      await load();
      toast.success("Đã cập nhật trạng thái");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái thất bại");
    }
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await searchQuizzes({
        page,
        pageSize,
        keyword,
        quizTypeId: quizTypeId && quizTypeId !== "all" ? quizTypeId : null,
        quizSectionId: quizSectionId && quizSectionId !== "all" ? quizSectionId : null,
        status: status && status !== "all" ? status : null,
        skill: skill && skill !== "all" ? skill : null,
      });
      const meta = res?.meta || res?.data?.meta;
      const result = res?.result || res?.data?.result || res?.data || [];
      setItems(result || []);
      if (meta) {
        setTotal(meta.total || 0);
        setTotalPages(Math.ceil(meta.total / pageSize) || 1);
      } else {
        // fallback
        const totalCount = Array.isArray(result) ? result.length : 0;
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách quiz.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, pageSize]);

  // load quiz types once
  useEffect(() => {
    (async () => {
      try {
        const r = await listQuizTypes();
        const data = r?.data?.result || r?.result || r?.data || r || [];
        setTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // load sections whenever type changes OR skill changes
  useEffect(() => {
    if (!quizTypeId || quizTypeId === "all") {
      setSections([]);
      setQuizSectionId("all");
      return;
    }
    (async () => {
      try {
        const resp = await listPublicQuizSectionsByType(String(quizTypeId), {
          page: 1,
          pageSize: 200,
          ...(skill && skill !== "all" ? { skill } : {}),
        });
        const list = resp?.result || resp?.data || resp || [];
        setSections(Array.isArray(list) ? list : []);

        if (
          quizSectionId &&
          quizSectionId !== "all" &&
          !list.find((s) => String(s.id) === String(quizSectionId))
        ) {
          setQuizSectionId("all");
        }
      } catch (e) {
        console.error("Failed to load sections", e);
        setSections([]);
      }
    })();
  }, [quizTypeId, skill]);

  const onChangeSection = (val) => {
    setQuizSectionId(val || "all");
    if (!val || val === "all") return;
    if (!skill || skill === "all") {
      const sec = sections.find((s) => String(s.id) === String(val));
      if (sec?.skill) setSkill(String(sec.skill));
    }
  };

  // Search
  const search = async (params = {}) => {
    setLoading(true);
    try {
      const res = await searchQuizzes({
        page,
        pageSize,
        keyword,
        quizTypeId: quizTypeId && quizTypeId !== "all" ? quizTypeId : null,
        quizSectionId: quizSectionId && quizSectionId !== "all" ? quizSectionId : null,
        status: status && status !== "all" ? status : null,
        skill: skill && skill !== "all" ? skill : null,
        ...params,
      });
      const meta = res?.meta || res?.data?.meta;
      const result = res?.result || res?.data?.result || res?.data || [];
      setItems(result || []);
      if (meta) {
        setTotal(meta.total || 0);
        setTotalPages(Math.ceil(meta.total / pageSize) || 1);
      } else {
        const totalCount = Array.isArray(result) ? result.length : 0;
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = useCallback((quiz) => {
    setQuizToDelete(quiz);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!quizToDelete) return;
    try {
      await deleteQuiz(quizToDelete.id);
      toast.success("Đã xóa quiz");
      setDeleteDialogOpen(false);
      setQuizToDelete(null);
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa quiz");
    }
  }, [quizToDelete]);



  useEffect(() => {
    search({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    setPage(1);
    search({ page: 1 });
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lí đề thi</h1>
        <Button asChild>
          <a href="/admin/quizzes/new">+ Tạo Quiz</a>
        </Button>
      </div>

      <QuizFilters
        keyword={keyword}
        setKeyword={setKeyword}
        quizTypeId={quizTypeId}
        setQuizTypeId={setQuizTypeId}
        status={status}
        setStatus={setStatus}
        skill={skill}
        setSkill={setSkill}
        quizSectionId={quizSectionId}
        setQuizSectionId={setQuizSectionId}
        types={types}
        sections={sections}
        onSubmit={handleSubmit}
        onChangeSection={onChangeSection}
      />

      <div className="rounded-xl border p-4">
        <QuizList
          items={items}
          loading={loading}
          onDelete={openDeleteDialog}
          onStatusChange={handleStatusChange}
        />

        {!loading && items.length > 0 && (
          <QuizPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <DeleteQuizDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        quiz={quizToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
