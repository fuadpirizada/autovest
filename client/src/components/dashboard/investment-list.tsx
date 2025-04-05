import { useState } from "react";
import { Investment, Package } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface InvestmentListProps {
  investments: Investment[];
  packages: Package[];
}

const InvestmentList: React.FC<InvestmentListProps> = ({ investments, packages }) => {
  if (investments.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">No active investments</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have any active investments yet. Start investing to see your portfolio here.
        </p>
        <Link href="/marketplace">
          <Button className="bg-gradient-to-r from-amber-500 to-amber-700">
            View Investment Opportunities
          </Button>
        </Link>
      </div>
    );
  }

  // Match packages with investments
  const investmentsWithDetails = investments.map(investment => {
    const packageDetails = packages.find(pkg => pkg.id === investment.packageId);
    return { ...investment, packageDetails };
  });

  return (
    <div className="space-y-4">
      {investmentsWithDetails.map((investment) => {
        // Calculate progress
        const startDate = new Date(investment.startDate);
        const endDate = new Date(investment.endDate);
        const now = new Date();
        const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        const daysElapsed = (now.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        const progress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
        
        // Format dates
        const formattedStartDate = format(startDate, 'MMM d, yyyy');
        const formattedEndDate = format(endDate, 'MMM d, yyyy');
        
        return (
          <div key={investment.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img 
                  src={investment.packageDetails?.imageUrl || "https://via.placeholder.com/120"} 
                  alt={investment.packageDetails?.name || "Investment"} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between mb-1">
                  <h5 className="font-bold">{investment.packageDetails?.name || "Investment Package"}</h5>
                  <span className="text-teal-500">{investment.packageDetails?.weeklyReturn || 0}% Weekly</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Period: {formattedStartDate} - {formattedEndDate}
                    </p>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div 
                        className="h-full bg-teal-500 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Investment: ${investment.amount}</p>
                    <p className="text-sm text-teal-500">Earned: +${investment.totalEarned.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvestmentList;
