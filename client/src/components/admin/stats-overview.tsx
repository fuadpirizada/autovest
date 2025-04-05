import { User, Package, Investment, Transaction } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useMemo } from "react";

interface StatsOverviewProps {
  users: User[];
  packages: Package[];
  investments: Investment[];
  transactions: Transaction[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  users,
  packages,
  investments,
  transactions,
}) => {
  // Total counts
  const totalUsers = users.length;
  const activeInvestments = investments.filter((inv) => inv.isActive).length;
  
  // Total investment amount
  const totalInvestmentAmount = investments.reduce(
    (total, inv) => total + inv.amount,
    0
  );

  // Pending withdrawals
  const pendingWithdrawals = transactions
    .filter((tx) => tx.type === "withdrawal" && tx.status === "pending")
    .reduce((total, tx) => total + tx.amount, 0);

  // Investment distribution by tier
  const investmentsByTier = useMemo(() => {
    const tierMap = investments.reduce((acc, investment) => {
      const pkg = packages.find((p) => p.id === investment.packageId);
      if (pkg) {
        if (!acc[pkg.tier]) {
          acc[pkg.tier] = 0;
        }
        acc[pkg.tier] += investment.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tierMap).map(([tier, amount]) => ({
      tier,
      amount,
    }));
  }, [investments, packages]);

  // Monthly investment data
  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        time: d.getTime(),
        economy: 0,
        premium: 0,
        luxury: 0,
        supercar: 0,
      };
    }).reverse();

    // Group investments by month and tier
    investments.forEach((inv) => {
      const investmentDate = new Date(inv.startDate);
      const monthData = last6Months.find(
        (m) =>
          investmentDate.getMonth() === new Date(m.time).getMonth() &&
          investmentDate.getFullYear() === new Date(m.time).getFullYear()
      );
      
      if (monthData) {
        const pkg = packages.find((p) => p.id === inv.packageId);
        if (pkg) {
          const tierKey = pkg.tier.toLowerCase() as 'economy' | 'premium' | 'luxury' | 'supercar';
          monthData[tierKey] += inv.amount;
        }
      }
    });

    return last6Months;
  }, [investments, packages]);

  // Recent activity data
  const recentActivity = useMemo(() => {
    const activities = [
      ...transactions.map((tx) => ({
        id: `tx-${tx.id}`,
        type: tx.type === "return" 
          ? "return" 
          : tx.type === "withdrawal" 
            ? "withdrawal" 
            : "investment",
        title: tx.type === "return" 
          ? "Weekly Return" 
          : tx.type === "withdrawal" 
            ? "Withdrawal Request" 
            : "New Investment",
        description: `User #${tx.userId} ${
          tx.type === "return"
            ? "received a return of"
            : tx.type === "withdrawal"
              ? "requested withdrawal of"
              : "invested"
        } $${Math.abs(tx.amount).toFixed(2)}`,
        time: new Date(tx.date).getTime(),
        formattedTime: new Date(tx.date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })),
    ].sort((a, b) => b.time - a.time).slice(0, 5);

    return activities;
  }, [transactions]);

  // Activity type to border color
  const getActivityBorderColor = (type: string) => {
    switch (type) {
      case "return":
        return "border-teal-500";
      case "investment":
        return "border-amber-500";
      case "withdrawal":
        return "border-purple-500";
      case "login":
        return "border-blue-500";
      default:
        return "border-gray-500";
    }
  };

  // Chart colors
  const COLORS = ["#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-teal-500 flex items-center">
              <span className="i-lucide-arrow-up mr-1" />
              12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Investments</CardDescription>
            <CardTitle className="text-3xl">{activeInvestments}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-teal-500 flex items-center">
              <span className="i-lucide-arrow-up mr-1" />
              8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Investments</CardDescription>
            <CardTitle className="text-3xl">
              ${totalInvestmentAmount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-teal-500 flex items-center">
              <span className="i-lucide-arrow-up mr-1" />
              15% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Withdrawals</CardDescription>
            <CardTitle className="text-3xl">
              ${Math.abs(pendingWithdrawals).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              {transactions.filter(tx => tx.type === "withdrawal" && tx.status === "pending").length} requests pending
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Investment Distribution</CardTitle>
            <CardDescription>Monthly breakdown by package tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="economy" stackId="a" fill="#3B82F6" name="Economy" />
                  <Bar dataKey="premium" stackId="a" fill="#F59E0B" name="Premium" />
                  <Bar dataKey="luxury" stackId="a" fill="#8B5CF6" name="Luxury" />
                  <Bar dataKey="supercar" stackId="a" fill="#EC4899" name="Supercar" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment by Tier</CardTitle>
            <CardDescription>Distribution of investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentsByTier}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="tier"
                    label={({ tier }) => tier}
                  >
                    {investmentsByTier.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className={`border-l-4 ${getActivityBorderColor(activity.type)} pl-3 py-1`}
              >
                <div className="flex justify-between">
                  <p className="font-medium">{activity.title}</p>
                  <span className="text-xs text-gray-400">{activity.formattedTime}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
