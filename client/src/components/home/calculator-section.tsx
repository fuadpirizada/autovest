import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GlassCard from "@/components/ui/glass-card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const CalculatorSection = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(1000);
  const [rate, setRate] = useState<number>(1.5);
  const [duration, setDuration] = useState<number>(6);
  const [compound, setCompound] = useState<boolean>(true);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [weeklyGrowth, setWeeklyGrowth] = useState<number[]>([]);

  // Calculate investment returns
  useEffect(() => {
    const weeks = Math.floor(duration * 4.33); // Approximate weeks per month
    let total = amount;
    const growthValues: number[] = [];

    if (compound) {
      // Compound growth
      for (let i = 0; i < weeks; i++) {
        total *= (1 + rate / 100);
        growthValues.push(total);
      }
    } else {
      // Simple growth
      const weeklyReturn = amount * (rate / 100);
      for (let i = 0; i < weeks; i++) {
        total += weeklyReturn;
        growthValues.push(total);
      }
    }

    setFinalAmount(total);
    setProfit(total - amount);
    setWeeklyGrowth(growthValues);
  }, [amount, rate, duration, compound]);

  // Calculate progress ring value (0-283)
  const progressRingValue = Math.min((finalAmount / amount) * 100, 200) / 100;
  const progressRingCircumference = 283;
  const progressRingOffset = progressRingCircumference - (progressRingValue * progressRingCircumference / 2);

  return (
    <section id="calculator-section" className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Calculate Your Returns</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Use our calculator to estimate the potential returns on your investment over time.
            </p>
            
            <GlassCard className="p-6">
              <div className="mb-4">
                <Label htmlFor="investment-amount" className="block text-sm font-medium mb-2">
                  Investment Amount ($)
                </Label>
                <Input
                  id="investment-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  min={100}
                  step={100}
                  className="w-full p-3"
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor="investment-package" className="block text-sm font-medium mb-2">
                  Investment Package
                </Label>
                <Select
                  value={rate.toString()}
                  onValueChange={(value) => setRate(parseFloat(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.2">Economy (1.2% Weekly)</SelectItem>
                    <SelectItem value="1.5">Premium (1.5% Weekly)</SelectItem>
                    <SelectItem value="2.0">Luxury (2.0% Weekly)</SelectItem>
                    <SelectItem value="2.5">Supercar (2.5% Weekly)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="investment-duration" className="block text-sm font-medium mb-2">
                  Investment Duration
                </Label>
                <Select
                  value={duration.toString()}
                  onValueChange={(value) => setDuration(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="compound-toggle" className="block text-sm font-medium mb-2">
                  Compound Returns
                </Label>
                <div className="flex items-center">
                  <Switch 
                    id="compound-toggle" 
                    checked={compound}
                    onCheckedChange={setCompound}
                  />
                  <Label htmlFor="compound-toggle" className="ml-3 text-sm font-medium">
                    Reinvest weekly returns
                  </Label>
                </div>
              </div>
            </GlassCard>
          </motion.div>
          
          <motion.div
            className="md:w-1/2 md:pl-10"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-6">Projected Returns</h3>
              
              <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" className="dark:stroke-gray-700" />
                    
                    {/* Progress Circle */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth="8" 
                      strokeDasharray="283" 
                      strokeDashoffset={progressRingOffset} 
                      transform="rotate(-90 50 50)" 
                      className="transition-all duration-700 ease-in-out" 
                    />
                    
                    <text x="50" y="45" textAnchor="middle" className="text-3xl font-bold fill-current">
                      ${Math.round(finalAmount)}
                    </text>
                    <text x="50" y="65" textAnchor="middle" className="text-sm fill-current">
                      Total Return
                    </text>
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Initial Investment</p>
                  <p className="text-xl font-bold">${amount}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Net Profit</p>
                  <p className="text-xl font-bold text-teal-500">${Math.round(profit)}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Weekly Growth Projection</p>
                <div className="flex items-end h-24 gap-1 px-4">
                  {weeklyGrowth.length > 0 && (
                    <>
                      {Array.from({ length: 12 }).map((_, i) => {
                        const index = Math.floor(i * (weeklyGrowth.length / 12));
                        const value = index < weeklyGrowth.length ? weeklyGrowth[index] : 0;
                        const max = Math.max(...weeklyGrowth);
                        const height = value ? (value / max) * 100 : 0;
                        
                        return (
                          <div 
                            key={i}
                            className="bg-amber-500 w-full max-w-[8.33%] rounded-t-sm transition-all duration-1000" 
                            style={{ height: `${height}%` }}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                  <span>Week 1</span>
                  <span>Week {Math.floor(duration * 4.33 / 2)}</span>
                  <span>Week {Math.floor(duration * 4.33)}</span>
                </div>
              </div>
              
              <Link href={user ? "/marketplace" : "/auth?tab=register"}>
                <Button className="px-6 py-3 font-medium rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:opacity-90 transition-opacity">
                  Start Investing Now
                </Button>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
