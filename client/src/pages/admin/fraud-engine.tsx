import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Clock,
  Eye,
  Filter,
  Fingerprint,
  Loader2,
  Map,
  MessageSquare,
  PhoneOff,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Smartphone,
  UserX,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FraudEngine() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskLevel, setRiskLevel] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch fraud rules
  const { data: fraudRules, isLoading } = useQuery({
    queryKey: ["/api/admin/fraud-rules"],
  });

  // Fetch agent fraud scores
  const { data: agentScores } = useQuery({
    queryKey: ["/api/admin/agent-scores"],
  });

  // Update rule score impact
  const updateRuleScoreImpact = async (ruleId: number, scoreImpact: number) => {
    setIsUpdating(true);
    
    try {
      await apiRequest("PATCH", `/api/admin/fraud-rules/${ruleId}`, {
        scoreImpact,
      });
      
      toast({
        title: "Rule Updated",
        description: "The fraud rule score impact has been updated.",
      });
      
      // Refresh fraud rules
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fraud-rules"] });
      
    } catch (error) {
      console.error("Rule update error:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the fraud rule.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle rule status
  const toggleRuleStatus = async (ruleId: number, currentStatus: string) => {
    setIsUpdating(true);
    
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      await apiRequest("PATCH", `/api/admin/fraud-rules/${ruleId}`, {
        status: newStatus,
      });
      
      toast({
        title: "Rule Status Updated",
        description: `The fraud rule has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
      });
      
      // Refresh fraud rules
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fraud-rules"] });
      
    } catch (error) {
      console.error("Rule status update error:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the rule status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter agents
  const filteredAgents = agentScores
    ? agentScores.filter((agent: any) => {
        // Filter by risk level
        if (riskLevel !== "all" && agent.riskLevel !== riskLevel) {
          return false;
        }
        
        // Filter by search (name or CSP ID)
        if (searchQuery) {
          const name = `${agent.user.firstName} ${agent.user.lastName}`.toLowerCase();
          const cspId = agent.cspId.toLowerCase();
          
          return name.includes(searchQuery.toLowerCase()) || cspId.includes(searchQuery.toLowerCase());
        }
        
        return true;
      })
    : [];

  // Sort agents by fraud score (descending)
  const sortedAgents = filteredAgents.sort((a: any, b: any) => b.fraudScore - a.fraudScore);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Fraud Engine</h1>
        <p className="text-gray-600">Configure fraud detection rules and monitor agent risk levels.</p>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="rules">Fraud Rules</TabsTrigger>
          <TabsTrigger value="agents">Agent Risk Scores</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Fraud Rules Tab */}
        <TabsContent value="rules">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Fraud Detection Rules</CardTitle>
                  <CardDescription>
                    Configure the rules and score impacts that determine agent risk levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-60 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div>
                      <Button variant="outline" className="mb-4" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/fraud-rules"] })}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh Rules
                      </Button>
                      
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Rule Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-center">Score Impact</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fraudRules && fraudRules.length > 0 ? (
                              fraudRules.map((rule: any) => (
                                <TableRow key={rule.id}>
                                  <TableCell className="font-medium capitalize">{rule.name.replace(/-/g, ' ')}</TableCell>
                                  <TableCell>{rule.description}</TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex items-center justify-center">
                                      <Input 
                                        type="number" 
                                        defaultValue={rule.scoreImpact}
                                        className="w-16 text-center"
                                        min={1}
                                        max={100}
                                        onChange={(e) => {
                                          const value = parseInt(e.target.value);
                                          if (value !== rule.scoreImpact && !isNaN(value)) {
                                            updateRuleScoreImpact(rule.id, value);
                                          }
                                        }}
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Switch 
                                      checked={rule.status === "active"} 
                                      onCheckedChange={() => toggleRuleStatus(rule.id, rule.status)}
                                    />
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                  <div className="flex flex-col items-center">
                                    <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-gray-500">No fraud rules found</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Rule Effectiveness</CardTitle>
                  <CardDescription>
                    Impact of each rule on fraud detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Odd-hour Transactions</Label>
                        <span className="text-sm">24%</span>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Device/IP Change</Label>
                        <span className="text-sm">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Selfie Mismatch</Label>
                        <span className="text-sm">32%</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Missing Geolocation</Label>
                        <span className="text-sm">14%</span>
                      </div>
                      <Progress value={14} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Failed Biometrics</Label>
                        <span className="text-sm">38%</span>
                      </div>
                      <Progress value={38} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Aadhaar Reuse</Label>
                        <span className="text-sm">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Risk Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Low Risk</span>
                      </div>
                      <span>78%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span>Medium Risk</span>
                      </div>
                      <span>15%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span>High Risk</span>
                      </div>
                      <span>7%</span>
                    </div>
                    
                    <div className="h-4 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div className="flex h-full">
                        <div className="bg-green-500 h-full" style={{ width: '78%' }}></div>
                        <div className="bg-yellow-500 h-full" style={{ width: '15%' }}></div>
                        <div className="bg-red-500 h-full" style={{ width: '7%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Agent Risk Scores Tab */}
        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
                <div>
                  <CardTitle>Agent Risk Scores</CardTitle>
                  <CardDescription>
                    Monitor and assess fraud risk levels across all banking correspondents
                  </CardDescription>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search agent..."
                      className="pl-8 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select value={riskLevel} onValueChange={setRiskLevel}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/agent-scores"] })}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-60 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>CSP ID</TableHead>
                        <TableHead>Fraud Score</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Risk Factors</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAgents && sortedAgents.length > 0 ? (
                        sortedAgents.map((agent: any) => {
                          // Generate risk factors based on score
                          const riskFactors = [];
                          if (agent.fraudScore > 70) {
                            riskFactors.push(<Badge key="1" variant="outline" className="bg-red-100 text-red-800">Biometric Failures</Badge>);
                            riskFactors.push(<Badge key="2" variant="outline" className="bg-red-100 text-red-800 ml-1">Odd Hours</Badge>);
                          } else if (agent.fraudScore > 50) {
                            riskFactors.push(<Badge key="1" variant="outline" className="bg-yellow-100 text-yellow-800">Device Changes</Badge>);
                            riskFactors.push(<Badge key="2" variant="outline" className="bg-yellow-100 text-yellow-800 ml-1">Selfie Mismatch</Badge>);
                          } else if (agent.fraudScore > 25) {
                            riskFactors.push(<Badge key="1" variant="outline" className="bg-yellow-100 text-yellow-800">Missing Geolocation</Badge>);
                          } else {
                            riskFactors.push(<Badge key="1" variant="outline" className="bg-green-100 text-green-800">All Clear</Badge>);
                          }
                          
                          return (
                            <TableRow key={agent.id}>
                              <TableCell>
                                <div className="flex items-center">
                                  <img
                                    src={agent.user.profileImageUrl || `https://ui-avatars.com/api/?name=${agent.user.firstName}+${agent.user.lastName}&background=6A0DAD&color=fff`}
                                    alt={`${agent.user.firstName} ${agent.user.lastName}`}
                                    className="w-8 h-8 rounded-full mr-2 object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">{agent.user.firstName} {agent.user.lastName}</p>
                                    <p className="text-xs text-gray-500">{agent.user.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{agent.cspId}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Progress 
                                    value={agent.fraudScore} 
                                    max={100}
                                    className="w-24 h-2 mr-2"
                                    indicatorClassName={
                                      agent.fraudScore > 50 ? "bg-red-500" :
                                      agent.fraudScore > 25 ? "bg-yellow-500" :
                                      "bg-green-500"
                                    }
                                  />
                                  <span>{agent.fraudScore}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  agent.riskLevel === "high" ? "bg-red-100 text-red-800" :
                                  agent.riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-green-100 text-green-800"
                                }>
                                  {agent.riskLevel.charAt(0).toUpperCase() + agent.riskLevel.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {riskFactors}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="mr-1">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  Assign Audit
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex flex-col items-center">
                              <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-gray-500">No agents found</p>
                              <Button variant="outline" onClick={() => {
                                setSearchQuery("");
                                setRiskLevel("all");
                              }} className="mt-2">
                                <Filter className="h-4 w-4 mr-2" /> Clear Filters
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Fraud Trends Analysis</CardTitle>
                <CardDescription>
                  Fraud detection trends over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <BarChart3 className="h-12 w-12 text-gray-300" />
                  <p className="ml-4 text-gray-500">Fraud trend analytics visualization would appear here</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Fingerprint className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Failed Biometrics</p>
                          <p className="text-2xl font-bold">24</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">Odd Hours</p>
                          <p className="text-2xl font-bold">18</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Device Changes</p>
                          <p className="text-2xl font-bold">41</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Map className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Geo Issues</p>
                          <p className="text-2xl font-bold">15</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fraud Detection Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-primary">92%</div>
                    <p className="text-sm text-gray-500 mt-2">accuracy in fraud detection</p>
                    
                    <div className="mt-6 space-y-2">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>True Positives</span>
                          <span>87%</span>
                        </div>
                        <Progress value={87} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>False Positives</span>
                          <span>8%</span>
                        </div>
                        <Progress value={8} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>False Negatives</span>
                          <span>5%</span>
                        </div>
                        <Progress value={5} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Fraud Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserX className="h-5 w-5 text-red-500 mr-2" />
                        <span>Biometric Failures</span>
                      </div>
                      <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>
                    </li>
                    
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                        <span>Device Switching</span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                    </li>
                    
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <PhoneOff className="h-5 w-5 text-red-500 mr-2" />
                        <span>Geolocation Mismatch</span>
                      </div>
                      <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>
                    </li>
                    
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 text-yellow-500 mr-2" />
                        <span>Customer Complaints</span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                    </li>
                    
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                        <span>Odd Hour Transactions</span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
