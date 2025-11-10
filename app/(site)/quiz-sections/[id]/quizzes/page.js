"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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

  // ✅ luôn không lỗi
  const { meta = {}, result: items = [] } = data || {};

  useEffect(() => {
    if (!sectionId) return;
    (async () => {
      const res = await listPublishedBySection(sectionId, { page, pageSize });
      setData(res.data);
    })();
  }, [sectionId, page]);

  useEffect(() => {
    if (page === pageParam) return;

    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(page));

    router.replace(`?${sp.toString()}`);
  }, [page, pageParam, router, searchParams]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Quizzes</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length > 0 &&
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

        {items.length === 0 && (
          <div className="text-muted-foreground">No quizzes</div>
        )}
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={meta.page || 1} // ✅ Đổi từ 'page' sang 'currentPage'
          totalPages={meta.pages || 0}
          onPageChange={setPage} // ✅ Đổi từ 'onChange' sang 'onPageChange'
        />
      </div>
    </div>
  );
}
