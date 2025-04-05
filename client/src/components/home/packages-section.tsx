import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Package } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GlassCard from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/use-auth";

type PackageCardProps = {
  pkg: Package;
  index: number;
};

const PackageCard = ({ pkg, index }: PackageCardProps) => {
  const { user } = useAuth();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlassCard className="overflow-hidden transition-all hover:shadow-xl">
        <div className="relative">
          {pkg.tier === "Supercar" && (
            <div className="absolute -top-1 -right-1 z-10">
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
                Most Popular
              </div>
            </div>
          )}
          <div className="h-48 overflow-hidden">
            <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{pkg.description}</p>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Weekly Return</p>
              <p className="text-xl font-bold text-teal-500">{pkg.weeklyReturn}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Min. Investment</p>
              <p className="text-xl font-bold">${pkg.minInvestment}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lock Period Options</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-800">3 Months</span>
              <span className="px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-800">6 Months</span>
              <span className="px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-800">12 Months</span>
            </div>
          </div>
          
          <Link href={user ? "/marketplace" : "/auth?tab=register"}>
            <Button className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 text-white font-medium hover:opacity-90 transition-opacity">
              Invest Now
            </Button>
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const LoadingCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <GlassCard className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        
        <Skeleton className="h-3 w-32 mb-2" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </GlassCard>
  </motion.div>
);

const PackagesSection = () => {
  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="font-display text-3xl md:text-4xl font-bold mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Investment Packages
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Select the package that matches your investment goals and risk tolerance.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              <LoadingCard index={0} />
              <LoadingCard index={1} />
              <LoadingCard index={2} />
              <LoadingCard index={3} />
            </>
          ) : (
            packages?.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
