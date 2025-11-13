
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { listQuizTypes } from "@/lib/api/quiz/quiz-type";
import {
  getQuiz,
  updateQuizWithSection,
  createQuizWithSection,
} from "@/lib/api/quiz/quiz";
import { pageQuizSectionsByType } from "@/lib/api/quiz/quiz-section";
import { toast } from "sonner";

const SKILLS = ["LISTENING", "READING", "SPEAKING", "WRITING"];
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function AdminQuizEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const isNew = id === "new";

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Section state
  const [quizSectionId, setQuizSectionId] = useState("none");
  const [sections, setSections] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    quizTypeId: "none",
    skill: "READING",
    status: "DRAFT",
    contextText: "",
    questionText: "",
    explanation: "",
  });

  // Load Types + existing Quiz
  useEffect(() => {
    (async () => {
      try {
        const t = await listQuizTypes();
        const typesList = t?.data?.result || t?.data || t || [];
        setTypes(Array.isArray(typesList) ? typesList : []);

        if (!isNew) {
          const q = await getQuiz(id);
          const d = q?.data || q;

          setForm({
            title: d.title || "",
            description: d.description || "",
            quizTypeId: d.quizTypeId ? String(d.quizTypeId) : "none",
            skill: d.skill || "READING",
            status: d.status || "DRAFT",
            contextText: d.contextText || "",
            questionText: d.questionText || "",
            explanation: d.explanation || "",
          });

          setQuizSectionId(d.quizSectionId ? String(d.quizSectionId) : "none");
        }
      } catch (e) {
        console.error(e);
        toast.error("Không tải được dữ liệu.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  // ✅ useEffect 1: Fetch sections chỉ khi quizTypeId thay đổi
  useEffect(() => {
    const typeId = form.quizTypeId;
    if (!typeId || typeId === "none") {
      setSections([]);
      setQuizSectionId("none");
      return;
    }
    (async () => {
      try {
        const params = {
          page: 1,
          pageSize: 200,
        };
        const data = await pageQuizSectionsByType(String(typeId), params);
        const items = data?.result || data?.data?.result || data?.data || data || [];
        const list = Array.isArray(items) ? items : [];
        setSections(list); // Lưu tất cả sections (không lọc)

        if (
          quizSectionId &&
          quizSectionId !== "none" &&
          !list.find((s) => String(s.id) === String(quizSectionId))
        ) {
          setQuizSectionId("none");
        }
      } catch (e) {
        console.error("Failed to load sections", e);
        setSections([]);
        setQuizSectionId("none");
      }
    })();
  }, [form.quizTypeId]); // ✅ Chỉ phụ thuộc vào quizTypeId

  // ✅ useEffect 2: Lọc sections khi skill thay đổi (không gọi API)
  useEffect(() => {
    if (sections.length === 0) return;

    // Lọc sections theo skill hiện tại
    const filtered = sections.filter((s) => {
      const sk = String(s.skill || s.quizSkill || "").toUpperCase();
      return !form.skill || sk === String(form.skill).toUpperCase();
    });

    // Reset quizSectionId nếu section hiện tại không phù hợp với skill mới
    if (
      quizSectionId &&
      quizSectionId !== "none" &&
      !filtered.find((s) => String(s.id) === String(quizSectionId))
    ) {
      setQuizSectionId("none");
    }
  }, [form.skill, sections, quizSectionId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };

      if (!payload.title || !payload.quizTypeId || payload.quizTypeId === "none") {
        toast.error("Vui lòng nhập tiêu đề và chọn loại đề");
        return;
      }

      const submitPayload = {
        title: payload.title,
        description: payload.description,
        quizTypeId: payload.quizTypeId,
        skill: payload.skill,
        status: payload.status,
        contextText: payload.contextText,
        questionText: payload.questionText,
        explanation: payload.explanation,
      };

      if (quizSectionId && quizSectionId !== "none") {
        submitPayload.quizSectionId = quizSectionId;
      } else {
        delete submitPayload.quizSectionId;
      }

      if (isNew) {
        await createQuizWithSection(submitPayload);
      } else {
        await updateQuizWithSection(id, submitPayload);
      }

      toast.success("Đã lưu quiz thành công");
      router.push("/admin/quizzes");
    } catch (e) {
      console.error(e);
      toast.error("Lưu thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-6 text-muted-foreground">Đang tải...</main>
      </div>
    );
  }

  // ✅ Lọc sections theo skill để hiển thị trong dropdown
  const filteredSections = sections.filter((s) => {
    const sk = String(s.skill || s.quizSkill || "").toUpperCase();
    return !form.skill || sk === String(form.skill).toUpperCase();
  });

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            {isNew ? "Tạo Quiz" : "Sửa Quiz"}
          </h1>
          <Link href="/admin/quizzes">
            <Button variant="outline">Quay lại</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                <Input
                  placeholder="Nhập tiêu đề quiz"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Loại đề</label>
                <Select
                  value={form.quizTypeId}
                  onValueChange={(v) => {
                    setForm({ ...form, quizTypeId: v });
                    setQuizSectionId("none");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đề" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Chọn loại đề --</SelectItem>
                    {types.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name || t.code || t.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skill */}
              <div>
                <label className="block text-sm font-medium mb-2">Kỹ năng</label>
                <Select
                  value={form.skill}
                  onValueChange={(v) => {
                    setForm({ ...form, skill: v });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kỹ năng" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILLS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Section (filtered) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Chọn Section
                  {form.quizTypeId === "none" && (
                    <span className="text-xs text-muted-foreground">(Chọn loại đề trước)</span>
                  )}
                </label>
                <Select
                  value={quizSectionId}
                  onValueChange={(v) => setQuizSectionId(v)}
                  disabled={form.quizTypeId === "none" || filteredSections.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Không chọn --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Không chọn --</SelectItem>
                    {filteredSections.map((s) => (
                      <SelectItem key={String(s.id)} value={String(s.id)}>
                        {(s.name || s.id) + (s.skill ? ` • ${s.skill}` : s.quizSkill ? ` • ${s.quizSkill}` : "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <Textarea
                  rows={3}
                  placeholder="Nhập mô tả quiz"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* contextText */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Đoạn văn/Ngữ cảnh chung (contextText)</label>
                <Textarea
                  rows={4}
                  placeholder="Nhập đoạn văn hoặc ngữ cảnh cho câu hỏi"
                  value={form.contextText}
                  onChange={(e) => setForm({ ...form, contextText: e.target.value })}
                />
              </div>

              {/* questionText */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Yêu cầu Speaking/Writing (questionText)</label>
                <Textarea
                  rows={4}
                  placeholder="Nhập yêu cầu cho phần Speaking hoặc Writing"
                  value={form.questionText}
                  onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                />
              </div>

              {/* explanation */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Giải thích sau khi nộp (explanation)</label>
                <Textarea
                  rows={4}
                  placeholder="Nhập giải thích hoặc đáp án mẫu"
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Button type="submit" className="w-full md:w-auto">
                  {isNew ? "Tạo mới" : "Cập nhật"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
