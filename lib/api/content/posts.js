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

export async function adminSearchPosts(params = {}) {
  try {
    const res = await api.get("/api/admin/content/posts", { params });
    if (res.status === 200) {
      const data = res.data?.data || res.data;
      return { success: true, data: unwrapList(data) };
    }
    return { success: false, error: "Không thể tìm kiếm bài viết" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể tìm kiếm bài viết" };
  }
}

export async function adminSearchPostsPaged(params = {}) {
  try {
    const res = await api.get("/api/admin/content/posts", { params });
    if (res.status === 200) {
      const data = res.data?.data || res.data;
      const items = unwrapList(data);
      const meta = data?.meta ?? fallbackMeta(items);
      return { success: true, data: { items, meta } };
    }
    return { success: false, error: "Không thể tìm kiếm bài viết" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể tìm kiếm bài viết" };
  }
}

export async function adminCreatePost(payload) {
  try {
    const body = { ...payload };
    if (!body.slug || body.slug.trim() === "") delete body.slug;
    const res = await api.post("/api/admin/content/posts", body);
    if (res.status === 200 || res.status === 201) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể tạo bài viết" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể tạo bài viết";
    return { success: false, error: message };
  }
}

export async function adminUpdatePost(id, payload) {
  try {
    const res = await api.patch(`/api/admin/content/posts/${id}`, payload);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể cập nhật bài viết" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể cập nhật bài viết";
    return { success: false, error: message };
  }
}

export async function adminDeletePost(id) {
  try {
    const res = await api.delete(`/api/admin/content/posts/${id}`);
    if (res.status === 204 || res.status === 200) {
      return { success: true, data: null };
    }
    return { success: false, error: "Không thể xóa bài viết" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể xóa bài viết";
    return { success: false, error: message };
  }
}

export async function adminPublishPost(id) {
  try {
    const res = await api.post(`/api/admin/content/posts/${id}/publish`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể xuất bản bài viết" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể xuất bản bài viết";
    return { success: false, error: message };
  }
}

export async function adminUnpublishPost(id) {
  try {
    const res = await api.post(`/api/admin/content/posts/${id}/unpublish`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể gỡ xuất bản bài viết" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể gỡ xuất bản bài viết";
    return { success: false, error: message };
  }
}

export async function adminGetPost(id) {
  try {
    const res = await api.get(`/api/admin/content/posts/${id}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy thông tin bài viết" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy thông tin bài viết" };
  }
}

export async function publicListPosts(params = {}) {
  try {
    const res = await api.get("/api/public/content/posts", { params });
    if (res.status === 200) {
      const data = res.data?.data || res.data;
      return { success: true, data: unwrapList(data) };
    }
    return { success: false, error: "Không thể lấy danh sách bài viết" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách bài viết" };
  }
}

export async function publicListPostsPaged(params = {}) {
  try {
    const res = await api.get("/api/public/content/posts", { params });
    if (res.status === 200) {
      const data = res.data?.data || res.data;
      const items = unwrapList(data);
      const meta = data?.meta ?? fallbackMeta(items);
      return { success: true, data: { items, meta } };
    }
    return { success: false, error: "Không thể lấy danh sách bài viết" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách bài viết" };
  }
}

export async function publicGetPostBySlug(slug) {
  try {
    const res = await api.get(`/api/public/content/posts/${slug}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy thông tin bài viết" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy thông tin bài viết" };
  }
}

export async function appCreatePost(payload) {
  try {
    const res = await api.post("/api/app/content/posts", payload);
    if (res.status === 200 || res.status === 201) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể tạo bài viết" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể tạo bài viết";
    return { success: false, error: message };
  }
}
