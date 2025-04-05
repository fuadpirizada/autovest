import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Car,
  BarChart3,
  CreditCard,
  Settings,
} from "lucide-react";

type AdminView = "dashboard" | "users" | "packages" | "investments" | "transactions" | "settings";

interface AdminSidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    {
      view: "dashboard" as AdminView,
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
    },
    {
      view: "users" as AdminView,
      label: "User Management",
      icon: <Users className="w-5 h-5 mr-3" />,
    },
    {
      view: "packages" as AdminView,
      label: "Packages",
      icon: <Car className="w-5 h-5 mr-3" />,
    },
    {
      view: "investments" as AdminView,
      label: "Investments",
      icon: <BarChart3 className="w-5 h-5 mr-3" />,
    },
    {
      view: "transactions" as AdminView,
      label: "Transactions",
      icon: <CreditCard className="w-5 h-5 mr-3" />,
    },
    {
      view: "settings" as AdminView,
      label: "Settings",
      icon: <Settings className="w-5 h-5 mr-3" />,
    },
  ];

  return (
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <Button
          key={item.view}
          variant={activeView === item.view ? "default" : "ghost"}
          className={`w-full justify-start ${
            activeView === item.view
              ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white"
              : ""
          }`}
          onClick={() => setActiveView(item.view)}
        >
          {item.icon}
          <span>{item.label}</span>
        </Button>
      ))}
    </nav>
  );
};

export default AdminSidebar;
