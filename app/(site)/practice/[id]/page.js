"use client";

import { useEffect, useMemo, useState, useRef, memo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Send, ArrowLeft } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { getPublicQuiz } from "@/lib/api/quiz/quiz";
import { submitOneShot } from "@/lib/api/attempt";
import SpeakingRecorder from "@/components/practice/speaking-recorder";

const ContextPassage = memo(({ contextText }) => {
  if (!contextText) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Đoạn văn</CardTitle>
      </CardHeader>
      <CardContent>
        <article
          className="prose prose-sm max-w-none ql-content"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(contextText) }}
        />
      </CardContent>
    </Card>
  );
});

ContextPassage.displayName = "ContextPassage";

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
  const isSpeaking = (q) => quiz?.skill?.toUpperCase() === "SPEAKING" && !isMCQ(q);

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

      if (res.success) {
        const data = res.data;
        const attemptId = data?.id || data?.attemptId || data?.attempt?.id;

        if (attemptId) {
          router.push(`/account/attempts/${attemptId}`);
        } else {
          router.push(`/account`);
        }
      } else {
        setWarningMessage(res.error || "Nộp bài thất bại. Vui lòng thử lại.");
        setWarningDialogOpen(true);
      }
    } catch (e) {
      console.error("Submit failed:", e);
      setWarningMessage("Nộp bài thất bại. Vui lòng thử lại.");
      setWarningDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl p-4 sm:p-6 space-y-6">
        <Skeleton className="h-9 w-28" />
        
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded" />
                  <Skeleton className="h-6 w-20 rounded" />
                  <Skeleton className="h-6 w-28 rounded" />
                </div>
              </div>
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl p-4 sm:p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <p className="text-destructive text-lg font-medium">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.back()}
              >
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto max-w-5xl p-4 sm:p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Không tìm thấy đề thi.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.back()}
              >
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      {/* Header */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              {quiz.description && (
                <p className="text-sm text-muted-foreground">{quiz.description}</p>
              )}
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Hướng dẫn làm bài:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                  <li>Đọc kỹ câu hỏi và chọn đáp án phù hợp nhất</li>
                  <li>Sử dụng nút "Trước" và "Tiếp theo" để di chuyển giữa các câu</li>
                  <li>Nhấn "Nộp bài" khi hoàn thành để xem kết quả</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                {quiz.quizTypeName && (
                  <Badge variant="secondary">{quiz.quizTypeName}</Badge>
                )}
                {quiz.skill && <Badge variant="outline">{quiz.skill}</Badge>}
                {quiz.quizSectionName && (
                  <Badge variant="outline">{quiz.quizSectionName}</Badge>
                )}
              </div>
            </div>

            <Button onClick={onSubmit} size="lg">
              <Send className="mr-2 h-4 w-4" />
              Nộp bài
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Passage (contextText) hiển thị 1 lần */}
      <ContextPassage contextText={quiz.contextText} />

      {/* Vùng làm bài */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="default" className="text-base py-1 px-3">
                Câu {Math.min(index + 1, total)}/{total}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Đã trả lời: {answered}/{total}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => go(-1)}
                disabled={index === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => go(1)}
                disabled={index >= total - 1}
              >
                Tiếp theo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question */}
          {current && (
            <>
              <article
                className="prose prose-sm max-w-none ql-content"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(current.content || ""),
                }}
              />

              {/* Options / Text answer */}
              {isMCQ(current) ? (
                <div className="space-y-3">
                  {(current.options || [])
                    .slice()
                    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                    .map((op) => {
                      const checked = answers[current.id] === op.id;
                      return (
                        <label
                          key={op.id}
                          className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
                            checked
                              ? "border-primary bg-primary/5 ring-2 ring-primary"
                              : "hover:bg-muted/50 hover:border-muted-foreground/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${current.id}`}
                            checked={checked}
                            onChange={() => onChoose(current.id, op.id)}
                            className="w-4 h-4 mt-1"
                          />
                          <span className="text-sm flex-1">{op.content}</span>
                        </label>
                      );
                    })}
                </div>
              ) : isSpeaking(current) ? (
                <SpeakingRecorder questionId={current.id} onAnswer={onChoose} />
              ) : (
                <div>
                  <textarea
                    className="w-full min-h-[140px] border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Nhập câu trả lời của bạn..."
                    value={answers[current.id] || ""}
                    onChange={(e) => onChoose(current.id, e.target.value)}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

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
            {warningMessage.includes("Vẫn nộp bài") ? (
              <>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Nộp bài</AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction onClick={() => setWarningDialogOpen(false)}>
                Đồng ý
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}