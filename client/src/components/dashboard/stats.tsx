import { Investment, Transaction } from "@shared/schema";
import GlassCard from "../ui/glass-card";
import { useAuth } from "@/hooks/use-auth";

interface DashboardStatsProps {
  investments: Investment[];
  transactions: Transaction[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  investments, 
  transactions 
}) => {
  const { user } = useAuth();
  
  // Calculate the total invested amount
  const totalInvested = investments.reduce(
    (sum, investment) => sum + investment.amount, 
    0
  );
  
  // Calculate total earnings
  const totalEarned = investments.reduce(
    (sum, investment) => sum + investment.totalEarned, 
    0
  );
  
  // Count active investments
  const activeInvestmentsCount = investments.filter(
    inv => inv.isActive
  ).length;
  
  // Calculate next payout (simplified version)
  const weeklyReturns = investments
    .filter(inv => inv.isActive)
    .map(inv => {
      const packageId = inv.packageId;
      // Find package return rate based on packageId
      // This is a simplification - in a real app, we'd have this data available
      let returnRate = 0.015; // Default to 1.5%
      if (packageId === 1) returnRate = 0.012; // Economy
      if (packageId === 2) returnRate = 0.015; // Premium
      if (packageId === 3) returnRate = 0.02;  // Luxury
      if (packageId === 4) returnRate = 0.025; // Supercar
      
      return inv.amount * returnRate;
    })
    .reduce((sum, weeklyReturn) => sum + weeklyReturn, 0);
  
  // Estimate days until next payout (just for display - in a real app would be from backend)
  const daysUntilPayout = 2;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GlassCard className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available Balance</p>
        <p className="text-2xl font-bold">${user?.balance.toFixed(2)}</p>
      </GlassCard>
      
      <GlassCard className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Investments</p>
        <p className="text-2xl font-bold">${totalInvested.toFixed(2)}</p>
      </GlassCard>
      
      <GlassCard className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Earnings</p>
        <p className="text-2xl font-bold text-teal-500">${totalEarned.toFixed(2)}</p>
      </GlassCard>
      
      <GlassCard className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next Payout</p>
        <p className="text-2xl font-bold">
          <span className="text-amber-500">${weeklyReturns.toFixed(2)}</span>
          {weeklyReturns > 0 && (
            <span className="text-sm font-normal ml-1">in {daysUntilPayout} days</span>
          )}
        </p>
      </GlassCard>
    </div>
  );
};

export default DashboardStats;
