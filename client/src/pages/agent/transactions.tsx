import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function AgentTransactions() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState<boolean>(false);
  
  // Fetch transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: !!user && user?.role === "agent",
  });

  if (isLoadingAuth || isLoadingTransactions) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Transactions</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading transactions...</CardTitle>
            <CardDescription>Please wait while we load your transaction history.</CardDescription>
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
  const mockTransactions = [
    {
      id: 1,
      type: "Cash Deposit",
      amount: 15000,
      customerName: "Sunil Mehta",
      customerId: "CUST12345",
      accountNumber: "XXXX5678",
      timestamp: "2025-05-09T14:30:00",
      status: "completed",
      notes: "Regular savings deposit",
      location: "Mumbai, Maharashtra"
    },
    {
      id: 2,
      type: "Account Opening",
      amount: 5000,
      customerName: "Priya Singh",
      customerId: "CUST23456",
      accountNumber: "XXXX9012",
      timestamp: "2025-05-09T12:15:00",
      status: "completed",
      notes: "New savings account with initial deposit",
      location: "Mumbai, Maharashtra"
    },
    {
      id: 3,
      type: "Bill Payment",
      amount: 2500,
      customerName: "Rahul Sharma",
      customerId: "CUST34567",
      accountNumber: "XXXX3456",
      timestamp: "2025-05-09T11:00:00",
      status: "completed",
      notes: "Electricity bill payment",
      location: "Mumbai, Maharashtra"
    },
    {
      id: 4,
      type: "Cash Withdrawal",
      amount: 7500,
      customerName: "Amit Patel",
      customerId: "CUST45678",
      accountNumber: "XXXX7890",
      timestamp: "2025-05-09T10:45:00",
      status: "completed",
      notes: "Personal withdrawal",
      location: "Mumbai, Maharashtra"
    },
    {
      id: 5,
      type: "Money Transfer",
      amount: 10000,
      customerName: "Neha Verma",
      customerId: "CUST56789",
      accountNumber: "XXXX2345",
      timestamp: "2025-05-09T09:30:00",
      status: "completed",
      notes: "Transfer to family member",
      location: "Mumbai, Maharashtra"
    },
    {
      id: 6,
      type: "Loan Disbursement",
      amount: 50000,
      customerName: "Vikram Singh",
      customerId: "CUST67890",
      accountNumber: "XXXX5432",
      timestamp: "2025-05-08T15:15:00",
      status: "completed",
      notes: "Small business loan",
      location: "Mumbai, Maharashtra"
    },
    {
      id: 7,
      type: "Cash Deposit",
      amount: 25000,
      customerName: "Deepa Kumar",
      customerId: "CUST78901",
      accountNumber: "XXXX6789",
      timestamp: "2025-05-08T14:20:00",
      status: "completed",
      notes: "Business deposit",
      location: "Mumbai, Maharashtra"
    },
    {
      id: 8,
      type: "Bill Payment",
      amount: 1200,
      customerName: "Rajesh Gupta",
      customerId: "CUST89012",
      accountNumber: "XXXX7654",
      timestamp: "2025-05-08T11:45:00",
      status: "completed",
      notes: "Water bill payment",
      location: "Mumbai, Maharashtra"
    },
    {
      id: 9,
      type: "Account Opening",
      amount: 1000,
      customerName: "Meena Sharma",
      customerId: "CUST90123",
      accountNumber: "XXXX8765",
      timestamp: "2025-05-07T16:30:00",
      status: "completed",
      notes: "New current account with initial deposit",
      location: "Mumbai, Maharashtra"
    },
    {
      id: 10,
      type: "Cash Withdrawal",
      amount: 12000,
      customerName: "Sanjay Kapoor",
      customerId: "CUST01234",
      accountNumber: "XXXX9876",
      timestamp: "2025-05-07T13:50:00",
      status: "completed",
      notes: "Business expense withdrawal",
      location: "Mumbai, Maharashtra"
    }
  ];

  const transactionTypes = [
    { value: "all", label: "All Transactions" },
    { value: "Cash Deposit", label: "Cash Deposit" },
    { value: "Cash Withdrawal", label: "Cash Withdrawal" },
    { value: "Account Opening", label: "Account Opening" },
    { value: "Money Transfer", label: "Money Transfer" },
    { value: "Bill Payment", label: "Bill Payment" },
    { value: "Loan Disbursement", label: "Loan Disbursement" }
  ];

  const dateFilters = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  const getDateFilterDate = () => {
    const now = new Date();
    switch (dateFilter) {
      case "today":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      case "week":
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        return lastWeek;
      case "month":
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return lastMonth;
      default:
        return null;
    }
  };

  // Apply filters
  const filteredTransactions = mockTransactions.filter(tx => {
    // Apply transaction type filter
    if (typeFilter !== "all" && tx.type !== typeFilter) {
      return false;
    }
    
    // Apply date filter
    const dateFilterDate = getDateFilterDate();
    if (dateFilterDate && new Date(tx.timestamp) < dateFilterDate) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.customerName.toLowerCase().includes(query) ||
        tx.customerId.toLowerCase().includes(query) ||
        tx.accountNumber.toLowerCase().includes(query) ||
        tx.notes.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Transaction Created",
      description: "Your transaction has been successfully recorded.",
    });
    setIsNewTransactionOpen(false);
  };

  // Transaction stats calculations
  const totalTransactions = filteredTransactions.length;
  const totalValue = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const depositValue = filteredTransactions
    .filter(tx => tx.type === "Cash Deposit")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const withdrawalValue = filteredTransactions
    .filter(tx => tx.type === "Cash Withdrawal")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Transactions</h1>
        <Dialog open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-700 hover:bg-purple-800">New Transaction</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Record New Transaction</DialogTitle>
              <DialogDescription>
                Enter the details for the new transaction
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitTransaction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-type">Transaction Type</Label>
                  <Select required>
                    <SelectTrigger id="transaction-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionTypes.filter(t => t.value !== "all").map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input id="amount" type="number" min="1" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer-id">Customer ID</Label>
                <Input id="customer-id" placeholder="Enter Customer ID" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input id="customer-name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Transaction Notes</Label>
                <Input id="notes" placeholder="Add any relevant notes" />
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsNewTransactionOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-700 hover:bg-purple-800">
                  Complete Transaction
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Transactions</CardTitle>
            <CardDescription>Number of filtered transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalTransactions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Value</CardTitle>
            <CardDescription>Sum of all transaction amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Deposits</CardTitle>
            <CardDescription>Total deposits value</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(depositValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Withdrawals</CardTitle>
            <CardDescription>Total withdrawals value</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(withdrawalValue)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by customer, account, or notes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                {dateFilters.map(filter => (
                  <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>#{tx.id}</TableCell>
                    <TableCell>
                      <div>{tx.customerName}</div>
                      <div className="text-xs text-gray-500">{tx.customerId}</div>
                    </TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>{tx.accountNumber}</TableCell>
                    <TableCell>
                      {formatDate(new Date(tx.timestamp))}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm"
                        onClick={() => {
                          toast({
                            title: "Receipt Generated",
                            description: "Transaction receipt has been generated and is ready for download.",
                          });
                        }}
                      >
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end mt-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}