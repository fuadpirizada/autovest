import { motion, useMotionValue, useTransform, useScroll, useSpring, AnimatePresence, animate } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Wallet, Clock } from "lucide-react";

// Particle animation component for the background
const ParticleBackground = () => {
  const particleCount = 25;
  const particles = Array.from({ length: particleCount });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = Math.random() * 10 + 5;
        const opacity = Math.random() * 0.5 + 0.1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-500/30 dark:bg-amber-500/20"
            style={{ 
              width: size, 
              height: size,
              left: `${posX}%`,
              top: `${posY}%`,
              opacity: 0,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, opacity, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

// Carousel of luxury car images
const CarCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carImages = [
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Ferrari
    "https://images.unsplash.com/photo-1543465077-db45d34b88a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Lamborghini
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Porsche
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Bugatti
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carImages.length]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <motion.img
            src={carImages[currentIndex]}
            alt={`Luxury Car ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </motion.div>
      </AnimatePresence>
      
      {/* Carousel indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {carImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-6" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Animated statistics component
interface AnimatedStatProps {
  label: string;
  value: number;
  symbol?: string;
  delay?: number;
}

const AnimatedStat = ({ label, value, symbol = "", delay = 0 }: AnimatedStatProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds
    
    // Wait for delay before starting animation
    const timeout = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setDisplayValue(Math.floor(progress * value));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };
      
      window.requestAnimationFrame(step);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [value, delay]);
  
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.3 }}
    >
      <span className="text-3xl font-bold text-amber-500">{displayValue}{symbol}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    </motion.div>
  );
};

// Main Hero Section component
const HeroSection = () => {
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  // Mouse follower effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const springX = useSpring(mousePosition.x, { stiffness: 100, damping: 30 });
  const springY = useSpring(mousePosition.y, { stiffness: 100, damping: 30 });

  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden relative min-h-screen flex items-center">
      {/* Background particle effects */}
      <ParticleBackground />
      
      {/* Mouse follower gradient orb */}
      <motion.div 
        className="hidden md:block fixed w-40 h-40 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 blur-3xl pointer-events-none mix-blend-screen"
        style={{ 
          left: springX, 
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 0
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
          <motion.div 
            className="lg:w-1/2"
            style={{ opacity, y, scale }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Invest in Luxury Cars<br />
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Get Premium Returns
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Start earning up to 2.5% weekly returns by investing in our carefully curated collection of luxury vehicles. 
              Investments start from as low as $1.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button className="px-6 py-3 font-medium rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" className="px-6 py-3 font-medium rounded-lg hover:scale-105 transition-all duration-300">
                      View Investments
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth?tab=register">
                    <Button className="px-6 py-3 font-medium rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105">
                      Start Investing
                    </Button>
                  </Link>
                  <Link href="#calculator-section">
                    <Button variant="outline" className="px-6 py-3 font-medium rounded-lg hover:scale-105 transition-all duration-300">
                      Calculate Returns
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
            
            {/* Stats section */}
            <motion.div 
              className="grid grid-cols-3 gap-4 mt-10 p-4 rounded-xl backdrop-blur-sm bg-white/10 dark:bg-gray-900/20 border border-gray-200/20 dark:border-gray-800/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <AnimatedStat label="Active Investors" value={5847} delay={1.2} />
              <AnimatedStat label="Capital Invested" value={12.5} symbol="M$" delay={1.4} />
              <AnimatedStat label="Avg. ROI" value={18.3} symbol="%" delay={1.6} />
            </motion.div>
            
            {/* Trust markers */}
            <motion.div 
              className="flex flex-wrap items-center mt-8 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="mr-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-sm">Secure Platform</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="mr-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-sm">Weekly Payouts</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="mr-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-sm">Flexible Lock Periods</span>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Car image carousel and floating cards */}
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ opacity, scale }}
          >
            <div className="relative z-10 h-[400px] md:h-[500px] overflow-hidden rounded-xl">
              <CarCarousel />
            </div>
            
            {/* Floating cards */}
            <motion.div 
              className="absolute -bottom-8 -right-6 p-4 rounded-lg shadow-lg max-w-xs z-20"
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <GlassCard className="p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                    <i className="fa-solid fa-chart-line text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Supercar Package</p>
                    <p className="text-xs text-purple-500">2.5% Weekly Returns</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
            
            <motion.div 
              className="absolute -top-8 -left-6 p-4 rounded-lg shadow-lg max-w-xs z-20"
              initial={{ opacity: 0, y: -20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <GlassCard className="p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                    <i className="fa-solid fa-money-bill-transfer text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Starter Package</p>
                    <p className="text-xs text-teal-500">Start from just $1</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 -right-3 md:right-4 p-3 rounded-lg shadow-lg z-20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              whileHover={{ scale: 1.05, x: -5 }}
            >
              <GlassCard className="p-3 border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                    <i className="fa-solid fa-lock text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium">Flexible Periods</p>
                    <p className="text-xs">1-12 months</p>
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
