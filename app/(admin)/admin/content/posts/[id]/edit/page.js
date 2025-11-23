"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PostForm from "@/components/content/post-form";
import { listCategories } from "@/lib/api/content/categories";
import { adminGetPost, adminUpdatePost } from "@/lib/api/content/posts";
import { useParams, useRouter } from "next/navigation";

export default function AdminPostEditPage() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [initial, setInitial] = useState(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await listCategories();

      if (res.success) {
        const data = res.data;
        const catsContent = Array.isArray(data?.result) 
          ? data.result 
          : Array.isArray(data?.content) 
          ? data.content 
          : Array.isArray(data) 
          ? data 
          : [];
        setCategories(catsContent);
      }

      const postRes = await adminGetPost(id);
      if (postRes.success) {
        setInitial(postRes.data);
      }
    })();
  }, [id]);

  async function update(payload) {
    setSaving(true);
    try {
      const res = await adminUpdatePost(id, payload);
      if (res.success) {
        router.push("/admin/content/posts");
      } else {
        toast.error(res.error || "Cập nhật bài viết thất bại");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!initial)
    return (
      <div className="flex">
        {/* <AdminSidebar /> */}
        <div className="p-4">Đang tải...</div>
      </div>
    );

  return (
    <div className="flex">
      {/* <AdminSidebar /> */}
      <div className="p-4 w-full space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Sửa bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm
              initial={initial}
              categories={categories}
              onSubmit={update}
              submitting={saving}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
