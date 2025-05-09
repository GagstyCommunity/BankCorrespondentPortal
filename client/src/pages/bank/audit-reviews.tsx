import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, getPriorityColor } from "@/lib/utils";

export default function BankAuditReviews() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState<boolean>(false);
  const [reviewAuditOpen, setReviewAuditOpen] = useState<boolean>(false);
  
  // Fetch audits
  const { data: audits, isLoading: isLoadingAudits } = useQuery({
    queryKey: ["/api/audits", statusFilter, priorityFilter],
    enabled: !!user && user?.role === "bank",
  });

  if (isLoadingAuth || isLoadingAudits) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Audit Reviews</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading audit data...</CardTitle>
            <CardDescription>Please wait while we load the audit information.</CardDescription>
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
  const auditStatuses = [
    { id: "all", name: "All Statuses" },
    { id: "completed", name: "Completed" },
    { id: "pending_review", name: "Pending Review" },
    { id: "approved", name: "Approved" },
    { id: "escalated", name: "Escalated" }
  ];

  const auditPriorities = [
    { id: "all", name: "All Priorities" },
    { id: "critical", name: "Critical" },
    { id: "high", name: "High" },
    { id: "medium", name: "Medium" },
    { id: "low", name: "Low" }
  ];

  const mockAudits = [
    {
      id: 1,
      auditorName: "Priya Sharma",
      auditorId: "AUD-123",
      cspName: "Ramesh Kumar",
      cspId: "CSP-4521",
      location: "Mumbai, Maharashtra",
      status: "completed",
      priority: "low",
      findings: "All operational protocols followed correctly. No issues found.",
      submittedDate: "2025-05-05",
      reviewStatus: "pending_review",
      reviewDate: null,
      reviewedBy: null,
      reviewComments: null,
      evidenceUrls: ["/uploads/evidence/audit1_1.jpg", "/uploads/evidence/audit1_2.jpg"],
      recommendations: [],
      risk: "low",
      riskScore: 15
    },
    {
      id: 2,
      auditorName: "Vijay Mehta",
      auditorId: "AUD-456",
      cspName: "Anil Gupta",
      cspId: "CSP-8734",
      location: "Delhi, New Delhi",
      status: "completed",
      priority: "high",
      findings: "Multiple discrepancies in customer documentation. KYC verification process not followed properly. Recommended immediate training.",
      submittedDate: "2025-05-04",
      reviewStatus: "approved",
      reviewDate: "2025-05-05",
      reviewedBy: "Anita Desai",
      reviewComments: "Agreed with findings. CSP has been scheduled for KYC training session.",
      evidenceUrls: ["/uploads/evidence/audit2_1.jpg", "/uploads/evidence/audit2_2.jpg", "/uploads/evidence/audit2_3.jpg"],
      recommendations: ["Mandatory KYC refresher training", "Weekly spot checks for next month"],
      risk: "high",
      riskScore: 75
    },
    {
      id: 3,
      auditorName: "Kavita Singh",
      auditorId: "AUD-789",
      cspName: "Sunita Patel",
      cspId: "CSP-6392",
      location: "Bangalore, Karnataka",
      status: "completed",
      priority: "medium",
      findings: "Minor issues with transaction logging. Agent needs refresher on the documentation process.",
      submittedDate: "2025-05-03",
      reviewStatus: "pending_review",
      reviewDate: null,
      reviewedBy: null,
      reviewComments: null,
      evidenceUrls: ["/uploads/evidence/audit3_1.jpg"],
      recommendations: ["Documentation process refresher"],
      risk: "medium",
      riskScore: 42
    },
    {
      id: 4,
      auditorName: "Rahul Verma",
      auditorId: "AUD-234",
      cspName: "Rajiv Verma",
      cspId: "CSP-2146",
      location: "Chennai, Tamil Nadu",
      status: "completed",
      priority: "critical",
      findings: "Serious compliance violations. Agent conducting transactions during odd hours. Multiple biometric verification failures.",
      submittedDate: "2025-05-02",
      reviewStatus: "escalated",
      reviewDate: "2025-05-03",
      reviewedBy: "Vikram Singh",
      reviewComments: "Serious violations confirmed. Recommended temporary suspension until investigation completed.",
      evidenceUrls: ["/uploads/evidence/audit4_1.jpg", "/uploads/evidence/audit4_2.jpg", "/uploads/evidence/audit4_3.jpg", "/uploads/evidence/audit4_4.jpg"],
      recommendations: ["Immediate suspension", "Full investigation", "Potential termination"],
      risk: "high",
      riskScore: 92
    },
    {
      id: 5,
      auditorName: "Priya Sharma",
      auditorId: "AUD-123",
      cspName: "Meena Sharma",
      cspId: "CSP-7523",
      location: "Kolkata, West Bengal",
      status: "completed",
      priority: "high",
      findings: "Agent found using unauthorized transaction methods. Evidence of potential identity fraud.",
      submittedDate: "2025-05-01",
      reviewStatus: "approved",
      reviewDate: "2025-05-02",
      reviewedBy: "Ravi Kumar",
      reviewComments: "Findings validated. Immediate suspension and investigation initiated.",
      evidenceUrls: ["/uploads/evidence/audit5_1.jpg", "/uploads/evidence/audit5_2.jpg"],
      recommendations: ["Suspend agent", "Report to compliance team", "Detailed investigation"],
      risk: "high",
      riskScore: 88
    },
    {
      id: 6,
      auditorName: "Vijay Mehta",
      auditorId: "AUD-456",
      cspName: "Vikram Singh",
      cspId: "CSP-3456",
      location: "Jaipur, Rajasthan",
      status: "completed",
      priority: "medium",
      findings: "Moderate issues with process adherence. Documentation incomplete in several cases.",
      submittedDate: "2025-04-30",
      reviewStatus: "approved",
      reviewDate: "2025-05-01",
      reviewedBy: "Anita Desai",
      reviewComments: "Agree with auditor's assessment. Process training scheduled.",
      evidenceUrls: ["/uploads/evidence/audit6_1.jpg", "/uploads/evidence/audit6_2.jpg"],
      recommendations: ["Process adherence training", "Follow-up audit in 30 days"],
      risk: "medium",
      riskScore: 45
    },
    {
      id: 7,
      auditorName: "Kavita Singh",
      auditorId: "AUD-789",
      cspName: "Priya Desai",
      cspId: "CSP-8901",
      location: "Pune, Maharashtra",
      status: "completed",
      priority: "low",
      findings: "Minor discrepancies in record keeping. Overall good compliance.",
      submittedDate: "2025-04-29",
      reviewStatus: "approved",
      reviewDate: "2025-04-30",
      reviewedBy: "Ravi Kumar",
      reviewComments: "Agreed with findings. Minor issues to be addressed.",
      evidenceUrls: ["/uploads/evidence/audit7_1.jpg"],
      recommendations: ["Record keeping refresher"],
      risk: "low",
      riskScore: 12
    }
  ];

  // Apply filters
  const filteredAudits = mockAudits.filter(audit => {
    // Apply status filter
    if (statusFilter !== "all" && audit.reviewStatus !== statusFilter) {
      return false;
    }
    
    // Apply priority filter
    if (priorityFilter !== "all" && audit.priority !== priorityFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        audit.cspName.toLowerCase().includes(query) ||
        audit.cspId.toLowerCase().includes(query) ||
        audit.auditorName.toLowerCase().includes(query) ||
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

  const handleReviewAudit = (audit: any) => {
    setSelectedAudit(audit);
    setReviewAuditOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Audit Reviewed",
      description: "Your review has been submitted successfully.",
    });
    
    setReviewAuditOpen(false);
    setViewDetailsOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Audit Reviews</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Audits</CardTitle>
            <CardDescription>All completed audits</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockAudits.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Review</CardTitle>
            <CardDescription>Audits awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {mockAudits.filter(a => a.reviewStatus === "pending_review").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Critical Findings</CardTitle>
            <CardDescription>High priority issues</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {mockAudits.filter(a => a.priority === "critical" || a.priority === "high").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Escalated</CardTitle>
            <CardDescription>Requiring management action</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {mockAudits.filter(a => a.reviewStatus === "escalated").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Record Review</CardTitle>
          <CardDescription>Review and approve auditor findings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by CSP, auditor, or findings"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {auditStatuses.map(status => (
                  <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                {auditPriorities.map(priority => (
                  <SelectItem key={priority.id} value={priority.id}>{priority.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>CSP Agent</TableHead>
                  <TableHead>Auditor</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Review Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudits.map(audit => (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium">#{audit.id}</TableCell>
                    <TableCell>
                      <div>{audit.cspName}</div>
                      <div className="text-xs text-gray-500">{audit.cspId} • {audit.location}</div>
                    </TableCell>
                    <TableCell>{audit.auditorName}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(audit.priority)}>
                        {audit.priority.charAt(0).toUpperCase() + audit.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        audit.reviewStatus === "approved" ? "bg-green-500" :
                        audit.reviewStatus === "pending_review" ? "bg-yellow-500" :
                        audit.reviewStatus === "escalated" ? "bg-red-500" :
                        "bg-blue-500"
                      }>
                        {audit.reviewStatus === "pending_review" ? "Pending Review" :
                         audit.reviewStatus.charAt(0).toUpperCase() + audit.reviewStatus.slice(1)}
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
                        {audit.reviewStatus === "pending_review" && (
                          <Button 
                            size="sm"
                            className="bg-purple-700 hover:bg-purple-800"
                            onClick={() => handleReviewAudit(audit)}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAudits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No audits found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
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
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">Audit #{selectedAudit.id}</h2>
                  <p className="text-sm text-gray-500">
                    Submitted on {formatDate(new Date(selectedAudit.submittedDate))}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getPriorityColor(selectedAudit.priority)}>
                    {selectedAudit.priority.charAt(0).toUpperCase() + selectedAudit.priority.slice(1)} Priority
                  </Badge>
                  <Badge className={
                    selectedAudit.reviewStatus === "approved" ? "bg-green-500" :
                    selectedAudit.reviewStatus === "pending_review" ? "bg-yellow-500" :
                    selectedAudit.reviewStatus === "escalated" ? "bg-red-500" :
                    "bg-blue-500"
                  }>
                    {selectedAudit.reviewStatus === "pending_review" ? "Pending Review" :
                     selectedAudit.reviewStatus.charAt(0).toUpperCase() + selectedAudit.reviewStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-500">CSP Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">CSP Name</p>
                          <p className="font-medium">{selectedAudit.cspName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">CSP ID</p>
                          <p className="font-medium">{selectedAudit.cspId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{selectedAudit.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Risk Score</p>
                          <Badge className={
                            selectedAudit.risk === "low" ? "bg-green-500" :
                            selectedAudit.risk === "medium" ? "bg-yellow-500" :
                            "bg-red-500"
                          }>
                            {selectedAudit.riskScore}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-500">Auditor Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Auditor Name</p>
                          <p className="font-medium">{selectedAudit.auditorName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Auditor ID</p>
                          <p className="font-medium">{selectedAudit.auditorId}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-500 mb-2">Audit Findings</h3>
                <Card>
                  <CardContent className="p-4">
                    <p>{selectedAudit.findings}</p>
                  </CardContent>
                </Card>
              </div>

              {selectedAudit.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2">Auditor Recommendations</h3>
                  <Card>
                    <CardContent className="p-4">
                      <ul className="list-disc list-inside">
                        {selectedAudit.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

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

              {selectedAudit.reviewStatus !== "pending_review" && (
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2">Review Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Reviewed By</p>
                          <p className="font-medium">{selectedAudit.reviewedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Review Date</p>
                          <p className="font-medium">{formatDate(new Date(selectedAudit.reviewDate))}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Review Comments</p>
                          <p>{selectedAudit.reviewComments}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setViewDetailsOpen(false)}
                >
                  Close
                </Button>
                {selectedAudit.reviewStatus === "pending_review" && (
                  <Button 
                    className="bg-purple-700 hover:bg-purple-800"
                    onClick={() => {
                      setViewDetailsOpen(false);
                      handleReviewAudit(selectedAudit);
                    }}
                  >
                    Review Audit
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Audit Dialog */}
      <Dialog open={reviewAuditOpen} onOpenChange={setReviewAuditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Audit</DialogTitle>
            <DialogDescription>
              Review and provide feedback on this audit
            </DialogDescription>
          </DialogHeader>
          
          {selectedAudit && (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Audit #{selectedAudit.id}: {selectedAudit.cspName}</h3>
                <p className="text-xs text-gray-500">
                  Priority: <span className="font-medium capitalize">{selectedAudit.priority}</span> • 
                  Auditor: {selectedAudit.auditorName}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Review Decision</label>
                <Select defaultValue="approved" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve Findings</SelectItem>
                    <SelectItem value="escalated">Escalate to Management</SelectItem>
                    <SelectItem value="returned">Return for Clarification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Review Comments</label>
                <Textarea 
                  placeholder="Provide your feedback and comments on this audit..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Action Items (one per line)</label>
                <Textarea 
                  placeholder="List recommended actions to be taken..."
                  rows={3}
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setReviewAuditOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  Submit Review
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}