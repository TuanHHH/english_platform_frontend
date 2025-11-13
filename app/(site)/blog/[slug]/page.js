"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { publicGetPostBySlug } from "@/lib/api/content/posts";
import {
  publicListCommentsByPost,
  appCreateComment,
} from "@/lib/api/content/comments";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import CommentList from "@/components/content/comment-list";
import { sanitizeHtml } from "@/lib/sanitize";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10; // Số comments mỗi trang
  const [totalPages, setTotalPages] = useState(0);

  // Load comments function với pagination
  async function loadComments(postId, p = page) {
    setCommentsLoading(true);
    try {
      const response = await publicListCommentsByPost(postId, {
        page: p,
        size: pageSize,
      });
      
      // Xử lý response tùy theo cấu trúc API trả về
      let commentsData = [];
      let meta = null;
      
      if (response?.items) {
        // Nếu API trả về dạng { items: [], meta: {} }
        commentsData = response.items;
        meta = response.meta;
      } else if (response?.content) {
        commentsData = response.content;
        meta = response.meta;
      } else if (response?.data?.result) {
        commentsData = response.data.result;
        meta = response.data.meta;
      } else if (Array.isArray(response)) {
        commentsData = response;
      }
      
      setComments(commentsData);
      setTotalPages(meta?.pages ?? Math.ceil((meta?.total ?? 0) / pageSize) ?? 0);
    } catch (error) {
      console.error("Error loading comments:", error);
    //   toast.error("Không thể tải bình luận");
      setComments([]);
      setTotalPages(0);
    } finally {
      setCommentsLoading(false);
    }
  }

  // Handle comment creation
  async function handleCreateComment(payload) {
    try {
      const created = await appCreateComment(post.id, payload);
      
      // Reset về trang 1 và reload comments sau khi tạo comment mới
      setPage(1);
      await loadComments(post.id, 1);
      
    //   toast.success("Bình luận đã được gửi thành công!");
      return created;
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Gửi bình luận thất bại. Vui lòng thử lại.");
      throw error;
    }
  }

  // Initial load
  useEffect(() => {
    async function init() {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const postData = await publicGetPostBySlug(slug);
        setPost(postData);
        
        if (postData?.id) {
          await loadComments(postData.id, 1);
        }
      } catch (error) {
        console.error("Error loading post:", error);
        // toast.error("Không thể tải bài viết");
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [slug]);

  // Load comments khi page thay đổi
  useEffect(() => {
    if (post?.id) {
      loadComments(post.id, page);
    }
  }, [page]);

  if (isLoading) {
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  if (!post) {
    return <div className="container mx-auto p-4">Không tìm thấy bài viết.</div>;
  }

  const html = sanitizeHtml(post.bodyMd || "");

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          {/* Author header */}
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <img 
              src={post.authorAvatarUrl || "/avatar.svg"} 
              className="w-6 h-6 rounded-full object-cover" 
              alt={post.authorName || "Avatar"}
            />
            <span>{post.authorName || "Ẩn danh"}</span>
            <span>•</span>
            <span>
              {post.createdAt 
                ? new Date(post.createdAt).toLocaleString("vi-VN") 
                : ""}
            </span>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-clip-text capitalize">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <article
            className="prose max-w-none ql-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bình luận</CardTitle>
        </CardHeader>
        <CardContent>
          {commentsLoading ? (
            <div className="text-center py-4">Đang tải bình luận...</div>
          ) : (
            <>
              <CommentList
                postId={post.id}
                initial={comments}
                onCreate={handleCreateComment}
              />
              
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}