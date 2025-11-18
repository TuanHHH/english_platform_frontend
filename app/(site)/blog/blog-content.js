"use client";
import React, { useEffect, useState } from "react";
import { publicListPostsPaged } from "@/lib/api/content/posts";
import { listCategories } from "@/lib/api/content/categories";
import PostCard from "@/components/content/post-card";
import FiltersBar from "@/components/content/filters-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import useDebouncedValue from "@/hooks/use-debounced-value";

export default function BlogContent() {
  const [posts, setPosts] = useState([]);
  const [cats, setCats] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  // Debounce toàn bộ object filter (keyword, category, …) bằng stringify
  const filterKey = JSON.stringify(filters);
  const debouncedFilterKey = useDebouncedValue(filterKey, 1500);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalPages, setTotalPages] = useState(0);

  async function load(p = page, key = debouncedFilterKey) {
    setLoading(true);
    try {
      const parsedFilters = key ? JSON.parse(key) : {};
      const [catsData, paged] = await Promise.all([
        listCategories(),
        publicListPostsPaged({ ...parsedFilters, page: p, pageSize }),
      ]);
      setCats(catsData);
      setPosts(paged.items);
      setTotalPages(paged.meta?.pages ?? 0);
    } finally {
      setLoading(false);
    }
  }

  // Reset về trang 1 sau khi filter đã debounce xong
  useEffect(() => { setPage(1); }, [debouncedFilterKey]);

  // Gọi API khi page hoặc filter (đã debounce) thay đổi
  useEffect(() => { load(page, debouncedFilterKey); }, [page, debouncedFilterKey]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Bài viết</h1>

      <Card>
        <CardHeader><CardTitle>Bộ lọc</CardTitle></CardHeader>
        <CardContent>
          <FiltersBar categories={cats} onChange={setFilters} initial={filters} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Danh sách</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2 mb-4">
                {posts?.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage} 
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
