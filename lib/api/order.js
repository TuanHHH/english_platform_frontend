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

export async function getOrders(params = {}) {
  try {
    const queryParams = {
      page: params.page || 1,
      size: params.size || 10,
      sort: params.sort || "createdAt,desc"
    };

    // Add optional filters
    if (params.status) queryParams.status = params.status;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;

    const res = await api.get("/api/orders", {
      params: queryParams
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể lấy danh sách đơn hàng" };
  } catch (err) {
    console.error("Get orders error:", err);
    return { success: false, error: "Không thể lấy danh sách đơn hàng" };
  }
}

export async function getOrderById(orderId) {
  if (!orderId) {
    return { success: false, error: "Thiếu ID đơn hàng" };
  }

  try {
    const res = await api.get(`/api/orders/${orderId}/details`);

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
      default:
        console.error("Get order by ID error:", err);
        break;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getMyOrders(page = 1, pageSize = 10, sort = "createdAt,desc") {
  try {
    const res = await api.get("/api/orders/my-orders", {
      params: {
        page: page,
        size: pageSize,
        sort: sort
      }
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể lấy danh sách đơn hàng của bạn" };
  } catch (err) {
    return { success: false, error: "Không thể lấy danh sách đơn hàng của bạn" };
  }
}

export async function getMyOrderById(orderId) {
  if (!orderId) {
    return { success: false, error: "Thiếu ID đơn hàng" };
  }

  try {
    const res = await api.get(`/api/orders/my-order/${orderId}`);

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
      default:
        console.error("Get order by ID error:", err);
        break;
    }
    return { success: false, error: errorMessage };
  }
}