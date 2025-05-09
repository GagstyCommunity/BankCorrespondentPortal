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

export default function AuditorRoutes() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  
  // Fetch route data
  const { data: routeData, isLoading: isLoadingRoutes } = useQuery({
    queryKey: ["/api/auditor/routes"],
    enabled: !!user && user?.role === "auditor",
  });

  if (isLoadingAuth || isLoadingRoutes) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Audit Routes</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading route data...</CardTitle>
            <CardDescription>Please wait while we load your audit routes.</CardDescription>
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
  const mockRegions = [
    { id: "all", name: "All Regions" },
    { id: "mumbai", name: "Mumbai Region" },
    { id: "delhi", name: "Delhi Region" },
    { id: "bangalore", name: "Bangalore Region" },
    { id: "chennai", name: "Chennai Region" },
    { id: "kolkata", name: "Kolkata Region" }
  ];

  const mockRoutes = [
    {
      id: 1,
      name: "Mumbai Central Route",
      region: "mumbai",
      cspCount: 8,
      distance: 42,
      estimatedTime: "6 hours",
      status: "active",
      assignedDate: "2025-05-10",
      priority: "high",
      csps: [
        { name: "Ramesh Kumar", cspId: "CSP-4521", address: "123 Main Street, Andheri East", riskLevel: "high" },
        { name: "Rajiv Singh", cspId: "CSP-7623", address: "567 West Avenue, Bandra West", riskLevel: "medium" },
        { name: "Neha Verma", cspId: "CSP-3245", address: "890 South Road, Worli", riskLevel: "low" }
        // more CSPs would be listed here
      ]
    },
    {
      id: 2,
      name: "Delhi Downtown Loop",
      region: "delhi",
      cspCount: 6,
      distance: 35,
      estimatedTime: "5 hours",
      status: "active",
      assignedDate: "2025-05-12",
      priority: "medium",
      csps: [
        { name: "Anil Gupta", cspId: "CSP-8734", address: "456 Central Avenue, Connaught Place", riskLevel: "medium" },
        { name: "Sanjay Kapoor", cspId: "CSP-5432", address: "789 North Lane, Karol Bagh", riskLevel: "low" },
        { name: "Priti Sharma", cspId: "CSP-9876", address: "234 East Street, Lajpat Nagar", riskLevel: "medium" }
        // more CSPs would be listed here
      ]
    },
    {
      id: 3,
      name: "Bangalore Tech Park Circuit",
      region: "bangalore",
      cspCount: 7,
      distance: 38,
      estimatedTime: "5.5 hours",
      status: "pending",
      assignedDate: "2025-05-15",
      priority: "medium",
      csps: [
        { name: "Sunita Patel", cspId: "CSP-6392", address: "789 Tech Park, Whitefield", riskLevel: "low" },
        { name: "Rahul Mehta", cspId: "CSP-2187", address: "345 Innovation Avenue, Electronic City", riskLevel: "low" },
        { name: "Deepa Kumar", cspId: "CSP-7654", address: "678 Digital Lane, Koramangala", riskLevel: "medium" }
        // more CSPs would be listed here
      ]
    },
    {
      id: 4,
      name: "Chennai Coastal Route",
      region: "chennai",
      cspCount: 5,
      distance: 30,
      estimatedTime: "4 hours",
      status: "active",
      assignedDate: "2025-05-11",
      priority: "high",
      csps: [
        { name: "Rajiv Verma", cspId: "CSP-2146", address: "234 Beach Road, Adyar", riskLevel: "high" },
        { name: "Karthik Rajan", cspId: "CSP-4321", address: "567 Marina Drive, Mylapore", riskLevel: "medium" },
        { name: "Lakshmi Subramaniam", cspId: "CSP-8765", address: "890 Coast Road, Besant Nagar", riskLevel: "low" }
        // more CSPs would be listed here
      ]
    },
    {
      id: 5,
      name: "Kolkata Heritage Circuit",
      region: "kolkata",
      cspCount: 6,
      distance: 32,
      estimatedTime: "4.5 hours",
      status: "inactive",
      assignedDate: "2025-05-20",
      priority: "low",
      csps: [
        { name: "Meena Sharma", cspId: "CSP-7523", address: "567 Park Street", riskLevel: "medium" },
        { name: "Dipak Banerjee", cspId: "CSP-1098", address: "234 College Street", riskLevel: "low" },
        { name: "Ritu Ghosh", cspId: "CSP-5432", address: "789 Heritage Lane, Salt Lake", riskLevel: "low" }
        // more CSPs would be listed here
      ]
    }
  ];

  // Filter routes by selected region
  const filteredRoutes = selectedRegion === "all" 
    ? mockRoutes 
    : mockRoutes.filter(route => route.region === selectedRegion);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Audit Routes</h1>
        <Button className="bg-purple-700 hover:bg-purple-800">
          Request New Route
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {mockRegions.map(region => (
              <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {filteredRoutes.map(route => (
          <Card key={route.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{route.name}</CardTitle>
                  <CardDescription>
                    {mockRegions.find(r => r.id === route.region)?.name} • {route.cspCount} CSPs
                  </CardDescription>
                </div>
                <Badge className={
                  route.priority === "high" ? "bg-red-500" :
                  route.priority === "medium" ? "bg-yellow-500" :
                  "bg-green-500"
                }>
                  {route.priority.charAt(0).toUpperCase() + route.priority.slice(1)} Priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-medium">{route.distance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Time</p>
                    <p className="font-medium">{route.estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assigned Date</p>
                    <p className="font-medium">{formatDate(new Date(route.assignedDate))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge variant={route.status === "active" ? "default" : "outline"} 
                      className={
                        route.status === "active" ? "bg-green-500" : 
                        route.status === "pending" ? "bg-yellow-500" : 
                        "bg-gray-500"
                      }>
                      {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">CSPs on this route:</p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {route.csps.map((csp, index) => (
                      <div key={csp.cspId} className="flex justify-between items-center p-2 border rounded-md bg-gray-50">
                        <div>
                          <p className="font-medium text-sm">{index + 1}. {csp.name}</p>
                          <p className="text-xs text-gray-500">{csp.cspId} • {csp.address}</p>
                        </div>
                        <Badge className={getRiskLevelColor(csp.riskLevel)}>
                          {csp.riskLevel.charAt(0).toUpperCase() + csp.riskLevel.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline">View Map</Button>
                  <Button className="bg-purple-700 hover:bg-purple-800">Start Audit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Route Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Route Map Overview</CardTitle>
          <CardDescription>Visual representation of all audit routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold mb-4">Map Visualization Placeholder</p>
            <p className="mb-4">In a real application, this would be an interactive map showing:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>CSP locations with risk-level color coding</li>
              <li>Optimized audit routes</li>
              <li>Distance and estimated travel times</li>
              <li>Traffic conditions and alternative routes</li>
            </ul>
            <div className="mt-6">
              <Button>Open Full Map View</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}