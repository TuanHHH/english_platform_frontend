"use client";

import { memo, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import QuizActionsMenu from "./quiz-actions-menu";

const QuizItem = memo(({ quiz, onDelete, onStatusChange }) => {
  const t = quiz.quizTypeName || quiz.quizType?.name || quiz.quizTypeCode || "";
  const sec = quiz.quizSectionName || quiz.quizSection?.name || "";
  const sk = quiz.skill || quiz.quizSection?.skill || "";
  const statusText = quiz.status || quiz.quizStatus || "";

  const handleDelete = useCallback(() => onDelete(quiz), [quiz, onDelete]);
  const handleStatusChange = useCallback((v) => onStatusChange(quiz.id, v), [quiz.id, onStatusChange]);

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="space-y-1">
        <div className="font-semibold">
          {quiz.title || quiz.name || quiz.id}
        </div>
        <div className="text-sm text-muted-foreground">
          {[t, statusText, sk && (sec ? `${sk} • ${sec}` : sk)]
            .filter(Boolean)
            .join(" • ")}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Select value={quiz.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">DRAFT</SelectItem>
            <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
            <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
          </SelectContent>
        </Select>
        <QuizActionsMenu quizId={quiz.id} onDelete={handleDelete} />
      </div>
    </div>
  );
});

QuizItem.displayName = "QuizItem";

export default function QuizList({ items, loading, onDelete, onStatusChange }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1 flex-1">
              <Skeleton className="h-6 w-80" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-[140px]" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <div>Không có dữ liệu</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((q) => (
        <QuizItem
          key={q.id}
          quiz={q}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
