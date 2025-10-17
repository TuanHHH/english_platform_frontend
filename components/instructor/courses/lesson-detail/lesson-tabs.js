"use client"

import { Video, FileText, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function LessonTabs({ lesson, onEditContent }) {
  const kind = lesson.kind?.toLowerCase()
  const content = lesson.content || {}

  // Nếu là bài viết / nội dung HTML
  const body = content.body || {}
  const intro = body.intro || ""
  const sections = body.sections || []

  // Nếu là quiz
  const quizItems = content.quizItems || []

  // Nếu là video
  const videoUrl = lesson.primaryMedia?.url || null

  // Hàm render HTML an toàn (vì content đến từ backend của bạn)
  const renderHtml = (html) => (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )

  return (
    <Tabs
      defaultValue={kind === "video" ? "video" : kind === "quiz" ? "quiz" : "content"}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="video" disabled={kind !== "video"} className="gap-2">
          <Video className="h-4 w-4" /> Video
        </TabsTrigger>
        <TabsTrigger value="content" disabled={kind === "quiz"} className="gap-2">
          <FileText className="h-4 w-4" /> Nội dung
        </TabsTrigger>
        <TabsTrigger value="quiz" disabled={kind !== "quiz"} className="gap-2">
          <HelpCircle className="h-4 w-4" /> Quiz
        </TabsTrigger>
      </TabsList>

      {/* VIDEO */}
      {kind === "video" && (
        <TabsContent value="video" className="mt-6">
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Không có video chính
                </div>
              )}
            </div>

            <Button variant="outline" className="w-full" onClick={onEditContent}>
              Thay đổi Video
            </Button>
          </div>
        </TabsContent>
      )}

      {/* ARTICLE / HTML */}
      {kind !== "quiz" && (
        <TabsContent value="content" className="mt-6">
          <div className="space-y-6">
            {intro && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-foreground">{intro}</p>
              </div>
            )}
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                {section.title && (
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                )}
                {section.html && renderHtml(section.html)}
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={onEditContent}>
              Chỉnh sửa nội dung
            </Button>
          </div>
        </TabsContent>
      )}

      {/* QUIZ */}
      {kind === "quiz" && (
        <TabsContent value="quiz" className="mt-6">
          <div className="space-y-4">
            {quizItems.length > 0 ? (
              quizItems.map((q, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-muted/40 transition"
                >
                  <p className="font-medium mb-2">
                    Câu {index + 1}: {q.question}
                  </p>
                  <ul className="space-y-1">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={`p-2 rounded border ${
                          i === q.correctAnswer
                            ? "border-green-500 bg-green-100 text-green-700 font-semibold"
                            : "border-border"
                        }`}
                      >
                        {opt}
                        {i === q.correctAnswer && (
                          <Badge className="ml-2 bg-green-600 text-white">Đúng</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Chưa có câu hỏi nào</p>
            )}

            <Button variant="outline" className="w-full" onClick={onEditContent}>
              Chỉnh sửa Quiz
            </Button>
          </div>
        </TabsContent>
      )}
    </Tabs>
  )
}
