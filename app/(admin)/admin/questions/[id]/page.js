"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-6 md:p-10">Đang tải...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <main className="flex-1 p-6 md:p-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {isNew ? "Thêm Question" : "Sửa Question"}
          </h1>
          <Link
            href={`/admin/quizzes/${form.quizId}/questions`}
            className="inline-block"
          >
            <span className="inline-flex items-center px-3 py-2 text-sm rounded border hover:bg-gray-50">
              ← Quay lại
            </span>
          </Link>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="bg-white rounded border p-4 space-y-4">
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
            <input
              className="border rounded px-3 py-2 bg-gray-50"
              placeholder="Quiz ID (UUID)"
              value={form.quizId}
              onChange={(e) => setForm({ ...form, quizId: e.target.value })}
              readOnly={!isNew}
            />
            <textarea
              className="border rounded px-3 py-2 min-h-[120px]"
              placeholder="Nội dung câu hỏi"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Thứ tự:</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-24 bg-yellow-50 font-semibold"
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

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Phương án trả lời</div>
              <button
                type="button"
                onClick={addOption}
                className="px-3 py-2 text-sm rounded border bg-gray-50 hover:bg-gray-100"
              >
                + Thêm phương án
              </button>
            </div>

            <div className="space-y-3">
              {form.options.map((op, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-6 gap-2 border rounded p-3"
                >
                  <input
                    className="md:col-span-3 border rounded px-3 py-2"
                    placeholder={`Option ${idx + 1}`}
                    value={op.content}
                    onChange={(e) =>
                      setOption(idx, { content: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="border rounded px-3 py-2"
                    placeholder="Order"
                    value={op.orderIndex}
                    onChange={(e) =>
                      setOption(idx, { orderIndex: Number(e.target.value) })
                    }
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={op.correct}
                      onChange={(e) =>
                        setOption(idx, { correct: e.target.checked })
                      }
                    />
                    Correct
                  </label>
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="px-3 py-2 text-sm rounded border bg-red-50 hover:bg-red-100 text-red-600"
                  >
                    Xóa
                  </button>
                  <input
                    className="md:col-span-6 border rounded px-3 py-2"
                    placeholder="Giải thích (optional)"
                    value={op.explanation}
                    onChange={(e) =>
                      setOption(idx, { explanation: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <div>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {isNew ? "Tạo mới" : "Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
