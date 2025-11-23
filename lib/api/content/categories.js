import api from "@/lib/axios";

export async function listCategories(params = {}) {
  try {
    const res = await api.get("/api/admin/content/categories", { params });
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy danh sách danh mục" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách danh mục" };
  }
}

export async function listPublicCategories(params = {}) {
  try {
    const res = await api.get("/api/public/content/categories", { params });
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy danh sách danh mục" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách danh mục" };
  }
}

export async function createCategory(payload) {
  try {
    const body = { ...payload };
    if (!body.slug || body.slug.trim() === "") delete body.slug;
    if (!body.id && typeof crypto !== "undefined" && crypto.randomUUID)
      body.id = crypto.randomUUID();
    const res = await api.post("/api/admin/content/categories", body);
    if (res.status === 200 || res.status === 201) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể tạo danh mục" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể tạo danh mục";
    return { success: false, error: message };
  }
}

export async function updateCategory(id, payload) {
  try {
    const res = await api.patch(`/api/admin/content/categories/${id}`, payload);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể cập nhật danh mục" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể cập nhật danh mục";
    return { success: false, error: message };
  }
}

export async function deleteCategory(id) {
  try {
    const res = await api.delete(`/api/admin/content/categories/${id}`);
    if (res.status === 204 || res.status === 200) {
      return { success: true, data: null };
    }
    return { success: false, error: "Không thể xóa danh mục" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể xóa danh mục";
    return { success: false, error: message };
  }
}

export async function getCategory(id) {
  try {
    const res = await api.get(`/api/admin/content/categories/${id}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy thông tin danh mục" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy thông tin danh mục" };
  }
}
