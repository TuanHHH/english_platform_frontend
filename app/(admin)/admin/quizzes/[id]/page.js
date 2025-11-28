"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { listQuizTypes } from "@/lib/api/quiz/quiz-type";
import {
  getQuiz,
  updateQuizWithSection,
  createQuizWithSection,
} from "@/lib/api/quiz/quiz";
import { pageQuizSectionsByType } from "@/lib/api/quiz/quiz-section";
import { toast } from "sonner";
import { quizCreateSchema } from "@/schema/quiz";

// Import Component Editor
import ContextEditor from "@/components/admin/questions/context-editor";

// Import MediaManager (Dynamic)
const MediaManager = dynamic(() => import("@/components/media/media-manager"), {
  ssr: false,
});

const SKILLS = ["LISTENING", "READING", "SPEAKING", "WRITING"];
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function AdminQuizEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const isNew = id === "new";

  // Xác định đường dẫn folder media
  const folderPath = useMemo(() => {
    return isNew ? null : `quiz/${id}/media`;
  }, [id, isNew]);

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(quizCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      quizTypeId: "none",
      skill: "READING",
      status: "DRAFT",
      contextText: "",
      quizSectionId: null,
    },
  });

  const watchQuizTypeId = watch("quizTypeId");
  const watchSkill = watch("skill");
  const watchQuizSectionId = watch("quizSectionId");

  // Load Types + existing Quiz
  useEffect(() => {
    (async () => {
      try {
        const t = await listQuizTypes();
        const typesList = t?.data?.result || t?.data || t || [];
        setTypes(Array.isArray(typesList) ? typesList : []);

        if (!isNew) {
          const q = await getQuiz(id);
          const d = q?.data || q;

          reset({
            title: d.title || "",
            description: d.description || "",
            quizTypeId: d.quizTypeId ? String(d.quizTypeId) : "none",
            skill: d.skill || "READING",
            status: d.status || "DRAFT",
            contextText: d.contextText || "",
            quizSectionId: d.quizSectionId ? String(d.quizSectionId) : null,
          });
        }
      } catch (e) {
        console.error(e);
        toast.error("Không tải được dữ liệu.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew, reset]);

  // Fetch sections when quizTypeId changes
  useEffect(() => {
    const typeId = watchQuizTypeId;
    if (!typeId || typeId === "none") {
      setSections([]);
      setValue("quizSectionId", null);
      return;
    }
    (async () => {
      try {
        const params = {
          page: 1,
          pageSize: 200,
        };
        const data = await pageQuizSectionsByType(String(typeId), params);
        const items =
          data?.result || data?.data?.result || data?.data || data || [];
        const list = Array.isArray(items) ? items : [];
        setSections(list);

        if (
          watchQuizSectionId &&
          !list.find((s) => String(s.id) === String(watchQuizSectionId))
        ) {
          setValue("quizSectionId", null);
        }
      } catch (e) {
        console.error("Failed to load sections", e);
        setSections([]);
        setValue("quizSectionId", null);
      }
    })();
  }, [watchQuizTypeId, setValue]);

  // Reset section if skill changes and current section doesn't match
  useEffect(() => {
    if (sections.length === 0) return;

    const filtered = sections.filter((s) => {
      const sk = String(s.skill || s.quizSkill || "").toUpperCase();
      return !watchSkill || sk === String(watchSkill).toUpperCase();
    });

    if (
      watchQuizSectionId &&
      !filtered.find((s) => String(s.id) === String(watchQuizSectionId))
    ) {
      setValue("quizSectionId", null);
    }
  }, [watchSkill, sections, watchQuizSectionId, setValue]);

  const onSubmit = async (data) => {
    try {
      const submitPayload = {
        title: data.title,
        description: data.description || "",
        quizTypeId: data.quizTypeId,
        skill: data.skill,
        status: data.status,
        contextText: data.contextText || "",
      };

      if (data.quizSectionId) {
        submitPayload.quizSectionId = data.quizSectionId;
      }

      if (isNew) {
        await createQuizWithSection(submitPayload);
      } else {
        await updateQuizWithSection(id, submitPayload);
      }

      toast.success("Đã lưu quiz thành công");
      router.push("/admin/quizzes");
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Lưu thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-6 text-muted-foreground">Đang tải...</main>
      </div>
    );
  }

  // Filter sections based on current skill
  const filteredSections = sections.filter((s) => {
    const sk = String(s.skill || s.quizSkill || "").toUpperCase();
    return !watchSkill || sk === String(watchSkill).toUpperCase();
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {isNew ? "Tạo Quiz" : "Sửa Quiz"}
          </h1>
          {/* Chỉ hiển thị tiêu đề, nút Quay lại đã bị xóa */}
        </div>

        {/* MEDIA MANAGER SECTION */}
        {!isNew && folderPath && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">
                Quản lý Media (Quiz ID: {id})
              </h2>
            </div>
            <div className="p-4">
              <MediaManager folder={folderPath} />
            </div>
          </div>
        )}

        {isNew && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
            Vui lòng tạo Quiz trước, sau đó bạn có thể tải lên hình ảnh/media.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Thông tin Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nhập tiêu đề quiz"
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Loại đề <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="quizTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        setValue("quizSectionId", null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại đề" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- Chọn loại đề --</SelectItem>
                        {types.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>
                            {t.name || t.code || t.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.quizTypeId && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.quizTypeId.message}
                  </p>
                )}
              </div>

              {/* Skill */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kỹ năng <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="skill"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kỹ năng" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILLS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.skill && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.skill.message}
                  </p>
                )}
              </div>

              {/* Section (filtered) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Chọn Section
                  {watchQuizTypeId === "none" && (
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      (Chọn loại đề trước)
                    </span>
                  )}
                </label>
                <Controller
                  name="quizSectionId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || "none"}
                      onValueChange={(v) =>
                        field.onChange(v === "none" ? null : v)
                      }
                      disabled={
                        watchQuizTypeId === "none" ||
                        filteredSections.length === 0
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-- Không chọn --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- Không chọn --</SelectItem>
                        {filteredSections.map((s) => (
                          <SelectItem key={String(s.id)} value={String(s.id)}>
                            {(s.name || s.id) +
                              (s.skill
                                ? ` • ${s.skill}`
                                : s.quizSkill
                                ? ` • ${s.quizSkill}`
                                : "")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.quizSectionId && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.quizSectionId.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Nhập mô tả quiz"
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* ContextEditor */}
              <div className="md:col-span-2">
                <Controller
                  name="contextText"
                  control={control}
                  render={({ field }) => (
                    <ContextEditor
                      contextText={field.value}
                      onContextChange={field.onChange}
                      folderPath={folderPath}
                      saving={isSubmitting}
                    />
                  )}
                />
                {errors.contextText && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.contextText.message}
                  </p>
                )}
              </div>

              {/* Explanation */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Giải thích sau khi nộp
                </label>
                <Controller
                  name="explanation"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Nhập giải thích hoặc đáp án mẫu"
                    />
                  )}
                />
                {errors.explanation && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.explanation.message}
                  </p>
                )}
              </div>

              {/* Nút Submit DUY NHẤT */}
              <div className="md:col-span-2 mt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting
                    ? "Đang lưu..."
                    : isNew
                    ? "Tạo mới"
                    : "Cập nhật"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}