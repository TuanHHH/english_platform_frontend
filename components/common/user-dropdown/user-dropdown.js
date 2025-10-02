"use client";

import {
  LayoutDashboard,
  LogOut,
  User as UserIcon, // vẫn dùng cho menu item
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

const UserDropdown = ({ user }) => {
  const router = useRouter();
  const logoutUser = useAuthStore((s) => s.logoutUser);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Bạn đã đăng xuất.");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Đăng xuất thất bại, vui lòng thử lại.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={user?.avatarUrl || "/default-avatar.png"}
              alt={user.fullName}
            />
            <AvatarFallback>
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline text-sm">{user.fullName}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-gray-700">
          Xin chào, {user.fullName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user?.roles?.includes("ADMIN") && (
          <DropdownMenuItem onClick={() => router.push("/admin")}>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Trang quản trị
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => router.push("/account")}>
          <UserIcon className="w-4 h-4 mr-2" />
          Tài khoản
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
