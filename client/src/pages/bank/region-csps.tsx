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
import { getRiskLevelColor, formatDate } from "@/lib/utils";

export default function BankRegionCSPs() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedCSP, setSelectedCSP] = useState<any | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState<boolean>(false);
  
  // Fetch CSP data
  const { data: csps, isLoading: isLoadingCSPs } = useQuery({
    queryKey: ["/api/bank/csps", regionFilter, riskFilter],
    enabled: !!user && user?.role === "bank",
  });

  if (isLoadingAuth || isLoadingCSPs) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Regional CSP Management</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading CSP data...</CardTitle>
            <CardDescription>Please wait while we load the CSP information.</CardDescription>
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
  const regions = [
    { id: "all", name: "All Regions" },
    { id: "north", name: "North Region" },
    { id: "south", name: "South Region" },
    { id: "east", name: "East Region" },
    { id: "west", name: "West Region" },
    { id: "central", name: "Central Region" }
  ];

  const riskLevels = [
    { id: "all", name: "All Risk Levels" },
    { id: "high", name: "High Risk" },
    { id: "medium", name: "Medium Risk" },
    { id: "low", name: "Low Risk" }
  ];

  const mockCSPs = [
    {
      id: "CSP-4521",
      name: "Ramesh Kumar",
      region: "north",
      location: "Mumbai, Maharashtra",
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      phone: "+91 98765 43210",
      email: "ramesh.kumar@example.com",
      riskLevel: "low",
      riskScore: 15,
      lastAuditDate: "2025-05-05",
      nextAuditDate: "2025-06-05",
      status: "active",
      joinDate: "2024-01-10",
      transactionsToday: 12,
      transactionsThisMonth: 345,
      supervisor: "Anita Desai",
      auditor: "Priya Sharma"
    },
    {
      id: "CSP-8734",
      name: "Anil Gupta",
      region: "north",
      location: "Delhi, New Delhi",
      address: "456 Central Avenue, Connaught Place, New Delhi, 110001",
      phone: "+91 87654 32109",
      email: "anil.gupta@example.com",
      riskLevel: "high",
      riskScore: 75,
      lastAuditDate: "2025-05-04",
      nextAuditDate: "2025-05-18",
      status: "active",
      joinDate: "2024-02-15",
      transactionsToday: 8,
      transactionsThisMonth: 267,
      supervisor: "Vikram Singh",
      auditor: "Vijay Mehta"
    },
    {
      id: "CSP-6392",
      name: "Sunita Patel",
      region: "south",
      location: "Bangalore, Karnataka",
      address: "789 Tech Park, Whitefield, Bangalore, 560066",
      phone: "+91 76543 21098",
      email: "sunita.patel@example.com",
      riskLevel: "medium",
      riskScore: 42,
      lastAuditDate: "2025-05-03",
      nextAuditDate: "2025-06-03",
      status: "active",
      joinDate: "2024-01-25",
      transactionsToday: 15,
      transactionsThisMonth: 412,
      supervisor: "Ravi Kumar",
      auditor: "Kavita Singh"
    },
    {
      id: "CSP-2146",
      name: "Rajiv Verma",
      region: "south",
      location: "Chennai, Tamil Nadu",
      address: "234 Beach Road, Adyar, Chennai, 600020",
      phone: "+91 65432 10987",
      email: "rajiv.verma@example.com",
      riskLevel: "high",
      riskScore: 92,
      lastAuditDate: "2025-05-02",
      nextAuditDate: "2025-05-16",
      status: "suspended",
      joinDate: "2024-03-05",
      transactionsToday: 0,
      transactionsThisMonth: 132,
      supervisor: "Karthik Rajan",
      auditor: "Rahul Verma"
    },
    {
      id: "CSP-7523",
      name: "Meena Sharma",
      region: "east",
      location: "Kolkata, West Bengal",
      address: "567 Park Street, Kolkata, 700016",
      phone: "+91 54321 09876",
      email: "meena.sharma@example.com",
      riskLevel: "high",
      riskScore: 88,
      lastAuditDate: "2025-05-01",
      nextAuditDate: "2025-05-15",
      status: "active",
      joinDate: "2024-02-01",
      transactionsToday: 6,
      transactionsThisMonth: 203,
      supervisor: "Dipak Banerjee",
      auditor: "Priya Sharma"
    },
    {
      id: "CSP-3456",
      name: "Vikram Singh",
      region: "west",
      location: "Jaipur, Rajasthan",
      address: "890 Heritage Lane, Jaipur, 302001",
      phone: "+91 43210 98765",
      email: "vikram.singh@example.com",
      riskLevel: "medium",
      riskScore: 35,
      lastAuditDate: "2025-04-29",
      nextAuditDate: "2025-05-29",
      status: "active",
      joinDate: "2024-01-15",
      transactionsToday: 11,
      transactionsThisMonth: 289,
      supervisor: "Anita Desai",
      auditor: "Kavita Singh"
    },
    {
      id: "CSP-8901",
      name: "Priya Desai",
      region: "west",
      location: "Pune, Maharashtra",
      address: "123 Commerce Avenue, Pune, 411001",
      phone: "+91 32109 87654",
      email: "priya.desai@example.com",
      riskLevel: "low",
      riskScore: 12,
      lastAuditDate: "2025-04-28",
      nextAuditDate: "2025-05-28",
      status: "active",
      joinDate: "2024-02-20",
      transactionsToday: 14,
      transactionsThisMonth: 356,
      supervisor: "Ravi Kumar",
      auditor: "Vijay Mehta"
    },
    {
      id: "CSP-5432",
      name: "Sanjay Kapoor",
      region: "north",
      location: "Delhi, New Delhi",
      address: "789 North Lane, Karol Bagh, Delhi, 110005",
      phone: "+91 21098 76543",
      email: "sanjay.kapoor@example.com",
      riskLevel: "low",
      riskScore: 18,
      lastAuditDate: "2025-04-27",
      nextAuditDate: "2025-05-27",
      status: "active",
      joinDate: "2024-01-05",
      transactionsToday: 10,
      transactionsThisMonth: 278,
      supervisor: "Vikram Singh",
      auditor: "Rahul Verma"
    },
    {
      id: "CSP-7654",
      name: "Deepa Kumar",
      region: "south",
      location: "Bangalore, Karnataka",
      address: "678 Digital Lane, Koramangala, Bangalore, 560034",
      phone: "+91 10987 65432",
      email: "deepa.kumar@example.com",
      riskLevel: "medium",
      riskScore: 45,
      lastAuditDate: "2025-04-26",
      nextAuditDate: "2025-05-26",
      status: "active",
      joinDate: "2024-03-01",
      transactionsToday: 9,
      transactionsThisMonth: 245,
      supervisor: "Ravi Kumar",
      auditor: "Priya Sharma"
    },
    {
      id: "CSP-2187",
      name: "Rahul Mehta",
      region: "central",
      location: "Bhopal, Madhya Pradesh",
      address: "345 Central Road, Bhopal, 462001",
      phone: "+91 09876 54321",
      email: "rahul.mehta@example.com",
      riskLevel: "low",
      riskScore: 22,
      lastAuditDate: "2025-04-25",
      nextAuditDate: "2025-05-25",
      status: "active",
      joinDate: "2024-02-10",
      transactionsToday: 13,
      transactionsThisMonth: 321,
      supervisor: "Anita Desai",
      auditor: "Vijay Mehta"
    }
  ];

  // Apply filters
  const filteredCSPs = mockCSPs.filter(csp => {
    // Apply region filter
    if (regionFilter !== "all" && csp.region !== regionFilter) {
      return false;
    }
    
    // Apply risk level filter
    if (riskFilter !== "all" && csp.riskLevel !== riskFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        csp.name.toLowerCase().includes(query) ||
        csp.id.toLowerCase().includes(query) ||
        csp.location.toLowerCase().includes(query) ||
        csp.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleViewDetails = (csp: any) => {
    setSelectedCSP(csp);
    setViewDetailsOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Regional CSP Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-700 hover:bg-purple-800">Add New CSP</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New CSP Agent</DialogTitle>
              <DialogDescription>
                Register a new Bank Correspondent in the system
              </DialogDescription>
            </DialogHeader>
            <div className="p-2">
              <h3 className="font-medium text-center text-purple-800 mb-4">CSP Application Form</h3>
              <p className="text-sm text-center mb-6">
                This is a form placeholder. In a real application, this would be a complete CSP registration form.
              </p>
              <div className="flex justify-center">
                <Button 
                  className="bg-purple-700 hover:bg-purple-800"
                  onClick={() => {
                    toast({
                      title: "Registration Process Started",
                      description: "The CSP registration has been initiated. The applicant will receive an email with next steps.",
                    });
                  }}
                >
                  Process CSP Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total CSPs</CardTitle>
            <CardDescription>Filtered CSP count</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredCSPs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active CSPs</CardTitle>
            <CardDescription>Currently operating</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {filteredCSPs.filter(csp => csp.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">High Risk</CardTitle>
            <CardDescription>CSPs requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {filteredCSPs.filter(csp => csp.riskLevel === "high").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Avg. Transactions</CardTitle>
            <CardDescription>Daily per CSP</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Math.round(filteredCSPs.reduce((sum, csp) => sum + csp.transactionsToday, 0) / 
                (filteredCSPs.filter(csp => csp.status === "active").length || 1))}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSP Agent Management</CardTitle>
          <CardDescription>View and manage all CSP agents in your regions</CardDescription>
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
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                {riskLevels.map(risk => (
                  <SelectItem key={risk.id} value={risk.id}>{risk.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CSP Agent</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Audit</TableHead>
                  <TableHead>Today's Txns</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCSPs.map(csp => (
                  <TableRow key={csp.id}>
                    <TableCell>
                      <div className="font-medium">{csp.name}</div>
                      <div className="text-xs text-gray-500">{csp.id} • {csp.location}</div>
                    </TableCell>
                    <TableCell>
                      {regions.find(r => r.id === csp.region)?.name.replace(' Region', '')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskLevelColor(csp.riskLevel)}>
                        {csp.riskScore}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={csp.status === "active" ? "default" : "outline"} 
                        className={csp.status === "active" ? "bg-green-500" : "bg-red-100 text-red-800"}>
                        {csp.status.charAt(0).toUpperCase() + csp.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(new Date(csp.lastAuditDate))}</TableCell>
                    <TableCell className="text-center">{csp.transactionsToday}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(csp)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-purple-700 hover:bg-purple-800"
                        >
                          Manage
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCSPs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No CSP agents found matching your filters.
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

      {/* CSP Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>CSP Agent Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected CSP agent
            </DialogDescription>
          </DialogHeader>
          
          {selectedCSP && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-3xl mb-4">
                      {selectedCSP.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <h2 className="text-xl font-semibold">{selectedCSP.name}</h2>
                    <p className="text-gray-500">{selectedCSP.id}</p>
                    <div className="mt-2">
                      <Badge className={getRiskLevelColor(selectedCSP.riskLevel)}>
                        Risk Score: {selectedCSP.riskScore}
                      </Badge>
                    </div>
                    <Badge 
                      className={`mt-2 ${selectedCSP.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {selectedCSP.status.charAt(0).toUpperCase() + selectedCSP.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-500">Assigned Personnel</h3>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Supervisor</p>
                          <p className="font-medium">{selectedCSP.supervisor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Auditor</p>
                          <p className="font-medium">{selectedCSP.auditor}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-500">Key Dates</h3>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Joined</p>
                          <p className="font-medium">{formatDate(new Date(selectedCSP.joinDate))}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Audit</p>
                          <p className="font-medium">{formatDate(new Date(selectedCSP.lastAuditDate))}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Next Audit</p>
                          <p className="font-medium">{formatDate(new Date(selectedCSP.nextAuditDate))}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{selectedCSP.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{selectedCSP.phone}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="font-medium">{selectedCSP.address}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Region</p>
                              <p className="font-medium">
                                {regions.find(r => r.id === selectedCSP.region)?.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="font-medium">{selectedCSP.location}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Transaction Activity</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Today</p>
                              <p className="text-2xl font-bold">{selectedCSP.transactionsToday}</p>
                              <p className="text-xs text-gray-500">transactions</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">This Month</p>
                              <p className="text-2xl font-bold">{selectedCSP.transactionsThisMonth}</p>
                              <p className="text-xs text-gray-500">transactions</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Daily Average</p>
                              <p className="text-2xl font-bold">
                                {Math.round(selectedCSP.transactionsThisMonth / 30)}
                              </p>
                              <p className="text-xs text-gray-500">transactions</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 h-[150px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                            <p className="text-sm text-gray-500 text-center">
                              Transaction history chart (placeholder)
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Quick Actions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button variant="outline" size="sm" className="h-auto py-2">
                          Schedule Audit
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-2">
                          View Transactions
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-2">
                          View Location History
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-2">
                          Performance Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                {selectedCSP.status === "active" ? (
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Suspend CSP
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    Reactivate CSP
                  </Button>
                )}
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