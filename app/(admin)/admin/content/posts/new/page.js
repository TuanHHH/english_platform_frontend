"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PostForm from "@/components/content/post-form";
import { listCategories } from "@/lib/api/content/categories";
import { adminCreatePost } from "@/lib/api/content/posts";
import { useRouter } from "next/navigation";

export default function AdminPostNewPage() {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await listCategories();
      if (res.success) {
        const data = res.data;
        const content = Array.isArray(data?.result) 
          ? data.result 
          : Array.isArray(data?.content) 
          ? data.content 
          : Array.isArray(data) 
          ? data 
          : [];
        setCategories(content);
      }
    })();
  }, []);

  async function create(payload) {
    setSaving(true);
    try {
      const res = await adminCreatePost(payload);
      if (res.success) {
        router.push("/admin/content/posts");
      } else {
        toast.error(res.error || "Tạo bài viết thất bại");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex">
      {/* <AdminSidebar /> */}
      <div className="p-4 w-full space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tạo bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm
              categories={categories}
              onSubmit={create}
              submitting={saving}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
