import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !location.includes("login")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, location, navigate]);

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch('/api/notifications/unread-count', {
            credentials: 'include',
          });
          
          if (res.ok) {
            const data = await res.json();
            setNotificationCount(data.count);
          }
        } catch (error) {
          console.error('Failed to fetch notification count:', error);
        }
      }
    };

    fetchNotificationCount();
    
    // Set up interval to check notifications periodically
    const interval = setInterval(fetchNotificationCount, 60000); // every minute
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await apiRequest("GET", "/api/logout", undefined);
      queryClient.clear();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show only children for login page or other public pages
  if (!isAuthenticated || location === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          user={user}
          notificationCount={notificationCount}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
