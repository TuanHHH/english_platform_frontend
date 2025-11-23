import api from "@/lib/axios";

export async function submitOneShot(payload) {
  try {
    const res = await api.post(`/api/assessment/attempts/submit`, payload);
    if (res.status === 200 || res.status === 201) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể nộp bài" };
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || "Không thể nộp bài";
    return { success: false, error: message };
  }
}

export async function listMyAttempts({ page = 1, pageSize = 20, quizId = null } = {}) {
  try {
    const res = await api.get("/api/assessment/attempts/my", {
      params: {
        page,
        pageSize,
        ...(quizId && { quizId }),
      },
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }

    return { success: false, error: "Không thể lấy danh sách bài làm" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách bài làm" };
  }
}


export async function listAttemptsByQuiz({ quizId, page = 1, pageSize = 20 }) {
  try {
    const res = await api.get("/api/assessment/attempts", {
      params: {
        quizId,
        page,
        pageSize,
      },
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }

    return { success: false, error: "Không thể lấy danh sách bài làm" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy danh sách bài làm" };
  }
}

export async function getAttempt(attemptId) {
  try {
    const res = await api.get(`/api/assessment/attempts/${attemptId}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy thông tin bài làm" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy thông tin bài làm" };
  }
}

export async function getAttemptAnswers(attemptId) {
  try {
    const res = await api.get(`/api/assessment/attempts/${attemptId}/answers`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy đáp án bài làm" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy đáp án bài làm" };
  }
}
