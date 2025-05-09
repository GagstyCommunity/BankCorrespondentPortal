import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ChevronRight, Loader2, MapPin, Phone, User } from "lucide-react";

// Form schema for CSP application
const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  aadhaarNumber: z.string().regex(/^[0-9]{12}$/, "Aadhaar number must be 12 digits"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
  address: z.string().min(10, "Please enter your complete address"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  qualification: z.string().min(2, "Qualification is required"),
  experience: z.string().optional(),
});

export default function Apply() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [applicationCompleted, setApplicationCompleted] = useState(false);
  
  // Form setup
  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      aadhaarNumber: "",
      panNumber: "",
      address: "",
      district: "",
      state: "",
      qualification: "",
      experience: "",
    },
  });

  // Submit CSP application
  const onSubmit = async (data: z.infer<typeof applicationSchema>) => {
    setSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/apply", data);
      
      toast({
        title: "Application Submitted Successfully",
        description: "We've received your CSP application. Our team will review it and get back to you soon.",
      });
      
      setApplicationCompleted(true);
      
    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Application Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // If application is completed, show success page
  if (applicationCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for your interest in becoming a Banking Correspondent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-700">
              Your application has been successfully submitted. Our team will review your information
              and contact you within 3-5 business days.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              <Button className="w-full" onClick={() => navigate("/contact")}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center">Become a Banking Correspondent</h1>
          <p className="text-center mt-4 max-w-3xl mx-auto text-white/90">
            Join our network of Banking Correspondents and help bring essential financial services to underserved communities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Process Steps */}
          <div className="mb-8">
            <Tabs 
              value={step.toString()} 
              onValueChange={(value) => setStep(parseInt(value))}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="1" disabled={submitting}>
                  <span className="hidden sm:inline">1. Personal Information</span>
                  <span className="sm:hidden">Step 1</span>
                </TabsTrigger>
                <TabsTrigger value="2" disabled={!form.getValues().name || submitting}>
                  <span className="hidden sm:inline">2. Identity & Address</span>
                  <span className="sm:hidden">Step 2</span>
                </TabsTrigger>
                <TabsTrigger value="3" disabled={!form.getValues().aadhaarNumber || submitting}>
                  <span className="hidden sm:inline">3. Qualifications</span>
                  <span className="sm:hidden">Step 3</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>{
                step === 1 ? "Personal Information" :
                step === 2 ? "Identity & Address Verification" :
                "Education & Experience"
              }</CardTitle>
              <CardDescription>{
                step === 1 ? "Please provide your basic details" :
                step === 2 ? "Your identity documents and address information" :
                "Tell us about your qualifications and experience"
              }</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <User className="text-gray-500 mr-2 h-5 w-5" />
                                <Input placeholder="Enter your full name" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Phone className="text-gray-500 mr-2 h-5 w-5" />
                                <Input placeholder="10-digit mobile number" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              We'll send verification and updates to this number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button 
                          type="button" 
                          onClick={() => setStep(2)}
                          disabled={!form.getValues().name || !form.getValues().email || !form.getValues().phoneNumber}
                          className="w-full"
                        >
                          Continue <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Identity & Address */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="aadhaarNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aadhaar Number</FormLabel>
                            <FormControl>
                              <Input placeholder="12-digit Aadhaar number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter your 12-digit Aadhaar number without spaces
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="panNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN Number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. ABCDE1234F" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Address</FormLabel>
                            <FormControl>
                              <div className="flex items-start">
                                <MapPin className="text-gray-500 mr-2 h-5 w-5 mt-2" />
                                <Textarea 
                                  placeholder="Enter your complete address with landmark" 
                                  className="min-h-[80px]"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>District</FormLabel>
                              <FormControl>
                                <Input placeholder="Your district" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                                  <SelectItem value="Assam">Assam</SelectItem>
                                  <SelectItem value="Bihar">Bihar</SelectItem>
                                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                                  <SelectItem value="Kerala">Kerala</SelectItem>
                                  <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                  <SelectItem value="Punjab">Punjab</SelectItem>
                                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                                  <SelectItem value="West Bengal">West Bengal</SelectItem>
                                  {/* Add more states as needed */}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => setStep(3)}
                          disabled={!form.getValues().aadhaarNumber || !form.getValues().panNumber || !form.getValues().address}
                        >
                          Continue <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Qualifications */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="qualification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Educational Qualification</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select qualification" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="10th Pass">10th Pass</SelectItem>
                                <SelectItem value="12th Pass">12th Pass</SelectItem>
                                <SelectItem value="Diploma">Diploma</SelectItem>
                                <SelectItem value="Graduate">Graduate</SelectItem>
                                <SelectItem value="Post-Graduate">Post-Graduate</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relevant Experience (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe any experience in banking, finance, retail, or customer service" 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Tell us about any experience that would help you as a Banking Correspondent
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4 flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setStep(2)}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit"
                          disabled={submitting || !form.formState.isValid}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100 py-16 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Becoming a CSP</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Earn Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Earn attractive commissions on every transaction. The more customers you serve, the more you earn.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Low Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Start with minimal infrastructure. All you need is a computer, internet connection, and basic peripherals.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Training & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Receive comprehensive training and continuous support from our dedicated team to help you succeed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
