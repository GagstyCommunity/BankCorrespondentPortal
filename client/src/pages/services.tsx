import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, BanknoteIcon, Building, CreditCard, HandCoins, Phone, Upload } from "lucide-react";
import { useLocation } from "wouter";

export default function Services() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center">Our Services</h1>
          <p className="text-center mt-4 max-w-3xl mx-auto text-white/90">
            Our Banking Correspondent Services provide essential financial solutions to underserved communities, 
            bringing banking to your doorstep.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="aeps" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-8">
            <TabsTrigger value="aeps">AEPS</TabsTrigger>
            <TabsTrigger value="remittance">Remittance</TabsTrigger>
            <TabsTrigger value="micro-atm">Micro ATM</TabsTrigger>
          </TabsList>
          
          <TabsContent value="aeps">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Aadhaar Enabled Payment System</h2>
                <p className="text-gray-700 mb-4">
                  AEPS allows you to perform basic banking transactions like withdrawal, deposit, and balance inquiry through your Aadhaar-linked bank account, 
                  using only your fingerprint for authentication.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <HandCoins className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Cash Withdrawal</h3>
                      <p className="text-gray-600 text-sm">Withdraw cash from your Aadhaar-linked bank account using biometric authentication.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <BanknoteIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Cash Deposit</h3>
                      <p className="text-gray-600 text-sm">Deposit cash into your Aadhaar-linked bank account securely and conveniently.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Balance Inquiry</h3>
                      <p className="text-gray-600 text-sm">Check your account balance instantly using your fingerprint.</p>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-6" onClick={() => navigate("/apply")}>
                  Become a CSP <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1621104507822-9e1243ff0f8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=500&q=80" 
                  alt="Person using AEPS for banking transaction" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="remittance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80" 
                  alt="Domestic money transfer" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Domestic Money Transfer</h2>
                <p className="text-gray-700 mb-4">
                  Our remittance services enable you to send money to any bank account in India securely and quickly,
                  helping you support your family and friends, no matter where they are.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Fast Transfers</h3>
                      <p className="text-gray-600 text-sm">Send money to any bank account in India within minutes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Multi-Bank Support</h3>
                      <p className="text-gray-600 text-sm">Transfer to any bank account across all major banks in India.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <BanknoteIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Competitive Rates</h3>
                      <p className="text-gray-600 text-sm">Low transaction fees for all domestic remittances.</p>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-6" onClick={() => navigate("/apply")}>
                  Become a CSP <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="micro-atm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Micro ATM Services</h2>
                <p className="text-gray-700 mb-4">
                  Our Micro ATM service allows customers to perform financial transactions using their debit card
                  in areas where traditional ATMs are not available, bringing essential banking services to your doorstep.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Card-Based Transactions</h3>
                      <p className="text-gray-600 text-sm">Perform transactions using any bank's debit card with PIN authentication.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Portable Device</h3>
                      <p className="text-gray-600 text-sm">Compact and portable device that can be carried anywhere.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <BanknoteIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Multiple Transactions</h3>
                      <p className="text-gray-600 text-sm">Cash withdrawal, balance inquiry, and mini-statement services.</p>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-6" onClick={() => navigate("/apply")}>
                  Become a CSP <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80" 
                  alt="Micro ATM transaction" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Service Cards */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Bill Payments</CardTitle>
                <CardDescription>Pay utility bills and more</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Pay electricity, water, gas, mobile, DTH recharges, and many more utility bills at your nearest CSP.
                  Get instant confirmation and receipts.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Insurance Services</CardTitle>
                <CardDescription>Protect what matters</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Buy and renew insurance policies from top providers. Get assistance in claims processing and premium payments.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Opening</CardTitle>
                <CardDescription>Start your banking journey</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Open new bank accounts, activate direct benefit transfers, and link your Aadhaar to your bank account.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to bring banking services to your community?</h2>
          <p className="text-gray-700 mb-8 max-w-3xl mx-auto">
            Join our network of Banking Correspondents and help provide essential financial services to underserved areas.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/apply")}>
              Apply Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
