"use client";

import { useMemo } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function AttemptAnswersView({ data }) {
  if (!data) return null;

  const {
    quizName,
    quizType,
    quizSection,
    skill,
    status,
    totalQuestions,
    totalCorrect,
    score,
    maxScore,
    startedAt,
    submittedAt,
    contextText,
    explanation,
    answers,
  } = data;

  const pct = useMemo(() => {
    if (!score || !maxScore) return "-";
    return Math.round((score / maxScore) * 100) + "%";
  }, [score, maxScore]);

  const fmt = (iso) => {
    try {
      return iso ? new Date(iso).toLocaleString("vi-VN") : "";
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">{quizName}</h1>
            <p className="text-sm text-muted-foreground">
              {quizType} • {quizSection} • {skill}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded bg-gray-100 px-2 py-1">{status}</span>
            <span className="rounded bg-gray-100 px-2 py-1">
              {totalCorrect ?? "-"} / {totalQuestions ?? "-"}
            </span>
            <span className="rounded bg-gray-100 px-2 py-1">{pct}</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          <div>Bắt đầu: {fmt(startedAt)}</div>
          <div>Nộp bài: {fmt(submittedAt)}</div>
        </div>
      </div>

      {/* Context Text for entire attempt */}
      {contextText && (
        <div
          className="rounded-lg border bg-white p-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: contextText }}
        />
      )}

      {/* Explanation for entire attempt */}
      {explanation && (
        <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900 whitespace-pre-wrap">
          <div className="mb-1 font-medium">Giải thích</div>
          {explanation}
        </div>
      )}

      {/* Answers */}
      <div className="space-y-4">
        {answers?.map((a, idx) => (
          <div
            key={a.questionId || idx}
            className="rounded-lg border bg-white p-4"
          >
            {/* Title + Icon */}
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="text-sm">
                <div className="font-medium">Câu {a.orderIndex ?? idx + 1}</div>
                <div className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {a.questionContent}
                </div>
              </div>
              {a.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>

            {/* Options */}
            {Array.isArray(a.options) && a.options.length > 0 && (
              <div className="mt-3 text-sm">
                <div className="text-muted-foreground">Đáp án</div>
                <ul className="mt-1 space-y-2">
                  {a.options.map((o) => {
                    const isSelected = !!o.selected;
                    const isCorrect = !!o.correct;

                    return (
                      <li
                        key={o.id}
                        className={[
                          "rounded border px-3 py-2",
                          isCorrect
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200 bg-gray-50",
                          isSelected ? "ring-2 ring-blue-400" : "",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-gray-900">{o.content}</div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {isCorrect ? "Đáp án đúng" : "Đáp án khác"}
                              {isSelected ? " • Bạn đã chọn" : ""}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
