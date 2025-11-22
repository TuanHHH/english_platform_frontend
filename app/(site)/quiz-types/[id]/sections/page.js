"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { listPublicQuizSectionsByType } from "@/lib/api/quiz/quiz-section";
import { listPublishedBySection } from "@/lib/api/quiz/quiz";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SKILLS = ["LISTENING", "READING", "SPEAKING", "WRITING"];

export default function SiteQuizTypeSectionsPage() {
  const params = useParams();
  const quizTypeId = params?.id?.toString();
  const [sections, setSections] = useState([]);
  const [activeSkill, setActiveSkill] = useState("LISTENING");
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [quizzes, setQuizzes] = useState({});
  const [loadingQuizzes, setLoadingQuizzes] = useState({});

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

  const loadQuizzes = async (sectionId) => {
    if (quizzes[sectionId]) return;
    
    setLoadingQuizzes(prev => ({ ...prev, [sectionId]: true }));
    try {
      const res = await listPublishedBySection(sectionId, { page: 1, pageSize: 100 });
      const items = res?.data?.result || [];
      setQuizzes(prev => ({ ...prev, [sectionId]: items }));
    } catch (e) {
      console.error("Error loading quizzes:", e);
      setQuizzes(prev => ({ ...prev, [sectionId]: [] }));
    } finally {
      setLoadingQuizzes(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const toggleSection = (sectionId) => {
    const isExpanded = expandedSections[sectionId];
    setExpandedSections(prev => ({ ...prev, [sectionId]: !isExpanded }));
    
    if (!isExpanded && !quizzes[sectionId]) {
      loadQuizzes(sectionId);
    }
  };

  useEffect(() => {
    if (quizTypeId) {
      load(quizTypeId, activeSkill);
      setExpandedSections({});
      setQuizzes({});
    }
  }, [quizTypeId, activeSkill]);

  const capitalize = (s) => s.charAt(0) + s.slice(1).toLowerCase();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Chọn kỹ năng luyện tập</h1>
        <p className="text-muted-foreground">
          Hãy chọn kỹ năng bạn muốn rèn luyện. Mỗi kỹ năng có các bài tập được thiết kế 
          để giúp bạn cải thiện từng khía cạnh của việc học tiếng Anh.
        </p>
      </div>

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
        <div className="space-y-3">
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
        <div className="space-y-3">
          {sections.map((sec) => {
            const isExpanded = expandedSections[sec.id];
            const sectionQuizzes = quizzes[sec.id] || [];
            const isLoadingQuizzes = loadingQuizzes[sec.id];

            return (
              <div key={sec.id} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full p-4 hover:bg-muted/50 transition flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">
                      {capitalize(sec.skill || "")}
                    </div>
                    <div className="text-lg font-semibold">{sec.name}</div>
                    {sec.description && (
                      <div className="text-sm mt-1 text-muted-foreground">{sec.description}</div>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t bg-muted/20 p-4">
                    {isLoadingQuizzes ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : sectionQuizzes.length === 0 ? (
                      <div className="text-muted-foreground text-center py-4">
                        Chưa có bài thi nào
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {sectionQuizzes.map((q) => (
                          <Link
                            key={q.id}
                            href={`/practice/${q.id}`}
                            className="block border bg-white rounded-lg p-3 hover:shadow-md transition"
                          >
                            <div className="font-medium">{q.title}</div>
                            {q.description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {q.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
