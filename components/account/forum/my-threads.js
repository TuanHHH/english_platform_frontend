"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import ThreadListFilters from "@/components/forum/thread-list-filters";
import { appForumMyThreads, forumListCategories } from "@/lib/api/forum/forum";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyForumThreads() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 0 });
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [cats, setCats] = useState([]);
  const pageSize = 20;

  async function load(p = page, f = filters) {
    const { items, meta } = await appForumMyThreads({ ...f, page: p + 1, pageSize });
    setItems(items);
    setMeta(meta);
  }

  useEffect(() => { forumListCategories().then(setCats); }, []);
  useEffect(() => { setPage(0); }, [JSON.stringify(filters)]);
  useEffect(() => { load(page, filters); }, [page, filters]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bài viết diễn đàn của tôi</h2>
        <Link href="/forum/new">
          <Button>Tạo chủ đề</Button>
        </Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Bộ lọc</CardTitle></CardHeader>
        <CardContent>
          <ThreadListFilters categories={cats} onChange={setFilters} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Chủ đề của tôi</CardTitle>
          <Pagination currentPage={page} totalPages={meta?.pages ?? 0} onPageChange={(p)=>setPage(p)} />
        </CardHeader>
        <CardContent className="grid gap-2">
          {items.map(t => (
            <Link key={t.id} href={`/forum/${t.slug}`} className="border rounded-md p-3 hover:bg-muted/40">
              <div className="font-medium">{t.title}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <img src={t.authorAvatarUrl || "/avatar.svg"} className="w-5 h-5 rounded-full object-cover" alt=""/>
                <span>{t.authorName || "Bạn"}</span>
                <span>•</span>
                <span>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ""}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {t.replyCount} trả lời • {t.viewCount} lượt xem • {t.locked ? "Đã khóa" : "Đang mở"}
              </div>
            </Link>
          ))}
          {items.length === 0 && <div className="text-sm text-muted-foreground">Bạn chưa đăng chủ đề nào.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
