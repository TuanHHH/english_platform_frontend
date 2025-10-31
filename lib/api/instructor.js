import api from "@/lib/axios";
import { ErrorCode } from "@/lib/constants";

export async function getUserInstructorRequests() {
  try {
    const res = await api.get(`/api/instructor-requests/me/all`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Lấy danh sách yêu cầu thất bại" };
  } catch (err) {
    return { success: false, error: "Lấy danh sách yêu cầu thất bại" };
  }
}

export async function createInstructorRequest({ bio, expertise, experienceYears, qualification, reason }) {
  try {
    const res = await api.post(`/api/instructor-requests`, {
      bio,
      expertise,
      experienceYears,
      qualification,
      reason
    });
    if (res.status === 201) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Tạo yêu cầu thất bại" };
  } catch (err) {
    console.error(err);
    const code = err?.response?.data?.code;
    if (code === ErrorCode.RESOURCE_ALREADY_EXISTS) {
      return { success: false, error: "Bạn đang có yêu cầu chờ duyệt, vui lòng thử lại sau" };
    }
    if (code == ErrorCode.RESOURCE_INVALID) {
      return { success: false, error: "Bạn đã là giảng viên" };
    }
    return { success: false, error: "Tạo yêu cầu thất bại" };
  }
}

export async function uploadProofs(files) {
  try {
    const formData = new FormData();

    // Append multiple files
    files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('folder', 'certificate_proofs');

    const res = await api.post('/api/media/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Upload file thất bại" };
  } catch (err) {
    return { success: false, error: "Upload file thất bại" };
  }
}

export async function uploadCertificateProofs(requestId, fileUrls) {
  try {
    const res = await api.post(`/api/instructor-requests/${requestId}/certificate-proofs`, {
      fileUrls
    });
    if (res.status === 201) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Tải lên chứng chỉ thất bại" };
  } catch (err) {
    return { success: false, error: "Tải lên chứng chỉ thất bại" };
  }
}

export async function getInstructorRequestsByUserAndId(requestId) {
  try {
    const res = await api.get(`/api/instructor-requests/me/${requestId}`);
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Lấy yêu cầu thất bại" };
  } catch (err) {
    return { success: false, error: "Lấy yêu cầu thất bại" };
  }
}

export async function updateInstructorRequest({requestId, bio, expertise, experienceYears, qualification, reason }) {
  try {
    const res = await api.patch(`/api/instructor-requests/${requestId}`, {
      bio,
      expertise,
      experienceYears,
      qualification,
      reason
    });
    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Cập nhật yêu cầu thất bại" };
  } catch (err) {
    console.error(err);
    const code = err?.response?.data?.code;
    if (code === ErrorCode.RESOURCE_NOT_FOUND) {
      return { success: false, error: "Không tìm thấy yêu cầu" };
    }
    if (code == ErrorCode.RESOURCE_INVALID) {
      return { success: false, error: "Bạn chỉ cập nhật được request đang chờ duyệt" };
    }
    return { success: false, error: "Cập nhật yêu cầu thất bại" };
  }
}

export async function deleteCertificateProof(requestId, proofId) {
  try {
    const res = await api.delete(`/api/instructor-requests/${requestId}/certificate-proofs/${proofId}`);
    if (res.status === 200 || res.status === 204) {
      return { success: true };
    }
    return { success: false, error: "Xóa chứng chỉ thất bại" };
  } catch (err) {
    const message = err?.response?.data?.message || "Xóa chứng chỉ thất bại";
    return { success: false, error: message };
  }
}
