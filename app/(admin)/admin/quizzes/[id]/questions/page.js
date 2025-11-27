"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { getQuiz, updateQuiz } from "@/lib/api/quiz/quiz";
import { listQuestionsByQuiz, deleteQuestion, createQuestion, updateQuestion } from "@/lib/api/quiz/question";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import QuestionForm from "@/components/admin/questions/question-form";
import QuestionList from "@/components/admin/questions/question-list";

// Import lại ContextEditor cho contextText
import ContextEditor from "@/components/admin/questions/context-editor";

const MediaManager = dynamic(() => import("@/components/media/media-manager"), {
  ssr: false,
});

export default function QuizQuestionsWithContextPage() {
  const params = useParams();
  const quizId = params?.id || "unknown";
  const folderPath = `quiz/${quizId}/media`;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [contextText, setContextText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSkill, setQuizSkill] = useState("");

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);

  const maxOrderIndex = useMemo(() => {
    if (!questions || questions.length === 0) return 0;
    return Math.max(...questions.map((q) => q.orderIndex ?? 1));
  }, [questions]);

  async function loadAll(p = page) {
    try {
      setLoading(true);
      setError(null);
      const q = await getQuiz(quizId);
      const qd = q?.data || q;
      
      setQuizTitle(qd?.title || "Quiz");
      setContextText(qd?.contextText || "");
      setExplanation(qd?.explanation || ""); 
      setQuizSkill(qd?.skill || "");

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
  }, [quizId]);

  async function saveQuizContent() {
    try {
      setSaving(true);
      // Gọi API updateQuiz với payload gồm cả contextText và explanation
      await updateQuiz(quizId, { 
        contextText, 
        explanation 
      });
      toast.success("Đã lưu nội dung (Ngữ cảnh & Giải thích).");
    } catch (e) {
      toast.error(e?.message || "Lỗi khi lưu nội dung");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteDialog(question) {
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteQuestion() {
    if (!questionToDelete) return;
    const previousQuestions = [...questions];
    
    setQuestions(questions.filter(q => q.id !== questionToDelete.id));
    setDeleteDialogOpen(false);
    setQuestionToDelete(null);
    
    try {
      await deleteQuestion(questionToDelete.id);
      toast.success("Đã xóa câu hỏi.");
    } catch (e) {
      setQuestions(previousQuestions);
      toast.error(e?.message || "Không xóa được câu hỏi.");
    }
  }

  function openAddDialog() {
    setAddDialogOpen(true);
  }

  async function handleAddQuestion(data) {
    try {
      const existingQuestion = questions.find(q => q.orderIndex === Number(data.orderIndex));
      if (existingQuestion) {
        toast.error(`Thứ tự ${data.orderIndex} đã được sử dụng bởi câu hỏi khác`);
        return;
      }

      const payload = {
        quizId: data.quizId,
        content: data.content,
        explanation: data.explanation || "",
        orderIndex: Number(data.orderIndex),
      };

      const validOptions = data.options?.filter(o => o.content?.trim());
      if (validOptions && validOptions.length > 0) {
        payload.options = validOptions.map((o, i) => ({
          content: o.content,
          correct: !!o.correct,
          explanation: o.explanation || "",
          orderIndex: Number(o.orderIndex || i + 1),
        }));
      }

      await createQuestion(payload);
      toast.success("Đã tạo câu hỏi mới!");
      setAddDialogOpen(false);
      loadAll(page);
    } catch (e) {
      toast.error(e?.message || "Không thể tạo câu hỏi.");
    }
  }

  function openEditDialog(question) {
    setQuestionToEdit(question);
    setEditDialogOpen(true);
  }

  async function handleEditQuestion(data) {
    if (!questionToEdit) return;
    try {
      const existingQuestion = questions.find(
        q => q.orderIndex === Number(data.orderIndex) && q.id !== questionToEdit.id
      );
      if (existingQuestion) {
        toast.error(`Thứ tự ${data.orderIndex} đã được sử dụng bởi câu hỏi khác`);
        return;
      }

      const payload = {
        quizId: data.quizId,
        content: data.content,
        explanation: data.explanation || "",
        orderIndex: Number(data.orderIndex),
      };

      const validOptions = data.options?.filter(o => o.content?.trim());
      if (validOptions && validOptions.length > 0) {
        payload.options = validOptions.map((o, i) => ({
          content: o.content,
          correct: !!o.correct,
          explanation: o.explanation || "",
          orderIndex: Number(o.orderIndex || i + 1),
        }));
      }

      await updateQuestion(questionToEdit.id, payload);
      toast.success("Đã cập nhật câu hỏi!");
      setEditDialogOpen(false);
      setQuestionToEdit(null);
      loadAll(page);
    } catch (e) {
      toast.error(e?.message || "Không thể cập nhật câu hỏi.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {quizTitle}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">ID: {quizId}</span>
                {quizSkill && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{quizSkill}</span>
                  </>
                )}
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{questions?.length || 0} câu hỏi</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/quizzes">
                <Button variant="outline">Quay lại</Button>
              </Link>
              <Button onClick={openAddDialog}>+ Thêm câu hỏi</Button>
            </div>
          </div>
        </div>

        {/* Media Manager */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">Quản lý Media</h2>
          </div>
          <div className="p-4">
            <MediaManager folder={folderPath} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Context Editor & Explanation Textarea */}
          <div className="space-y-6">
            
            {/* 1. Context Editor (Editor) */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Ngữ cảnh / Bài đọc (Context)</h3>
                <ContextEditor
                    contextText={contextText}
                    onContextChange={setContextText}
                    onSave={saveQuizContent}
                    saving={saving}
                    loading={loading}
                    folderPath={folderPath}
                />
            </div>

            {/* 2. Explanation (Textarea) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Giải thích chi tiết (Explanation)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea 
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        rows={6}
                        placeholder="Nhập giải thích chi tiết cho toàn bộ quiz (hiển thị sau khi nộp bài)..."
                        className="bg-white"
                    />
                    <Button 
                        onClick={saveQuizContent} 
                        disabled={saving}
                        className="w-full"
                        variant="secondary"
                    >
                        {saving ? "Đang lưu..." : "Lưu giải thích"}
                    </Button>
                </CardContent>
            </Card>

          </div>

          {/* Right Column: Question List */}
          <Card className="border-gray-200 gap-2 h-fit">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-700">Danh sách câu hỏi</CardTitle>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                  {questions?.length || 0}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <QuestionList
                questions={questions}
                quizId={quizId}
                loading={loading}
                error={error}
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  loadAll(p);
                }}
                onDelete={openDeleteDialog}
                onAddNew={openAddDialog}
                onEdit={openEditDialog}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa câu hỏi{" "}
              <strong>
                #{questionToDelete?.orderIndex || ""}
              </strong>
              ? Hành động này không thể hoàn tác và sẽ xóa cả các đáp án liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteQuestion} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm câu hỏi mới</DialogTitle>
          </DialogHeader>
          <QuestionForm
            quizId={quizId}
            quizSkill={quizSkill}
            orderIndex={maxOrderIndex + 1}
            onSubmit={handleAddQuestion}
            onCancel={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) setQuestionToEdit(null);
      }}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sửa câu hỏi #{questionToEdit?.orderIndex}</DialogTitle>
          </DialogHeader>
          {questionToEdit && (
            <QuestionForm
              key={questionToEdit.id}
              quizId={quizId}
              quizSkill={quizSkill}
              orderIndex={questionToEdit.orderIndex}
              initialData={questionToEdit}
              isEditing={true}
              onSubmit={handleEditQuestion}
              onCancel={() => {
                setEditDialogOpen(false);
                setQuestionToEdit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}