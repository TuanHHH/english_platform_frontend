import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sanitizeHtml } from "@/lib/sanitize";

export default function AssessmentResults({ results, type = 'speaking' }) {
  if (!results) return null;

  const isSpeaking = type === 'speaking';

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Kết quả chấm điểm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        {results.questionContent && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Câu hỏi:</h3>
            <article
              className="prose prose-sm max-w-none p-4 bg-muted rounded-lg"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(results.questionContent) }}
            />
          </div>
        )}

        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl">
          <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
            {results.aiScore}
          </div>
          <div className="text-lg text-muted-foreground">/10</div>
          <Badge variant="secondary" className="mt-2">
            Điểm tổng
          </Badge>
        </div>

        {/* Detailed Scores */}
        <div className="grid grid-cols-2 gap-4">
          {isSpeaking ? (
            <>
              <ScoreItem label="Fluency & Coherence" score={results.aiFluency} />
              <ScoreItem label="Pronunciation" score={results.aiPronunciation} />
              <ScoreItem label="Grammar" score={results.aiGrammar} />
              <ScoreItem label="Vocabulary" score={results.aiVocabulary} />
            </>
          ) : (
            <>
              <ScoreItem label="Task Response" score={results.aiTaskResponse} />
              <ScoreItem label="Coherence & Cohesion" score={results.aiCoherence} />
              <ScoreItem label="Grammar" score={results.aiGrammar} />
              <ScoreItem label="Vocabulary" score={results.aiVocabulary} />
            </>
          )}
        </div>

        {/* Transcript (Speaking only) */}
        {isSpeaking && results.transcript && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Nội dung bạn đã nói:</h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{results.transcript}</p>
            </div>
          </div>
        )}

        {/* Feedback */}
        {results.feedback && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Nhận xét chi tiết:</h3>
            <article
              className="prose prose-sm max-w-none p-4 bg-muted rounded-lg"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(results.feedback.replace(/\n/g, '<br>')) }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreItem({ label, score }) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold text-primary">
        {score !== null ? score : '-'}/10
      </div>
    </div>
  );
}
