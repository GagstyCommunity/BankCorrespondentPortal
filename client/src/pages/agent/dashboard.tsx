import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getRiskLevelColor, formatDate, formatCurrency } from "@/lib/utils";

export default function AgentDashboard() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  
  // Fetch agent dashboard data
  const { data: agentStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/agent/stats"],
    enabled: !!user && user?.role === "agent",
  });

  if (isLoadingAuth || isLoadingStats) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Agent Dashboard</h1>
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
  const mockAgentProfile = {
    name: "Ramesh Kumar",
    id: "CSP-4521",
    location: "Mumbai, Maharashtra",
    address: "123 Main Street, Andheri East, Mumbai, 400069",
    phone: "+91 98765 43210",
    riskLevel: "medium",
    riskScore: 45,
    lastAuditDate: "2025-04-15",
    nextAuditDate: "2025-05-15",
    status: "active",
    joinDate: "2024-01-10"
  };

  const mockStats = {
    transactionsToday: 12,
    transactionsThisMonth: 345,
    totalValueToday: 45000,
    totalValueThisMonth: 1250000,
    lastCheckIn: "2025-05-09T08:30:00",
    accountsOpened: 5,
    customerAssisted: 18
  };

  const mockTransactions = [
    {
      id: 1,
      type: "Cash Deposit",
      amount: 15000,
      customerName: "Sunil Mehta",
      accountNumber: "XXXX5678",
      timestamp: "2025-05-09T14:30:00",
      status: "completed"
    },
    {
      id: 2,
      type: "Account Opening",
      amount: 5000,
      customerName: "Priya Singh",
      accountNumber: "XXXX9012",
      timestamp: "2025-05-09T12:15:00",
      status: "completed"
    },
    {
      id: 3,
      type: "Bill Payment",
      amount: 2500,
      customerName: "Rahul Sharma",
      accountNumber: "XXXX3456",
      timestamp: "2025-05-09T11:00:00",
      status: "completed"
    },
    {
      id: 4,
      type: "Cash Withdrawal",
      amount: 7500,
      customerName: "Amit Patel",
      accountNumber: "XXXX7890",
      timestamp: "2025-05-09T10:45:00",
      status: "completed"
    },
    {
      id: 5,
      type: "Money Transfer",
      amount: 10000,
      customerName: "Neha Verma",
      accountNumber: "XXXX2345",
      timestamp: "2025-05-09T09:30:00",
      status: "completed"
    }
  ];

  const mockAlerts = [
    {
      id: 1,
      message: "Your biometric check-in is due today",
      type: "reminder",
      timestamp: "2025-05-09T07:30:00"
    },
    {
      id: 2,
      message: "Your next audit is scheduled for May 15, 2025",
      type: "info",
      timestamp: "2025-05-08T16:45:00"
    },
    {
      id: 3,
      message: "Please update your contact information",
      type: "action",
      timestamp: "2025-05-07T14:20:00"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Agent Dashboard</h1>
        <Button className="bg-purple-700 hover:bg-purple-800">
          Check-In Now
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Today's Transactions</CardTitle>
            <CardDescription>Number of transactions today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockStats.transactionsToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Transaction Value</CardTitle>
            <CardDescription>Total value processed today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(mockStats.totalValueToday)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Last Check-In</CardTitle>
            <CardDescription>Your last biometric verification</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatDate(new Date(mockStats.lastCheckIn))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Risk Score</CardTitle>
            <CardDescription>Your current trust rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <p className="text-3xl font-bold mr-2">{mockAgentProfile.riskScore}</p>
              <Badge className={getRiskLevelColor(mockAgentProfile.riskLevel)}>
                {mockAgentProfile.riskLevel.charAt(0).toUpperCase() + mockAgentProfile.riskLevel.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest transaction activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map(transaction => (
                <div key={transaction.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{transaction.type}</h3>
                    <p className="text-sm text-gray-500">
                      {transaction.customerName} • {transaction.accountNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(new Date(transaction.timestamp))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                    <Badge className="bg-green-500 mt-1">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm">View All Transactions</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-xl">
                    {mockAgentProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{mockAgentProfile.name}</p>
                    <p className="text-sm text-gray-500">{mockAgentProfile.id}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{mockAgentProfile.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className="bg-green-500">
                        {mockAgentProfile.status.charAt(0).toUpperCase() + mockAgentProfile.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Audit</p>
                      <p className="font-medium">{formatDate(new Date(mockAgentProfile.nextAuditDate))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="font-medium">{formatDate(new Date(mockAgentProfile.joinDate))}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications & Alerts</CardTitle>
              <CardDescription>Important updates for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAlerts.map(alert => (
                  <div key={alert.id} className={`border-l-4 pl-4 py-2 ${
                    alert.type === 'reminder' ? 'border-blue-500' :
                    alert.type === 'action' ? 'border-yellow-500' :
                    'border-gray-500'
                  }`}>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(new Date(alert.timestamp))}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}