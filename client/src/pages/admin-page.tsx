import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Package, Investment, Transaction } from "@shared/schema";
import GlassCard from "@/components/ui/glass-card";
import { Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/sidebar";
import StatsOverview from "@/components/admin/stats-overview";
import UserManagement from "@/components/admin/user-management";
import PackageManagement from "@/components/admin/package-management";

type AdminView = "dashboard" | "users" | "packages" | "investments" | "transactions";

const AdminPage = () => {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: packages, isLoading: isLoadingPackages } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const { data: investments, isLoading: isLoadingInvestments } = useQuery<Investment[]>({
    queryKey: ["/api/admin/investments"],
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
  });

  const isLoading = isLoadingUsers || isLoadingPackages || isLoadingInvestments || isLoadingTransactions;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <StatsOverview 
            users={users || []}
            packages={packages || []}
            investments={investments || []}
            transactions={transactions || []}
          />
        );
      case "users":
        return <UserManagement users={users || []} />;
      case "packages":
        return <PackageManagement packages={packages || []} />;
      case "investments":
        return <div>Investments Management (Coming Soon)</div>;
      case "transactions":
        return <div>Transactions Management (Coming Soon)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-display mb-8">Admin Panel</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <GlassCard className="p-4">
            <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
          </GlassCard>
        </div>
        
        <div className="flex-grow">
          <GlassCard className="p-6">
            {renderContent()}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
