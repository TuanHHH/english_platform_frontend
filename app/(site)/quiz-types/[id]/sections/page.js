"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { listPublicQuizSectionsByType } from "@/lib/api/quiz/quiz-section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SKILLS = ["LISTENING", "READING", "SPEAKING", "WRITING"];

export default function SiteQuizTypeSectionsPage() {
  const params = useParams();
  const quizTypeId = params?.id?.toString();
  const [sections, setSections] = useState([]);
  const [activeSkill, setActiveSkill] = useState("LISTENING");
  const [loading, setLoading] = useState(false);

  const load = async (typeId, skill) => {
    if (!typeId || !skill) return;
    setLoading(true);
    try {
      const data = await listPublicQuizSectionsByType(typeId, { skill });
      const items = Array.isArray(data)
        ? data
        : data?.data || data?.result || [];
      setSections(items || []);
    } catch (e) {
      console.error("Error loading quiz sections:", e);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizTypeId) {
      load(quizTypeId, activeSkill);
    }
  }, [quizTypeId, activeSkill]);

  const capitalize = (s) => s.charAt(0) + s.slice(1).toLowerCase();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Chọn kỹ năng</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
        {SKILLS.map((s) => (
          <Button
            key={s}
            variant={activeSkill === s ? "default" : "outline"}
            onClick={() => setActiveSkill(s)}
          >
            {capitalize(s)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-xl p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          Chưa có bài thi nào cho kỹ năng này
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => (
            <Link
              key={sec.id}
              href={`/quiz-sections/${sec.id}/quizzes`}
              className="block border rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="text-sm text-muted-foreground">
                {capitalize(sec.skill || "")}
              </div>
              <div className="text-lg font-semibold">{sec.name}</div>
              {sec.description && (
                <div className="text-sm mt-1">{sec.description}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
