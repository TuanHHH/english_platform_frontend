"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listPublishedBySection } from "@/lib/api/quiz/quiz";
import { Pagination } from "@/components/ui/pagination";

export default function SectionQuizzesPage() {
  const { id: sectionId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(pageParam);
  const pageSize = 12;

  const [data, setData] = useState({
    meta: { page: 1, pageSize: 12, pages: 0, total: 0 },
    result: [],
  });
  const [loading, setLoading] = useState(true);

  const { meta = {}, result: items = [] } = data || {};

  useEffect(() => {
    if (!sectionId) return;
    (async () => {
      setLoading(true);
      const res = await listPublishedBySection(sectionId, { page, pageSize });
      setData(res.data);
      setLoading(false);
    })();
  }, [sectionId, page]);

  useEffect(() => {
    if (page === pageParam) return;

    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(page));

    router.replace(`?${sp.toString()}`);
  }, [page, pageParam, router, searchParams]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Danh sách bài thi</h1>
        <p className="text-muted-foreground">
          Chọn bài thi phù hợp với trình độ và mục tiêu học tập của bạn. 
          Mỗi bài thi được thiết kế để giúp bạn rèn luyện và cải thiện kỹ năng tiếng Anh.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}

        {!loading && items.length > 0 &&
          items.map((q) => (
            <Link
              key={q.id}
              href={`/practice/${q.id}`}
              className="block border rounded-xl p-4 hover:shadow-md"
            >
              <div className="text-sm text-muted-foreground">
                {q.quizTypeName}
              </div>
              <div className="text-lg font-semibold">{q.title}</div>
            </Link>
          ))}

        {!loading && items.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-lg">Chưa có bài thi nào</p>
          </div>
        )}
      </div>

      {meta.pages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={meta.page || 1}
            totalPages={meta.pages || 0}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
