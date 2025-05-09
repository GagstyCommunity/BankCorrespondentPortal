import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import {
  CalendarIcon,
  Clock,
  Download,
  Filter,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";

export default function AgentLocationLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Fetch location logs
  const { data: locationLogs, isLoading, refetch } = useQuery({
    queryKey: ["/api/location-logs"],
  });

  // Filter location logs
  const filteredLogs = locationLogs
    ? locationLogs.filter((log: any) => {
        // Filter by activity
        if (activityFilter !== "all" && log.activity !== activityFilter) {
          return false;
        }
        
        // Filter by search (address)
        if (searchQuery && !log.address?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Filter by date range
        if (dateRange !== "all") {
          const logDate = new Date(log.logDate);
          const now = new Date();
          
          if (dateRange === "today") {
            const todayStart = new Date(now.setHours(0, 0, 0, 0));
            if (logDate < todayStart) return false;
          } else if (dateRange === "week") {
            const weekStart = new Date(now.setDate(now.getDate() - 7));
            if (logDate < weekStart) return false;
          } else if (dateRange === "month") {
            const monthStart = new Date(now.setMonth(now.getMonth() - 1));
            if (logDate < monthStart) return false;
          }
        }
        
        return true;
      })
    : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Location Logs</h1>
        <p className="text-gray-600">Track and manage your location activity for security and compliance.</p>
      </div>

      {/* Location Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Logs</p>
                <h3 className="text-2xl font-bold mt-1">{locationLogs?.length || 0}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Check-ins</p>
                <h3 className="text-2xl font-bold mt-1">
                  {locationLogs?.filter((log: any) => log.activity === "check-in").length || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Transactions</p>
                <h3 className="text-2xl font-bold mt-1">
                  {locationLogs?.filter((log: any) => log.activity === "transaction").length || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Logs</p>
                <h3 className="text-2xl font-bold mt-1">
                  {locationLogs?.filter((log: any) => {
                    const logDate = new Date(log.logDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return logDate >= today;
                  }).length || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Logs Table */}
      <Card>
        <CardHeader className="p-6 flex flex-col sm:flex-row justify-between gap-4">
          <CardTitle>Location History</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative max-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search address..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="check-in">Check-in</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="login">Login</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button size="icon" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {filteredLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Coordinates</TableHead>
                        <TableHead>Device ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                              {formatDateTime(log.logDate)}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{log.activity}</TableCell>
                          <TableCell>
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-1 mt-1 text-primary flex-shrink-0" />
                              <span>{log.address || "Unknown location"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.latitude && log.longitude 
                              ? `${log.latitude.toFixed(6)}, ${log.longitude.toFixed(6)}`
                              : "Not available"
                            }
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.deviceId || "Unknown device"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No location logs found matching your filters.</p>
                  <Button variant="outline" onClick={() => {
                    setActivityFilter("all");
                    setSearchQuery("");
                    setDateRange("all");
                  }} className="mt-2">
                    <Filter className="h-4 w-4 mr-2" /> Clear Filters
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {filteredLogs.length} of {locationLogs?.length || 0} location logs
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Map Visualization */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Location Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 rounded-lg bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
              <p className="text-gray-600">Map visualization would appear here</p>
              <p className="text-sm text-gray-500 mt-1">
                Showing location data for {filteredLogs.length} log entries
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
