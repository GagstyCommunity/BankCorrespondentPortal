import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  user: User | null | undefined;
  notificationCount: number;
  onMenuClick: () => void;
}

export default function Header({ user, notificationCount, onMenuClick }: HeaderProps) {
  const [location, navigate] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications
  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: showNotifications,
  });

  // Get display name and initials
  const displayName = user 
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "User"
    : "User";
  
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  const getPageTitle = () => {
    const path = location.split("/");
    if (path.length < 3) return "Dashboard";
    
    // Capitalize and format the last segment of the path
    const lastSegment = path[path.length - 1];
    return lastSegment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="bg-white border-b border-gray-200 flex items-center h-16 px-6">
      {/* Mobile menu button */}
      <button 
        className="text-gray-500 focus:outline-none lg:hidden mr-3"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex-1 flex justify-between">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-bold text-primary lg:hidden">{getPageTitle()}</h1>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notifications */}
          <DropdownMenu 
            open={showNotifications} 
            onOpenChange={setShowNotifications}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications && notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification: any) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-sm text-gray-500">{notification.message}</span>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-primary cursor-pointer flex justify-center"
                onClick={() => {
                  if (user?.role === "admin") {
                    navigate("/admin/notifications");
                  } else {
                    // TODO: Add notifications page for other roles
                  }
                  setShowNotifications(false);
                }}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-2 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={displayName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-gray-900">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    if (user?.role === "agent") {
                      navigate("/agent/profile");
                    } else {
                      // TODO: Add profile page for other roles
                    }
                  }}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    if (user?.role === "agent") {
                      navigate("/agent/dashboard");
                    } else if (user?.role === "admin") {
                      navigate("/admin/dashboard");
                    } else if (user?.role === "auditor") {
                      navigate("/auditor/dashboard");
                    } else if (user?.role === "bank") {
                      navigate("/bank/dashboard");
                    }
                  }}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
