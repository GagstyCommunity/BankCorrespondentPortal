import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getRiskLevelColor, formatDate } from "@/lib/utils";

export default function AgentProfile() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Fetch agent profile data
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/api/users/profile"],
    enabled: !!user,
  });

  if (isLoadingAuth || isLoadingProfile) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Agent Profile</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading profile data...</CardTitle>
            <CardDescription>Please wait while we load your profile information.</CardDescription>
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
  const mockAgentProfile = {
    name: "Ramesh Kumar",
    id: "CSP-4521",
    email: "ramesh.kumar@example.com",
    mobileNumber: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    address: "123 Main Street, Andheri East, Mumbai, 400069",
    aadhaarNumber: "XXXX-XXXX-1234",
    panNumber: "ABCTY1234D",
    bankAccountNumber: "XXXXXXXXXXXX5678",
    ifscCode: "BANK0001234",
    riskLevel: "medium",
    riskScore: 45,
    lastAuditDate: "2025-04-15",
    nextAuditDate: "2025-05-15",
    status: "active",
    joinDate: "2024-01-10",
    supervisorName: "Anita Desai",
    supervisorContact: "+91 87654 32109"
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Agent Profile</h1>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? "bg-gray-500 hover:bg-gray-600" : "bg-purple-700 hover:bg-purple-800"}
        >
          {isEditing ? "Cancel Editing" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-3xl mb-4">
                {mockAgentProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-semibold">{mockAgentProfile.name}</h2>
              <p className="text-gray-500">{mockAgentProfile.id}</p>
              <div className="mt-2">
                <Badge className={getRiskLevelColor(mockAgentProfile.riskLevel)}>
                  {mockAgentProfile.riskLevel.charAt(0).toUpperCase() + mockAgentProfile.riskLevel.slice(1)} Risk ({mockAgentProfile.riskScore})
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className="bg-green-500 mt-1">
                  {mockAgentProfile.status.charAt(0).toUpperCase() + mockAgentProfile.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{mockAgentProfile.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">{formatDate(new Date(mockAgentProfile.joinDate))}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Audit</p>
                <p className="font-medium">{formatDate(new Date(mockAgentProfile.lastAuditDate))}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Scheduled Audit</p>
                <p className="font-medium">{formatDate(new Date(mockAgentProfile.nextAuditDate))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Update your personal and contact information" 
                : "Your personal and contact information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input 
                        id="name" 
                        defaultValue={mockAgentProfile.name} 
                      />
                    ) : (
                      <p className="font-medium">{mockAgentProfile.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={mockAgentProfile.email} 
                      />
                    ) : (
                      <p className="font-medium">{mockAgentProfile.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    {isEditing ? (
                      <Input 
                        id="mobile" 
                        defaultValue={mockAgentProfile.mobileNumber} 
                      />
                    ) : (
                      <p className="font-medium">{mockAgentProfile.mobileNumber}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input 
                        id="address" 
                        defaultValue={mockAgentProfile.address} 
                      />
                    ) : (
                      <p className="font-medium">{mockAgentProfile.address}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <p className="font-medium">{mockAgentProfile.aadhaarNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <p className="font-medium">{mockAgentProfile.panNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account">Bank Account Number</Label>
                    <p className="font-medium">{mockAgentProfile.bankAccountNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <p className="font-medium">{mockAgentProfile.ifscCode}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supervisor">Supervisor Name</Label>
                    <p className="font-medium">{mockAgentProfile.supervisorName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisor-contact">Supervisor Contact</Label>
                    <p className="font-medium">{mockAgentProfile.supervisorContact}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="bg-purple-700 hover:bg-purple-800">
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-gray-500 mb-2">Last changed 30 days ago</p>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-2">Enabled</p>
                <Button variant="outline" size="sm">
                  Manage 2FA
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium">Biometric Credentials</h3>
                <p className="text-sm text-gray-500 mb-2">Last updated: {formatDate(new Date(mockAgentProfile.lastAuditDate))}</p>
                <Button variant="outline" size="sm">
                  Update Biometrics
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium">Device Management</h3>
                <p className="text-sm text-gray-500 mb-2">1 active device</p>
                <Button variant="outline" size="sm">
                  Manage Devices
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance History Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compliance History</CardTitle>
            <CardDescription>Record of your audits and compliance checks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Quarterly Audit</p>
                  <p className="text-sm text-gray-500">{formatDate(new Date("2025-04-15"))}</p>
                </div>
                <Badge className="bg-green-500">Passed</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Monthly Review</p>
                  <p className="text-sm text-gray-500">{formatDate(new Date("2025-03-20"))}</p>
                </div>
                <Badge className="bg-green-500">Passed</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">KYC Process Audit</p>
                  <p className="text-sm text-gray-500">{formatDate(new Date("2025-02-15"))}</p>
                </div>
                <Badge className="bg-yellow-500">Issues Found</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Quarterly Audit</p>
                  <p className="text-sm text-gray-500">{formatDate(new Date("2025-01-10"))}</p>
                </div>
                <Badge className="bg-green-500">Passed</Badge>
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  View Full History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}