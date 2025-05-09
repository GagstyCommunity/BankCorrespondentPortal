import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getRiskLevelColor, formatDate } from "@/lib/utils";

export default function BankDashboard() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  
  // Fetch bank dashboard data
  const { data: bankStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/bank/stats"],
    enabled: !!user && user?.role === "bank",
  });

  if (isLoadingAuth || isLoadingStats) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Bank Officer Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
  const mockStats = {
    totalCSPs: 103,
    activeCSPs: 98,
    inactiveCSPs: 5,
    highRiskCSPs: 8,
    mediumRiskCSPs: 25,
    lowRiskCSPs: 70,
    totalDisputes: 12,
    openDisputes: 5,
    closedDisputes: 7,
    totalAudits: 87,
    pendingAudits: 12,
    completedAudits: 75,
    transactionsToday: 548,
    transactionsThisMonth: 12547,
    avgTransactionsPerCSP: 121
  };

  // CSP risk distribution
  const cspRiskDistribution = [
    {
      level: "Low Risk",
      count: mockStats.lowRiskCSPs,
      percentage: Math.round((mockStats.lowRiskCSPs / mockStats.totalCSPs) * 100),
      color: "bg-green-500"
    },
    {
      level: "Medium Risk",
      count: mockStats.mediumRiskCSPs,
      percentage: Math.round((mockStats.mediumRiskCSPs / mockStats.totalCSPs) * 100),
      color: "bg-yellow-500"
    },
    {
      level: "High Risk",
      count: mockStats.highRiskCSPs,
      percentage: Math.round((mockStats.highRiskCSPs / mockStats.totalCSPs) * 100),
      color: "bg-red-500"
    }
  ];

  // Recent high risk CSPs
  const recentHighRiskCSPs = [
    {
      id: "CSP-2146",
      name: "Rajiv Verma",
      location: "Chennai, Tamil Nadu",
      riskScore: 92,
      riskLevel: "high",
      lastAuditDate: "2025-05-02",
      status: "suspended",
      issue: "Multiple biometric verification failures"
    },
    {
      id: "CSP-7523",
      name: "Meena Sharma",
      location: "Kolkata, West Bengal",
      riskScore: 88,
      riskLevel: "high",
      lastAuditDate: "2025-05-01",
      status: "active",
      issue: "Unauthorized transaction methods"
    },
    {
      id: "CSP-8734",
      name: "Anil Gupta",
      location: "Delhi, New Delhi",
      riskScore: 75,
      riskLevel: "high",
      lastAuditDate: "2025-05-04",
      status: "active",
      issue: "KYC documentation discrepancies"
    }
  ];

  // Recent disputes
  const recentDisputes = [
    {
      id: 1,
      cspId: "CSP-5432",
      cspName: "Sanjay Kapoor",
      location: "Delhi, New Delhi",
      status: "open",
      type: "Transaction",
      reason: "Customer claims incorrect amount processed",
      submittedDate: "2025-05-08"
    },
    {
      id: 2,
      cspId: "CSP-7654",
      cspName: "Deepa Kumar",
      location: "Bangalore, Karnataka",
      status: "open",
      type: "Account",
      reason: "Wrong account details entered",
      submittedDate: "2025-05-07"
    },
    {
      id: 3,
      cspId: "CSP-2146",
      cspName: "Rajiv Verma",
      location: "Chennai, Tamil Nadu",
      status: "open",
      type: "Audit",
      reason: "Dispute on audit findings",
      submittedDate: "2025-05-06"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Bank Officer Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total CSPs</CardTitle>
            <CardDescription>All bank correspondents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockStats.totalCSPs}</p>
            <div className="flex items-center mt-2 text-sm">
              <Badge className="bg-green-500 mr-2">{mockStats.activeCSPs}</Badge>
              <span>Active</span>
              <Badge className="bg-red-500 ml-4 mr-2">{mockStats.inactiveCSPs}</Badge>
              <span>Suspended</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">High Risk CSPs</CardTitle>
            <CardDescription>Agents requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{mockStats.highRiskCSPs}</p>
            <p className="text-sm text-gray-500 mt-2">
              {Math.round((mockStats.highRiskCSPs / mockStats.totalCSPs) * 100)}% of total CSPs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Open Disputes</CardTitle>
            <CardDescription>Disputes requiring resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{mockStats.openDisputes}</p>
            <p className="text-sm text-gray-500 mt-2">
              {mockStats.completedAudits} resolved this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Today's Transactions</CardTitle>
            <CardDescription>Total transactions today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockStats.transactionsToday}</p>
            <p className="text-sm text-gray-500 mt-2">
              {mockStats.avgTransactionsPerCSP} avg. per active CSP
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>High Risk CSP Agents</CardTitle>
            <CardDescription>CSP agents requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentHighRiskCSPs.map(csp => (
                <div key={csp.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{csp.name}</h3>
                    <p className="text-sm text-gray-500">{csp.id} • {csp.location}</p>
                    <p className="text-sm mt-1">
                      Issue: <span className="text-red-600">{csp.issue}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getRiskLevelColor(csp.riskLevel)}>
                      Risk Score: {csp.riskScore}
                    </Badge>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">View Profile</Button>
                      <Button className="bg-purple-700 hover:bg-purple-800" size="sm">
                        Take Action
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-2">
                <Button variant="outline">View All High Risk CSPs</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSP Risk Distribution</CardTitle>
            <CardDescription>Risk level breakdown of agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cspRiskDistribution.map(risk => (
                <div key={risk.level}>
                  <div className="flex justify-between mb-2">
                    <span>{risk.level}</span>
                    <div className="flex items-center">
                      <span className="mr-2">{risk.count}</span>
                      <Badge className={risk.color}>{risk.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className={`${risk.color} h-2.5 rounded-full`} style={{ width: `${risk.percentage}%` }}></div>
                  </div>
                </div>
              ))}

              <div className="h-[200px] bg-gray-200 rounded-md flex items-center justify-center mt-4">
                <div className="text-center text-gray-500">
                  <p>Distribution Chart</p>
                  <p className="text-xs mt-1">Risk distribution visualization</p>
                </div>
                {/* In a real app, this would be a chart component */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Disputes</CardTitle>
            <CardDescription>Disputes needing resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDisputes.map(dispute => (
                <div key={dispute.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <Badge className="bg-yellow-500 mr-2">
                          {dispute.type}
                        </Badge>
                        <h3 className="font-semibold">{dispute.cspName}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {dispute.cspId} • {dispute.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                      {dispute.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm">{dispute.reason}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Submitted: {formatDate(new Date(dispute.submittedDate))}
                    </p>
                    <Button size="sm" className="bg-purple-700 hover:bg-purple-800">
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-2">
                <Button variant="outline">View All Disputes</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Audit Activities</CardTitle>
            <CardDescription>Latest audit reports and findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-semibold">CSP Audit Completed</p>
                <p className="text-sm">Ramesh Kumar (CSP-4521) passed the audit with no issues</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">{formatDate(new Date("2025-05-05"))}</p>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <p className="font-semibold">Critical Audit Findings</p>
                <p className="text-sm">Rajiv Verma (CSP-2146) has multiple compliance violations</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">{formatDate(new Date("2025-05-04"))}</p>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="font-semibold">Audit with Minor Issues</p>
                <p className="text-sm">Sunita Patel (CSP-6392) has minor documentation issues</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">{formatDate(new Date("2025-05-03"))}</p>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-semibold">Upcoming Audit</p>
                <p className="text-sm">Meena Sharma (CSP-7523) scheduled for auditing</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">{formatDate(new Date("2025-05-15"))}</p>
                  <Button variant="outline" size="sm">Details</Button>
                </div>
              </div>
              
              <div className="flex justify-center pt-2">
                <Button variant="outline">View All Audits</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}