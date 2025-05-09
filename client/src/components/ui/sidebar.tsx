import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  AlertCircle,
  BarChart3,
  Building,
  Camera,
  CheckSquare,
  FileCog,
  FileWarning,
  Files,
  FileText,
  Home,
  LogOut,
  MapPin,
  MessageSquare,
  Route,
  Settings,
  ShieldAlert,
  User,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User as UserType } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  user: UserType | null | undefined;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({ user, isOpen, onClose, onLogout }: SidebarProps) {
  const [location] = useLocation();
  const [initials, setInitials] = useState("");

  useEffect(() => {
    if (user) {
      const firstInitial = user.firstName?.[0] || "";
      const lastInitial = user.lastName?.[0] || "";
      setInitials((firstInitial + lastInitial).toUpperCase());
    }
  }, [user]);

  const isActive = (path: string) => {
    return location === path;
  };

  // Get display name
  const displayName = user 
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "User"
    : "User";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "w-64 bg-white shadow-md h-full flex-shrink-0 z-30 fixed lg:relative lg:block transition-all duration-300 ease-in-out",
        isOpen ? "left-0" : "-left-64 lg:left-0"
      )}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-primary">CSP Portal</h1>
          </div>
        </div>
        
        <div className="py-4 px-3">
          {/* User Profile Section */}
          <div className="flex items-center px-2 py-3 mb-6">
            <Avatar className="h-10 w-10 border-2 border-secondary">
              <AvatarImage src={user?.profileImageUrl || ""} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="space-y-1">
            {/* Agent Navigation */}
            {user?.role === "agent" && (
              <>
                <SidebarLink href="/agent/dashboard" icon={<Home />} isActive={isActive("/agent/dashboard")}>Dashboard</SidebarLink>
                <SidebarLink href="/agent/profile" icon={<User />} isActive={isActive("/agent/profile")}>My Profile</SidebarLink>
                <SidebarLink href="/agent/transactions" icon={<BarChart3 />} isActive={isActive("/agent/transactions")}>Transactions</SidebarLink>
                <SidebarLink href="/agent/check-in" icon={<Camera />} isActive={isActive("/agent/check-in")}>Check-In</SidebarLink>
                <SidebarLink href="/agent/location-logs" icon={<MapPin />} isActive={isActive("/agent/location-logs")}>Location Logs</SidebarLink>
              </>
            )}
            
            {/* Admin Navigation */}
            {user?.role === "admin" && (
              <>
                <SidebarLink href="/admin/dashboard" icon={<Home />} isActive={isActive("/admin/dashboard")}>Dashboard</SidebarLink>
                <SidebarLink href="/admin/fraud-engine" icon={<ShieldAlert />} isActive={isActive("/admin/fraud-engine")}>Fraud Engine</SidebarLink>
                <SidebarLink href="/admin/map-view" icon={<MapPin />} isActive={isActive("/admin/map-view")}>Map View</SidebarLink>
                <SidebarLink href="/admin/manage-users" icon={<Users />} isActive={isActive("/admin/manage-users")}>Manage Users</SidebarLink>
                <SidebarLink href="/admin/audit-logs" icon={<FileText />} isActive={isActive("/admin/audit-logs")}>Audit Logs</SidebarLink>
                <SidebarLink href="/admin/notifications" icon={<AlertCircle />} isActive={isActive("/admin/notifications")}>Notifications</SidebarLink>
              </>
            )}
            
            {/* Auditor Navigation */}
            {user?.role === "auditor" && (
              <>
                <SidebarLink href="/auditor/dashboard" icon={<Home />} isActive={isActive("/auditor/dashboard")}>Dashboard</SidebarLink>
                <SidebarLink href="/auditor/assigned-csps" icon={<CheckSquare />} isActive={isActive("/auditor/assigned-csps")}>Assigned CSPs</SidebarLink>
                <SidebarLink href="/auditor/routes" icon={<Route />} isActive={isActive("/auditor/routes")}>Routes</SidebarLink>
                <SidebarLink href="/auditor/audit-submissions" icon={<FileCog />} isActive={isActive("/auditor/audit-submissions")}>Audit Submissions</SidebarLink>
                <SidebarLink href="/auditor/audit-history" icon={<Files />} isActive={isActive("/auditor/audit-history")}>Audit History</SidebarLink>
              </>
            )}
            
            {/* Bank Officer Navigation */}
            {user?.role === "bank" && (
              <>
                <SidebarLink href="/bank/dashboard" icon={<Home />} isActive={isActive("/bank/dashboard")}>Dashboard</SidebarLink>
                <SidebarLink href="/bank/region-csps" icon={<Building />} isActive={isActive("/bank/region-csps")}>Region CSPs</SidebarLink>
                <SidebarLink href="/bank/reports" icon={<FileText />} isActive={isActive("/bank/reports")}>Reports</SidebarLink>
                <SidebarLink href="/bank/disputes" icon={<MessageSquare />} isActive={isActive("/bank/disputes")}>Disputes</SidebarLink>
                <SidebarLink href="/bank/audit-reviews" icon={<FileWarning />} isActive={isActive("/bank/audit-reviews")}>Audit Reviews</SidebarLink>
              </>
            )}
          </nav>
        </div>
        
        {/* Logout Section */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <button 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 w-full"
            onClick={onLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

function SidebarLink({ href, icon, children, isActive }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <a className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md w-full",
        isActive 
          ? "text-gray-900 bg-[rgba(106,13,173,0.1)] border-l-4 border-primary font-semibold" 
          : "text-gray-600 hover:bg-gray-100"
      )}>
        <span className={cn(
          "mr-3 text-lg",
          isActive ? "text-primary" : "text-gray-500"
        )}>
          {icon}
        </span>
        {children}
      </a>
    </Link>
  );
}
