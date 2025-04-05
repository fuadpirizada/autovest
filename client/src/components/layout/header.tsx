import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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
import { 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  LayoutDashboard, 
  Car, 
  CreditCard, 
  PlusCircle, 
  HelpCircle, 
  Bell, 
  User as UserIcon, 
  ShoppingBag, 
  Zap, 
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Detect scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  interface NavLinkType {
    name: string;
    path: string;
    icon?: React.ReactNode;
    authRequired?: boolean;
    description?: string;
  }
  
  const mainNavLinks: NavLinkType[] = [
    { name: "Home", path: "/" },
    { name: "Packages", path: "/marketplace", icon: <Car className="w-4 h-4 mr-1" /> },
    { name: "Dashboard", path: "/dashboard", authRequired: true, icon: <LayoutDashboard className="w-4 h-4 mr-1" /> },
    { name: "My Investments", path: "/dashboard/investments", authRequired: true, icon: <CreditCard className="w-4 h-4 mr-1" /> },
  ];

  const dropdownLinks: NavLinkType[] = [
    { 
      name: "Car Portfolio", 
      path: "/portfolio", 
      description: "View our luxury vehicle collection", 
      icon: <ShoppingBag className="w-5 h-5 text-blue-500" />
    },
    { 
      name: "Referral Program", 
      path: "/referrals", 
      description: "Invite friends and earn rewards", 
      icon: <Zap className="w-5 h-5 text-amber-500" /> 
    },
    { 
      name: "Support Center", 
      path: "/support", 
      description: "Get help with your investments", 
      icon: <HelpCircle className="w-5 h-5 text-green-500" /> 
    },
  ];

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "backdrop-blur-lg bg-white/85 dark:bg-gray-900/85 shadow-md"
          : "bg-transparent"
      }`}>
        <div className="container mx-auto px-4">
          {/* Main header row */}
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo */}
            <Link href="/">
              <motion.div 
                className="flex items-center cursor-pointer" 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="mr-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <span className="font-bold text-lg">A</span>
                </div>
                <span className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700">
                  AutoVest
                </span>
              </motion.div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center space-x-1">
                {mainNavLinks.map((link) => {
                  // Skip links that require auth if user is not logged in
                  if (link.authRequired && !user) return null;
                  
                  return (
                    <Link key={link.path} href={link.path}>
                      <motion.div
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                          location === link.path 
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {link.icon}
                        <span className="text-sm font-medium">{link.name}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* More dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      className="flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span className="text-sm font-medium">More</span>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {dropdownLinks.map((link) => (
                      <DropdownMenuItem key={link.path} asChild>
                        <Link href={link.path}>
                          <div className="flex items-start gap-2 cursor-pointer w-full">
                            <div className="mt-0.5">{link.icon}</div>
                            <div>
                              <p className="font-medium">{link.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{link.description}</p>
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>
            
            {/* Right section - User actions */}
            <div className="flex items-center space-x-3">
              {/* Search button */}
              <motion.button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:flex"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Theme toggle */}
              <ThemeToggle />
              
              {user ? (
                <>
                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button 
                        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:flex"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full"></span>
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-semibold">Notifications</h3>
                        <Badge variant="outline">3 Unread</Badge>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        <div className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Weekly return received</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your investment has generated a return of $125.00</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">2 hours ago</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                              <Zap className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Limited offer available</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Exclusive premium package with 2.8% weekly returns</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Yesterday</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 border-t text-center">
                        <Button variant="link" size="sm" className="w-full text-xs">View all notifications</Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                
                  {/* Add funds button */}
                  <Link href="/dashboard/deposit">
                    <motion.div
                      className="hidden md:flex"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        size="sm" 
                        className="gap-1.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Funds</span>
                      </Button>
                    </motion.div>
                  </Link>
                
                  {/* User menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button 
                        className="relative flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/20">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden md:inline text-sm font-medium">${user.balance.toFixed(2)}</span>
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end" forceMount>
                      <div className="flex flex-col space-y-1 p-3 border-b">
                        <p className="text-sm font-medium">{user.fullName || user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                          <p className="text-sm font-medium">${user.balance.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="p-2">
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard">
                            <div className="flex items-center cursor-pointer w-full py-1">
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              <span>Dashboard</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/marketplace">
                            <div className="flex items-center cursor-pointer w-full py-1">
                              <Car className="mr-2 h-4 w-4" />
                              <span>Investment Packages</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/investments">
                            <div className="flex items-center cursor-pointer w-full py-1">
                              <CreditCard className="mr-2 h-4 w-4" />
                              <span>My Investments</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/deposit">
                            <div className="flex items-center cursor-pointer w-full py-1">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              <span>Add Funds</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/profile">
                            <div className="flex items-center cursor-pointer w-full py-1">
                              <UserIcon className="mr-2 h-4 w-4" />
                              <span>My Profile</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        {user.role === "admin" && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin">
                              <div className="flex items-center cursor-pointer w-full py-1">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Admin Panel</span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/auth">
                    <Button variant="outline" size="sm" className="font-medium">Login</Button>
                  </Link>
                  <Link href="/auth?tab=register">
                    <Button size="sm" className="font-medium bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <motion.button 
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              className="border-t border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-500" />
                  <Input 
                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
                    placeholder="Search investment packages, cars..."
                    autoFocus
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-24 overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6 space-y-6">
              <nav className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Main Navigation
                  </p>
                  {(mainNavLinks as NavLinkType[]).concat(dropdownLinks).map((link) => {
                    // Skip links that require auth if user is not logged in
                    if (link.authRequired && !user) return null;
                    
                    return (
                      <Link key={link.path} href={link.path}>
                        <motion.div
                          className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="mr-3 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            {link.icon || <Car className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium">{link.name}</p>
                            {link.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{link.description}</p>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
                
                {!user && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Account
                    </p>
                    <div className="space-y-3">
                      <Link href="/auth">
                        <Button variant="outline" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                          <UserIcon className="mr-2 h-4 w-4" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth?tab=register">
                        <Button className="w-full justify-start bg-gradient-to-r from-amber-500 to-amber-700" onClick={() => setMobileMenuOpen(false)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                
                {user && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">{user.fullName || user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <p className="text-sm font-medium">${user.balance.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Link href="/dashboard/deposit">
                        <Button className="w-full justify-start bg-gradient-to-r from-amber-500 to-amber-700" onClick={() => setMobileMenuOpen(false)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Funds
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600" onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
