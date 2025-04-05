import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/use-auth";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
              Invest in Luxury Cars <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700">
                Get Premium Returns
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Start earning up to 2.5% weekly returns by investing in our carefully curated collection of luxury vehicles.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button className="px-6 py-3 font-medium rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:opacity-90 transition-opacity">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" className="px-6 py-3 font-medium rounded-lg">
                      View Investments
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth?tab=register">
                    <Button className="px-6 py-3 font-medium rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:opacity-90 transition-opacity">
                      Start Investing
                    </Button>
                  </Link>
                  <Link href="#calculator-section">
                    <Button variant="outline" className="px-6 py-3 font-medium rounded-lg">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center mt-8 space-x-6">
              <div className="flex items-center">
                <div className="mr-2 w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
                  <i className="fa-solid fa-shield-check"></i>
                </div>
                <span className="text-sm">Secure Platform</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
                  <i className="fa-solid fa-hand-holding-dollar"></i>
                </div>
                <span className="text-sm">Weekly Payouts</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
                  <i className="fa-solid fa-wallet"></i>
                </div>
                <span className="text-sm">Easy Withdrawals</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Luxury Car" 
                className="rounded-xl shadow-xl" 
              />
            </div>
            <motion.div 
              className="absolute -bottom-6 -right-6 p-4 rounded-lg shadow-lg max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Supercar Package</p>
                    <p className="text-xs text-teal-500">2.5% Weekly Returns</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
            <motion.div 
              className="absolute -top-6 -left-6 p-4 rounded-lg shadow-lg max-w-xs"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Flexible Lock Period</p>
                    <p className="text-xs">3, 6, or 12 months</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
