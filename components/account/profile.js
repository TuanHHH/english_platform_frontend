"use client";

import { useEffect, useState } from "react";
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
import { changePassword, updateUser } from "@/lib/api/user"; // ❗ chỉ giữ changePassword & updateUser
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store"; // ❗ dùng zustand store

const ProfileCard = () => {
  const { user, isLoggedIn, hasHydrated, fetchUser } = useAuthStore();

  const [hasChanges, setHasChanges] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  // Đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Khi store hydrate + login: nếu chưa có user thì fetch
  useEffect(() => {
    if (!hasHydrated) return;
    if (isLoggedIn && !user) {
      fetchUser(true);
    }
  }, [hasHydrated, isLoggedIn, user, fetchUser]);

  // Đồng bộ form từ store.user
  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setAvatarPreview(user.avatarUrl || null);
    setHasChanges(false);
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      setHasChanges(true);
    }
  };

  const handleAvatarRemove = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setHasChanges(true);
  };

  // Cập nhật hồ sơ -> gọi API -> refetch store; fallback: patch store local nếu refetch lỗi
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      // Nếu có flow upload thực, xử lý upload ở đây để lấy avatarUrl chuẩn từ server
      const payload = {
        fullName,
        email, // hiện tại input đang disabled; vẫn gửi để server làm chuẩn nếu cần
        avatarUrl: avatarPreview || null,
      };

      const res = await updateUser(payload);

      if (res?.success) {
        // Ưu tiên đồng bộ từ server
        const refetch = await fetchUser(true);
        if (refetch?.error) {
          // Fallback: patch local (nhanh gọn, lần sau sẽ được server sửa lại)
          useAuthStore.setState((s) => ({
            user: s.user ? { ...s.user, ...payload } : { ...payload },
          }));
        }

        toast.success("Hồ sơ được cập nhật thành công");
        setHasChanges(false);
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
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarRemove}
                  >
                    Xóa avatar
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
                  setFullName(e.target.value);
                  setHasChanges(true);
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
                  setEmail(e.target.value);
                  setHasChanges(true);
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
