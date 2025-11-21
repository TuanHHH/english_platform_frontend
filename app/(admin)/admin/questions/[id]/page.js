"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  getQuestion,
  createQuestion,
  updateQuestion,
} from "@/lib/api/quiz/question";
import { Toaster, toast } from "sonner";

export default function QuestionEditor() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;
  const isNew = id === "new";
  const initialQuizId = searchParams.get("quizId") || "";
  const nextOrderIndex = searchParams.get("nextOrderIndex") || "1";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    quizId: initialQuizId,
    content: "",
    orderIndex: parseInt(nextOrderIndex, 10) || 1,
    options: [
      { content: "", correct: false, explanation: "", orderIndex: 1 },
      { content: "", correct: false, explanation: "", orderIndex: 2 },
      { content: "", correct: false, explanation: "", orderIndex: 3 },
      { content: "", correct: false, explanation: "", orderIndex: 4 },
    ],
  });

  useEffect(() => {
    (async () => {
      try {
        if (!isNew) {
          const r = await getQuestion(id);
          const d = r?.data || r;
          setForm({
            quizId: d.quizId,
            content: d.content || "",
            orderIndex: d.orderIndex ?? 1,
            options: (d.options || []).map((o, idx) => ({
              content: o.content || "",
              correct: !!o.correct,
              explanation: o.explanation || "",
              orderIndex: o.orderIndex ?? idx + 1,
            })),
          });
        }
      } catch (e) {
        console.error(e);
        setError("Không tải được dữ liệu câu hỏi.");
        toast.error("Không tải được dữ liệu câu hỏi.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const setOption = (idx, patch) => {
    setForm((prev) => {
      const next = [...prev.options];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, options: next };
    });
  };

  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          content: "",
          correct: false,
          explanation: "",
          orderIndex: prev.options.length + 1,
        },
      ],
    }));
  };

  const removeOption = (idx) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options
        .filter((_, i) => i !== idx)
        .map((op, i) => ({ ...op, orderIndex: i + 1 })),
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        quizId: form.quizId,
        content: form.content,
        orderIndex: Number(form.orderIndex || 1),
        options: form.options.map((o, i) => ({
          content: o.content,
          correct: !!o.correct,
          explanation: o.explanation || "",
          orderIndex: Number(o.orderIndex || i + 1),
        })),
      };
      if (!payload.quizId) {
        toast.warning(
          "Thiếu Quiz ID (query ?quizId=...). Hãy quay lại từ trang Quản lí đề thi và bấm Câu hỏi."
        );
        return;
      }
      if (isNew) {
        await createQuestion(payload);
        toast.success("Đã tạo câu hỏi mới!");
      } else {
        await updateQuestion(id, payload);
        toast.success("Đã cập nhật câu hỏi!");
      }
      // Redirect về trang quiz questions với format mới
      router.push(`/admin/quizzes/${payload.quizId}/questions`);
    } catch (e) {
      console.error(e);
      toast.error("Lưu thất bại");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Toaster position="top-right" richColors />
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isNew ? "Thêm câu hỏi" : "Sửa câu hỏi"}
        </h1>
        <Button variant="outline" asChild>
          <Link href={`/admin/quizzes/${form.quizId}/questions`}>
            Quay lại
          </Link>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Thông tin câu hỏi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <input
              type="hidden"
              value={form.quizId}
              onChange={(e) => setForm({ ...form, quizId: e.target.value })}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nội dung câu hỏi</label>
              <Textarea
                placeholder="Nhập nội dung câu hỏi..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Thứ tự</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-32"
                  placeholder="Thứ tự"
                  value={form.orderIndex}
                  onChange={(e) =>
                    setForm({ ...form, orderIndex: e.target.value })
                  }
                  readOnly={isNew}
                />
                {isNew && (
                  <span className="text-xs text-muted-foreground">
                    (Tự động tăng từ câu hỏi cuối cùng)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Phương án trả lời</div>
                <Button
                  type="button"
                  onClick={addOption}
                  variant="outline"
                  size="sm"
                >
                  + Thêm phương án
                </Button>
              </div>

              <div className="space-y-3">
                {form.options.map((op, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 space-y-3 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Phương án {idx + 1}
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeOption(idx)}
                        variant="destructive"
                        size="sm"
                      >
                        Xóa
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-medium text-gray-600">
                          Nội dung
                        </label>
                        <Input
                          placeholder={`Nhập phương án ${idx + 1}...`}
                          value={op.content}
                          onChange={(e) =>
                            setOption(idx, { content: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">
                          Thứ tự
                        </label>
                        <Input
                          type="number"
                          placeholder="Thứ tự"
                          value={op.orderIndex}
                          onChange={(e) =>
                            setOption(idx, { orderIndex: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`correct-${idx}`}
                        checked={op.correct}
                        onChange={(e) =>
                          setOption(idx, { correct: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`correct-${idx}`} className="text-sm font-medium">
                        Đáp án đúng
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600">
                        Giải thích (tùy chọn)
                      </label>
                      <Input
                        placeholder="Nhập giải thích cho phương án này..."
                        value={op.explanation}
                        onChange={(e) =>
                          setOption(idx, { explanation: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                {isNew ? "Tạo mới" : "Cập nhật"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/quizzes/${form.quizId}/questions`)}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
