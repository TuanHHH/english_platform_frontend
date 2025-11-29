// lib/api/review.js
import api from "@/lib/axios";
import { ErrorCode } from "@/lib/constants";

// --- PUBLIC ---

export async function getPublicCourseReviews(courseId, { page = 0, size = 10 } = {}) {
  try {
    const res = await api.get(`/api/public/reviews/courses/${courseId}`, {
      params: { page, size }
    });
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể lấy danh sách đánh giá" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách đánh giá" };
  }
}

export async function getCourseReviewStats(courseId) {
  try {
    const res = await api.get(`/api/public/reviews/courses/${courseId}/stats`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể lấy thống kê đánh giá" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy thống kê đánh giá" };
  }
}

// --- USER (AUTHENTICATED) ---

export async function getMyReview(courseId) {
  try {
    const res = await api.get(`/api/reviews/my-review/courses/${courseId}`);
    // 204 No Content means no review yet
    if (res.status === 204) {
      return { success: true, data: null };
    }
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Lỗi khi kiểm tra đánh giá" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Lỗi kết nối" };
  }
}

export async function createReview(courseId, payload) {
  try {
    const res = await api.post(`/api/reviews/courses/${courseId}`, payload);
    if (res.status === 201 || res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Đánh giá thất bại" };
  } catch (err) {
    const code = err?.response?.data?.code;
    let message = "Đánh giá thất bại";

    switch (code) {
      case ErrorCode.RESOURCE_ALREADY_EXISTS:
        message = "Bạn đã đánh giá khóa học này rồi";
        break;
      case ErrorCode.OPERATION_NOT_ALLOWED:
        message = "Bạn cần đăng ký khóa học để viết đánh giá";
        break;
      case ErrorCode.RESOURCE_NOT_FOUND:
        message = "Khóa học không tồn tại";
        break;
    }
    return { success: false, error: message };
  }
}

export async function updateReview(reviewId, payload) {
  try {
    const res = await api.put(`/api/reviews/${reviewId}`, payload);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Cập nhật thất bại" };
  } catch (err) {
    return { success: false, error: "Cập nhật thất bại" };
  }
}

export async function deleteReview(reviewId) {
  try {
    const res = await api.delete(`/api/reviews/${reviewId}`);
    if (res.status === 200 || res.status === 204) {
      return { success: true };
    }
    return { success: false, error: "Xóa thất bại" };
  } catch (err) {
    return { success: false, error: "Xóa thất bại" };
  }
}

export async function hideReview(reviewId) {
  try {
    // const res = await api.post(`/api/instructor/reviews/${reviewId}/hide`);
    const res = await api.post(`/api/reviews/instructor/${reviewId}/hide`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể ẩn đánh giá" };
  } catch (err) {
    const message = err?.response?.data?.message || "Không thể ẩn đánh giá";
    return { success: false, error: message };
  }
}

export async function showReview(reviewId) {
  try {
    const res = await api.post(`/api/reviews/instructor/${reviewId}/show`);
    // const res = await api.post(`/api/instructor/reviews/${reviewId}/show`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể hiện đánh giá" };
  } catch (err) {
    const message = err?.response?.data?.message || "Không thể hiện đánh giá";
    return { success: false, error: message };
  }
}

export async function getInstructorCourseReviews(courseId, { page = 0, size = 10, isPublished, rating } = {}) {
  try {
    const params = { page, size };
    if (isPublished !== undefined && isPublished !== "ALL") {
      params.isPublished = isPublished;
    }
    if (rating && rating !== "ALL") {
      params.rating = rating;
    }

    const res = await api.get(`/api/reviews/instructor/courses/${courseId}`, { params });
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể lấy danh sách đánh giá" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Lỗi kết nối" };
  }
}

export async function getMyReviewsList({ page = 1, size = 10 } = {}) {
  try {
    const res = await api.get(`/api/reviews/my-reviews`, {
      params: { 
        page: page - 1, 
        size 
      }
    });
    
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể tải lịch sử đánh giá" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Lỗi kết nối" };
  }
}