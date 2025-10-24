import api from "@/lib/axios";
import { ErrorCode } from "@/lib/constants";

export async function createOrder(orderRequest) {
  if (!orderRequest) {
    return { success: false, error: "Thiếu thông tin đơn hàng" };
  }

  try {
    const res = await api.post("/api/orders", orderRequest);

    if (res.status === 201) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể tạo đơn hàng" };
  } catch (err) {
    const code = err?.response?.data?.code;
    switch (code) {
      case ErrorCode.RESOURCE_ALREADY_OWNER:
        errorMessage = "Đã có khóa học đã được mua, vui lòng loại bỏ khỏi đơn hàng trước khi mua";
        break;
      default:
        console.error("Get order by ID error:", err);
        break;
    }
    let errorMessage = "Không thể tạo đơn hàng, vui lòng thử lại sau";
    return { success: false, error: errorMessage };
  }
}

export async function getOrders(page = 1, pageSize = 10) {
  try {
    const res = await api.get("/api/orders", {
      params: {
        page: page,
        size: pageSize
      }
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể lấy danh sách đơn hàng" };
  } catch (err) {
    const code = err?.response?.data?.code;
    let errorMessage = "Không thể lấy danh sách đơn hàng";

    switch (code) {
      case ErrorCode.UNAUTHORIZED:
        errorMessage = "Bạn cần đăng nhập để xem đơn hàng";
        break;
      default:
        console.error("Get orders error:", err);
        break;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getOrderById(orderId) {
  if (!orderId) {
    return { success: false, error: "Thiếu ID đơn hàng" };
  }

  try {
    const res = await api.get(`/api/orders/${orderId}`);

    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể lấy thông tin đơn hàng" };
  } catch (err) {
    const code = err?.response?.data?.code;
    let errorMessage = "Không thể lấy thông tin đơn hàng";

    switch (code) {
      case ErrorCode.RESOURCE_NOT_FOUND:
        errorMessage = "Không tìm thấy đơn hàng";
        break;
      case ErrorCode.FORBIDDEN:
        errorMessage = "Bạn không có quyền xem đơn hàng này";
        break;
      default:
        console.error("Get order by ID error:", err);
        break;
    }
    return { success: false, error: errorMessage };
  }
}