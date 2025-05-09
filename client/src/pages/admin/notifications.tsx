import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDateTime } from "@/lib/utils";

export default function AdminNotifications() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState<boolean>(false);

  // Fetch notifications
  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["/api/admin/notifications"],
    enabled: !!user && user?.role === "admin",
  });

  const filteredNotifications = notifications?.filter((notification: any) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title?.toLowerCase().includes(query) ||
        notification.message?.toLowerCase().includes(query) ||
        notification.type?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleViewDetails = (notification: any) => {
    setSelectedNotification(notification);
    setViewDetailsOpen(true);
  };

  if (isLoadingAuth || isLoadingNotifications) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">System Notifications</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading notifications...</CardTitle>
            <CardDescription>Please wait while we load the notification data.</CardDescription>
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
  const mockNotifications = [
    {
      id: 1,
      title: "High-Risk CSP Agent Detected",
      message: "A CSP agent (ID: CSP-2146) has been flagged as high risk with a score of 92. Immediate audit recommended.",
      type: "alert",
      createdAt: "2025-05-07T08:30:00",
      read: false,
      actionUrl: "/admin/map-view",
      metadata: {
        agentId: "CSP-2146",
        agentName: "Rajiv Verma",
        riskScore: 92,
        location: "Chennai, Tamil Nadu"
      }
    },
    {
      id: 2,
      title: "Audit Completed",
      message: "An audit has been completed by Priya Sharma for CSP agent Ramesh Kumar. No issues found.",
      type: "info",
      createdAt: "2025-05-05T14:45:00",
      read: true,
      actionUrl: "/admin/audit-logs",
      metadata: {
        auditId: 1,
        auditorName: "Priya Sharma",
        agentName: "Ramesh Kumar",
        status: "completed"
      }
    },
    {
      id: 3,
      title: "New CSP Application Submitted",
      message: "A new CSP application has been submitted by Ananya Rao. Pending review and approval.",
      type: "info",
      createdAt: "2025-05-05T10:15:00",
      read: false,
      actionUrl: "/admin/manage-users",
      metadata: {
        applicantName: "Ananya Rao",
        applicantEmail: "ananya.rao@example.com",
        region: "Bangalore, Karnataka"
      }
    },
    {
      id: 4,
      title: "System Update Scheduled",
      message: "A system maintenance update is scheduled for May 12, 2025, from 02:00 to 04:00 IST. The system may be unavailable during this time.",
      type: "warning",
      createdAt: "2025-05-04T16:30:00",
      read: true,
      actionUrl: null,
      metadata: {
        maintenanceDate: "2025-05-12",
        startTime: "02:00 IST",
        endTime: "04:00 IST",
        affectedSystems: ["Authentication", "Transaction Processing", "Reporting"]
      }
    },
    {
      id: 5,
      title: "Critical Alert: Multiple Failed Check-ins",
      message: "CSP agent Anil Gupta (ID: CSP-8734) has experienced 5 consecutive failed biometric check-ins. Account temporarily suspended.",
      type: "critical",
      createdAt: "2025-05-03T19:10:00",
      read: false,
      actionUrl: "/admin/manage-users",
      metadata: {
        agentId: "CSP-8734",
        agentName: "Anil Gupta",
        failureCount: 5,
        lastAttempt: "2025-05-03T19:05:00",
        accountStatus: "suspended"
      }
    },
    {
      id: 6,
      title: "Fraud Rule Updated",
      message: "Fraud rule 'Aadhaar Re-use Detection' has been updated to include new verification parameters.",
      type: "info",
      createdAt: "2025-05-02T11:25:00",
      read: true,
      actionUrl: "/admin/fraud-engine",
      metadata: {
        ruleId: 3,
        ruleName: "Aadhaar Re-use Detection",
        updatedBy: "Sandeep Roy",
        previousThreshold: 2,
        newThreshold: 3
      }
    },
    {
      id: 7,
      title: "Monthly Report Generated",
      message: "The monthly CSP performance report for April 2025 has been generated and is ready for review.",
      type: "info",
      createdAt: "2025-05-01T09:00:00",
      read: true,
      actionUrl: "/admin/reports",
      metadata: {
        reportMonth: "April 2025",
        generatedBy: "System",
        fileSize: "2.3 MB",
        reportSections: ["Transaction Summary", "Risk Analysis", "Audit Compliance", "Operational Metrics"]
      }
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">System Notifications</h1>
        <Button 
          onClick={() => {
            toast({
              title: "Notifications Marked as Read",
              description: "All notifications have been marked as read.",
            });
          }}
          className="bg-purple-700 hover:bg-purple-800"
        >
          Mark All as Read
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">42</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">3</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>View and manage system notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search notifications"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Notification</TableHead>
                  <TableHead className="w-[150px]">Type</TableHead>
                  <TableHead className="w-[200px]">Date & Time</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockNotifications.map((notification) => (
                  <TableRow key={notification.id} className={!notification.read ? "bg-purple-50" : ""}>
                    <TableCell>
                      {!notification.read ? (
                        <Badge className="bg-purple-500">Unread</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Read</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-md">{notification.message}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        notification.type === "info" ? "bg-blue-500" :
                        notification.type === "alert" ? "bg-yellow-500" :
                        notification.type === "warning" ? "bg-orange-500" :
                        notification.type === "critical" ? "bg-red-500" :
                        "bg-gray-500"
                      }>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(new Date(notification.createdAt))}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(notification)}
                        >
                          View
                        </Button>
                        {notification.actionUrl && (
                          <Button 
                            size="sm" 
                            className="bg-purple-700 hover:bg-purple-800"
                            onClick={() => {
                              toast({
                                title: "Navigating",
                                description: `Taking you to ${notification.actionUrl}`,
                              });
                            }}
                          >
                            Go To
                          </Button>
                        )}
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

      {/* Notification Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
            <DialogDescription>
              Complete information about this notification
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">{selectedNotification.title}</h3>
                <Badge className={
                  selectedNotification.type === "info" ? "bg-blue-500" :
                  selectedNotification.type === "alert" ? "bg-yellow-500" :
                  selectedNotification.type === "warning" ? "bg-orange-500" :
                  selectedNotification.type === "critical" ? "bg-red-500" :
                  "bg-gray-500"
                }>
                  {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}
                </Badge>
                <p className="mt-2">{selectedNotification.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Received: {formatDateTime(new Date(selectedNotification.createdAt))}
                </p>
              </div>

              {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2">Additional Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-3 gap-1">
                            <div className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</div>
                            <div className="col-span-2">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                {!selectedNotification.read && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      toast({
                        title: "Notification Marked as Read",
                        description: "The notification has been marked as read.",
                      });
                      setViewDetailsOpen(false);
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
                {selectedNotification.actionUrl && (
                  <Button 
                    className="bg-purple-700 hover:bg-purple-800"
                    onClick={() => {
                      toast({
                        title: "Navigating",
                        description: `Taking you to ${selectedNotification.actionUrl}`,
                      });
                      setViewDetailsOpen(false);
                    }}
                  >
                    Go To Related Page
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}