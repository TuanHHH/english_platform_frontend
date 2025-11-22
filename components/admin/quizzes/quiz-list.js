import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function QuizList({
  items,
  loading,
  onDelete,
  onStatusChange,
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="space-y-1 flex-1">
              <Skeleton className="h-6 w-80" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-8 w-[140px]" />
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
      {items.map((q) => {
        const t = q.quizTypeName || q.quizType?.name || q.quizTypeCode || "";
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
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(q)}
              >
                Xóa
              </Button>
              <Button variant="secondary" asChild>
                <a href={`/admin/quizzes/${q.id}/questions`}>Câu hỏi</a>
              </Button>
              <Select
                value={q.status}
                onValueChange={(v) => onStatusChange(q.id, v)}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
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
  );
}
