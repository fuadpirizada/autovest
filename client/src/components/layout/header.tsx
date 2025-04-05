import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Settings, LayoutDashboard, Car, ShoppingCart } from "lucide-react";

const Header = () => {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Investments", path: "/marketplace" },
    { name: "Dashboard", path: "/dashboard", authRequired: true },
    { name: "Admin", path: "/admin", adminRequired: true },
  ];

  return (
    <header className="backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 fixed top-0 w-full z-50 transition-all duration-300 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <div className="flex items-center">
          <Link href="/">
            <span className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700 cursor-pointer">
              AutoVest
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            // Skip links that require auth if user is not logged in
            if (link.authRequired && !user) return null;
            // Skip admin links if user is not admin
            if (link.adminRequired && (!user || user.role !== "admin")) return null;
            
            return (
              <Link key={link.path} href={link.path}>
                <span className={`text-sm font-medium hover:text-amber-500 transition-colors cursor-pointer ${location === link.path ? 'text-amber-500' : ''}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-500 text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user.fullName || user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <div className="flex items-center cursor-pointer w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/marketplace">
                    <div className="flex items-center cursor-pointer w-full">
                      <Car className="mr-2 h-4 w-4" />
                      <span>Marketplace</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <div className="flex items-center cursor-pointer w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:block">
              <Link href="/auth">
                <Button variant="outline" className="mr-2">Login</Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-700">Register</Button>
              </Link>
            </div>
          )}
          
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-800">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              // Skip links that require auth if user is not logged in
              if (link.authRequired && !user) return null;
              // Skip admin links if user is not admin
              if (link.adminRequired && (!user || user.role !== "admin")) return null;
              
              return (
                <Link key={link.path} href={link.path}>
                  <span 
                    className={`text-sm font-medium hover:text-amber-500 transition-colors cursor-pointer ${location === link.path ? 'text-amber-500' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </span>
                </Link>
              );
            })}
            
            {!user && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link href="/auth">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-700">Register</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
