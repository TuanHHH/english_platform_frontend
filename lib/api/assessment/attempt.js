
import api from "@/lib/axios";

/** One-shot submit: create attempt, save answers, auto-grade for MCQ */
export async function submitOneShot(payload) {
  // payload: { quizId, answers: [{questionId, selectedOptionId?, answerText?, timeSpentMs?}] }
  const res = await api.post(`/api/assessment/attempts/submit`, payload);
  return res.data; // AttemptResponse
}

/** Current user's attempts (PaginationResponse) */
export async function listMyAttempts({ page = 1, pageSize = 20, quizId = null } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("pageSize", pageSize);
  if (quizId) params.set("quizId", quizId);
  const res = await api.get(`/api/assessment/attempts/my?${params.toString()}`);
  return res.data; // { meta, result }
}

/** Admin: list attempts by quiz (PaginationResponse) */
export async function listAttemptsByQuiz({ quizId, page = 1, pageSize = 20 }) {
  const params = new URLSearchParams();
  params.set("quizId", quizId);
  params.set("page", page);
  params.set("pageSize", pageSize);
  const res = await api.get(`/api/assessment/attempts?${params.toString()}`);
  return res.data;
}

/** Get a single attempt (owner or admin) */
export async function getAttempt(attemptId) {
  const res = await api.get(`/api/assessment/attempts/${attemptId}`);
  return res.data;
}


/** Get full answers (with correct options and all options) for a given attempt */
export async function getAttemptAnswers(attemptId) {
  const res = await api.get(`/api/assessment/attempts/${attemptId}/answers`);
  return res.data; // AttemptAnswersResponse or wrapped {data}
}
