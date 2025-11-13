"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { sanitizeHtml } from "@/lib/sanitize";
import { getPublicQuiz } from "@/lib/api/quiz/quiz";
import { submitOneShot } from "@/lib/api/assessment/attempt";

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State cho warning dialog
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // để cuộn về kết quả nếu bạn muốn giữ lại flow xem tại chỗ (ở bản này sẽ redirect)
  const resultRef = useRef(null);

  // Load đề (PUBLIC)
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const res = await getPublicQuiz(String(id));
        const data = res?.data || res;
        if (!mounted) return;
        setQuiz(data || null);

        // an toàn: sort theo orderIndex nếu có
        const qs = Array.isArray(data?.questions) ? [...data.questions] : [];
        qs.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        setQuestions(qs);

        setIndex(0);
        setAnswers({});
        setError("");
      } catch (e) {
        console.error(e);
        if (mounted) setError("Không tải được đề thi.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const total = questions.length;
  const current = useMemo(() => questions?.[index] || null, [questions, index]);
  const isMCQ = (q) => Array.isArray(q?.options) && q.options.length > 0;

  const answered = useMemo(() => Object.keys(answers).length, [answers]);

  const go = (step) => {
    setIndex((prev) => {
      const next = prev + step;
      if (next < 0) return 0;
      if (next >= total) return total - 1;
      return next;
    });
  };

  const onChoose = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const onSubmit = async () => {
    if (answered < total) {
      setWarningMessage(
        `Bạn mới trả lời ${answered}/${total} câu. Vẫn nộp bài?`
      );
      setWarningDialogOpen(true);
      return;
    }

    await handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setWarningDialogOpen(false);

      // Chuẩn payload theo attempt submit
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: isMCQ(q) ? answers[q.id] ?? null : null,
        answerText: !isMCQ(q) ? answers[q.id] ?? null : null,
        timeSpentMs: null,
      }));

      const res = await submitOneShot({
        quizId: String(id),
        answers: payloadAnswers,
      });

      const data = res?.data || res;
      const attemptId = data?.id || data?.attemptId || data?.attempt?.id;

      // ✅ Khuyến nghị: chuyển sang trang review để xem đáp án/giải thích
      if (attemptId) {
        router.push(`/account/attempts/${attemptId}`);
      } else {
        // fallback nếu server chưa trả id rõ ràng
        router.push(`/account`);
      }
    } catch (e) {
      console.error("Submit failed:", e);
      setWarningMessage("Nộp bài thất bại. Vui lòng thử lại.");
      setWarningDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="container mx-auto p-6">Đang tải đề thi...</div>;
  if (error)
    return <div className="container mx-auto p-6 text-red-600">{error}</div>;
  if (!quiz) {
    return (
      <div className="container mx-auto p-6 text-red-600">
        Không tìm thấy đề thi.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">{quiz.description}</p>
          <div className="text-xs mt-2 inline-flex gap-2">
            <span className="px-2 py-1 border rounded">
              {quiz.quizTypeName}
            </span>
            <span className="px-2 py-1 border rounded">{quiz.skill}</span>
            {quiz.quizSectionName && (
              <span className="px-2 py-1 border rounded">
                {quiz.quizSectionName}
              </span>
            )}
          </div>
        </div>

        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={onSubmit}
        >
          Nộp bài
        </button>
      </div>

      {/* Passage (contextText) hiển thị 1 lần */}
      {quiz.contextText && (
        <article
          className="prose max-w-none ql-content border rounded p-4 bg-gray-50"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(quiz.contextText) }}
        />
      )}

      {/* Vùng làm bài */}
      <>
        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Câu {Math.min(index + 1, total)}/{total}
          </div>
          <div className="space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => go(-1)}
              disabled={index === 0}
            >
              ← Trước
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => go(1)}
              disabled={index >= total - 1}
            >
              Tiếp theo →
            </button>
          </div>
        </div>

        {/* Question */}
        {current && (
          <>
            <article
              className="prose max-w-none ql-content border rounded p-4"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(current.content || ""),
              }}
            />

            {/* Options / Text answer */}
            {isMCQ(current) ? (
              <div className="space-y-2">
                {(current.options || [])
                  .slice()
                  .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                  .map((op) => {
                    const checked = answers[current.id] === op.id;
                    return (
                      <label
                        key={op.id}
                        className={`flex items-center gap-3 border rounded p-3 cursor-pointer transition-colors ${
                          checked
                            ? "border-blue-500 bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${current.id}`}
                          checked={checked}
                          onChange={() => onChoose(current.id, op.id)}
                          className="w-4 h-4"
                        />
                        <span>{op.content}</span>
                      </label>
                    );
                  })}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  className="w-full min-h-[140px] border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập câu trả lời của bạn..."
                  value={answers[current.id] || ""}
                  onChange={(e) => onChoose(current.id, e.target.value)}
                />
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            {answered} / {total} câu đã trả lời
          </div>
          <div className="space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => go(-1)}
              disabled={index === 0}
            >
              ← Trước
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => go(1)}
              disabled={index >= total - 1}
            >
              Tiếp theo →
            </button>
          </div>
        </div>
      </>

      {/* Warning dialog - chỉ hiển thị thông báo */}
      <AlertDialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thông báo</AlertDialogTitle>
            <AlertDialogDescription>
              {warningMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setWarningDialogOpen(false)}>
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}