
import api from "@/lib/axios";
import { ErrorCode } from "@/lib/constants";

export async function createStripeCheckout(orderId) {
  if (!orderId) {
    return { success: false, error: "Thiếu ID đơn hàng" };
  }

  try {
    const res = await api.post("/api/payments/stripe/checkout", {
      orderId: orderId
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể tạo thanh toán Stripe" };
  } catch (err) {
    const code = err?.response?.data?.code;
    let errorMessage = "Không thể tạo thanh toán Stripe, vui lòng thử lại sau";

    switch (code) {
      case ErrorCode.UNAUTHORIZED:
        errorMessage = "Bạn cần đăng nhập để thực hiện thanh toán";
        break;
      case ErrorCode.RESOURCE_NOT_FOUND:
        errorMessage = "Không tìm thấy đơn hàng";
        break;
      case ErrorCode.RESOURCE_INVALID:
        errorMessage = "Đơn hàng không hợp lệ để thanh toán";
        break;
      case ErrorCode.FORBIDDEN:
        errorMessage = "Bạn không có quyền thanh toán đơn hàng này";
        break;
      case ErrorCode.OPERATION_NOT_ALLOWED:
        errorMessage = "Không thể thanh toán đơn hàng này";
        break;
      default:
        console.error("Create Stripe checkout error:", err);
        break;
    }
    return { success: false, error: errorMessage };
  }
}

export async function createPayOSCheckout(orderId) {
  if (!orderId) {
    return { success: false, error: "Thiếu ID đơn hàng" };
  }

  try {
    const res = await api.post("/api/payments/payos/checkout", {
      orderId: orderId
    });

    if (res.status === 200) {
      return { success: true, data: res.data?.data };
    }
    return { success: false, error: "Không thể tạo thanh toán PayOS" };
  } catch (err) {
    const code = err?.response?.data?.code;
    let errorMessage = "Không thể tạo thanh toán PayOS, vui lòng thử lại sau";

    switch (code) {
      case ErrorCode.UNAUTHORIZED:
        errorMessage = "Bạn cần đăng nhập để thực hiện thanh toán";
        break;
      case ErrorCode.RESOURCE_NOT_FOUND:
        errorMessage = "Không tìm thấy đơn hàng";
        break;
      case ErrorCode.RESOURCE_INVALID:
        errorMessage = "Đơn hàng không hợp lệ để thanh toán";
        break;
      case ErrorCode.FORBIDDEN:
        errorMessage = "Bạn không có quyền thanh toán đơn hàng này";
        break;
      case ErrorCode.OPERATION_NOT_ALLOWED:
        errorMessage = "Không thể thanh toán đơn hàng này";
        break;
      default:
        console.error("Create PayOS checkout error:", err);
        break;
    }
    return { success: false, error: errorMessage };
  }
}