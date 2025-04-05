import { useQuery } from "@tanstack/react-query";
import { Package } from "@shared/schema";
import { Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

const PortfolioPage = () => {
  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group packages by tier for better organization
  const categories = packages?.reduce((acc, pkg) => {
    const category = pkg.tier || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(pkg);
    return acc;
  }, {} as Record<string, Package[]>);

  const renderVehicleCard = (pkg: Package, index: number) => {
    return (
      <motion.div
        key={pkg.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <GlassCard className="h-full overflow-hidden flex flex-col">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={pkg.imageUrl || `https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`} 
              alt={pkg.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute top-2 right-2">
              <span className="inline-block bg-amber-500 text-white text-xs px-2 py-1 rounded-md">
                {pkg.weeklyReturn}% Weekly
              </span>
            </div>
          </div>
          
          <div className="p-4 flex-grow">
            <h3 className="text-lg font-bold">{pkg.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{pkg.description}</p>
            
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Min. Investment:</span>
                <span className="font-medium">${pkg.minInvestment}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="font-medium">4 weeks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Expected ROI:</span>
                <span className="font-medium text-teal-600 dark:text-teal-400">
                  {(pkg.weeklyReturn * 4).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4 pt-0 mt-auto">
            <Link href={`/marketplace?package=${pkg.id}`}>
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-700"
              >
                Invest Now
              </Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Vehicle Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our collection of investment vehicles
          </p>
        </div>
      </div>

      {Object.entries(categories || {}).map(([category, pkgs]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            {category}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pkgs.map((pkg, index) => renderVehicleCard(pkg, index))}
          </div>
        </div>
      ))}

      {(!packages || packages.length === 0) && (
        <GlassCard className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No vehicles available</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Our vehicle portfolio is currently being updated. Please check back later.
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default PortfolioPage;