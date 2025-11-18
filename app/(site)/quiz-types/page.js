"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { listQuizTypes } from "@/lib/api/quiz/quiz-type";

export default function QuizTypes() {
  const [quizTypes, setQuizTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async()=>{
      try {
        const r = await listQuizTypes();
        setQuizTypes(r?.data || r || []);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="border border-muted/50">
              <CardHeader>
                <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-3 mb-6">
        <h1 className="text-2xl font-semibold">Các loại bài thi</h1>
        <p className="text-muted-foreground max-w-3xl">
          Chọn loại bài thi phù hợp với mục tiêu của bạn. Chúng tôi cung cấp đa dạng các loại đề thi 
          từ IELTS, TOEIC đến các bài kiểm tra tiếng Anh cơ bản, giúp bạn luyện tập và đánh giá năng lực một cách toàn diện.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quizTypes.map((qt) => (
          <Link key={qt.id} href={`/quiz-types/${qt.id}/sections`} className="h-full">
            <Card className="h-full cursor-pointer hover:shadow-lg transition-all border border-muted/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold">{qt.name}</CardTitle>
                {qt.description && <p className="text-sm text-muted-foreground">{qt.description}</p>}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
