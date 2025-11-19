
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { appReplyToPost } from "@/lib/api/forum";

/**
 * Inline form to reply to a top-level comment (level-1) and create a level-2 comment.
 * It intentionally does NOT support deeper nesting.
 */
export default function ReplyToPostForm({ threadId, parentPostId, onDone }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const content = (body || "").trim();
    if (!content) return;
    setLoading(true);
    try {
      await appReplyToPost(threadId, parentPostId, { bodyMd: content });
      setBody("");
      onDone?.();
    } catch (e) {
      console.error(e);
      toast.error("Không thể gửi trả lời. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Textarea
        rows={3}
        placeholder="Viết trả lời..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => { setBody(""); onDone?.(); }} disabled={loading}>
          Hủy
        </Button>
        <Button onClick={submit} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi trả lời"}
        </Button>
      </div>
    </div>
  );
}
