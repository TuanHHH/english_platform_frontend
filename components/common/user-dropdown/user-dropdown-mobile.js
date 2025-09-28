"use client";

import {
    User, LayoutDashboard, LogOut
    // , MessageCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store"; 
// import Notification from "@/components/common/notification";

const UserDropdownMobile = ({ user }) => {
    const router = useRouter();
    const logout = useAuthStore((s) => s.logoutUser);
    if (!user) return null;

    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Bạn đã đăng xuất");
            router.push("/");
        } catch (err) {
            toast.error("Đăng xuất thất bại");
        }
    };

    return (
        <div className="flex flex-col gap-2 pt-4">
            {/* <Notification /> */}
            <p className="text-sm text-gray-600">
                Xin chào, <strong>{user.fullName}</strong>
            </p>

            {user?.roles?.includes("ADMIN") && (
                <Button
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={() => router.push("/admin")}
                >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Trang quản trị
                </Button>
            )}
            <Button
                variant="ghost"
                className="justify-start w-full"
                onClick={() => router.push("/account")}
            >
                <User className="w-4 h-4 mr-2" />
                Tài khoản
            </Button>

            {/* <Button
                variant="ghost"
                className="justify-start w-full"
                onClick={() => router.push("/feedback")}
            >
                <MessageCircle className="w-4 h-4 mr-2" />
                Góp ý
            </Button> */}

            <Button
                variant="ghost"
                className="justify-start w-full text-red-600"
                onClick={handleLogout}
            >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
            </Button>
        </div>
    );
};

export default UserDropdownMobile;
