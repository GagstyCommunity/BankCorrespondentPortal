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
import { formatDate } from "@/lib/utils";

export default function BankDisputes() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState<boolean>(false);
  const [resolveDisputeOpen, setResolveDisputeOpen] = useState<boolean>(false);
  
  // Fetch disputes
  const { data: disputes, isLoading: isLoadingDisputes } = useQuery({
    queryKey: ["/api/disputes", statusFilter, typeFilter],
    enabled: !!user && user?.role === "bank",
  });

  if (isLoadingAuth || isLoadingDisputes) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Dispute Management</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading dispute data...</CardTitle>
            <CardDescription>Please wait while we load the dispute information.</CardDescription>
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
  const disputeStatuses = [
    { id: "all", name: "All Statuses" },
    { id: "open", name: "Open" },
    { id: "in-progress", name: "In Progress" },
    { id: "resolved", name: "Resolved" },
    { id: "escalated", name: "Escalated" }
  ];

  const disputeTypes = [
    { id: "all", name: "All Types" },
    { id: "transaction", name: "Transaction" },
    { id: "account", name: "Account" },
    { id: "service", name: "Service" },
    { id: "audit", name: "Audit" }
  ];

  const mockDisputes = [
    {
      id: 1,
      cspId: "CSP-5432",
      cspName: "Sanjay Kapoor",
      location: "Delhi, New Delhi",
      status: "open",
      type: "transaction",
      category: "Amount Discrepancy",
      reason: "Customer claims incorrect amount processed",
      submittedDate: "2025-05-08",
      submittedBy: "Customer",
      customerName: "Amit Singh",
      customerContact: "+91 55555 66666",
      transactionId: "TXN-67890",
      disputeAmount: 5000,
      description: "Customer claims that he deposited ₹15,000 but only ₹10,000 was credited to his account. Requires verification of transaction records.",
      evidence: ["Receipt copy", "Account statement"],
      resolutionActions: [],
      resolutionDate: null,
      resolvedBy: null
    },
    {
      id: 2,
      cspId: "CSP-7654",
      cspName: "Deepa Kumar",
      location: "Bangalore, Karnataka",
      status: "in-progress",
      type: "account",
      category: "Wrong Information",
      reason: "Wrong account details entered",
      submittedDate: "2025-05-07",
      submittedBy: "CSP Agent",
      customerName: "Priya Patel",
      customerContact: "+91 66666 77777",
      transactionId: "ACC-12345",
      disputeAmount: null,
      description: "CSP agent entered incorrect account holder name during account opening. Customer's middle name was misspelled. Requires correction in banking system.",
      evidence: ["ID proof", "Application form"],
      resolutionActions: ["Information forwarded to operations team"],
      resolutionDate: null,
      resolvedBy: null
    },
    {
      id: 3,
      cspId: "CSP-2146",
      cspName: "Rajiv Verma",
      location: "Chennai, Tamil Nadu",
      status: "escalated",
      type: "audit",
      category: "Findings Dispute",
      reason: "Dispute on audit findings",
      submittedDate: "2025-05-06",
      submittedBy: "CSP Agent",
      customerName: null,
      customerContact: null,
      transactionId: null,
      disputeAmount: null,
      description: "CSP agent disputes the findings of recent audit. Claims that the issues highlighted were due to system failure rather than procedural non-compliance.",
      evidence: ["System logs", "Previous compliance reports"],
      resolutionActions: ["Escalated to compliance department", "Second audit scheduled"],
      resolutionDate: null,
      resolvedBy: null
    },
    {
      id: 4,
      cspId: "CSP-4521",
      cspName: "Ramesh Kumar",
      location: "Mumbai, Maharashtra",
      status: "open",
      type: "service",
      category: "Service Quality",
      reason: "Customer complaint about service",
      submittedDate: "2025-05-05",
      submittedBy: "Customer",
      customerName: "Raj Malhotra",
      customerContact: "+91 77777 88888",
      transactionId: null,
      disputeAmount: null,
      description: "Customer complained about long wait times and unprofessional behavior from the CSP agent. Multiple customers have reported similar issues.",
      evidence: ["Customer feedback form"],
      resolutionActions: [],
      resolutionDate: null,
      resolvedBy: null
    },
    {
      id: 5,
      cspId: "CSP-8901",
      cspName: "Priya Desai",
      location: "Pune, Maharashtra",
      status: "resolved",
      type: "transaction",
      category: "Failed Transaction",
      reason: "Money deducted but transaction failed",
      submittedDate: "2025-05-04",
      submittedBy: "Customer",
      customerName: "Vikram Joshi",
      customerContact: "+91 88888 99999",
      transactionId: "TXN-54321",
      disputeAmount: 2500,
      description: "Customer attempted to pay utility bill, amount was deducted but payment wasn't registered with utility provider. Required refund or confirmation of payment.",
      evidence: ["Transaction receipt", "Bank statement", "Utility provider confirmation"],
      resolutionActions: ["Verified transaction logs", "Confirmed payment with utility provider", "Updated customer"],
      resolutionDate: "2025-05-06",
      resolvedBy: "Anita Desai"
    },
    {
      id: 6,
      cspId: "CSP-3456",
      cspName: "Vikram Singh",
      location: "Jaipur, Rajasthan",
      status: "resolved",
      type: "account",
      category: "Documentation Issue",
      reason: "Missing documentation",
      submittedDate: "2025-05-03",
      submittedBy: "Bank Auditor",
      customerName: "Neha Shah",
      customerContact: "+91 99999 00000",
      transactionId: "ACC-67890",
      disputeAmount: null,
      description: "Auditor found that KYC documentation was incomplete for this account. Required follow-up with customer for additional documentation.",
      evidence: ["Audit report", "Account opening form"],
      resolutionActions: ["Contacted customer", "Collected missing documents", "Updated records"],
      resolutionDate: "2025-05-05",
      resolvedBy: "Ravi Kumar"
    },
    {
      id: 7,
      cspId: "CSP-6392",
      cspName: "Sunita Patel",
      location: "Bangalore, Karnataka",
      status: "in-progress",
      type: "service",
      category: "System Issue",
      reason: "Service disruption",
      submittedDate: "2025-05-02",
      submittedBy: "CSP Agent",
      customerName: null,
      customerContact: null,
      transactionId: null,
      disputeAmount: null,
      description: "CSP reporting frequent system outages affecting service delivery. Requesting technical support and compensation for business interruption.",
      evidence: ["System error logs", "Downtime records"],
      resolutionActions: ["IT team assigned", "Temporary workaround provided"],
      resolutionDate: null,
      resolvedBy: null
    }
  ];

  // Apply filters
  const filteredDisputes = mockDisputes.filter(dispute => {
    // Apply status filter
    if (statusFilter !== "all" && dispute.status !== statusFilter) {
      return false;
    }
    
    // Apply type filter
    if (typeFilter !== "all" && dispute.type !== typeFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        dispute.cspName.toLowerCase().includes(query) ||
        dispute.cspId.toLowerCase().includes(query) ||
        dispute.location.toLowerCase().includes(query) ||
        dispute.category.toLowerCase().includes(query) ||
        dispute.reason.toLowerCase().includes(query) ||
        (dispute.customerName && dispute.customerName.toLowerCase().includes(query)) ||
        (dispute.transactionId && dispute.transactionId.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handleViewDetails = (dispute: any) => {
    setSelectedDispute(dispute);
    setViewDetailsOpen(true);
  };

  const handleResolveDispute = (dispute: any) => {
    setSelectedDispute(dispute);
    setResolveDisputeOpen(true);
  };

  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Dispute Resolved",
      description: "The dispute has been successfully resolved and all parties have been notified.",
    });
    
    setResolveDisputeOpen(false);
    setViewDetailsOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Dispute Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Disputes</CardTitle>
            <CardDescription>All reported issues</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockDisputes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Open Disputes</CardTitle>
            <CardDescription>Awaiting resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {mockDisputes.filter(d => d.status === "open").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">In Progress</CardTitle>
            <CardDescription>Currently being resolved</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {mockDisputes.filter(d => d.status === "in-progress").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Escalated</CardTitle>
            <CardDescription>Requiring special attention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {mockDisputes.filter(d => d.status === "escalated").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dispute Records</CardTitle>
          <CardDescription>Manage and resolve customer and agent disputes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by CSP, customer, or dispute details"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {disputeStatuses.map(status => (
                  <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {disputeTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisputes.map(dispute => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-medium">#{dispute.id}</TableCell>
                    <TableCell>
                      <div>{dispute.cspName}</div>
                      <div className="text-xs text-gray-500">{dispute.cspId} • {dispute.location}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {dispute.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={dispute.reason}>
                        {dispute.reason}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        dispute.status === "resolved" ? "bg-green-500" :
                        dispute.status === "open" ? "bg-yellow-500" :
                        dispute.status === "in-progress" ? "bg-blue-500" :
                        "bg-red-500"
                      }>
                        {dispute.status === "in-progress" ? "In Progress" : 
                         dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(new Date(dispute.submittedDate))}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(dispute)}
                        >
                          View
                        </Button>
                        {dispute.status !== "resolved" && (
                          <Button 
                            size="sm"
                            className="bg-purple-700 hover:bg-purple-800"
                            onClick={() => handleResolveDispute(dispute)}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDisputes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No disputes found matching your filters.
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

      {/* Dispute Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected dispute
            </DialogDescription>
          </DialogHeader>
          
          {selectedDispute && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">Dispute #{selectedDispute.id}</h2>
                  <p className="text-sm text-gray-500">
                    Submitted on {formatDate(new Date(selectedDispute.submittedDate))}
                  </p>
                </div>
                <Badge className={
                  selectedDispute.status === "resolved" ? "bg-green-500" :
                  selectedDispute.status === "open" ? "bg-yellow-500" :
                  selectedDispute.status === "in-progress" ? "bg-blue-500" :
                  "bg-red-500"
                }>
                  {selectedDispute.status === "in-progress" ? "In Progress" : 
                   selectedDispute.status.charAt(0).toUpperCase() + selectedDispute.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-500">CSP Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">CSP Name</p>
                          <p className="font-medium">{selectedDispute.cspName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">CSP ID</p>
                          <p className="font-medium">{selectedDispute.cspId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{selectedDispute.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-500">Dispute Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 hover:bg-blue-50">
                            {selectedDispute.type}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{selectedDispute.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Submitted By</p>
                          <p className="font-medium">{selectedDispute.submittedBy}</p>
                        </div>
                        {selectedDispute.transactionId && (
                          <div>
                            <p className="text-sm text-gray-500">Transaction ID</p>
                            <p className="font-medium">{selectedDispute.transactionId}</p>
                          </div>
                        )}
                        {selectedDispute.disputeAmount && (
                          <div>
                            <p className="text-sm text-gray-500">Disputed Amount</p>
                            <p className="font-medium">₹{selectedDispute.disputeAmount.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {selectedDispute.customerName && (
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2">Customer Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Customer Name</p>
                          <p className="font-medium">{selectedDispute.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="font-medium">{selectedDispute.customerContact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-500 mb-2">Dispute Description</h3>
                <Card>
                  <CardContent className="p-4">
                    <p>{selectedDispute.description}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2">Evidence Provided</h3>
                  <Card>
                    <CardContent className="p-4">
                      <ul className="list-disc list-inside">
                        {selectedDispute.evidence.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2">Resolution Actions</h3>
                  <Card>
                    <CardContent className="p-4">
                      {selectedDispute.resolutionActions.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {selectedDispute.resolutionActions.map((action: string, index: number) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No resolution actions taken yet.</p>
                      )}
                      
                      {selectedDispute.resolutionDate && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-500">Resolved on {formatDate(new Date(selectedDispute.resolutionDate))}</p>
                          <p className="text-sm text-gray-500">Resolved by: {selectedDispute.resolvedBy}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setViewDetailsOpen(false)}
                >
                  Close
                </Button>
                {selectedDispute.status !== "resolved" && (
                  <Button 
                    className="bg-purple-700 hover:bg-purple-800"
                    onClick={() => {
                      setViewDetailsOpen(false);
                      handleResolveDispute(selectedDispute);
                    }}
                  >
                    Resolve Dispute
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Dispute Dialog */}
      <Dialog open={resolveDisputeOpen} onOpenChange={setResolveDisputeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Enter resolution details for this dispute
            </DialogDescription>
          </DialogHeader>
          
          {selectedDispute && (
            <form onSubmit={handleSubmitResolution} className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Dispute #{selectedDispute.id}: {selectedDispute.reason}</h3>
                <p className="text-xs text-gray-500">
                  CSP: {selectedDispute.cspName} ({selectedDispute.cspId})
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Resolution Status</label>
                <Select defaultValue="resolved" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="partially-resolved">Partially Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Resolution Details</label>
                <Textarea 
                  placeholder="Describe how this dispute was resolved and any actions taken..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Compensation/Adjustment Amount (if applicable)</label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setResolveDisputeOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  Submit Resolution
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}