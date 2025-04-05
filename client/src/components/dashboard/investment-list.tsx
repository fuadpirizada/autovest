import { Investment, Package } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface InvestmentListProps {
  investments: Investment[];
  packages: Package[];
}

const InvestmentList = ({ investments, packages }: InvestmentListProps) => {
  if (investments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No investments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Package
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Start Date
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Duration
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Earned
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => {
            const pkg = packages.find((p) => p.id === investment.packageId);
            
            return (
              <tr 
                key={investment.id} 
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-800 overflow-hidden mr-3">
                      {pkg?.imageUrl ? (
                        <img 
                          src={pkg.imageUrl} 
                          alt={pkg?.name || 'Package'} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-r from-amber-500 to-amber-700" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{pkg?.name || "Unknown Package"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{pkg?.tier || ""}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 font-medium">${investment.amount.toFixed(2)}</td>
                <td className="py-4 px-4 text-sm">
                  {investment.startDate 
                    ? format(new Date(investment.startDate), 'MMM dd, yyyy') 
                    : "Not started"}
                </td>
                <td className="py-4 px-4 text-sm">{investment.durationMonths} month</td>
                <td className="py-4 px-4 font-medium text-teal-600 dark:text-teal-400">
                  ${(investment.totalEarned || 0).toFixed(2)}
                </td>
                <td className="py-4 px-4">
                  {investment.isActive ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline">Completed</Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentList;