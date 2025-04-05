import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import GlassCard from "@/components/ui/glass-card";
import { Loader2 } from "lucide-react";
import DashboardStats from "@/components/dashboard/stats";
import InvestmentList from "@/components/dashboard/investment-list";
import TransactionList from "@/components/dashboard/transaction-list";
import { Package, Investment, Transaction } from "@shared/schema";

const DashboardPage = () => {
  const { user } = useAuth();

  const { data: investments, isLoading: isLoadingInvestments } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: packages } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  if (isLoadingInvestments || isLoadingTransactions) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.fullName || user?.username}!
          </p>
        </div>
      </div>

      <DashboardStats investments={investments || []} transactions={transactions || []} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Active Investments</h2>
            <InvestmentList 
              investments={investments || []} 
              packages={packages || []} 
            />
          </GlassCard>
        </div>

        <div>
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
            <TransactionList transactions={transactions?.slice(0, 5) || []} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
