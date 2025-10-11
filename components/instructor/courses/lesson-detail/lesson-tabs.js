"use client"

import { Video, FileText, HelpCircle, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LessonTabs({ lesson, onEditContent, onDeleteQuestion }) {
  return (
    <Tabs defaultValue="video" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="video" className="gap-2">
          <Video className="h-4 w-4" /> Video
        </TabsTrigger>
        <TabsTrigger value="text" className="gap-2">
          <FileText className="h-4 w-4" /> Nội Dung
        </TabsTrigger>
        <TabsTrigger value="quiz" className="gap-2">
          <HelpCircle className="h-4 w-4" /> Quiz
        </TabsTrigger>
      </TabsList>

      {/* VIDEO TAB */}
      <TabsContent value="video" className="mt-6">
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={lesson.videoUrl}
              alt="Lesson video"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={onEditContent}
          >
            Thay Đổi Video
          </Button>
        </div>
      </TabsContent>

      {/* TEXT TAB */}
      <TabsContent value="text" className="mt-6">
        <div className="space-y-4">
          <div className="prose max-w-none p-4 rounded-lg bg-muted/30">
            <p className="text-foreground">{lesson.textContent}</p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={onEditContent}
          >
            Chỉnh Sửa Nội Dung
          </Button>
        </div>
      </TabsContent>

      {/* QUIZ TAB */}
      <TabsContent value="quiz" className="mt-6">
        <div className="space-y-4">
          {lesson.quiz.map((q, index) => (
            <Card key={q.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base flex-1">
                    Câu {index + 1}: {q.question}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteQuestion(q)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {q.options.map((option, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${
                        i === q.correctAnswer
                          ? "border-success bg-success/10"
                          : "border-border"
                      }`}
                    >
                      {option}
                      {i === q.correctAnswer && (
                        <Badge className="ml-2 bg-success">Đúng</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full">
            Thêm Câu Hỏi Mới
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
