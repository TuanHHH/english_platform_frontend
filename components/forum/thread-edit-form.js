"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { forumListCategories, appUpdateThread, forumGetThreadBySlug } from "@/lib/api/forum";
import Editor from "@/components/content/editor";
import { useAuthStore } from "@/store/auth-store";

export default function ThreadEditForm({ slug }) {
  const router = useRouter();

  const [cats, setCats] = useState([]);
  const [title, setTitle] = useState("");
  const [bodyMd, setBodyMd] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [threadId, setThreadId] = useState(null);

  const [noPermission, setNoPermission] = useState(false);

  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    async function init() {
      try {
        const [catsData, threadData] = await Promise.all([
          forumListCategories(),
          forumGetThreadBySlug(slug),
        ]);

        if (threadData) {
          if (!user) {
            setNoPermission(true);
            return;
          }

          if (String(threadData.authorId) !== String(user.id)) {
            setNoPermission(true);
            return;
          }

          setThreadId(threadData.id);
          setTitle(threadData.title);
          setBodyMd(threadData.bodyMd);
          setCategoryIds(threadData.categories?.map((c) => c.id) || []);
        }

        setCats(catsData);
      } catch (e) {
        console.error(e);
        toast.error("Không thể tải thông tin bài viết");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [slug, user, hasHydrated]);

  function toggleCat(id) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function submit() {
    if (!title.trim() || !bodyMd.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await appUpdateThread(threadId, {
        title,
        bodyMd,
        categoryIds,
      });
      toast.success("Cập nhật bài viết thành công!");
      router.push(`/forum/${data.slug}`);
    } catch (e) {
      console.error(e);
      toast.error("Cập nhật thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div>Đang tải dữ liệu...</div>;

  if (noPermission) {
    return (
      <Card className="p-6 border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">
            Bạn không có quyền chỉnh sửa bài viết này
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 mb-4">
            Chỉ tác giả bài viết mới có thể chỉnh sửa nội dung.
          </p>
          <Button onClick={() => router.push(`/forum/${slug}`)}>
            Quay lại bài viết
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chỉnh sửa chủ đề</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Tiêu đề <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="Nhập tiêu đề chủ đề..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Danh mục</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cats.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  checked={categoryIds.includes(c.id)}
                  onChange={() => toggleCat(c.id)}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nội dung <span className="text-destructive">*</span>
          </label>
          <Editor
            key={loading ? "loading" : "loaded"}
            initialContent={bodyMd}
            onContentChange={setBodyMd}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => router.back()} disabled={submitting}>
            Hủy
          </Button>
          <Button
            onClick={submit}
            disabled={submitting || !title.trim() || !bodyMd.trim()}
          >
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}