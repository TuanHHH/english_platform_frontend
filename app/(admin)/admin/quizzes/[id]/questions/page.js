"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import Editor from "@/components/content/editor";
import Link from "next/link";
import { getQuiz, updateQuiz } from "@/lib/api/quiz/quiz";
import { listQuestionsByQuiz, deleteQuestion } from "@/lib/api/quiz/question";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const MediaManager = dynamic(() => import("@/components/media/media-manager"), {
  ssr: false,
});

export default function QuizQuestionsWithContextPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id || "unknown";
  const folderPath = `forums/${quizId}/media`;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [contextText, setContextText] = useState("");
  const [quizTitle, setQuizTitle] = useState("");

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Tính toán orderIndex cao nhất
  const maxOrderIndex = useMemo(() => {
    if (!questions || questions.length === 0) return 0;
    return Math.max(...questions.map((q) => q.orderIndex ?? 1));
  }, [questions]);

  async function loadAll(p = page) {
    try {
      setLoading(true);
      setError(null);
      // 1) quiz detail
      const q = await getQuiz(quizId);
      const qd = q?.data || q;
      setQuizTitle(qd?.title || "Quiz");
      setContextText(qd?.contextText || "");

      // 2) questions
      const r = await listQuestionsByQuiz(quizId, { page: p, pageSize: 20 });
      const data = r?.data || r;
      setQuestions(data?.result || data?.items || []);
      const tp = data?.meta?.pages || data?.totalPages || 1;
      setTotalPages(tp);
      setPage(data?.meta?.page || p);
    } catch (e) {
      setError(e?.message || "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (quizId) loadAll(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  async function saveContext() {
    try {
      setSaving(true);
      await updateQuiz(quizId, { contextText });
      toast.success("Đã lưu đoạn văn/ngữ cảnh (contextText).");
    } catch (e) {
      toast.error(e?.message || "Lỗi khi lưu contextText");
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteQuestion(id) {
    if (!confirm("Xóa câu hỏi này?")) return;
    try {
      await deleteQuestion(id);
      toast.success("Đã xóa câu hỏi.");
      loadAll(page);
    } catch (e) {
      toast.error(e?.message || "Không xóa được câu hỏi.");
    }
  }

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">
          Quản lý Media & Câu hỏi cho Quiz
        </h1>
        <p className="text-sm text-gray-500">
          Quiz ID:{" "}
          <code className="px-2 py-1 bg-gray-100 rounded">{quizId}</code>
        </p>
      </div>

      {/* Media Manager Section - Collapsible */}
      <MediaManager folder={folderPath} />

      <main className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Câu hỏi • {quizTitle}</h2>
          <div className="flex gap-2">
            <Link href="/admin/quizzes">
              <Button variant="outline">Quay lại</Button>
            </Link>
            {/* Truyền nextOrderIndex qua URL */}
            <Link
              href={`/admin/questions/new?quizId=${quizId}&nextOrderIndex=${
                maxOrderIndex + 1
              }`}
            >
              <Button>+ Thêm câu hỏi</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: ContextText with Editor.js */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Đoạn văn/Ngữ cảnh chung (contextText)</CardTitle>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  S3 Upload Enabled
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <span className="ml-3 text-gray-600">Đang tải...</span>
                </div>
              ) : (
                <>
                  {/* Editor với S3 Upload */}
                  <Editor
                    initialContent={contextText}
                    onContentChange={setContextText}
                    useServerUpload={true}
                    uploadFolder={folderPath}
                  />

                  <div className="mt-4 flex gap-2">
                    <Button onClick={saveContext} disabled={saving}>
                      {saving ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Đang lưu...
                        </>
                      ) : (
                        "💾 Lưu contextText"
                      )}
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 font-medium mb-1">
                      ℹ️ Hướng dẫn sử dụng Editor:
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                      <li>
                        <strong>Ảnh:</strong> Click nút Image → Chọn file → Tự
                        động upload lên S3
                      </li>
                      <li>
                        <strong>Audio:</strong> Click nút 🎵 → Chọn file audio →
                        Upload lên S3
                      </li>
                      <li>
                        <strong>Resize ảnh:</strong> Click vào ảnh đã chèn →
                        Chọn kích thước hoặc căn lề
                      </li>
                      <li>
                        <strong>Media:</strong> Tất cả file được lưu vào folder:{" "}
                        <code className="bg-blue-100 px-1 rounded">
                          {folderPath}
                        </code>
                      </li>
                    </ul>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3 italic">
                    * Editor sử dụng AWS S3 để lưu trữ media, đảm bảo hiệu suất
                    và khả năng mở rộng tốt.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* RIGHT: Questions list */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách câu hỏi</CardTitle>
                <span className="text-xs text-gray-600">
                  {questions?.length || 0} câu hỏi
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <span className="ml-3 text-gray-600">Đang tải...</span>
                </div>
              ) : error ? (
                <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
                  ❌ {error}
                </div>
              ) : !questions || questions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <div className="text-gray-500 italic">Chưa có câu hỏi.</div>
                  <Link
                    href={`/admin/questions/new?quizId=${quizId}&nextOrderIndex=1`}
                    className="inline-block mt-4"
                  >
                    <Button>+ Tạo câu hỏi đầu tiên</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
                            Câu {q.orderIndex ?? idx + 1}
                          </span>
                          {q.type && (
                            <span className="text-xs text-gray-500 capitalize">
                              {q.type}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/questions/${q.id}?quizId=${quizId}`}
                          >
                            <Button size="sm" variant="outline">
                              ✏️ Sửa
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDeleteQuestion(q.id)}
                          >
                            🗑️ Xóa
                          </Button>
                        </div>
                      </div>

                      {/* Render question stem/preview (HTML) if available */}
                      {q.content ? (
                        <div
                          className="prose prose-sm max-w-none mt-2 border-l-2 border-gray-200 pl-3"
                          dangerouslySetInnerHTML={{ __html: q.content }}
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground mt-2 italic">
                          — Không có nội dung hiển thị —
                        </div>
                      )}

                      {/* Render options */}
                      {q.options && q.options.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs font-medium text-gray-600 mb-2">
                            Các lựa chọn:
                          </div>
                          <ul className="space-y-1">
                            {q.options
                              .sort(
                                (a, b) =>
                                  (a.orderIndex || 1) - (b.orderIndex || 1)
                              )
                              .map((opt, i) => (
                                <li
                                  key={opt.id || i}
                                  className={`text-sm flex items-start gap-2 ${
                                    opt.correct
                                      ? "font-medium text-green-700 bg-green-50 p-2 rounded"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <span className="text-gray-400 flex-shrink-0">
                                    {String.fromCharCode(65 + i)}.
                                  </span>
                                  <span className="flex-1">{opt.content}</span>
                                  {opt.correct && (
                                    <span className="flex-shrink-0">✅</span>
                                  )}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pt-4 border-t">
                      <Pagination
                        currentPage={Math.max(0, page - 1)}
                        totalPages={totalPages}
                        onPageChange={(p) => {
                          setPage(p + 1);
                          loadAll(p + 1);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
