import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import GlassCard from "@/components/ui/glass-card";
import { Loader2, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvestmentList from "@/components/dashboard/investment-list";
import { Package, Investment } from "@shared/schema";
import { Link } from "wouter";

const InvestmentsPage = () => {
  const { user } = useAuth();

  const { data: investments, isLoading: isLoadingInvestments } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const { data: packages } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  if (isLoadingInvestments) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">My Investments</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your investment packages
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/marketplace">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-700">
              <FilePlus className="w-4 h-4 mr-2" />
              New Investment
            </Button>
          </Link>
        </div>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-6">Your Investment Portfolio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Invested</p>
            <p className="text-2xl font-bold">
              ${investments?.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2) || "0.00"}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/20 border border-teal-200 dark:border-teal-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              ${investments?.reduce((sum, inv) => sum + (inv.totalEarned || 0), 0).toFixed(2) || "0.00"}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Investments</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {investments?.filter(inv => inv.isActive).length || 0}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-4">Active Investments</h3>
          <InvestmentList 
            investments={investments?.filter(inv => inv.isActive) || []} 
            packages={packages || []} 
          />
        </div>
        
        {(investments?.filter(inv => !inv.isActive)?.length || 0) > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Completed Investments</h3>
            <InvestmentList 
              investments={investments?.filter(inv => !inv.isActive) || []} 
              packages={packages || []} 
            />
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default InvestmentsPage;