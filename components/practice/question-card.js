import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import SpeakingRecorder from "./speaking-recorder";

export default function QuestionCard({
  current,
  index,
  total,
  answered,
  answers,
  isMCQ,
  isSpeaking,
  onChoose,
  onAudioReady,
  onNavigate
}) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Badge variant="default" className="text-base py-1 px-3">
              Câu {Math.min(index + 1, total)}/{total}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Đã trả lời: {answered}/{total}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(-1)}
              disabled={index === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(1)}
              disabled={index >= total - 1}
            >
              Tiếp theo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {current && (
          <>
            <article
              className="prose prose-sm max-w-none ql-content"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(current.content || ""),
              }}
            />

            {isMCQ(current) ? (
              <div className="space-y-3">
                {(current.options || [])
                  .slice()
                  .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                  .map((op) => {
                    const checked = answers[current.id] === op.id;
                    return (
                      <label
                        key={op.id}
                        className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
                          checked
                            ? "border-primary bg-primary/5 ring-2 ring-primary"
                            : "hover:bg-muted/50 hover:border-muted-foreground/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${current.id}`}
                          checked={checked}
                          onChange={() => onChoose(current.id, op.id)}
                          className="w-4 h-4 mt-1"
                        />
                        <span className="text-sm flex-1">{op.content}</span>
                      </label>
                    );
                  })}
              </div>
            ) : isSpeaking(current) ? (
              <SpeakingRecorder 
                questionId={current.id} 
                onAnswer={onChoose}
                onAudioReady={onAudioReady}
              />
            ) : (
              <div>
                <textarea
                  className="w-full min-h-[140px] border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Nhập câu trả lời của bạn..."
                  value={answers[current.id] || ""}
                  onChange={(e) => onChoose(current.id, e.target.value)}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
