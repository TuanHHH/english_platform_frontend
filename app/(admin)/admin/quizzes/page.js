
"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; 
import { searchQuizzes ,updateQuiz } from "@/lib/api/quiz/quiz";
import { listQuizTypes } from "@/lib/api/quiz/quiz-type";
import { listPublicQuizSectionsByType } from "@/lib/api/quiz/quiz-section";


const SKILLS = ["LISTENING", "READING", "SPEAKING", "WRITING"];
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];


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
  
  const handleStatusChange = async (id, nextStatus) => {
    try {
      await updateQuiz(id, { status: nextStatus });
      await load();
      toast.success("Đã cập nhật trạng thái");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

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

      {/* Filters */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border p-4 space-y-4 bg-background"
      >
        {/* 6 columns: keyword, type, status, skill, section */}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Từ khóa"
            className="md:col-span-2"
          />

          {/* Quiz Type */}
          <Select
            value={quizTypeId}
            onValueChange={(v) => {
              setQuizTypeId(v);
              setQuizSectionId("all");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Quiz Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {types.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name || t.code || t.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={status} onValueChange={(v) => setStatus(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Skill */}
          <Select
            value={skill}
            onValueChange={(v) => {
              setSkill(v);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {SKILLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quiz Section */}
          <Select
            value={quizSectionId}
            onValueChange={onChangeSection}
            disabled={!quizTypeId || quizTypeId === "all" || sections.length === 0}
          >
            <SelectTrigger className="w-full md:col-span-2">
              <SelectValue placeholder="Section (theo Type)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {sections.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {(s.name || s.id) + (s.skill ? ` • ${s.skill}` : "")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </form>

      <div className="rounded-xl border p-4">
        {/* <div className="font-medium mb-3">
          Kết quả ({total} tổng cộng)
        </div> */}
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <div className="space-y-3">
            {items?.length === 0 && <div>Không có dữ liệu</div>}
            {items?.map((q) => {
              const t =
                q.quizTypeName || q.quizType?.name || q.quizTypeCode || "";
              const sec = q.quizSectionName || q.quizSection?.name || "";
              const sk = q.skill || q.quizSection?.skill || "";
              const statusText = q.status || q.quizStatus || "";
              return (
                <div
                  key={q.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {q.title || q.name || q.id}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {[
                        t,
                        statusText,
                        sk && (sec ? `${sk} • ${sec}` : sk),
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                      <a href={`/admin/quizzes/${q.id}`}>Sửa</a>
                    </Button>
                    <Button variant="destructive" asChild>
                      <a href={`/admin/quizzes/${q.id}/delete`}>Xóa</a>
                    </Button>
                    <Button variant="secondary" asChild>
                      <a href={`/admin/quizzes/${q.id}/questions`}>Câu hỏi</a>
                    </Button>
                    <Select value={q.status} onValueChange={(v)=>handleStatusChange(q.id, v)}>
                      <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">DRAFT</SelectItem>
                        <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                        <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && items.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Trang {page} / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 2), Math.min(totalPages, page + 1))
                  .map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
