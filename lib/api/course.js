import api from "@/lib/axios";
import { ErrorCode } from "@/lib/constants";

export async function uploadMedia(file, folder = "course_thumbnail") {
  if (!file) {
    return { success: false, error: "Thiếu file" };
  }
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await api.post("/api/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể tải ảnh lên" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể tải ảnh lên" };
  }
}

export async function uploadCourseVideo(file) {
  if (!file) {
    return { success: false, error: "Thiếu file video" };
  }
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/api/media/upload-course-video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 202 || res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể tải video lên" };
  } catch (err) {
    console.error(err);
    return { success: false, error: err?.response?.data?.message || "Không thể tải video lên" };
  }
}

export async function getSignedVideoUrl(mediaId) {
  if (!mediaId) {
    return { success: false, error: "Thiếu ID media" };
  }
  try {
    const res = await api.get(`/api/media/sign-video/${mediaId}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể lấy URL video" };
  } catch (err) {
    console.error(err);
    return { success: false, error: err?.response?.data?.message || "Không thể lấy URL video" };
  }
}
export async function getCourses(params = {}) {
  try {
    const {
      keyword,
      page = 1,
      size = 9,
      sort = "createdAt,desc",
      isPublished,
    } = params;

    const query = new URLSearchParams();
    if (keyword) query.append("keyword", keyword);
    if (isPublished !== undefined) query.append("isPublished", isPublished);
    query.append("page", page);
    query.append("size", size);
    query.append("sort", sort);
    const res = await api.get(`/api/courses/mine?${query.toString()}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }

    return { success: false, error: "Không thể lấy danh sách khóa học" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách khóa học" };
  }
}

export async function getCourseById(courseId) {
  if (!courseId) {
    return { success: false, error: "Thiếu ID khóa học" };
  }
  try {
    const res = await api.get(`/api/courses/${courseId}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data }
    }
    return { success: false, error: "Không thể lấy thông tin khóa học" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy thông tin khóa học" };
  }
}

export async function getCourseModules(courseId) {
  if (!courseId) {
    return { success: false, error: "Thiếu ID khóa học" };
  }
  try {
    const res = await api.get(`/api/courses/${courseId}/modules`);
    if (res.status === 200) {
      return res.data?.data;
    }
    return { success: false, error: "Không thể lấy danh sách chương" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách chương" };
  }
}

export async function createCourse(payload) {
  try {
    const res = await api.post("/api/courses", payload);
    if (res.status === 201) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể tạo khóa học" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể tạo khóa học" };
  }
}

export async function updateCourse(courseId, payload) {
  if (!courseId) {
    return { success: false, error: "Thiếu ID khóa học" };
  }
  try {
    const res = await api.put(`/api/courses/${courseId}`, payload);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể cập nhật khóa học" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể cập nhật khóa học" };
  }
}

export async function deleteCourse(courseId) {
  if (!courseId) {
    return { success: false, error: "Thiếu ID khóa học" };
  }
  try {
    const res = await api.delete(`/api/courses/${courseId}`);
    if (res.status === 204) {
      return { success: true };
    }
    return { success: false, error: "Không thể xóa khóa học" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể xóa khóa học" };
  }
}

export async function publishCourse(courseId, publish) {
  if (!courseId) {
    return { success: false, error: "Thiếu ID khóa học" };
  }
  try {
    const res = await api.patch(`/api/courses/${courseId}/publish?publish=${publish}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể cập nhật trạng thái xuất bản" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể cập nhật trạng thái xuất bản" };
  }
}

export const getCourseModuleDetail = async (courseId, moduleId) => {
  if (!courseId || !moduleId) {
    return { success: false, error: "Thiếu courseId hoặc moduleId" };
  }

  try {
    const res = await api.get(`/api/courses/${courseId}/modules/${moduleId}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy thông tin module" };
  }
};


export const createCourseModule = async (courseId, payload) => {
  if (!courseId) {
    return { success: false, error: "Thiếu ID khóa học" };
  }
  try {
    const res = await api.post(`/api/courses/${courseId}/modules`, payload);
    if (res.status === 201) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể tạo chương" };
  } catch (err) {
    const errorCode = err?.response?.data?.code;
    if (errorCode === ErrorCode.DUPLICATE_KEY) {
      return { success: false, error: "Vị trí đã tồn tại" };
    }
    return { success: false, error: "Không thể tạo chương" };
  }
};

export const updateCourseModule = async (courseId, payload) => {
  if (!courseId) {
    return { success: false, error: "Thiếu ID khóa học" };
  }
  try {
    const res = await api.put(`/api/courses/${courseId}/modules`, payload);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể cập nhật chương" };
  } catch (err) {
    const errorCode = err?.response?.data?.code;
    if (errorCode === ErrorCode.DUPLICATE_KEY) {
      return { success: false, error: "Vị trí bị trùng" };
    }
    return { success: false, error: "Không thể cập nhật chương" };
  }
};

export const deleteCourseModule = async (courseId, moduleId) => {
  if (!courseId) {
    return { success: false, error: "Thiếu ID khóa học" };
  }
  if (!moduleId) {
    return { success: false, error: "Thiếu ID chương" };
  }
  try {
    const res = await api.delete(
      `/api/courses/${courseId}/modules/${moduleId}`
    );
    if (res.status === 204) {
      return { success: true };
    }
    return { success: false, error: "Không thể xóa chương" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể xóa chương" };
  }
}

export const publishModule = async (courseId, moduleId, publish) => {
  if (!courseId) {
    return { success: false, error: "Thiếu ID khóa học" };
  }
  if (!moduleId) {
    return { success: false, error: "Thiếu ID module" };
  }
  try {
    const res = await api.patch(
      `/api/courses/${courseId}/modules/${moduleId}/publish?publish=${publish}`
    );
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể cập nhật trạng thái xuất bản" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể cập nhật trạng thái xuất bản" };
  }
}

export const listCourseLessons = async (moduleId) => {
  if (!moduleId) {
    return { success: false, error: "Thiếu ID chương" };
  }
  try {
    const res = await api.get(`/api/modules/${moduleId}/lessons`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
  }
  catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách bài học" };
  }
}

export const createLesson = async (moduleId, payload) => {
  if (!moduleId) {
    return { success: false, error: "Thiếu ID module" }
  }

  try {
    const res = await api.post(`/api/modules/${moduleId}/lessons`, payload)
    if (res.status === 201) {
      return { success: true, data: res.data?.data }
    } else {
      return {
        success: false,
        error: res.data?.message || "Không thể tạo bài học",
      }
    }
  } catch (err) {
    return {
      success: false,
      error: "Lỗi khi gọi API tạo bài học",
    }
  }
}

export const getLessonDetail = async (moduleId, lessonId) => {
  if (!moduleId) {
    return { success: false, error: "Thiếu ID module" }
  }
  if (!lessonId) {
    return { success: false, error: "Thiếu ID lesson" }
  }
  try {
    const res = await api.get(`/api/modules/${moduleId}/lessons/${lessonId}`)
    if (res.status === 200) {
      return { success: true, data: res.data?.data }
    } else {
      return {
        success: false,
        error: res.data?.message || "Không thể lấy chi tiết bài học",
      }
    }
  } catch (err) {
    return {
      success: false,
      error: "Lỗi khi gọi API lấy chi tiết bài học",
    }
  }
}

export const updateLesson = async (moduleId, lessonId, payload) => {
  if (!moduleId) {
    return { success: false, error: "Thiếu ID module" }
  }
  if (!lessonId) {
    return { success: false, error: "Thiếu ID lesson" }
  }

  try {
    const res = await api.put(`/api/modules/${moduleId}/lessons/${lessonId}`, payload)
    if (res.status === 200) {
      return { success: true, data: res.data?.data }
    } else {
      return {
        success: false,
        error: res.data?.message || "Không thể cập nhật bài học",
      }
    }
  } catch (err) {
    return {
      success: false,
      error: "Lỗi khi gọi API cập nhật bài học",
    }
  }
}

export const deleteLesson = async (moduleId, lessonId) => {
  if (!moduleId) {
    return { success: false, error: "Thiếu ID module" }
  }
  if (!lessonId) {
    return { success: false, error: "Thiếu ID lesson" }
  }

  try {
    const res = await api.delete(`/api/modules/${moduleId}/lessons/${lessonId}`)
    if (res.status === 204) {
      return { success: true }
    } else {
      return {
        success: false,
        error: res.data?.message || "Không thể xóa bài học",
      }
    }
  } catch (err) {
    return {
      success: false,
      error: "Lỗi khi gọi API xóa bài học",
    }
  }
}

export const publishLesson = async (moduleId, lessonId, publish) => {
  if (!moduleId) {
    return { success: false, error: "Thiếu ID module" }
  }
  if (!lessonId) {
    return { success: false, error: "Thiếu ID lesson" }
  }

  try {
    const res = await api.patch(`/api/modules/${moduleId}/lessons/${lessonId}/publish?publish=${publish}`)
    if (res.status === 200) {
      return { success: true, data: res.data?.data }
    } else {
      return {
        success: false,
        error: res.data?.message || "Không thể cập nhật trạng thái xuất bản",
      }
    }
  } catch (err) {
    return {
      success: false,
      error: "Lỗi khi cập nhật trạng thái xuất bản",
    }
  }
}