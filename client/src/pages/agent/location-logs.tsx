import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function AgentLocationLogs() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  
  // Fetch location logs
  const { data: locationLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["/api/location-logs"],
    enabled: !!user && user?.role === "agent",
  });

  if (isLoadingAuth || isLoadingLogs) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Location Logs</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading location data...</CardTitle>
            <CardDescription>Please wait while we load your location history.</CardDescription>
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
  const mockLocationLogs = [
    {
      id: 1,
      timestamp: "2025-05-09T14:30:00",
      latitude: 19.1136,
      longitude: 72.8697,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "transaction",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "Cash Deposit of ₹15,000"
    },
    {
      id: 2,
      timestamp: "2025-05-09T12:15:00",
      latitude: 19.1137,
      longitude: 72.8698,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "transaction",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "Account Opening with ₹5,000 initial deposit"
    },
    {
      id: 3,
      timestamp: "2025-05-09T10:45:00",
      latitude: 19.1135,
      longitude: 72.8696,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "transaction",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "Cash Withdrawal of ₹7,500"
    },
    {
      id: 4,
      timestamp: "2025-05-09T08:30:00",
      latitude: 19.1136,
      longitude: 72.8697,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "check-in",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "Daily Biometric Check-in"
    },
    {
      id: 5,
      timestamp: "2025-05-08T17:45:00",
      latitude: 19.1136,
      longitude: 72.8697,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "log-out",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "End of Day Log-out"
    },
    {
      id: 6,
      timestamp: "2025-05-08T15:15:00",
      latitude: 19.1138,
      longitude: 72.8699,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "transaction",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "Loan Disbursement of ₹50,000"
    },
    {
      id: 7,
      timestamp: "2025-05-08T13:20:00",
      latitude: 19.1139,
      longitude: 72.8695,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "transaction",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "Bill Payment of ₹1,200"
    },
    {
      id: 8,
      timestamp: "2025-05-08T08:45:00",
      latitude: 19.1136,
      longitude: 72.8697,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "check-in",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "Daily Biometric Check-in"
    },
    {
      id: 9,
      timestamp: "2025-05-07T16:30:00",
      latitude: 19.1135,
      longitude: 72.8698,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "log-out",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "End of Day Log-out"
    },
    {
      id: 10,
      timestamp: "2025-05-07T08:15:00",
      latitude: 19.1136,
      longitude: 72.8697,
      address: "123 Main Street, Andheri East, Mumbai, 400069",
      activity: "check-in",
      deviceId: "DEVICE-123456",
      ipAddress: "192.168.1.100",
      details: "Daily Biometric Check-in"
    }
  ];

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "check-in", label: "Check-ins" },
    { value: "transaction", label: "Transactions" },
    { value: "log-out", label: "Log-outs" }
  ];

  const dateFilters = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  const getDateFilterDate = () => {
    const now = new Date();
    switch (dateFilter) {
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

  // Apply filters
  const filteredLogs = mockLocationLogs.filter(log => {
    // Apply activity type filter
    if (activityFilter !== "all" && log.activity !== activityFilter) {
      return false;
    }
    
    // Apply date filter
    const dateFilterDate = getDateFilterDate();
    if (dateFilterDate && new Date(log.timestamp) < dateFilterDate) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Location Logs</h1>
        <Button 
          className="bg-purple-700 hover:bg-purple-800"
          onClick={() => {
            toast({
              title: "Location Updated",
              description: "Your current location has been logged.",
            });
          }}
        >
          Log Current Location
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Logs</CardTitle>
            <CardDescription>Number of location records</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredLogs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Check-ins</CardTitle>
            <CardDescription>Number of biometric verifications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {filteredLogs.filter(log => log.activity === "check-in").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Transactions</CardTitle>
            <CardDescription>Number of transaction logs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {filteredLogs.filter(log => log.activity === "transaction").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Location History</CardTitle>
            <CardDescription>Your recorded locations and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by activity" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  {dateFilters.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {formatDateTime(new Date(log.timestamp))}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          log.activity === "check-in" ? "bg-blue-500" :
                          log.activity === "transaction" ? "bg-green-500" :
                          log.activity === "log-out" ? "bg-gray-500" :
                          "bg-purple-500"
                        }>
                          {log.activity === "check-in" ? "Check-in" :
                           log.activity === "transaction" ? "Transaction" :
                           log.activity === "log-out" ? "Log-out" :
                           log.activity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{log.address}</div>
                          <div className="text-xs text-gray-500">
                            Lat: {log.latitude.toFixed(6)}, Long: {log.longitude.toFixed(6)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-500">
                          <div>{log.deviceId}</div>
                          <div>{log.ipAddress}</div>
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

        <Card>
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
            <CardDescription>Visual representation of your activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-gray-200 rounded-md flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="mb-2">Map Preview</p>
                <p className="text-xs max-w-xs mx-auto">
                  In a real application, this would show an interactive map with your location history
                </p>
              </div>
              {/* In a real app, this would be a Google Map or similar */}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <p className="text-sm">Check-in Locations</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <p className="text-sm">Transaction Locations</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                <p className="text-sm">Log-out Locations</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
              <p className="text-sm text-yellow-800 font-medium">Important</p>
              <p className="text-xs mt-1">
                Your location is only tracked during official banking activities like check-ins and transactions. 
                This data is used for security monitoring and audit purposes only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Analytics</CardTitle>
          <CardDescription>Patterns in your location data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Activity Timeline</h3>
              <div className="h-[150px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                <p className="text-sm text-gray-500 text-center">
                  Activity heatmap by time of day (chart placeholder)
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Location Consistency</h3>
              <div className="h-[150px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                <p className="text-sm text-gray-500 text-center">
                  Consistency score over time (chart placeholder)
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Device Usage</h3>
              <div className="h-[150px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                <p className="text-sm text-gray-500 text-center">
                  Device usage patterns (chart placeholder)
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold mb-3">Location Insights</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2 mt-0.5">✓</div>
                  <p>99.8% of your activities occur at your registered location</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2 mt-0.5">✓</div>
                  <p>Your average check-in time is 08:37 AM</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2 mt-0.5">✓</div>
                  <p>Peak transaction activity occurs between 10 AM and 2 PM</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2 mt-0.5">✓</div>
                  <p>You consistently use the same registered device for banking activities</p>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Reminders</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 mt-0.5">i</div>
                  <p>Check-ins are required at the start of each business day</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 mt-0.5">i</div>
                  <p>All banking transactions must be performed at your registered location</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-2 mt-0.5">!</div>
                  <p>Alert bank administrators of any location changes or device updates</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-2 mt-0.5">!</div>
                  <p>Location anomalies may trigger security reviews of your account</p>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}