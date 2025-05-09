import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";

export default function BankReports() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<string>("month");
  const [reportType, setReportType] = useState<string>("performance");
  
  // Fetch reports
  const { data: reports, isLoading: isLoadingReports } = useQuery({
    queryKey: ["/api/reports", timeRange, reportType],
    enabled: !!user && user?.role === "bank",
  });

  if (isLoadingAuth || isLoadingReports) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Reports & Analytics</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading report data...</CardTitle>
            <CardDescription>Please wait while we load the report information.</CardDescription>
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
  const timeRanges = [
    { id: "week", name: "Last 7 Days" },
    { id: "month", name: "Last 30 Days" },
    { id: "quarter", name: "Last Quarter" },
    { id: "year", name: "Last Year" }
  ];

  const reportTypes = [
    { id: "performance", name: "Performance Analytics" },
    { id: "risk", name: "Risk Analysis" },
    { id: "compliance", name: "Compliance Reports" },
    { id: "financial", name: "Financial Summary" }
  ];

  // Mock data for saved reports
  const mockReports = [
    {
      id: 1,
      name: "Monthly CSP Performance Report",
      type: "performance",
      period: "April 2025",
      createdOn: "2025-05-01",
      createdBy: "System",
      fileType: "PDF",
      fileSize: "2.3 MB"
    },
    {
      id: 2,
      name: "Quarterly Risk Analysis",
      type: "risk",
      period: "Q1 2025",
      createdOn: "2025-04-15",
      createdBy: "Anita Desai",
      fileType: "XLSX",
      fileSize: "4.1 MB"
    },
    {
      id: 3,
      name: "Annual Compliance Summary",
      type: "compliance",
      period: "2024",
      createdOn: "2025-03-10",
      createdBy: "Vikram Singh",
      fileType: "PDF",
      fileSize: "5.7 MB"
    },
    {
      id: 4,
      name: "Weekly Transaction Report",
      type: "financial",
      period: "Apr 24-30, 2025",
      createdOn: "2025-05-01",
      createdBy: "System",
      fileType: "XLSX",
      fileSize: "1.8 MB"
    },
    {
      id: 5,
      name: "High Risk CSP Analysis",
      type: "risk",
      period: "April 2025",
      createdOn: "2025-05-02",
      createdBy: "Ravi Kumar",
      fileType: "PDF",
      fileSize: "3.2 MB"
    }
  ];

  // Mock data for performance metrics
  const mockPerformanceMetrics = {
    totalTransactions: 45872,
    transactionGrowth: 12.5,
    avgTransactionsPerCSP: 436,
    topPerformingRegion: "North",
    topPerformingCSP: "Ramesh Kumar (CSP-4521)",
    activeCSPs: 98,
    activeCSPsGrowth: 5.2
  };

  // Mock data for risk metrics
  const mockRiskMetrics = {
    highRiskCSPs: 8,
    highRiskPercentage: 7.8,
    mediumRiskCSPs: 25,
    mediumRiskPercentage: 24.2,
    lowRiskCSPs: 70,
    lowRiskPercentage: 68.0,
    riskTrend: "decreasing",
    topRiskFactors: ["Biometric verification failures", "Odd-hour transactions", "Location inconsistencies"]
  };

  // Function to download a report
  const handleDownloadReport = (report: any) => {
    toast({
      title: "Report Downloaded",
      description: `${report.name} has been downloaded successfully.`,
    });
  };

  // Function to generate a new report
  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "New report has been generated and added to your saved reports.",
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Reports & Analytics</h1>
        <Button 
          className="bg-purple-700 hover:bg-purple-800"
          onClick={handleGenerateReport}
        >
          Generate New Report
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Report type" />
          </SelectTrigger>
          <SelectContent>
            {reportTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map(range => (
              <SelectItem key={range.id} value={range.id}>{range.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {reportType === "performance" && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Transaction Volume</CardTitle>
                <CardDescription>Total processed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockPerformanceMetrics.totalTransactions.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-500">+{mockPerformanceMetrics.transactionGrowth}%</Badge>
                  <span className="text-sm text-gray-500 ml-2">vs. previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Active CSPs</CardTitle>
                <CardDescription>Agents with transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockPerformanceMetrics.activeCSPs}</p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-500">+{mockPerformanceMetrics.activeCSPsGrowth}%</Badge>
                  <span className="text-sm text-gray-500 ml-2">vs. previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Average Volume</CardTitle>
                <CardDescription>Transactions per CSP</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockPerformanceMetrics.avgTransactionsPerCSP}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume Trend</CardTitle>
                <CardDescription>Daily transaction volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Transaction volume chart (placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>Transaction distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Regional performance chart (placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing CSPs</CardTitle>
                <CardDescription>Highest transaction volume agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Top CSPs performance chart (placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {reportType === "risk" && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">High Risk CSPs</CardTitle>
                <CardDescription>Agents requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">{mockRiskMetrics.highRiskCSPs}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {mockRiskMetrics.highRiskPercentage}% of total CSPs
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Medium Risk CSPs</CardTitle>
                <CardDescription>Agents requiring monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">{mockRiskMetrics.mediumRiskCSPs}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {mockRiskMetrics.mediumRiskPercentage}% of total CSPs
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Low Risk CSPs</CardTitle>
                <CardDescription>Compliant agents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{mockRiskMetrics.lowRiskCSPs}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {mockRiskMetrics.lowRiskPercentage}% of total CSPs
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>CSP risk level breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Risk distribution chart (placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Score Trends</CardTitle>
                <CardDescription>Average risk score over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Risk trend chart (placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Risk Factors</CardTitle>
                <CardDescription>Most common risk patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockRiskMetrics.topRiskFactors.map((factor, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-2">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold">{factor}</h3>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div 
                            className="bg-red-500 h-2.5 rounded-full" 
                            style={{ width: `${100 - (index * 15)}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {reportType === "compliance" && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Compliance Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Audit Compliance</CardTitle>
                <CardDescription>CSPs with completed audits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">92%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">KYC Compliance</CardTitle>
                <CardDescription>Transactions with proper KYC</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">98%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "98%" }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Operating Hours</CardTitle>
                <CardDescription>CSPs operating in allowed hours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">95%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "95%" }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance by Region</CardTitle>
                <CardDescription>Compliance rate across regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Regional compliance chart (placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Compliance Issues</CardTitle>
                <CardDescription>Most common compliance gaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Compliance issues chart (placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {reportType === "financial" && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Transaction Value</CardTitle>
                <CardDescription>Value of all transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">₹145.6M</p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-500">+8.3%</Badge>
                  <span className="text-sm text-gray-500 ml-2">vs. previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Average Transaction</CardTitle>
                <CardDescription>Average transaction value</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">₹3,175</p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-500">+2.1%</Badge>
                  <span className="text-sm text-gray-500 ml-2">vs. previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Commission Generated</CardTitle>
                <CardDescription>Total CSP commission</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">₹2.9M</p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-500">+7.5%</Badge>
                  <span className="text-sm text-gray-500 ml-2">vs. previous period</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Value Trend</CardTitle>
                <CardDescription>Total value over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Transaction value chart (placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Transaction Types</CardTitle>
                <CardDescription>Value distribution by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-200 rounded-md flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Transaction type chart (placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Saved Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockReports.map(report => (
            <Card key={report.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{report.name}</CardTitle>
                    <CardDescription>Period: {report.period}</CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 hover:bg-blue-50">
                    {report.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <p>Created: {formatDate(new Date(report.createdOn))}</p>
                    <p>By: {report.createdBy}</p>
                    <p>Format: {report.fileType} ({report.fileSize})</p>
                  </div>
                  <Button 
                    onClick={() => handleDownloadReport(report)}
                    className="bg-purple-700 hover:bg-purple-800"
                  >
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}