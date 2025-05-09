import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime, getRiskLevelColor, getStatusColor } from "@/lib/utils";
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  Camera, 
  CheckCircle, 
  CreditCard, 
  HandCoins, 
  HelpCircle, 
  Info, 
  MapPin, 
  Smartphone, 
  Wallet
} from "lucide-react";

export default function AgentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lastCheckInStatus, setLastCheckInStatus] = useState<{
    status: string;
    date: string;
    progress: number;
  }>({
    status: "pending",
    date: "Not available",
    progress: 0,
  });

  // Fetch agent stats
  const { data: agentStats, isLoading } = useQuery({
    queryKey: ["/api/agent/stats"],
  });

  useEffect(() => {
    // Calculate check-in status
    if (agentStats?.latestCheckIn) {
      const checkInDate = new Date(agentStats.latestCheckIn.checkInDate);
      const now = new Date();
      const hoursSinceLastCheckIn = (now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
      
      // Assuming check-ins are required every 24 hours
      const progress = Math.min(100, (hoursSinceLastCheckIn / 24) * 100);
      
      setLastCheckInStatus({
        status: agentStats.latestCheckIn.status,
        date: formatDateTime(checkInDate),
        progress: progress,
      });
    }
  }, [agentStats]);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const agentProfile = agentStats?.agentProfile;
  const transactions = agentStats?.transactions || [];
  const fraudScore = agentProfile?.fraudScore || 0;
  const riskLevel = agentProfile?.riskLevel || "low";

  // Get fraud score attributes based on score
  const getFraudScoreAttributes = (score: number) => {
    if (score <= 25) {
      return { text: "Excellent", color: "bg-secondary", width: `${Math.max(5, score)}%` };
    } else if (score <= 50) {
      return { text: "Good", color: "bg-yellow-500", width: `${score}%` };
    } else {
      return { text: "High Risk", color: "bg-red-500", width: `${score}%` };
    }
  };

  const scoreAttrs = getFraudScoreAttributes(fraudScore);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">FI Agent Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName}. Here's your activity overview.</p>
      </div>
      
      {/* Fraud Score Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Fraud Score</h2>
            <div className="flex items-center mt-2 md:mt-0">
              <Badge variant="outline" className={getRiskLevelColor(riskLevel)}>
                {riskLevel === "low" ? "Low Risk" : riskLevel === "medium" ? "Medium Risk" : "High Risk"}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            <div className="lg:w-2/3">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <Badge className="bg-primary text-white">
                      Current Score: {fraudScore}/100
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary">
                      {scoreAttrs.text}
                    </span>
                  </div>
                </div>
                <Progress value={fraudScore} className="h-2" indicatorClassName={scoreAttrs.color} />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Transactions</p>
                  <p className="text-lg font-semibold">{transactions.length}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Check-ins</p>
                  <p className="text-lg font-semibold">
                    {lastCheckInStatus.status === "verified" ? "Complete" : "Pending"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Biometric Auth</p>
                  <p className="text-lg font-semibold">100%</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3 mt-6 lg:mt-0">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Risk Factors</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
                    <span>Regular working hours</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
                    <span>Consistent device usage</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
                    <span>Valid geolocation</span>
                  </li>
                  {lastCheckInStatus.status !== "verified" && (
                    <li className="flex items-center">
                      <Info className="text-yellow-500 mr-2 h-4 w-4" />
                      <span>Check-in required</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Transactions & Check-In */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <Button variant="link" className="text-primary p-0">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.length > 0 ? (
                    transactions.slice(0, 5).map((transaction: any) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {transaction.customerName.split(' ').map((n: string) => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{transaction.customerName}</div>
                              <div className="text-sm text-gray-500">
                                {transaction.accountNumber ? 
                                  `XXX${transaction.accountNumber.slice(-4)}` : 
                                  (transaction.customerAadhaar ? `XXXX-XXXX-${transaction.customerAadhaar.slice(-4)}` : 'N/A')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{transaction.transactionType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(transaction.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(transaction.transactionDate)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Daily Check-In */}
        <div>
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Daily Check-In</h2>
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Last check-in: {lastCheckInStatus.date}
                </p>
                <div className="flex items-center">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${100 - lastCheckInStatus.progress}%` }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {Math.round(100 - lastCheckInStatus.progress)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {lastCheckInStatus.progress < 100 
                    ? `${Math.round(24 - (lastCheckInStatus.progress * 24 / 100))} hours until next check-in`
                    : "Check-in required now"}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Selfie Check-In</h3>
                    <Badge variant="outline" className={getStatusColor(lastCheckInStatus.status)}>
                      {lastCheckInStatus.status === "verified" ? "Completed" : "Required"}
                    </Badge>
                  </div>
                  {lastCheckInStatus.status === "verified" ? (
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Verified at {lastCheckInStatus.date}</p>
                        <p className="text-xs text-gray-500">Facial match: 98%</p>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => window.location.href = "/agent/check-in"}
                    >
                      <Camera className="mr-2 h-4 w-4" /> Perform Selfie Check-In
                    </Button>
                  )}
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">360° Video</h3>
                    <Badge variant="outline" className="bg-red-100 text-red-800">Required</Badge>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => window.location.href = "/agent/check-in"}
                  >
                    <Camera className="mr-2 h-4 w-4" /> Record 360° Video
                  </Button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Current Location</h3>
                    <Badge variant="outline" className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {agentStats?.locationLogs && agentStats.locationLogs[0]?.address || "Location not available"}
                  </p>
                  <div className="bg-gray-100 h-24 rounded-md flex items-center justify-center">
                    <MapPin className="text-primary h-8 w-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                <Wallet className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm">New Transaction</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                <CreditCard className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm">Customer KYC</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                <Smartphone className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm">Micro ATM</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                <HandCoins className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm">AEPS</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                <ArrowUp className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm">Remittance</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                <HelpCircle className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm">Help</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Alerts & Notifications */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h2>
            <Badge>3 New</Badge>
          </div>
          <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto scrollbar-thin">
            <div className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Verification Required</h3>
                  <p className="text-sm text-gray-600 mt-1">Your account needs additional verification. Please complete by EOD.</p>
                  <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Audit Passed</h3>
                  <p className="text-sm text-gray-600 mt-1">Congratulations! You passed the monthly security audit.</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">System Update</h3>
                  <p className="text-sm text-gray-600 mt-1">Portal will be under maintenance from 2 AM to 4 AM tomorrow.</p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
