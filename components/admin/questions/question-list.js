import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

export default function QuestionList({ 
  questions, 
  quizId, 
  loading, 
  error, 
  page, 
  totalPages, 
  onPageChange, 
  onDelete, 
  onAddNew 
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
        <span className="ml-3 text-sm text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-3">Chưa có câu hỏi nào</p>
        <Button onClick={onAddNew}>
          + Tạo câu hỏi đầu tiên
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((q, idx) => (
        <div
          key={q.id || idx}
          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                Câu {q.orderIndex ?? idx + 1}
              </span>
              {q.type && (
                <span className="text-xs text-gray-500 capitalize">
                  {q.type}
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              <Link href={`/admin/questions/${q.id}?quizId=${quizId}`}>
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                  Sửa
                </Button>
              </Link>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(q)}
                className="h-7 px-2 text-xs"
              >
                Xóa
              </Button>
            </div>
          </div>

          {q.content ? (
            <div
              className="prose prose-sm max-w-none mt-2 border-l-2 border-gray-300 pl-3"
              dangerouslySetInnerHTML={{ __html: q.content }}
            />
          ) : (
            <div className="text-sm text-gray-400 mt-2 italic">
              — Không có nội dung hiển thị —
            </div>
          )}

          {q.options && q.options.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-600 mb-2">
                Các lựa chọn:
              </div>
              <ul className="space-y-1">
                {q.options
                  .sort((a, b) => (a.orderIndex || 1) - (b.orderIndex || 1))
                  .map((opt, i) => (
                    <li
                      key={opt.id || i}
                      className={`text-sm flex items-start gap-2 p-2 rounded ${
                        opt.correct
                          ? "font-medium text-green-800 bg-green-50 border-l-2 border-green-500"
                          : "text-gray-700 bg-gray-50"
                      }`}
                    >
                      <span className={`shrink-0 font-medium ${opt.correct ? "text-green-600" : "text-gray-500"}`}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span className="flex-1">{opt.content}</span>
                      {opt.correct && (
                        <span className="shrink-0 text-green-600 font-bold">✓</span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="pt-4 border-t">
          <Pagination
            currentPage={Math.max(0, page - 1)}
            totalPages={totalPages}
            onPageChange={(p) => onPageChange(p + 1)}
          />
        </div>
      )}
    </div>
  );
}
