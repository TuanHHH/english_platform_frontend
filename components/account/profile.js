"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";
import { changePassword, updateUser } from "@/lib/api/user";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

const ProfileCard = () => {
  const { user, isLoggedIn, hasHydrated } = useAuthStore();

  const [hasChanges, setHasChanges] = useState(false);

  // Preview đang hiển thị ở UI (có thể là link https từ backend hoặc blob: khi vừa chọn file)
  const [avatarPreview, setAvatarPreview] = useState(null);
  // Data URL chỉ tồn tại khi người dùng vừa chọn ảnh mới mà CHƯA lưu
  const [avatarDataUrl, setAvatarDataUrl] = useState(null);
  // Có đang có ảnh mới chờ lưu hay không (để quyết định hiển thị nút hủy)
  const [avatarPending, setAvatarPending] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Tham chiếu tới input file để có thể reset value
  const fileInputRef = useRef(null);

  // Không tự fetch khi hydrate (tuân thủ yêu cầu)
  useEffect(() => {
    if (!hasHydrated) return;
  }, [hasHydrated]);

  // Khi đổi user -> đồng bộ form và preview từ backend, và reset trạng thái pending
  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setAvatarPreview(user.avatarUrl || null);
    setAvatarDataUrl(null);
    setAvatarPending(false);
    setHasChanges(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [user]);

  // Giải phóng object URL cũ nếu là blob:
  useEffect(() => {
    return () => {
      // cleanup khi unmount
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, []); // chỉ cần khi unmount

  // Mỗi lần avatarPreview thay đổi sang blob mới -> revoke blob cũ
  const setPreviewSafely = (nextUrl) => {
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return nextUrl;
    });
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // data URL
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Tính lại hasChanges dựa vào form + trạng thái avatarPending
  const recomputeHasChanges = (next = {}) => {
    const nextFullName = next.fullName !== undefined ? next.fullName : fullName;
    const nextEmail = next.email !== undefined ? next.email : email;
    const nextAvatarPending =
      next.avatarPending !== undefined ? next.avatarPending : avatarPending;

    setHasChanges(
      (nextFullName || "") !== (user?.fullName || "") ||
        (nextEmail || "") !== (user?.email || "") ||
        nextAvatarPending // chỉ cần đang pending avatar là coi như có thay đổi
    );
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview cho UI
    const url = URL.createObjectURL(file);
    setPreviewSafely(url);

    try {
      // Convert sang base64 để gửi JSON avatarUrl (nếu backend chấp nhận)
      const dataUrl = await fileToDataUrl(file);
      setAvatarDataUrl(dataUrl);
      setAvatarPending(true);
      recomputeHasChanges({ avatarPending: true });
    } catch (err) {
      console.error("Avatar to DataURL error:", err);
      toast.error("Không đọc được ảnh. Vui lòng thử ảnh khác.");
      // quay lại ảnh ban đầu
      setPreviewSafely(user?.avatarUrl || null);
      setAvatarDataUrl(null);
      setAvatarPending(false);
      recomputeHasChanges({ avatarPending: false });
    }
  };

  // Hủy ảnh vừa chọn (chưa lưu) -> quay về avatar cũ, ẩn nút hủy
  const handleAvatarCancel = () => {
    // Xoá preview blob nếu có
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarDataUrl(null);
    setAvatarPending(false);
    setPreviewSafely(user?.avatarUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    recomputeHasChanges({ avatarPending: false });
  };

  // Cập nhật hồ sơ
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      const payload = {
        fullName,
        email, // đang disabled ở UI nhưng vẫn gửi để backend quyết định
        // Nếu không pending avatar -> giữ nguyên URL từ backend
        avatarUrl:
          avatarPending && avatarDataUrl
            ? avatarDataUrl
            : user?.avatarUrl || null,
      };

      const res = await updateUser(payload);

      if (res?.success) {
        // Cập nhật store lạc quan
        useAuthStore.setState((s) => ({
          user: s.user
            ? {
                ...s.user,
                fullName,
                email,
                avatarUrl:
                  (res.data && res.data.avatarUrl) ??
                  payload.avatarUrl ??
                  s.user.avatarUrl,
              }
            : { fullName, email, avatarUrl: payload.avatarUrl || null },
        }));

        // Sau khi lưu xong -> không còn pending
        setAvatarDataUrl(null);
        setAvatarPending(false);
        setPreviewSafely(
          (res?.data && res.data.avatarUrl) ||
            payload.avatarUrl ||
            user?.avatarUrl ||
            null
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        recomputeHasChanges({ avatarPending: false });
        toast.success("Hồ sơ được cập nhật thành công");
      } else {
        toast.error(res?.error || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi cập nhật");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }
    setLoading(true);
    const res = await changePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );
    setLoading(false);

    if (res?.success) {
      toast.success("Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(res?.error || "Đổi mật khẩu thất bại");
    }
  };

  if (!hasHydrated) {
    return <div className="text-sm text-muted-foreground">Đang tải hồ sơ…</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Hồ sơ cá nhân */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Hồ sơ cá nhân
          </CardTitle>
          <CardDescription>Thông tin cá nhân</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs text-center px-2">
                    No Avatar
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-500 text-sm text-center"
                >
                  Upload Avatar
                </Label>
                <Input
                  id="avatar"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                {avatarPending && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarCancel}
                  >
                    Hủy ảnh vừa chọn
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label className="mb-2" htmlFor="fullName">
                Tên
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => {
                  const v = e.target.value;
                  setFullName(v);
                  recomputeHasChanges({ fullName: v });
                }}
              />
            </div>

            <div>
              <Label className="mb-2" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                disabled
                value={email}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmail(v);
                  recomputeHasChanges({ email: v });
                }}
              />
            </div>

            {hasChanges && (
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-500"
                disabled={updatingProfile}
              >
                {updatingProfile ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Đổi mật khẩu */}
      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>Tăng bảo mật tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label className="mb-2">Mật khẩu hiện tại</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Mật khẩu mới</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Xác nhận mật khẩu</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? "Đang đổi..." : "Xác nhận đổi mật khẩu"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;