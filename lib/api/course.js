import api from "@/lib/axios";

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
            return res.data?.data;
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
            return res.data?.data ;
        }
        return { success: false, error: "Không thể lấy danh sách chương" };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Không thể lấy danh sách chương" };
    }
}