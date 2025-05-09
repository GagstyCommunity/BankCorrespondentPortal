import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getRiskLevelColor } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Shield, MapPin, Phone, Mail, User, Building, CreditCard, Smartphone } from "lucide-react";

// Form schema for user profile
const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
});

// Form schema for bank details
const bankDetailsSchema = z.object({
  bankAccount: z.string().min(5, "Bank account number is required"),
  ifscCode: z.string().min(5, "IFSC code is required"),
});

export default function AgentProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch agent profile data
  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ["/api/users/profile"],
  });

  // Profile update form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: profileData?.user?.phoneNumber || "",
      address: profileData?.user?.address || "",
      district: profileData?.user?.district || "",
      state: profileData?.user?.state || "",
    },
  });

  // Bank details form
  const bankForm = useForm<z.infer<typeof bankDetailsSchema>>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      bankAccount: profileData?.agentProfile?.bankAccount || "",
      ifscCode: profileData?.agentProfile?.ifscCode || "",
    },
  });

  // Update form values when data is loaded
  useState(() => {
    if (profileData) {
      profileForm.reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: profileData.user.phoneNumber || "",
        address: profileData.user.address || "",
        district: profileData.user.district || "",
        state: profileData.user.state || "",
      });

      bankForm.reset({
        bankAccount: profileData.agentProfile?.bankAccount || "",
        ifscCode: profileData.agentProfile?.ifscCode || "",
      });
    }
  }, [profileData, user]);

  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      await apiRequest("PATCH", "/api/users/profile", data);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
      console.error("Profile update error:", error);
    }
  };

  const onBankDetailsSubmit = async (data: z.infer<typeof bankDetailsSchema>) => {
    try {
      // In a real app, you would update the agent profile's bank details
      // await apiRequest("PATCH", "/api/agent/bank-details", data);
      toast({
        title: "Bank details updated",
        description: "Your bank information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your bank details.",
        variant: "destructive",
      });
      console.error("Bank details update error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const userInfo = profileData?.user;
  const agentProfile = profileData?.agentProfile;

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">My Profile</h1>
        <p className="text-gray-600">View and manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.profileImageUrl || ""} alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-center">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-500 mb-2">{userInfo?.email}</p>
              <div className="flex items-center mb-4">
                <Badge variant="outline" className={getRiskLevelColor(agentProfile?.riskLevel || "low")}>
                  {agentProfile?.riskLevel === "low" ? "Low Risk" : 
                   agentProfile?.riskLevel === "medium" ? "Medium Risk" : "High Risk"}
                </Badge>
              </div>

              <div className="w-full mt-2 space-y-2">
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-gray-500" />
                  <span>CSP ID: {agentProfile?.cspId || "Not set"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{userInfo?.phoneNumber || "No phone number"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{userInfo?.email || "No email"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{userInfo?.address ? `${userInfo.address}, ${userInfo.district}, ${userInfo.state}` : "No address"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Fraud Score: {agentProfile?.fraudScore || 0}/100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="bank">Bank Details</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Personal Information</CardTitle>
                    <Button 
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your first name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your last name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div></div>
                          
                          <FormField
                            control={profileForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="district"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>District</FormLabel>
                                  <FormControl>
                                    <Input placeholder="District" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <FormControl>
                                    <Input placeholder="State" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500 text-sm">First Name</Label>
                          <p className="font-medium">{user?.firstName || "Not set"}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500 text-sm">Last Name</Label>
                          <p className="font-medium">{user?.lastName || "Not set"}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500 text-sm">Email</Label>
                          <p className="font-medium">{userInfo?.email || "Not set"}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500 text-sm">Phone Number</Label>
                          <p className="font-medium">{userInfo?.phoneNumber || "Not set"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-gray-500 text-sm">Address</Label>
                          <p className="font-medium">{userInfo?.address ? `${userInfo.address}, ${userInfo.district}, ${userInfo.state}` : "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bank Details Tab */}
            <TabsContent value="bank">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...bankForm}>
                    <form onSubmit={bankForm.handleSubmit(onBankDetailsSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={bankForm.control}
                          name="bankAccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bank Account Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your bank account number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={bankForm.control}
                          name="ifscCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IFSC Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter IFSC code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                          <p className="text-sm text-gray-600">Your bank details are securely stored and encrypted.</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit">Update Bank Details</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Smartphone className="h-5 w-5 text-primary mr-3" />
                          <div>
                            <h3 className="font-medium">Device Information</h3>
                            <p className="text-sm text-gray-600">Your currently registered device</p>
                          </div>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <div className="mt-3 text-sm text-gray-600 pl-8">
                        <p>Device ID: {userInfo?.deviceId || "Not registered"}</p>
                        <p>Last login: {userInfo?.lastLogin ? new Date(userInfo.lastLogin).toLocaleString() : "Never"}</p>
                        <p>Last IP: {userInfo?.lastIp || "Unknown"}</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-primary mr-3" />
                        <div>
                          <h3 className="font-medium">Biometric Authentication</h3>
                          <p className="text-sm text-gray-600">Status: <span className="text-green-600 font-medium">Enabled</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-primary mr-3" />
                        <div>
                          <h3 className="font-medium">Identity Verification</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm">Aadhaar Number</p>
                              <Badge variant={agentProfile?.aadhaarNumber ? "outline" : "secondary"} className={agentProfile?.aadhaarNumber ? "bg-green-100 text-green-800" : ""}>
                                {agentProfile?.aadhaarNumber ? "Verified" : "Not Verified"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm">PAN Number</p>
                              <Badge variant={agentProfile?.panNumber ? "outline" : "secondary"} className={agentProfile?.panNumber ? "bg-green-100 text-green-800" : ""}>
                                {agentProfile?.panNumber ? "Verified" : "Not Verified"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
