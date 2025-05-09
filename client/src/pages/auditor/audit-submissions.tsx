import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getPriorityColor } from "@/lib/utils";

export default function AuditorAuditSubmissions() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [selectedCSP, setSelectedCSP] = useState<string>("");
  const [auditFindings, setAuditFindings] = useState<string>("");
  const [auditStatus, setAuditStatus] = useState<string>("completed");
  const [auditPriority, setAuditPriority] = useState<string>("normal");
  const [evidenceFiles, setEvidenceFiles] = useState<FileList | null>(null);
  
  // Fetch CSP data for selection
  const { data: cspData, isLoading: isLoadingCSPs } = useQuery({
    queryKey: ["/api/auditor/csps"],
    enabled: !!user && user?.role === "auditor",
  });

  if (isLoadingAuth || isLoadingCSPs) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Audit Submission</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading data...</CardTitle>
            <CardDescription>Please wait while we load the submission form.</CardDescription>
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

  // Sample data for CSP selection
  const mockCSPs = [
    { id: "CSP-4521", name: "Ramesh Kumar", location: "Mumbai, Maharashtra" },
    { id: "CSP-8734", name: "Anil Gupta", location: "Delhi, New Delhi" },
    { id: "CSP-6392", name: "Sunita Patel", location: "Bangalore, Karnataka" },
    { id: "CSP-2146", name: "Rajiv Verma", location: "Chennai, Tamil Nadu" },
    { id: "CSP-7523", name: "Meena Sharma", location: "Kolkata, West Bengal" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCSP) {
      toast({
        title: "Error",
        description: "Please select a CSP agent to audit.",
        variant: "destructive"
      });
      return;
    }
    
    if (!auditFindings) {
      toast({
        title: "Error",
        description: "Please provide detailed audit findings.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would submit the form to the server
    toast({
      title: "Audit Submitted",
      description: "Your audit has been successfully submitted.",
    });
    
    // Reset form
    setSelectedCSP("");
    setAuditFindings("");
    setAuditStatus("completed");
    setAuditPriority("normal");
    setEvidenceFiles(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvidenceFiles(e.target.files);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Audit Submission</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit New Audit</CardTitle>
              <CardDescription>
                Complete this form to submit your audit findings for a CSP agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="csp-select">Select CSP Agent</Label>
                  <Select value={selectedCSP} onValueChange={setSelectedCSP}>
                    <SelectTrigger id="csp-select">
                      <SelectValue placeholder="Select a CSP agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCSPs.map(csp => (
                        <SelectItem key={csp.id} value={csp.id}>
                          {csp.name} ({csp.id}) - {csp.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audit-findings">Audit Findings</Label>
                  <Textarea
                    id="audit-findings"
                    placeholder="Provide detailed observations and findings from your audit..."
                    value={auditFindings}
                    onChange={(e) => setAuditFindings(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="audit-status">Audit Status</Label>
                    <Select value={auditStatus} onValueChange={setAuditStatus}>
                      <SelectTrigger id="audit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending Follow-up</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audit-priority">Priority</Label>
                    <Select value={auditPriority} onValueChange={setAuditPriority}>
                      <SelectTrigger id="audit-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence-files">Upload Evidence (Photos, Documents)</Label>
                  <Input 
                    id="evidence-files" 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-gray-500">
                    You can upload up to 5 files (max 2MB each). Supported formats: JPG, PNG, PDF.
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setSelectedCSP("");
                    setAuditFindings("");
                    setAuditStatus("completed");
                    setAuditPriority("normal");
                    setEvidenceFiles(null);
                  }}>
                    Clear Form
                  </Button>
                  <Button type="submit" className="bg-purple-700 hover:bg-purple-800">
                    Submit Audit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Audit Guidelines</CardTitle>
              <CardDescription>Follow these guidelines when submitting audits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Required Information</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                    <li>Complete CSP identification details</li>
                    <li>Detailed observations and findings</li>
                    <li>Supporting evidence (photos, documents)</li>
                    <li>Appropriate priority level assignment</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold">Priority Levels</h3>
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center">
                      <Badge className="bg-green-500 mr-2">Low</Badge>
                      <span className="text-sm">Minor issues, no compliance risk</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-blue-500 mr-2">Normal</Badge>
                      <span className="text-sm">Standard findings, action needed</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-yellow-500 mr-2">High</Badge>
                      <span className="text-sm">Significant issues, prompt action required</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-red-500 mr-2">Critical</Badge>
                      <span className="text-sm">Severe violations, immediate action needed</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Evidence Guidelines</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                    <li>Capture clear, well-lit photos</li>
                    <li>Include location context in images</li>
                    <li>Document all observed violations</li>
                    <li>Collect relevant paperwork copies</li>
                    <li>Respect privacy and data protection</li>
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-purple-700">Need Help?</h3>
                  <p className="text-sm mt-1">Contact the audit support team at:</p>
                  <p className="text-sm font-medium">audit-support@bankcorrespondent.com</p>
                  <p className="text-sm">Or call: +91 1800-AUDIT-HELP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}