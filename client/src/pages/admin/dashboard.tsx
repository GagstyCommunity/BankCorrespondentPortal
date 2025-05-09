import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { getRiskLevelColor } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Building,
  BuildingIcon,
  CheckCircle,
  FileWarning,
  Filter,
  MapPin,
  RefreshCw,
  Shield,
  UserCog,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  // Fetch admin stats
  const { data: adminStats, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  // Fetch high risk agents
  const { data: highRiskAgents } = useQuery({
    queryKey: ["/api/admin/stats/high-risk-agents"],
  });

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Extract data from the API response
  const userCounts = adminStats?.userCounts || { total: 0, agents: 0, auditors: 0, bankOfficers: 0 };
  const highRiskCSPs = adminStats?.highRiskAgents || [];
  const pendingAudits = adminStats?.pendingAudits || 0;
  const fraudRules = adminStats?.fraudRules || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Fraud Engine Dashboard</h1>
        <p className="text-gray-600">System overview and alerts for Banking Correspondent Network.</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total CSPs</p>
                <h3 className="text-2xl font-bold mt-1">{userCounts?.agents || 0}</h3>
              </div>
              <div className="p-2 rounded-md bg-purple-100 text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                12%
              </span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <h3 className="text-2xl font-bold mt-1">{highRiskCSPs?.length || 0}</h3>
              </div>
              <div className="p-2 rounded-md bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                8%
              </span>
              <span className="text-gray-500 ml-2">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraud Score Avg</p>
                <h3 className="text-2xl font-bold mt-1">18.3</h3>
              </div>
              <div className="p-2 rounded-md bg-green-100 text-green-600">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500 flex items-center">
                <ArrowDownRight className="mr-1 h-4 w-4" />
                3.2%
              </span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Audits</p>
                <h3 className="text-2xl font-bold mt-1">{pendingAudits}</h3>
              </div>
              <div className="p-2 rounded-md bg-yellow-100 text-yellow-600">
                <FileWarning className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                15%
              </span>
              <span className="text-gray-500 ml-2">vs last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">CSP Agents</p>
                <h3 className="text-2xl font-bold mt-1">{userCounts?.agents || 0}</h3>
              </div>
              <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                <UserCog className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>Verification Status</span>
                <span>85% Completed</span>
              </div>
              <Progress value={85} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Auditors</p>
                <h3 className="text-2xl font-bold mt-1">{userCounts?.auditors || 0}</h3>
              </div>
              <div className="p-2 rounded-md bg-emerald-100 text-emerald-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>Monthly Audits</span>
                <span>72% Completed</span>
              </div>
              <Progress value={72} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Bank Officers</p>
                <h3 className="text-2xl font-bold mt-1">{userCounts?.bankOfficers || 0}</h3>
              </div>
              <div className="p-2 rounded-md bg-indigo-100 text-indigo-600">
                <BuildingIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>Issue Resolution</span>
                <span>93% Completed</span>
              </div>
              <Progress value={93} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Map & High Risk CSPs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Risk Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">CSP Risk Map</CardTitle>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center relative">
                {/* Map Visualization Mock */}
                <div className="w-full h-full rounded-lg relative">
                  <div className="absolute p-1 top-1/4 left-1/4 h-4 w-4 rounded-full bg-green-500 border-2 border-white hover:scale-150 transition-transform cursor-pointer">
                    <span className="hidden absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white px-2 py-1 text-xs rounded shadow-md group-hover:block whitespace-nowrap">Rahul Sharma</span>
                  </div>
                  <div className="absolute p-1 top-1/3 left-1/2 h-4 w-4 rounded-full bg-green-500 border-2 border-white hover:scale-150 transition-transform cursor-pointer"></div>
                  <div className="absolute p-1 top-1/2 left-1/3 h-4 w-4 rounded-full bg-yellow-500 border-2 border-white hover:scale-150 transition-transform cursor-pointer"></div>
                  <div className="absolute p-1 top-2/3 left-2/3 h-4 w-4 rounded-full bg-red-500 border-2 border-white hover:scale-150 transition-transform cursor-pointer"></div>
                  <div className="absolute p-1 top-3/4 left-1/5 h-4 w-4 rounded-full bg-green-500 border-2 border-white hover:scale-150 transition-transform cursor-pointer"></div>
                </div>

                {/* Map Controls Overlay */}
                <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <i className="ri-zoom-in-line text-gray-700"></i>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <i className="ri-zoom-out-line text-gray-700"></i>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <i className="ri-refresh-line text-gray-700"></i>
                  </Button>
                </div>

                {/* Legend */}
                <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md">
                  <div className="text-xs font-medium mb-1">Risk Level</div>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600">North Region</p>
                  <p className="text-lg font-semibold">86 CSPs</p>
                  <p className="text-xs text-green-600">98% Active</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600">Central Region</p>
                  <p className="text-lg font-semibold">104 CSPs</p>
                  <p className="text-xs text-green-600">95% Active</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600">South Region</p>
                  <p className="text-lg font-semibold">55 CSPs</p>
                  <p className="text-xs text-yellow-600">89% Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* High Risk CSPs */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">High Risk CSPs</CardTitle>
              <Badge variant="outline" className="bg-red-100 text-red-800">
                {highRiskCSPs?.length || 0} Critical
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto scrollbar-thin">
                {highRiskCSPs && highRiskCSPs.length > 0 ? (
                  highRiskCSPs.map((csp: any) => (
                    <div key={csp.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <img 
                              src={csp.user.profileImageUrl || `https://ui-avatars.com/api/?name=${csp.user.firstName}+${csp.user.lastName}&background=6A0DAD&color=fff`} 
                              alt="Agent profile" 
                              className="w-10 h-10 rounded-full object-cover border-2 border-red-500" 
                            />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 border-2 border-white rounded-full"></span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">{csp.user.firstName} {csp.user.lastName}</h3>
                            <p className="text-xs text-gray-500">ID: {csp.cspId}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getRiskLevelColor(csp.riskLevel)}>
                          Score: {csp.fraudScore}
                        </Badge>
                      </div>
                      <div className="text-xs text-red-700 bg-red-50 p-2 rounded-md">
                        <AlertTriangle className="inline-block mr-1 h-3 w-3" /> 
                        {csp.fraudScore > 70 
                          ? "Multiple biometric failures & odd-hour transactions" 
                          : csp.fraudScore > 50 
                            ? "Frequent device changes & selfie mismatch" 
                            : "Missing geolocation data & IP changes"}
                      </div>
                      <div className="mt-2 flex justify-between">
                        <Button variant="ghost" size="sm" className="text-xs">
                          View Details
                        </Button>
                        <Button size="sm" className="text-xs">
                          Assign Audit
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No high risk CSPs found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fraud Detection Rules & Recent Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Detection Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Fraud Detection Rules</CardTitle>
            <CardDescription>
              These rules determine how fraud scores are calculated for agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score Impact</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fraudRules && fraudRules.length > 0 ? (
                    fraudRules.map((rule: any) => (
                      <tr key={rule.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{rule.name.replace(/-/g, ' ')}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">+{rule.scoreImpact}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant="outline" className={rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {rule.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">
                        No fraud rules defined
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Audits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Recent Audits</CardTitle>
            <Button variant="link" className="text-primary p-0">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto scrollbar-thin">
              <div className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" 
                      alt="Auditor profile" 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Neha Patel (Auditor)</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>CSP: Vikram Desai</span>
                        <span className="mx-1">•</span>
                        <span>ID: CSP12458</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>
                </div>
                <div className="mt-2 bg-gray-50 rounded-md p-2 text-xs">
                  <p>Findings: Multiple biometric authentication failures confirmed. Location verification failed.</p>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>Today, 11:45 AM</span>
                  <span>Hash: fd8c7e9b23...</span>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" 
                      alt="Auditor profile" 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Rahul Verma (Auditor)</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>CSP: Priya Malhotra</span>
                        <span className="mx-1">•</span>
                        <span>ID: CSP11578</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Issues Found</Badge>
                </div>
                <div className="mt-2 bg-gray-50 rounded-md p-2 text-xs">
                  <p>Findings: Geolocation data inconsistent but explained due to recent office relocation.</p>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>Yesterday, 03:22 PM</span>
                  <span>Hash: a7c23f4d19...</span>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img 
                      src="https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" 
                      alt="Auditor profile" 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Arjun Singh (Auditor)</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>CSP: Aamir Khan</span>
                        <span className="mx-1">•</span>
                        <span>ID: CSP10568</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Passed</Badge>
                </div>
                <div className="mt-2 bg-gray-50 rounded-md p-2 text-xs">
                  <p>Findings: All systems verified and working correctly. No issues found.</p>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>2 days ago</span>
                  <span>Hash: 93bf27c81a...</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
