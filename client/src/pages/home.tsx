import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Building, CheckCircle, CreditCard, HelpCircle, MapPin, Shield, UserPlus } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [location, navigate] = useLocation();

  // Redirect to appropriate dashboard if logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role === "agent") {
        navigate("/agent/dashboard");
      } else if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "auditor") {
        navigate("/auditor/dashboard");
      } else if (user?.role === "bank") {
        navigate("/bank/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-purple-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">Banking Services for Rural India</h1>
              <p className="text-lg opacity-90">
                Empowering Banking Correspondents to deliver financial services to underserved areas with security and efficiency.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate("/login")} 
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Login to Portal
                </Button>
                <Button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1589758438368-0ad531db3366?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                alt="Banking correspondent helping customer" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Banking Services</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Providing essential financial services to rural and underserved communities through our network of Banking Correspondents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            icon={<CreditCard className="h-10 w-10 text-primary" />}
            title="AEPS Services"
            description="Aadhaar Enabled Payment System for biometric-authenticated transactions like cash withdrawal, deposit, and fund transfers."
          />
          <ServiceCard 
            icon={<Building className="h-10 w-10 text-primary" />}
            title="Micro ATM"
            description="Portable devices enabling banking services in remote areas without the need for traditional ATM infrastructure."
          />
          <ServiceCard 
            icon={<ArrowRight className="h-10 w-10 text-primary" />}
            title="Remittance"
            description="Secure money transfer services for domestic remittances, enabling families to send money across India."
          />
        </div>
      </div>

      {/* About CSP Section */}
      <div id="about" className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1593672715438-d88a1cf7a48f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                alt="Rural banking services" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">About CSP & Financial Inclusion</h2>
              <p className="text-gray-700">
                Customer Service Points (CSPs) or Banking Correspondents are authorized representatives who provide banking services in areas where bank branches are not present.
              </p>
              <ul className="space-y-3">
                <FeatureItem text="Bringing banking to the doorstep of rural India" />
                <FeatureItem text="Enabling financial inclusion for underserved communities" />
                <FeatureItem text="Secure and authenticated transactions using advanced technology" />
                <FeatureItem text="Real-time fraud detection and prevention" />
              </ul>
              <Button 
                onClick={() => navigate("/apply")}
                className="bg-primary hover:bg-primary/90"
              >
                Become a CSP <UserPlus className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Ready to join our network?</h3>
                <p className="mt-2 text-gray-700">
                  Become a Banking Correspondent and empower your community with financial services.
                </p>
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate("/apply")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Apply Now
                </Button>
                <Button 
                  onClick={() => navigate("/contact")}
                  variant="outline"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Bank CSP Portal</h3>
              <p className="text-gray-400">
                Secure banking services for all through our extensive network of Banking Correspondents.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <FooterLink text="Home" />
                <FooterLink text="About Us" />
                <FooterLink text="Services" />
                <FooterLink text="Apply as CSP" />
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Services</h4>
              <ul className="space-y-2">
                <FooterLink text="AEPS" />
                <FooterLink text="Micro ATM" />
                <FooterLink text="Remittance" />
                <FooterLink text="Insurance" />
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>123 Banking Street, Financial District</span>
                </li>
                <li className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <span>support@bankcsp.example.com</span>
                </li>
                <li className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  <span>+91 1234567890</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Bank CSP Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <CheckCircle className="h-5 w-5 text-secondary mr-2 mt-0.5" />
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

function FooterLink({ text }: { text: string }) {
  return (
    <li>
      <a href="#" className="text-gray-400 hover:text-white transition-colors">
        {text}
      </a>
    </li>
  );
}
