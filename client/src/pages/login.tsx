import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function Login() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on user role
      if (user?.role === "agent") {
        navigate("/agent/dashboard");
      } else if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "auditor") {
        navigate("/auditor/dashboard");
      } else if (user?.role === "bank") {
        navigate("/bank/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-800 p-4">
      <Card className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary font-heading">Bank Correspondent Portal</h1>
            <p className="text-gray-600 mt-2">Secure and Efficient Banking Services</p>
          </div>
          
          <div className="space-y-6">
            <p className="text-center text-sm text-gray-600">
              Welcome to the Bank Correspondent Portal. Log in to access your dashboard and services.
            </p>
            
            <Button 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Need help? <a href="#" className="text-primary font-medium">Contact Support</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
