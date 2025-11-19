"use client";
import { toast } from 'sonner';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { forumListCategories } from "@/lib/api/forum";
import { appCreateThread } from "@/lib/api/forum";
import Editor from "@/components/content/editor";

export default function ThreadCreateForm() {
  const router = useRouter();
  const [cats, setCats] = useState([]);
  const [title, setTitle] = useState("");
  const [bodyMd, setBodyMd] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    forumListCategories().then(setCats);
  }, []);

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
    setLoading(true);
    try {
      const data = await appCreateThread(
        { title, bodyMd, categoryIds },
      );
      // BE trả về { id, slug, ... }
      if (data?.slug) {
        router.push(`/forum/${data.slug}`);
      } else {
        router.push("/forum");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo chủ đề mới</CardTitle>
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
          <p className="text-xs text-muted-foreground">
            {title.length}/200 ký tự
          </p>
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
            {cats.length === 0 && (
              <span className="text-xs text-muted-foreground col-span-full">
                Chưa có danh mục forum.
              </span>
            )}
          </div>
          {categoryIds.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Đã chọn {categoryIds.length} danh mục
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nội dung <span className="text-destructive">*</span>
          </label>
          <Editor initialContent="" onContentChange={setBodyMd} />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/forum")}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button onClick={submit} disabled={loading || !title.trim() || !bodyMd.trim()}>
            {loading ? "Đang tạo..." : "Tạo chủ đề"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
