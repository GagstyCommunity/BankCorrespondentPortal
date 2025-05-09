import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, getRiskLevelColor } from "@/lib/utils";

export default function AuditorAssignedCSPs() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  
  // Fetch assigned CSPs
  const { data: assignedCSPs, isLoading: isLoadingCSPs } = useQuery({
    queryKey: ["/api/auditor/assigned-csps"],
    enabled: !!user && user?.role === "auditor",
  });

  if (isLoadingAuth || isLoadingCSPs) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Assigned CSPs</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading data...</CardTitle>
            <CardDescription>Please wait while we load your assigned CSPs.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse h-16 w-16 bg-gray-300 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sample data for demonstration
  const mockCSPs = [
    {
      id: 1,
      name: "Ramesh Kumar",
      cspId: "CSP-4521",
      region: "Mumbai, Maharashtra",
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      phone: "+91 98765 43210",
      riskLevel: "high",
      riskScore: 78,
      lastAuditDate: "2025-04-15",
      nextAuditDate: "2025-05-15",
      status: "active"
    },
    {
      id: 2,
      name: "Anil Gupta",
      cspId: "CSP-8734",
      region: "Delhi, New Delhi",
      address: "456 Central Avenue, Connaught Place, New Delhi, 110001",
      phone: "+91 87654 32109",
      riskLevel: "medium",
      riskScore: 52,
      lastAuditDate: "2025-04-22",
      nextAuditDate: "2025-05-22",
      status: "active"
    },
    {
      id: 3,
      name: "Sunita Patel",
      cspId: "CSP-6392",
      region: "Bangalore, Karnataka",
      address: "789 Tech Park, Whitefield, Bangalore, 560066",
      phone: "+91 76543 21098",
      riskLevel: "low",
      riskScore: 28,
      lastAuditDate: "2025-04-30",
      nextAuditDate: "2025-05-30",
      status: "active"
    },
    {
      id: 4,
      name: "Rajiv Verma",
      cspId: "CSP-2146",
      region: "Chennai, Tamil Nadu",
      address: "234 Beach Road, Adyar, Chennai, 600020",
      phone: "+91 65432 10987",
      riskLevel: "high",
      riskScore: 92,
      lastAuditDate: "2025-04-10",
      nextAuditDate: "2025-05-10",
      status: "suspended"
    },
    {
      id: 5,
      name: "Meena Sharma",
      cspId: "CSP-7523",
      region: "Kolkata, West Bengal",
      address: "567 Park Street, Kolkata, 700016",
      phone: "+91 54321 09876",
      riskLevel: "medium",
      riskScore: 45,
      lastAuditDate: "2025-04-25",
      nextAuditDate: "2025-05-25",
      status: "active"
    }
  ];

  // Apply filters
  const filteredCSPs = mockCSPs.filter(csp => {
    // Apply risk level filter
    if (filterRisk !== "all" && csp.riskLevel !== filterRisk) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        csp.name.toLowerCase().includes(query) ||
        csp.cspId.toLowerCase().includes(query) ||
        csp.region.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Assigned CSPs</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total CSPs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockCSPs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {mockCSPs.filter(csp => csp.riskLevel === "high").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {mockCSPs.filter(csp => csp.riskLevel === "medium").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {mockCSPs.filter(csp => csp.riskLevel === "low").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSP Agent List</CardTitle>
          <CardDescription>Manage and schedule audits for your assigned CSP agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, ID, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CSP Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Last Audit</TableHead>
                  <TableHead>Next Audit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCSPs.map(csp => (
                  <TableRow key={csp.id}>
                    <TableCell>
                      <div className="font-medium">{csp.name}</div>
                      <div className="text-sm text-gray-500">{csp.cspId}</div>
                    </TableCell>
                    <TableCell>{csp.region}</TableCell>
                    <TableCell>
                      <Badge className={getRiskLevelColor(csp.riskLevel)}>
                        {csp.riskScore}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(new Date(csp.lastAuditDate))}</TableCell>
                    <TableCell>{formatDate(new Date(csp.nextAuditDate))}</TableCell>
                    <TableCell>
                      <Badge variant={csp.status === "active" ? "default" : "outline"} 
                        className={csp.status === "active" ? "bg-green-500" : "bg-red-100 text-red-800"}>
                        {csp.status.charAt(0).toUpperCase() + csp.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-purple-700 hover:bg-purple-800">
                          Schedule Audit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end mt-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}