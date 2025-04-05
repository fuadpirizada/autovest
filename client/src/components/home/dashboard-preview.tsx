import { motion } from "framer-motion";
import GlassCard from "@/components/ui/glass-card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Investment, Package, Transaction } from "@shared/schema";
import { format } from "date-fns";

const DashboardPreview = () => {
  const { user } = useAuth();
  
  // For mockup display, we only need packages
  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });
  
  // When logged in, we fetch user-specific data
  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
    enabled: !!user,
  });
  
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: !!user,
  });
  
  // Show mock/promo dashboard for non-logged-in users
  if (!user) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              className="font-display text-3xl md:text-4xl font-bold mb-3"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Your Investment Dashboard
            </motion.h2>
            <motion.p 
              className="text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Track your investments, monitor returns, and manage your portfolio all in one place.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-4 md:p-6 shadow-2xl overflow-hidden">
              <div className="mb-4 pb-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">Welcome back, Alex</h3>
                    <p className="text-sm text-gray-300">Last login: Today, 09:45 AM</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                      <i className="fa-solid fa-bell"></i>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                      <i className="fa-solid fa-gear"></i>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                      <span className="font-medium">A</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-gray-800">
                  <p className="text-sm text-gray-300 mb-1">Total Investment</p>
                  <p className="text-2xl font-bold">$12,500</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800">
                  <p className="text-sm text-gray-300 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-teal-400">$1,876</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800">
                  <p className="text-sm text-gray-300 mb-1">Active Investments</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800">
                  <p className="text-sm text-gray-300 mb-1">Next Payout</p>
                  <p className="text-2xl font-bold">
                    <span className="text-amber-400">$187</span>
                    <span className="text-sm font-normal ml-1">in 2 days</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold mb-4">Your Active Investments</h4>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-gray-800">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold">
                              SC
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between mb-1">
                              <h5 className="font-bold">Supercar Package #12</h5>
                              <span className="text-teal-400">2.5% Weekly</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-300">Progress: 12/24 weeks</p>
                                <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1">
                                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '50%' }}></div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-300">Investment: $5,000</p>
                                <p className="text-sm text-teal-400">Earned: +$787</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gray-800">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold">
                              PR
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between mb-1">
                              <h5 className="font-bold">Premium Package #08</h5>
                              <span className="text-teal-400">1.5% Weekly</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-300">Progress: 20/24 weeks</p>
                                <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1">
                                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '83%' }}></div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-300">Investment: $2,500</p>
                                <p className="text-sm text-teal-400">Earned: +$864</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold mb-4">Recent Transactions</h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-gray-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                          <i className="fa-solid fa-arrow-down"></i>
                        </div>
                        <div>
                          <p className="font-medium">Weekly Return</p>
                          <p className="text-xs text-gray-300">Jul 8, 2023 • 09:32 AM</p>
                        </div>
                      </div>
                      <span className="text-teal-400 font-medium">+$125.00</span>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-gray-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                          <i className="fa-solid fa-arrow-up"></i>
                        </div>
                        <div>
                          <p className="font-medium">New Investment</p>
                          <p className="text-xs text-gray-300">Jul 5, 2023 • 02:15 PM</p>
                        </div>
                      </div>
                      <span className="font-medium">-$5,000.00</span>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-gray-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                          <i className="fa-solid fa-wallet"></i>
                        </div>
                        <div>
                          <p className="font-medium">Withdrawal</p>
                          <p className="text-xs text-gray-300">Jul 1, 2023 • 11:20 AM</p>
                        </div>
                      </div>
                      <span className="text-purple-400 font-medium">-$750.00</span>
                    </div>
                    
                    <Link href="/auth">
                      <span className="block text-center text-sm text-amber-500 hover:text-amber-400 transition-colors mt-4 cursor-pointer">
                        Register Now to Access Your Dashboard
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    );
  }
  
  // For logged-in users, show their actual data instead
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="font-display text-3xl md:text-4xl font-bold mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Investment Dashboard
          </motion.h2>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Track your investments, monitor returns, and manage your portfolio all in one place.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-4 md:p-6 shadow-2xl overflow-hidden">
            <div className="mb-4 pb-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Welcome back, {user.fullName || user.username}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                    <span className="font-medium">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gray-800">
                <p className="text-sm text-gray-300 mb-1">Total Investment</p>
                <p className="text-2xl font-bold">${investments.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <p className="text-sm text-gray-300 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-teal-400">${investments.reduce((sum, inv) => sum + (inv.totalEarned || 0), 0).toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <p className="text-sm text-gray-300 mb-1">Active Investments</p>
                <p className="text-2xl font-bold">{investments.filter(inv => inv.isActive).length}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <p className="text-sm text-gray-300 mb-1">Your Balance</p>
                <p className="text-2xl font-bold">
                  <span className="text-amber-400">${user.balance.toFixed(2)}</span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <h4 className="text-lg font-bold mb-4">Your Active Investments</h4>
                  
                  <div className="space-y-4">
                    {investments.filter(inv => inv.isActive).length > 0 ? (
                      <>
                        {investments.filter(inv => inv.isActive).slice(0, 2).map(investment => {
                          const pkg = packages.find(p => p.id === investment.packageId);
                          return (
                            <div key={investment.id} className="p-4 rounded-lg bg-gray-800">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-r from-amber-500 to-amber-700">
                                  <div className="h-full w-full flex items-center justify-center text-white font-bold">
                                    {pkg?.name?.substring(0, 2) || "AU"}
                                  </div>
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between mb-1">
                                    <h5 className="font-bold">{pkg?.name || "Investment Package"}</h5>
                                    <span className="text-teal-400">{pkg?.weeklyReturn}% Weekly</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <div className="text-right">
                                      <p className="text-sm text-gray-300">Investment: ${investment.amount.toFixed(2)}</p>
                                      <p className="text-sm text-teal-400">Earned: +${(investment.totalEarned || 0).toFixed(2)}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="p-4 rounded-lg bg-gray-800 text-center">
                        <p>No active investments found</p>
                        <Link href="/marketplace">
                          <span className="text-amber-500 hover:text-amber-400 text-sm cursor-pointer block mt-2">
                            Browse investment packages
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4">Recent Transactions</h4>
                
                <div className="space-y-3">
                  {transactions.length > 0 ? (
                    <>
                      {transactions.slice(0, 3).map(transaction => (
                        <div key={transaction.id} className="p-3 rounded-lg bg-gray-800 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${
                              transaction.type === 'deposit' ? 'bg-teal-500' : 'bg-purple-500'
                            } flex items-center justify-center`}>
                              <span>$</span>
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description || transaction.type}</p>
                              <p className="text-xs text-gray-300">
                                {transaction.date ? format(new Date(transaction.date), 'MMM d, yyyy') : ''}
                              </p>
                            </div>
                          </div>
                          <span className={`font-medium ${
                            transaction.amount > 0 ? 'text-teal-400' : ''
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-3 rounded-lg bg-gray-800 text-center">
                      <p>No transactions found</p>
                    </div>
                  )}
                  
                  <Link href="/dashboard">
                    <span className="block text-center text-sm text-amber-500 hover:text-amber-400 transition-colors mt-4 cursor-pointer">
                      View Full Dashboard
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
