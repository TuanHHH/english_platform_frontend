import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Edit, Lock, Unlock } from "lucide-react";

const getInitials = (str) =>
  (str || "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const getStatusColor = (isActive) =>
  isActive ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive";

const getToggleAction = (isActive) =>
  isActive
    ? {
        label: "Khóa",
        icon: <Lock className="w-4 h-4" />,
        className: "text-destructive",
        willLock: true,
      }
    : {
        label: "Mở khóa",
        icon: <Unlock className="w-4 h-4" />,
        className: "text-green-600",
        willLock: false,
      };

const UserCard = ({ user, onToggle }) => {
  const action = getToggleAction(user.isActive);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:shadow-sm transition w-full gap-4">
      {/* === Avatar + Info === */}
      <div className="flex items-center space-x-4 min-w-0">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar
            className={`h-12 w-12 ${
              user.isActive ? "" : "ring-2 ring-destructive/30"
            }`}
          >
            <AvatarImage
              src={user.avatarUrl || undefined}
              alt={user.fullName || user.email}
            />
            <AvatarFallback className="bg-gradient-primary text-white font-semibold">
              {getInitials(user.fullName || user.email)}
            </AvatarFallback>
          </Avatar>

          {/* Badge */}
          <span
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background ${
              user.isActive ? "bg-green-500" : "bg-red-500"
            }`}
            title={user.isActive ? "Đang hoạt động" : "Đã khóa"}
          ></span>
        </div>

        {/* User info */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{user.fullName}</h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${getStatusColor(
                user.isActive
              )}`}
            >
              {user.isActive ? "Hoạt động" : "Tạm khóa"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* === Action buttons === */}
      <div className="flex items-center justify-end space-x-2 sm:ml-auto sm:flex-shrink-0">
        <Button variant="ghost" size="sm" className="flex items-center justify-center">
          <Mail className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center justify-center">
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center justify-center gap-1 min-w-[85px] sm:min-w-[95px] ${action.className}`}
          onClick={() => onToggle(user, action.willLock)}
        >
          {action.icon}
          <span className="hidden sm:inline">{action.label}</span>
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
