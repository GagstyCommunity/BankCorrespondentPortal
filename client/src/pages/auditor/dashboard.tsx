import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";

export default function AuditorDashboard() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  
  // Fetch auditor dashboard data
  const { data: auditorStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/auditor/stats"],
    enabled: !!user && user?.role === "auditor",
  });

  if (isLoadingAuth || isLoadingStats) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Auditor Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading data...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center">
                <div className="animate-pulse h-16 w-16 bg-gray-300 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Loading data...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center">
                <div className="animate-pulse h-16 w-16 bg-gray-300 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Loading data...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center">
                <div className="animate-pulse h-16 w-16 bg-gray-300 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Sample data for demonstration
  const auditsCompletedToday = 2;
  const totalAssignedAgents = 12;
  const pendingAudits = 5;
  const upcomingAudits = 3;

  // Sample assigned CSPs
  const assignedCSPs = [
    {
      id: 1,
      agentName: "Ramesh Kumar",
      agentId: "CSP-4521",
      location: "Mumbai, Maharashtra",
      riskScore: 75,
      lastAuditDate: "2025-04-15",
      status: "high-risk"
    },
    {
      id: 2,
      agentName: "Anil Gupta",
      agentId: "CSP-8734",
      location: "Delhi, New Delhi",
      riskScore: 42,
      lastAuditDate: "2025-04-22",
      status: "medium-risk"
    },
    {
      id: 3,
      agentName: "Sunita Patel",
      agentId: "CSP-6392",
      location: "Bangalore, Karnataka",
      riskScore: 28,
      lastAuditDate: "2025-04-30",
      status: "low-risk"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Auditor Dashboard</h1>
        <Button className="bg-purple-700 hover:bg-purple-800">
          Start New Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Today's Audits</CardTitle>
            <CardDescription>Completed audits today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{auditsCompletedToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Assigned CSPs</CardTitle>
            <CardDescription>Total CSPs under your supervision</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAssignedAgents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Audits</CardTitle>
            <CardDescription>Audits waiting to be completed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{pendingAudits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Upcoming</CardTitle>
            <CardDescription>Scheduled for next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{upcomingAudits}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assigned CSPs</CardTitle>
            <CardDescription>CSP agents assigned to you for auditing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedCSPs.map(csp => (
                <div key={csp.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{csp.agentName}</h3>
                    <p className="text-sm text-gray-500">{csp.agentId} · {csp.location}</p>
                    <p className="text-sm mt-1">
                      Last Audit: {formatDate(new Date(csp.lastAuditDate))}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      csp.status === "high-risk" ? "bg-red-500" :
                      csp.status === "medium-risk" ? "bg-yellow-500" :
                      "bg-green-500"
                    }>
                      Risk Score: {csp.riskScore}
                    </Badge>
                    <div className="mt-2">
                      <Button size="sm" className="bg-purple-700 hover:bg-purple-800">
                        Schedule Audit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Calendar</CardTitle>
            <CardDescription>Upcoming scheduled audits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-semibold">Today</p>
                <p className="text-sm">Ramesh Kumar (CSP-4521)</p>
                <p className="text-xs text-gray-500">Mumbai, Maharashtra</p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-blue-500">10:30 AM</Badge>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-semibold">Today</p>
                <p className="text-sm">Anil Gupta (CSP-8734)</p>
                <p className="text-xs text-gray-500">Delhi, New Delhi</p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-blue-500">2:15 PM</Badge>
                </div>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-4 py-2">
                <p className="font-semibold">Tomorrow</p>
                <p className="text-sm">Sunita Patel (CSP-6392)</p>
                <p className="text-xs text-gray-500">Bangalore, Karnataka</p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline">11:00 AM</Badge>
                </div>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-4 py-2">
                <p className="font-semibold">May 15, 2025</p>
                <p className="text-sm">Rajiv Verma (CSP-2146)</p>
                <p className="text-xs text-gray-500">Chennai, Tamil Nadu</p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline">9:30 AM</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}