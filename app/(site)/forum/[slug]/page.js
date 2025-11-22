"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MoreVertical, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { forumGetThreadBySlug, forumListThreadPosts } from "@/lib/api/forum";
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
} from "@/lib/api/forum";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 0 });
  const [page, setPage] = useState(1); 
  const [replyingPostId, setReplyingPostId] = useState(null);
  const [loadingThread, setLoadingThread] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // ✅ State cho delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 20;

  const user = useAuthStore((s) => s.user);
  const hydrateFromMe = useAuthStore((s) => s.hydrateFromMe);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  useEffect(() => {
    (hydrateFromMe || fetchMe)?.();
  }, [hydrateFromMe, fetchMe]);

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
    const { items, meta } = await forumListThreadPosts(thread.id, { page: p, pageSize });
    setPosts(items || []);
    setMeta(meta || { page: p, pages: 0 });
    setLoadingPosts(false);
  }

  useEffect(() => { load(); }, [slug]);
  useEffect(() => { setPage(1); }, [thread?.id]); 
  useEffect(() => { if (thread?.id) loadPosts(page); }, [page, thread?.id]);

  // ✅ Mở dialog xác nhận xóa
  function openDeleteDialog(postId) {
    if (!postId) return;
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  }

  // ✅ Xác nhận xóa từ dialog
  async function confirmDelete() {
    if (!postToDelete) return;

    const previousPosts = [...posts];
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postToDelete));
    setDeleting(true);

    try {
      await appDeleteOwnPost(postToDelete);
      toast.success("Đã xóa phản hồi");
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      setPosts(previousPosts);
      toast.error("Không thể xóa phản hồi. Vui lòng thử lại.");
      console.error("Error deleting post:", error);
    } finally {
      setDeleting(false);
    }
  }

  // ✅ Hủy xóa
  function cancelDelete() {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
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

  async function handleReplyDone() {
    if (!thread?.id) return;
    
    const { meta: newMeta } = await forumListThreadPosts(thread.id, { 
      page: 1, 
      pageSize 
    });
    
    const lastPage = newMeta?.pages || 1;
    
    setPage(lastPage);
    await loadPosts(lastPage);
  }

  async function handleReplyToPostDone() {
    setReplyingPostId(null);
    await loadPosts(page);
  }

  return (
    <>
      <div className="container mx-auto p-4 space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/forum")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

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

              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <UserAvatar
                  src={thread.authorAvatarUrl}
                  name={thread.authorName}
                  className="w-6 h-6"
                />
                <span>{thread.authorName || "Ẩn danh"}</span>
                <span>•</span>
                <span>
                  {thread.createdAt
                    ? new Date(thread.createdAt).toLocaleString("vi-VN")
                    : ""}
                </span>
              </div>

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
                {(() => {
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
                        <p>Chưa có phản hồi nào. Hãy là người đầu tiên trả lời!</p>
                      </div>
                    );
                  }

                  return roots.map((p) => {
                    const children = byParent.get(String(p.id)) || [];
                    return (
                      <div key={p.id} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <UserAvatar
                              src={p.authorAvatarUrl}
                              name={p.authorName}
                              className="w-5 h-5"
                            />
                            <span>{p.authorName || "Ẩn danh"}</span>
                            <span>•</span>
                            <span>{p.createdAt ? new Date(p.createdAt).toLocaleString("vi-VN") : ""}</span>
                          </div>

                          {eqIds(user?.id, p.authorId) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="hover:bg-muted rounded p-1">
                                <MoreVertical className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => openDeleteDialog(p.id)}
                                >
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        <div className="whitespace-pre-wrap">{p.bodyMd}</div>

                        <div className="mt-2 flex flex-wrap gap-3 items-center text-xs">
                          {!eqIds(user?.id, p.authorId) && (
                            <button
                              onClick={() => openReportDialog({ type: "post", id: p.id })}
                              className="text-destructive hover:underline"
                            >
                              Báo cáo
                            </button>
                          )}

                          {!thread?.locked && (
                            <button
                              className="hover:underline"
                              onClick={() => setReplyingPostId(replyingPostId === p.id ? null : p.id)}
                            >
                              {replyingPostId === p.id ? "Đóng" : "Trả lời"}
                            </button>
                          )}
                        </div>

                        {!thread?.locked && replyingPostId === p.id && (
                          <div className="mt-3">
                            <ReplyToPostForm
                              threadId={thread.id}
                              parentPostId={p.id}
                              onDone={handleReplyToPostDone}
                            />
                          </div>
                        )}

                        {children?.length > 0 && (
                          <div className="mt-3 ml-6 space-y-3">
                            {children.map((c) => (
                              <div key={c.id} className="border-l-2 border-muted pl-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <UserAvatar
                                      src={c.authorAvatarUrl}
                                      name={c.authorName}
                                      className="w-4 h-4"
                                    />
                                    <span>{c.authorName || "Ẩn danh"}</span>
                                    <span>•</span>
                                    <span>{c.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : ""}</span>
                                  </div>

                                  {eqIds(user?.id, c.authorId) && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger className="hover:bg-muted rounded p-1">
                                        <MoreVertical className="h-3 w-3" />
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          className="text-destructive focus:text-destructive"
                                          onClick={() => openDeleteDialog(c.id)}
                                        >
                                          Xóa
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>

                                <div className="whitespace-pre-wrap">{c.bodyMd}</div>

                                <div className="mt-2 flex flex-wrap gap-3 items-center text-xs">
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

        {!thread?.locked && thread?.id && (
          <Card>
            <CardHeader>
              <CardTitle>Trả lời</CardTitle>
            </CardHeader>
            <CardContent>
              <ReplyForm threadId={thread.id} onDone={handleReplyDone} />
            </CardContent>
          </Card>
        )}

        <ReportDialog
          open={reportOpen}
          onOpenChange={setReportOpen}
          target={reportTarget}
          loading={reportLoading}
          onSubmit={handleReportSubmit}
        />
      </div>

      {/* ✅ Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa phản hồi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phản hồi này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={deleting}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}