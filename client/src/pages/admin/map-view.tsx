import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getRiskLevelColor } from "@/lib/utils";

export default function AdminMapView() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [selectedView, setSelectedView] = useState<string>("risk");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  // Fetch agent locations with their risk scores
  const { data: agentLocations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["/api/admin/agent-locations"],
    enabled: !!user && user?.role === "admin",
  });

  // In a real application, we would use a mapping library like Leaflet or Google Maps
  // For this demo, we'll simulate a map with a placeholder

  if (isLoadingAuth || isLoadingLocations) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">CSP Map View</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading map data...</CardTitle>
            <CardDescription>Please wait while we load the map.</CardDescription>
          </CardHeader>
          <CardContent className="h-[600px] bg-gray-100 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-gray-300 mb-4"></div>
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">CSP Map View</h1>
        <div className="flex gap-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North Region</SelectItem>
              <SelectItem value="south">South Region</SelectItem>
              <SelectItem value="east">East Region</SelectItem>
              <SelectItem value="west">West Region</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => {
              toast({
                title: "Map Data Refreshed",
                description: "The map data has been updated with the latest information.",
              });
            }}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue={selectedView} onValueChange={setSelectedView} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="risk">Risk View</TabsTrigger>
          <TabsTrigger value="activity">Activity View</TabsTrigger>
          <TabsTrigger value="audits">Audit Status</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedView === "risk" ? "CSP Risk Map" : 
             selectedView === "activity" ? "CSP Activity Map" : "CSP Audit Status Map"}
          </CardTitle>
          <CardDescription>
            {selectedView === "risk" ? "Visualizing risk scores across all CSP agents" : 
             selectedView === "activity" ? "Monitoring real-time CSP agent activity" : 
             "Tracking audit status and compliance"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[600px] bg-gray-100 relative">
          {/* Map Placeholder - in a real app, this would be an actual map component */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-semibold mb-4">Map Visualization Placeholder</p>
              <p className="mb-4">In a real application, this would be an interactive map showing:</p>
              {selectedView === "risk" && (
                <div className="flex flex-col items-center gap-2">
                  <p>• CSP agent locations color-coded by risk level</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-green-500">Low Risk</Badge>
                    <Badge className="bg-yellow-500">Medium Risk</Badge>
                    <Badge className="bg-red-500">High Risk</Badge>
                  </div>
                </div>
              )}
              {selectedView === "activity" && (
                <div className="flex flex-col items-center gap-2">
                  <p>• Real-time CSP agent activity</p>
                  <p>• Transaction frequency heatmap</p>
                  <p>• Check-in locations and timestamps</p>
                </div>
              )}
              {selectedView === "audits" && (
                <div className="flex flex-col items-center gap-2">
                  <p>• Audit compliance status by region</p>
                  <p>• Pending audits highlighted</p>
                  <p>• Historical audit performance data</p>
                </div>
              )}
            </div>
          </div>

          {/* Sample Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded shadow-md">
            <h3 className="font-semibold mb-2">Legend</h3>
            <div className="flex flex-col gap-1">
              {selectedView === "risk" && (
                <>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-full"></div> Low Risk (0-30)</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-500 rounded-full"></div> Medium Risk (31-70)</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-full"></div> High Risk (71-100)</div>
                </>
              )}
              {selectedView === "activity" && (
                <>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded-full"></div> Active Now</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-500 rounded-full"></div> Inactive (24h)</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 rounded-full"></div> High Transaction Volume</div>
                </>
              )}
              {selectedView === "audits" && (
                <>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-full"></div> Compliant</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded-full"></div> Pending Audit</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-full"></div> Compliance Issues</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>CSP agents by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <span>Low Risk</span>
              <Badge className="bg-green-500">65%</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
            </div>
            
            <div className="flex justify-between mb-2">
              <span>Medium Risk</span>
              <Badge className="bg-yellow-500">25%</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "25%" }}></div>
            </div>
            
            <div className="flex justify-between mb-2">
              <span>High Risk</span>
              <Badge className="bg-red-500">10%</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "10%" }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Coverage</CardTitle>
            <CardDescription>CSP distribution by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>North Region</span>
                <span className="font-semibold">28 CSPs</span>
              </div>
              <div className="flex justify-between items-center">
                <span>South Region</span>
                <span className="font-semibold">32 CSPs</span>
              </div>
              <div className="flex justify-between items-center">
                <span>East Region</span>
                <span className="font-semibold">19 CSPs</span>
              </div>
              <div className="flex justify-between items-center">
                <span>West Region</span>
                <span className="font-semibold">24 CSPs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts Today</CardTitle>
            <CardDescription>Recent risk alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-red-800">High-Risk Behavior</p>
                    <p className="text-sm text-red-700">CSP ID: 4328</p>
                  </div>
                  <Badge className="bg-red-500">High</Badge>
                </div>
                <p className="text-sm mt-2">Sudden location change detected during transactions</p>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-yellow-800">Unusual Transaction Pattern</p>
                    <p className="text-sm text-yellow-700">CSP ID: 2159</p>
                  </div>
                  <Badge className="bg-yellow-500">Medium</Badge>
                </div>
                <p className="text-sm mt-2">Multiple high-value transactions in short timeframe</p>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-yellow-800">Biometric Verification Issue</p>
                    <p className="text-sm text-yellow-700">CSP ID: 3865</p>
                  </div>
                  <Badge className="bg-yellow-500">Medium</Badge>
                </div>
                <p className="text-sm mt-2">Multiple failed biometric verifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}