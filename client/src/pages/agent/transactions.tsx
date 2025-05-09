import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, getStatusColor } from "@/lib/utils";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BanknoteIcon,
  Clock,
  Download,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

// Transaction form schema
const transactionSchema = z.object({
  transactionType: z.string(),
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Amount must be a positive number"
  ),
  customerName: z.string().min(2, "Customer name is required"),
  customerAadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  accountNumber: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  deviceId: z.string().optional(),
});

export default function AgentTransactions() {
  const { toast } = useToast();
  const [newTransactionDialog, setNewTransactionDialog] = useState(false);
  const [transactionType, setTransactionType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    fetching: boolean;
  }>({
    latitude: null,
    longitude: null,
    fetching: false,
  });

  // Transaction form
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionType: "withdrawal",
      amount: "",
      customerName: "",
      customerAadhaar: "",
      accountNumber: "",
    },
  });

  // Fetch transactions
  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ["/api/transactions"],
  });

  // Get user's current location for transactions
  const getLocation = () => {
    setLocation(prev => ({ ...prev, fetching: true }));
    
    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      setLocation(prev => ({ ...prev, fetching: false }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude,
          longitude,
          fetching: false,
        });
      },
      (error) => {
        toast({
          title: "Location Error",
          description: `Error getting location: ${error.message}`,
          variant: "destructive",
        });
        setLocation(prev => ({ ...prev, fetching: false }));
      }
    );
  };

  // Submit transaction
  const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
    try {
      // Add location data if available
      const transactionData = {
        ...data,
        amount: parseFloat(data.amount),
        latitude: location.latitude,
        longitude: location.longitude,
        deviceId: 'web-browser', // In a real app, use a device fingerprint
      };
      
      await apiRequest("POST", "/api/transactions", transactionData);
      
      toast({
        title: "Transaction Created",
        description: "The transaction has been successfully recorded.",
      });
      
      // Refresh transactions
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      
      // Reset form and close dialog
      form.reset();
      setNewTransactionDialog(false);
      
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: "There was an error processing the transaction.",
        variant: "destructive",
      });
    }
  };

  // Filter transactions
  const filteredTransactions = transactions
    ? transactions.filter((transaction: any) => {
        // Filter by transaction type
        if (transactionType !== "all" && transaction.transactionType !== transactionType) {
          return false;
        }
        
        // Filter by search query (customer name or account number)
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          const nameMatch = transaction.customerName.toLowerCase().includes(searchLower);
          const accountMatch = transaction.accountNumber?.toLowerCase().includes(searchLower);
          const aadhaarMatch = transaction.customerAadhaar?.includes(searchQuery);
          
          if (!nameMatch && !accountMatch && !aadhaarMatch) {
            return false;
          }
        }
        
        // Filter by date range
        if (dateRange !== "all") {
          const txDate = new Date(transaction.transactionDate);
          const now = new Date();
          
          if (dateRange === "today") {
            const todayStart = new Date(now.setHours(0, 0, 0, 0));
            if (txDate < todayStart) return false;
          } else if (dateRange === "week") {
            const weekStart = new Date(now.setDate(now.getDate() - 7));
            if (txDate < weekStart) return false;
          } else if (dateRange === "month") {
            const monthStart = new Date(now.setMonth(now.getMonth() - 1));
            if (txDate < monthStart) return false;
          }
        }
        
        return true;
      })
    : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Transactions</h1>
        <p className="text-gray-600">Manage and track all your financial transactions.</p>
      </div>

      {/* Transaction Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <h3 className="text-2xl font-bold mt-1">{transactions?.length || 0}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <BanknoteIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Withdrawals</p>
                <h3 className="text-2xl font-bold mt-1">
                  {transactions?.filter((tx: any) => tx.transactionType === "withdrawal").length || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowUpFromLine className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Deposits</p>
                <h3 className="text-2xl font-bold mt-1">
                  {transactions?.filter((tx: any) => tx.transactionType === "deposit").length || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowDownToLine className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Transactions</p>
                <h3 className="text-2xl font-bold mt-1">
                  {transactions?.filter((tx: any) => {
                    const txDate = new Date(tx.transactionDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return txDate >= today;
                  }).length || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader className="p-6 flex flex-col sm:flex-row justify-between gap-4">
          <CardTitle>Transaction History</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative max-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customer..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="remittance">Remittance</SelectItem>
                <SelectItem value="bill">Bill Payment</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button size="icon" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Dialog open={newTransactionDialog} onOpenChange={setNewTransactionDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> New Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>New Transaction</DialogTitle>
                  <DialogDescription>
                    Create a new financial transaction record.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="transactionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="withdrawal">Withdrawal</SelectItem>
                              <SelectItem value="deposit">Deposit</SelectItem>
                              <SelectItem value="remittance">Remittance</SelectItem>
                              <SelectItem value="bill">Bill Payment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter customer's full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerAadhaar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhaar Number</FormLabel>
                          <FormControl>
                            <Input placeholder="12-digit Aadhaar number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the 12-digit Aadhaar number without spaces or dashes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Bank account number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={getLocation}
                        disabled={location.fetching}
                      >
                        {location.fetching ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        {location.latitude && location.longitude 
                          ? "Location Captured" 
                          : "Capture Location"}
                      </Button>
                      
                      {location.latitude && location.longitude && (
                        <p className="text-xs text-green-600">Location data available</p>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          "Create Transaction"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction: any) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{formatDateTime(transaction.transactionDate)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.customerName}</p>
                              <p className="text-sm text-gray-500">
                                {transaction.accountNumber 
                                  ? `A/C: xxx${transaction.accountNumber.slice(-4)}` 
                                  : transaction.customerAadhaar 
                                    ? `Aadhaar: xxx-xxx-${transaction.customerAadhaar.slice(-4)}`
                                    : "No ID"
                                }
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{transaction.transactionType}</TableCell>
                          <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No transactions found matching your filters.</p>
                  <Button variant="outline" onClick={() => {
                    setTransactionType("all");
                    setSearchQuery("");
                    setDateRange("all");
                  }} className="mt-2">
                    <Filter className="h-4 w-4 mr-2" /> Clear Filters
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {filteredTransactions.length} of {transactions?.length || 0} transactions
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
