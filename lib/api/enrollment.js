import api from "@/lib/axios";

export async function getMyEnrollments(params = {}) {
  try {
    const queryParams = {
      page: params.page || 1,
      size: params.size || 10,
      sort: params.sort || "createdAt,desc"
    };

    const res = await api.get("/api/enrollments/me", {
      params: queryParams
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể lấy danh sách khóa học của bạn" };
  } catch (err) {
    console.error("Get orders error:", err);
    return { success: false, error: "Không thể lấy danh sách khóa học của bạn" };
  }
}