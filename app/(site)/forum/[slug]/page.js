"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { forumGetThreadBySlug, forumListThreadPosts } from "@/lib/api/forum/forum";
import { Pagination } from "@/components/ui/pagination";
import ReplyForm from "@/components/forum/reply-form";
import ReplyToPostForm from "@/components/forum/reply-to-post-form";
import ReportDialog from "@/components/forum/report-dialog";
import {
  appReportPost,
  appReportThread,
  appLockThread,
  appUnlockThread,
  appDeleteOwnPost,
} from "@/lib/api/forum/forum";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

export default function ThreadDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 0 });
  const [page, setPage] = useState(0);
  const [replyingPostId, setReplyingPostId] = useState(null);
  const [loadingThread, setLoadingThread] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); // {type:"post"|"thread", id:string}
  const [reportLoading, setReportLoading] = useState(false);

  const pageSize = 20;

  // ===== Auth store =====
  const user = useAuthStore((s) => s.user);
  const hydrateFromMe = useAuthStore((s) => s.hydrateFromMe);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  useEffect(() => {
    (hydrateFromMe || fetchMe)?.(); // nếu store có sẵn, hydrate user một lần
  }, [hydrateFromMe, fetchMe]);

  // So sánh ID an toàn
  const eqIds = (a, b) => (a && b ? String(a) === String(b) : false);
  const isOwnerThread = thread ? eqIds(user?.id, thread.authorId) : false;

  async function load() {
    if (!slug) return;
    setLoadingThread(true);
    const t = await forumGetThreadBySlug(slug);
    setThread(t);
    setLoadingThread(false);
  }
  async function loadPosts(p = page) {
    if (!thread?.id) return;
    setLoadingPosts(true);
    const { items, meta } = await forumListThreadPosts(thread.id, { page: p + 1, pageSize });
    setPosts(items || []);
    setMeta(meta || { page: p + 1, pages: 0 });
    setLoadingPosts(false);
  }

  useEffect(() => { load(); }, [slug]);
  useEffect(() => { setPage(0); }, [thread?.id]);
  useEffect(() => { loadPosts(page); }, [page, thread?.id]);

  // Optimistic delete function
  async function handleDeletePost(postId) {
    if (!confirm("Xóa phản hồi này?")) return;

    // Optimistically remove the post from UI
    const previousPosts = [...posts];
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));

    try {
      await appDeleteOwnPost(postId);
      toast.success("Đã xóa phản hồi");
    } catch (error) {
      // Rollback on error
      setPosts(previousPosts);
      toast.error("Không thể xóa phản hồi. Vui lòng thử lại.");
      console.error("Error deleting post:", error);
    }
  }

  function openReportDialog(target) {
    setReportTarget(target);
    setReportOpen(true);
  }
  async function handleReportSubmit(reason) {
    if (!reportTarget?.id) return;
    setReportLoading(true);
    try {
      if (reportTarget.type === "post") await appReportPost(reportTarget.id, { reason });
      else await appReportThread(reportTarget.id, { reason });
      setReportOpen(false);
      toast.success("Đã gửi báo cáo. Cảm ơn bạn!");
    } catch (e) {
      console.error(e);
      toast.error("Gửi báo cáo thất bại. Vui lòng thử lại.");
    } finally {
      setReportLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {loadingThread ? (
        <Card>
          <CardHeader>
            <div className="mt-1 flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-3/4" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ) : thread ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {thread.title}
            </CardTitle>

            {/* Author header */}
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <img
                src={thread.authorAvatarUrl || "/avatar.svg"}
                className="w-6 h-6 rounded-full object-cover"
                alt={thread.authorName || "Avatar"}
              />
              <span>{thread.authorName || "Ẩn danh"}</span>
              <span>•</span>
              <span>
                {thread.createdAt
                  ? new Date(thread.createdAt).toLocaleString("vi-VN")
                  : ""}
              </span>
            </div>

            {/* Trạng thái + hành động */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {thread.categories?.map((c, idx) => (
                <span key={idx}>
                  {c.name}
                  {idx < thread.categories.length - 1 && ", "}
                </span>
              ))}
              {thread.categories?.length > 0 && <span>•</span>}
              <span className={thread.locked ? "text-destructive" : ""}>
                {thread.locked ? "Đã khóa" : "Đang mở"}
              </span>

              {/* Báo cáo thread: chỉ hiển thị khi KHÔNG phải chủ bài */}
              {(!isOwnerThread) && (
                <>
                  <span>•</span>
                  <button
                    className="underline hover:no-underline"
                    onClick={() => openReportDialog({ type: "thread", id: thread.id })}
                  >
                    Báo cáo
                  </button>
                </>
              )}

              {/* Khóa/Mở bình luận: chỉ dành cho chủ bài */}
              {isOwnerThread && (
                <>
                  <span>•</span>
                  {!thread.locked ? (
                    <button
                      className="underline hover:no-underline"
                      onClick={async () => { await appLockThread(thread.id); toast.success("Đã khóa bình luận"); await load(); }}
                    >
                      Khóa bình luận
                    </button>
                  ) : (
                    <button
                      className="underline hover:no-underline"
                      onClick={async () => { await appUnlockThread(thread.id); toast.success("Đã mở bình luận"); await load(); }}
                    >
                      Mở bình luận
                    </button>
                  )}
                </>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <article
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: thread.bodyMd }}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Phản hồi</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {loadingPosts ? (
            // Loading skeleton for posts
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-md p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-3">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Hiển thị bình luận 2 cấp (cấp 1 + trả lời cấp 2) */}
              {(() => {
                // Tạo map parentId -> danh sách con
                const byParent = new Map();
                (posts || []).forEach(p => {
                  const key = p.parentId ? String(p.parentId) : null;
                  const arr = byParent.get(key) || [];
                  arr.push(p);
                  byParent.set(key, arr);
                });
                const roots = byParent.get(null) || [];

                if (roots.length === 0) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Chưa có phản hồi nào.</p>
                    </div>
                  );
                }

                return roots.map((p) => {
                  const children = byParent.get(String(p.id)) || [];
                  return (
                    <div key={p.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <img
                            src={p.authorAvatarUrl || "/avatar.svg"}
                            className="w-5 h-5 rounded-full object-cover"
                            alt=""
                          />
                          <span>{p.authorName || "Ẩn danh"}</span>
                          <span>•</span>
                          <span>{p.createdAt ? new Date(p.createdAt).toLocaleString("vi-VN") : ""}</span>
                        </div>

                        {/* Menu actions: chỉ chủ comment */}
                        {eqIds(user?.id, p.authorId) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="hover:bg-muted rounded p-1">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDeletePost(p.id)}
                              >
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      <div className="whitespace-pre-wrap">{p.bodyMd}</div>

                      <div className="mt-2 flex flex-wrap gap-3 items-center text-xs">
                        {/* Báo cáo comment: KHÔNG hiển thị nếu là chủ comment */}
                        {!eqIds(user?.id, p.authorId) && (
                          <button
                            onClick={() => openReportDialog({ type: "post", id: p.id })}
                            className="text-destructive hover:underline"
                          >
                            Báo cáo
                          </button>
                        )}

                        {/* Trả lời cấp 2: chỉ cho cấp 1 và khi thread chưa khóa */}
                        {!thread?.locked && (
                          <button
                            className="hover:underline"
                            onClick={() => setReplyingPostId(replyingPostId === p.id ? null : p.id)}
                          >
                            {replyingPostId === p.id ? "Đóng" : "Trả lời"}
                          </button>
                        )}
                      </div>

                      {/* Form trả lời cấp 2 */}
                      {!thread?.locked && replyingPostId === p.id && (
                        <div className="mt-3">
                          <ReplyToPostForm
                            threadId={thread.id}
                            parentPostId={p.id}
                            onDone={async () => { setReplyingPostId(null); await loadPosts(0); }}
                          />
                        </div>
                      )}

                      {/* Danh sách trả lời (cấp 2) */}
                      {children?.length > 0 && (
                        <div className="mt-3 ml-6 space-y-3">
                          {children.map((c) => (
                            <div key={c.id} className="border-l pl-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <img
                                    src={c.authorAvatarUrl || "/avatar.svg"}
                                    className="w-4 h-4 rounded-full object-cover"
                                    alt=""
                                  />
                                  <span>{c.authorName || "Ẩn danh"}</span>
                                  <span>•</span>
                                  <span>{c.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : ""}</span>
                                </div>

                                {/* Menu actions: chỉ chủ comment */}
                                {eqIds(user?.id, c.authorId) && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger className="hover:bg-muted rounded p-1">
                                      <MoreVertical className="h-3 w-3" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() => handleDeletePost(c.id)}
                                      >
                                        Xóa
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>

                              <div className="whitespace-pre-wrap">{c.bodyMd}</div>

                              <div className="mt-2 flex flex-wrap gap-3 items-center text-xs">
                                {/* Báo cáo: KHÔNG hiển thị nếu là chủ comment */}
                                {!eqIds(user?.id, c.authorId) && (
                                  <button
                                    onClick={() => openReportDialog({ type: "post", id: c.id })}
                                    className="text-destructive hover:underline"
                                  >
                                    Báo cáo
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}

              {meta?.pages > 1 && (
                <div className="mt-4">
                  <Pagination currentPage={page} totalPages={meta?.pages ?? 0} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Form trả lời: ẩn khi thread đã khóa */}
      {!thread?.locked && thread?.id && (
        <Card>
          <CardHeader>
            <CardTitle>Trả lời</CardTitle>
          </CardHeader>
          <CardContent>
            <ReplyForm threadId={thread.id} onDone={() => loadPosts(0)} />
          </CardContent>
        </Card>
      )}

      {/* Report dialog (thread/post) */}
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        target={reportTarget}
        loading={reportLoading}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
