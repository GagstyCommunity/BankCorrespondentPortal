import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatDateTime, getPriorityColor } from "@/lib/utils";

export default function AuditorAuditHistory() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState<boolean>(false);
  
  // Fetch audit history
  const { data: auditHistory, isLoading: isLoadingAudits } = useQuery({
    queryKey: ["/api/auditor/audit-history"],
    enabled: !!user && user?.role === "auditor",
  });

  if (isLoadingAuth || isLoadingAudits) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Audit History</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading audit history...</CardTitle>
            <CardDescription>Please wait while we load your past audits.</CardDescription>
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
  const mockAudits = [
    {
      id: 1,
      cspName: "Ramesh Kumar",
      cspId: "CSP-4521",
      location: "Mumbai, Maharashtra",
      status: "completed",
      priority: "low",
      findings: "All operational protocols followed correctly. No issues found.",
      submittedDate: "2025-05-05T11:45:00",
      evidenceUrls: ["/uploads/evidence/audit1_1.jpg", "/uploads/evidence/audit1_2.jpg"],
      riskScore: 15
    },
    {
      id: 2,
      cspName: "Anil Gupta",
      cspId: "CSP-8734",
      location: "Delhi, New Delhi",
      status: "completed",
      priority: "high",
      findings: "Multiple discrepancies in customer documentation. KYC verification process not followed properly. Recommended immediate training.",
      submittedDate: "2025-05-04T17:30:00",
      evidenceUrls: ["/uploads/evidence/audit2_1.jpg", "/uploads/evidence/audit2_2.jpg", "/uploads/evidence/audit2_3.jpg"],
      riskScore: 75
    },
    {
      id: 3,
      cspName: "Sunita Patel",
      cspId: "CSP-6392",
      location: "Bangalore, Karnataka",
      status: "completed",
      priority: "medium",
      findings: "Minor issues with transaction logging. Agent needs refresher on the documentation process.",
      submittedDate: "2025-05-03T12:30:00",
      evidenceUrls: ["/uploads/evidence/audit3_1.jpg"],
      riskScore: 42
    },
    {
      id: 4,
      cspName: "Rajiv Verma",
      cspId: "CSP-2146",
      location: "Chennai, Tamil Nadu",
      status: "completed",
      priority: "critical",
      findings: "Serious compliance violations. Agent conducting transactions during odd hours. Multiple biometric verification failures.",
      submittedDate: "2025-05-02T19:20:00",
      evidenceUrls: ["/uploads/evidence/audit4_1.jpg", "/uploads/evidence/audit4_2.jpg", "/uploads/evidence/audit4_3.jpg", "/uploads/evidence/audit4_4.jpg"],
      riskScore: 92
    },
    {
      id: 5,
      cspName: "Meena Sharma",
      cspId: "CSP-7523",
      location: "Kolkata, West Bengal",
      status: "escalated",
      priority: "high",
      findings: "Agent found using unauthorized transaction methods. Evidence of potential identity fraud.",
      submittedDate: "2025-05-01T16:15:00",
      evidenceUrls: ["/uploads/evidence/audit5_1.jpg", "/uploads/evidence/audit5_2.jpg"],
      riskScore: 88
    },
    {
      id: 6,
      cspName: "Vikram Singh",
      cspId: "CSP-3456",
      location: "Jaipur, Rajasthan",
      status: "pending",
      priority: "medium",
      findings: "Audit completed but pending additional documentation from agent.",
      submittedDate: "2025-04-29T15:40:00",
      evidenceUrls: ["/uploads/evidence/audit6_1.jpg"],
      riskScore: 35
    },
    {
      id: 7,
      cspName: "Priya Desai",
      cspId: "CSP-8901",
      location: "Pune, Maharashtra",
      status: "completed",
      priority: "low",
      findings: "All processes followed correctly. Agent maintaining excellent documentation.",
      submittedDate: "2025-04-28T14:20:00",
      evidenceUrls: ["/uploads/evidence/audit7_1.jpg", "/uploads/evidence/audit7_2.jpg"],
      riskScore: 12
    }
  ];

  // Apply filters
  const getTimeFilterDate = () => {
    const now = new Date();
    switch (timeFilter) {
      case "today":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      case "week":
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        return lastWeek;
      case "month":
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return lastMonth;
      default:
        return null;
    }
  };

  const filteredAudits = mockAudits.filter(audit => {
    // Apply status filter
    if (statusFilter !== "all" && audit.status !== statusFilter) {
      return false;
    }
    
    // Apply time filter
    const timeFilterDate = getTimeFilterDate();
    if (timeFilterDate && new Date(audit.submittedDate) < timeFilterDate) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        audit.cspName.toLowerCase().includes(query) ||
        audit.cspId.toLowerCase().includes(query) ||
        audit.location.toLowerCase().includes(query) ||
        audit.findings.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleViewDetails = (audit: any) => {
    setSelectedAudit(audit);
    setViewDetailsOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Audit History</h1>
        <Button 
          onClick={() => {
            toast({
              title: "Reports Generated",
              description: "Your audit reports have been generated and are ready for download.",
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
            <p className="text-3xl font-bold">{mockAudits.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {mockAudits.filter(a => a.status === "completed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {mockAudits.filter(a => a.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Escalated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {mockAudits.filter(a => a.status === "escalated").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Past Audits</CardTitle>
          <CardDescription>History of your completed audit submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by CSP name, ID, or findings"
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Audit ID</TableHead>
                  <TableHead>CSP Agent</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudits.map(audit => (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium">#{audit.id}</TableCell>
                    <TableCell>
                      <div>{audit.cspName}</div>
                      <div className="text-xs text-gray-500">{audit.cspId}</div>
                    </TableCell>
                    <TableCell>{audit.location}</TableCell>
                    <TableCell>
                      <Badge className={
                        audit.status === "completed" ? "bg-green-500" :
                        audit.status === "pending" ? "bg-yellow-500" :
                        "bg-red-500"
                      }>
                        {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(audit.priority)}>
                        {audit.priority.charAt(0).toUpperCase() + audit.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(new Date(audit.submittedDate))}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(audit)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Download Started",
                              description: "Your audit report is being downloaded.",
                            });
                          }}
                        >
                          Download
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
                          selectedAudit.status === "pending" ? "bg-yellow-500" :
                          "bg-red-500"
                        }>
                          {selectedAudit.status.charAt(0).toUpperCase() + selectedAudit.status.slice(1)}
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
                      <div className="text-gray-500">Submitted:</div>
                      <div className="col-span-2">{formatDateTime(new Date(selectedAudit.submittedDate))}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-500">CSP Information</h3>
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">CSP Name:</div>
                      <div className="col-span-2 font-medium">{selectedAudit.cspName}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">CSP ID:</div>
                      <div className="col-span-2">{selectedAudit.cspId}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-gray-500">Location:</div>
                      <div className="col-span-2">{selectedAudit.location}</div>
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