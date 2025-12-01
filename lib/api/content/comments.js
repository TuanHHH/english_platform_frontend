import api from "@/lib/axios";

const unwrapList = (data) =>
  Array.isArray(data?.result)
    ? data.result
    : Array.isArray(data?.content)
    ? data.content
    : Array.isArray(data)
    ? data
    : [];

const fallbackMeta = (items = []) => ({
  page: 1,
  pageSize: items.length,
  pages: 1,
  total: items.length,
});

export async function adminListCommentsByPost(postId, params = {}) {
  try {
    const res = await api.get(`/api/admin/content/comments/by-post/${postId}`, { params });
    if (res.status === 200) {
      const data = res.data?.data || res.data;
      return { success: true, data: unwrapList(data) };
    }
    return { success: false, error: "Không thể lấy danh sách bình luận" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách bình luận" };
  }
}

export async function adminListCommentsByPostPaged(postId, params = {}) {
  try {
    const res = await api.get(`/api/admin/content/comments/by-post/${postId}`, { params });
    if (res.status === 200) {
      const data = res.data?.data || res.data;
      const items = unwrapList(data);
      const meta = data?.meta ?? fallbackMeta(items);
      return { success: true, data: { items, meta } };
    }
    return { success: false, error: "Không thể lấy danh sách bình luận" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách bình luận" };
  }
}

export async function adminHideComment(id) {
  try {
    const res = await api.post(`/api/admin/content/comments/${id}/hide`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể ẩn bình luận" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể ẩn bình luận";
    return { success: false, error: message };
  }
}

export async function adminUnhideComment(id) {
  try {
    const res = await api.post(`/api/admin/content/comments/${id}/unhide`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể hiện bình luận" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể hiện bình luận";
    return { success: false, error: message };
  }
}

export async function adminDeleteComment(id) {
  try {
    const res = await api.delete(`/api/admin/content/comments/${id}`);
    if (res.status === 204 || res.status === 200) {
      return { success: true, data: null };
    }
    return { success: false, error: "Không thể xóa bình luận" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể xóa bình luận";
    return { success: false, error: message };
  }
}

export async function adminListAllCommentsPaged(params = {}) {
  try {
    const page = Number(params.page) || 1;
    const pageSize = Number(params.pageSize) || 20;
    const query = { page, pageSize };
    if (params.keyword?.trim()) query.keyword = params.keyword.trim();
    if (typeof params.published === "boolean") query.published = params.published;
    if (params.postId) query.postId = params.postId;
    if (params.authorId) query.authorId = params.authorId;

    const res = await api.get("/api/admin/content/comments", { params: query });
    if (res.status === 200) {
      const data = res.data?.data || res.data;
      const items = unwrapList(data);
      const meta = data?.meta ?? fallbackMeta(items);
      return { success: true, data: { items, meta } };
    }
    return { success: false, error: "Không thể lấy danh sách bình luận" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách bình luận" };
  }
}

export async function publicListCommentsByPostPaged(postId, params = {}) {
  try {
    const res = await api.get(`/api/blog/comments/post/${postId}`, { params });
    if (res.status === 200) {
      const data = res.data?.data || res.data;
      const items = unwrapList(data);
      const meta = data?.meta ?? fallbackMeta(items);
      return { success: true, data: { items, meta } };
    }
    return { success: false, error: "Không thể lấy danh sách bình luận" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách bình luận" };
  }
}

export async function appCreateComment(postId, payload) {
  try {
    const res = await api.post(`/api/blog/comments/post/${postId}`, payload);
    if (res.status === 200 || res.status === 201) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể tạo bình luận" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể tạo bình luận";
    return { success: false, error: message };
  }
}

export async function appDeleteComment(commentId) {
  try {
    const res = await api.delete(`/api/blog/comments/${commentId}`);
    if (res.status === 204 || res.status === 200) {
      return { success: true, data: null };
    }
    return { success: false, error: "Không thể xóa bình luận" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể xóa bình luận";
    return { success: false, error: message };
  }
}
