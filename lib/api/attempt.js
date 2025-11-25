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

export async function listMyAttempts({ page = 1, size = 20, quizId = null } = {}) {
  try {
    const res = await api.get("/api/assessment/attempts/my", {
      params: {
        page,
        size,
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


export async function listAttemptsByQuiz({ quizId, page = 1, size = 20 }) {
  try {
    const res = await api.get("/api/assessment/attempts", {
      params: {
        quizId,
        page,
        size,
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

// Speaking submission - upload audio file directly
export async function submitSpeaking(attemptId, answerId, audioBlob) {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.mp3');
    
    const res = await fetch(
      `/api/assessment/attempts/${attemptId}/answers/${answerId}/speaking`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
      }
    );
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data?.data || data };
    }
    
    const errorData = await res.json().catch(() => ({}));
    return { success: false, error: errorData?.message || "Không thể submit speaking" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể submit speaking" };
  }
}

export async function getSpeakingResults(submissionId) {
  try {
    const res = await api.get(`/api/assessment/speaking-submissions/${submissionId}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy kết quả speaking" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy kết quả speaking" };
  }
}

// Writing submission - get by answerId (auto-created on submit attempt)
export async function getWritingResultsByAnswer(attemptId, answerId) {
  try {
    const res = await api.get(
      `/api/assessment/attempts/${attemptId}/answers/${answerId}/writing`
    );
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy kết quả writing" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy kết quả writing" };
  }
}

export async function getWritingSubmissions(attemptId) {
  try {
    const res = await api.get(`/api/assessment/attempts/${attemptId}/writing-submissions`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy kết quả writing" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy kết quả writing" };
  }
}

export async function getSpeakingSubmissions(attemptId) {
  try {
    const res = await api.get(`/api/assessment/attempts/${attemptId}/speaking-submissions`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data || res.data };
    }
    return { success: false, error: "Không thể lấy kết quả speaking" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể lấy kết quả speaking" };
  }
}
