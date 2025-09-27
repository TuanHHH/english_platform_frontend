export const navItems = [
  { name: "Trang chủ", path: "/" },
  { name: "Luyện tập", path: "/practice-tests" },
  { name: "Diễn đàn", path: "/forum" },
  { name: "Khóa học", path: "/courses" },
  { name: "Lịch học", path: "/study-schedule" },
];

export const ErrorCode = {
  EXCEPTION: 1,
  BAD_CREDENTIALS: 2,
  RESOURCE_NOT_FOUND: 3,
  UNAUTHORIZED: 4,
  RESOURCE_INVALID: 5,
  RESOURCE_ALREADY_EXISTS: 6,
  METHOD_NOT_VALID: 7,
  CANNOT_DELETE: 8,
  FORBIDDEN: 9,
};

export const ValidationPattern = {
  EMAIL_PATTERN: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/,
};
