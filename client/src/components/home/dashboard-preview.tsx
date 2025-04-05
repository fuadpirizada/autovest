import { motion } from "framer-motion";
import GlassCard from "@/components/ui/glass-card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const DashboardPreview = () => {
  const { user } = useAuth();
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
            {user ? (
              <>
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">Welcome back, {user.username}</h3>
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
                        <span className="font-medium">{user.username[0].toUpperCase()}</span>
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
                          <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80" alt="Ferrari" className="w-full h-full object-cover" />
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
                          <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80" alt="BMW" className="w-full h-full object-cover" />
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
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold mb-4">Experience Our Investment Dashboard</h3>
                  <p className="text-gray-300 mb-6">Create an account to access your personalized investment dashboard and start earning returns.</p>
                  <Link href="/auth?tab=register">
                    <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-700 rounded-lg font-medium hover:opacity-90 transition-all">
                      Register Now
                    </button>
                  </Link>
                </div>
              )}
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
