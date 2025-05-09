import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getPriorityColor, formatDate } from "@/lib/utils";

export default function AdminAuditLogs() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState<boolean>(false);

  // Fetch audits
  const { data: audits, isLoading: isLoadingAudits } = useQuery({
    queryKey: ["/api/audits", statusFilter],
    enabled: !!user && user?.role === "admin",
  });

  const filteredAudits = audits?.filter((audit: any) => {
    if (statusFilter !== "all" && audit.status !== statusFilter) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        audit.auditorName?.toLowerCase().includes(query) ||
        audit.agentName?.toLowerCase().includes(query) ||
        audit.findings?.toLowerCase().includes(query) ||
        audit.id?.toString().includes(query)
      );
    }
    
    return true;
  });

  const handleViewDetails = (audit: any) => {
    setSelectedAudit(audit);
    setViewDetailsOpen(true);
  };

  if (isLoadingAuth || isLoadingAudits) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Audit Logs</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading audit data...</CardTitle>
            <CardDescription>Please wait while we load the audit information.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-64 bg-gray-300 rounded mb-4"></div>
              <div className="h-80 w-full bg-gray-300 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock data for demonstration
  const mockAudits = [
    {
      id: 1,
      auditorName: "Priya Sharma",
      agentName: "Ramesh Kumar",
      agentId: "CSP-4521",
      findings: "All operational protocols followed correctly. No issues found.",
      status: "completed",
      priority: "low",
      auditDate: "2025-05-05T09:30:00",
      completedDate: "2025-05-05T11:45:00",
      evidenceUrls: ["/uploads/evidence/audit1_1.jpg", "/uploads/evidence/audit1_2.jpg"],
      location: "Mumbai, Maharashtra",
      riskScore: 15
    },
    {
      id: 2,
      auditorName: "Vijay Mehta",
      agentName: "Anil Gupta",
      agentId: "CSP-8734",
      findings: "Multiple discrepancies in customer documentation. KYC verification process not followed properly. Recommended immediate training.",
      status: "completed",
      priority: "high",
      auditDate: "2025-05-04T14:15:00",
      completedDate: "2025-05-04T17:30:00",
      evidenceUrls: ["/uploads/evidence/audit2_1.jpg", "/uploads/evidence/audit2_2.jpg", "/uploads/evidence/audit2_3.jpg"],
      location: "Delhi, New Delhi",
      riskScore: 75
    },
    {
      id: 3,
      auditorName: "Kavita Singh",
      agentName: "Sunita Patel",
      agentId: "CSP-6392",
      findings: "Minor issues with transaction logging. Agent needs refresher on the documentation process.",
      status: "completed",
      priority: "medium",
      auditDate: "2025-05-03T10:00:00",
      completedDate: "2025-05-03T12:30:00",
      evidenceUrls: ["/uploads/evidence/audit3_1.jpg"],
      location: "Bangalore, Karnataka",
      riskScore: 42
    },
    {
      id: 4,
      auditorName: "Rahul Verma",
      agentName: "Rajiv Verma",
      agentId: "CSP-2146",
      findings: "Serious compliance violations. Agent conducting transactions during odd hours. Multiple biometric verification failures.",
      status: "completed",
      priority: "critical",
      auditDate: "2025-05-02T16:45:00",
      completedDate: "2025-05-02T19:20:00",
      evidenceUrls: ["/uploads/evidence/audit4_1.jpg", "/uploads/evidence/audit4_2.jpg", "/uploads/evidence/audit4_3.jpg", "/uploads/evidence/audit4_4.jpg"],
      location: "Chennai, Tamil Nadu",
      riskScore: 92
    },
    {
      id: 5,
      auditorName: "Priya Sharma",
      agentName: "Neha Malhotra",
      agentId: "CSP-5217",
      findings: "Audit in progress. Initial observations show proper process adherence.",
      status: "in-progress",
      priority: "medium",
      auditDate: "2025-05-07T13:00:00",
      completedDate: null,
      evidenceUrls: [],
      location: "Hyderabad, Telangana",
      riskScore: 28
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Audit Logs</h1>
        <Button 
          onClick={() => {
            toast({
              title: "Audit Reports Generated",
              description: "Monthly audit reports have been generated and are ready for download.",
            });
          }}
          className="bg-purple-700 hover:bg-purple-800"
        >
          Generate Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">128</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">112</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Critical Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">4</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Records</CardTitle>
          <CardDescription>View and manage all audit logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by auditor, agent, or findings"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Audit ID</TableHead>
                  <TableHead>CSP Agent</TableHead>
                  <TableHead>Auditor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAudits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium">#{audit.id}</TableCell>
                    <TableCell>
                      {audit.agentName}
                      <div className="text-sm text-gray-500">{audit.agentId}</div>
                    </TableCell>
                    <TableCell>{audit.auditorName}</TableCell>
                    <TableCell>
                      <Badge className={
                        audit.status === "completed" ? "bg-green-500" :
                        audit.status === "in-progress" ? "bg-blue-500" :
                        "bg-yellow-500"
                      }>
                        {audit.status === "completed" ? "Completed" : 
                         audit.status === "in-progress" ? "In Progress" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(audit.priority)}>
                        {audit.priority.charAt(0).toUpperCase() + audit.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(new Date(audit.auditDate))}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(audit)}
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Audit Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected audit
            </DialogDescription>
          </DialogHeader>
          
          {selectedAudit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-500">Audit Information</h3>
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">Audit ID:</div>
                      <div className="col-span-2 font-medium">#{selectedAudit.id}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">Status:</div>
                      <div className="col-span-2">
                        <Badge className={
                          selectedAudit.status === "completed" ? "bg-green-500" :
                          selectedAudit.status === "in-progress" ? "bg-blue-500" :
                          "bg-yellow-500"
                        }>
                          {selectedAudit.status === "completed" ? "Completed" : 
                          selectedAudit.status === "in-progress" ? "In Progress" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">Priority:</div>
                      <div className="col-span-2">
                        <Badge className={getPriorityColor(selectedAudit.priority)}>
                          {selectedAudit.priority.charAt(0).toUpperCase() + selectedAudit.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">Audit Date:</div>
                      <div className="col-span-2">{formatDate(new Date(selectedAudit.auditDate))}</div>
                    </div>
                    {selectedAudit.completedDate && (
                      <div className="grid grid-cols-3 gap-1">
                        <div className="text-gray-500">Completed:</div>
                        <div className="col-span-2">{formatDate(new Date(selectedAudit.completedDate))}</div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">Location:</div>
                      <div className="col-span-2">{selectedAudit.location}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-500">Personnel</h3>
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">CSP Agent:</div>
                      <div className="col-span-2 font-medium">{selectedAudit.agentName}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">Agent ID:</div>
                      <div className="col-span-2">{selectedAudit.agentId}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">Risk Score:</div>
                      <div className="col-span-2">
                        <Badge className={
                          selectedAudit.riskScore < 30 ? "bg-green-500" :
                          selectedAudit.riskScore < 70 ? "bg-yellow-500" :
                          "bg-red-500"
                        }>
                          {selectedAudit.riskScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">Auditor:</div>
                      <div className="col-span-2">{selectedAudit.auditorName}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-500 mb-2">Findings</h3>
                <Card>
                  <CardContent className="p-4">
                    <p>{selectedAudit.findings}</p>
                  </CardContent>
                </Card>
              </div>

              {selectedAudit.evidenceUrls && selectedAudit.evidenceUrls.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2">Evidence ({selectedAudit.evidenceUrls.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedAudit.evidenceUrls.map((url: string, index: number) => (
                      <div key={index} className="border rounded-md p-2">
                        <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                          <p className="text-gray-500">Evidence Image {index + 1}</p>
                          {/* In a real app, this would be an actual image */}
                          {/* <img src={url} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover rounded-md" /> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    toast({
                      title: "Audit Report Downloaded",
                      description: "The audit report has been downloaded as a PDF.",
                    });
                  }}
                >
                  Download Report
                </Button>
                <Button onClick={() => setViewDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}