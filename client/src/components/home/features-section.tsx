import { motion } from "framer-motion";
import GlassCard from "@/components/ui/glass-card";

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  delay = 0 
}: { 
  icon: string; 
  title: string; 
  description: string;
  delay?: number; 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard className="p-6 hover:scale-105 transition-transform">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center mb-4">
          <i className={`${icon} text-xl text-white`}></i>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </GlassCard>
    </motion.div>
  );
};

const FeaturesSection = () => {
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
            Why Choose AutoVest?
          </motion.h2>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our platform offers unique investment opportunities combining luxury vehicles with attractive returns.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="fa-solid fa-money-bill-trend-up"
            title="High Weekly Returns"
            description="Earn up to 2.5% weekly with our premium investment packages. Choose from various tiers based on your investment capacity."
            delay={0.1}
          />
          
          <FeatureCard 
            icon="fa-solid fa-car-side"
            title="Luxury Car Portfolio"
            description="Invest in a carefully curated collection of high-end vehicles. Each car is selected for both prestige and value growth potential."
            delay={0.3}
          />
          
          <FeatureCard 
            icon="fa-solid fa-shield-halved"
            title="Secure & Transparent"
            description="Advanced security protocols protect your investments. Our transparent system lets you track performance and earnings in real-time."
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
