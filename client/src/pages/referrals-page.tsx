import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import GlassCard from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { Copy, Zap, Award, Users } from "lucide-react";
import { useState } from "react";

const ReferralsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate a referral code based on username
  const referralCode = user ? `${user.username}-${Math.random().toString(36).substring(2, 8)}` : '';

  // Generate a referral link
  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Referral link copied!",
      description: "Share this link with your friends to earn rewards.",
    });
    
    setTimeout(() => setCopied(false), 3000);
  };

  // In a real application, this would be fetched from the API
  const referralStats = {
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalEarned: 0
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Referral Program</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Invite friends and earn rewards when they invest
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-start mb-4">
              <div className="mr-4 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Total Referrals</h3>
                <p className="text-3xl font-bold mt-2">{referralStats.totalReferrals}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-start mb-4">
              <div className="mr-4 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Active Referrals</h3>
                <p className="text-3xl font-bold mt-2">{referralStats.completedReferrals}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-start mb-4">
              <div className="mr-4 w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Total Earned</h3>
                <p className="text-3xl font-bold mt-2">${referralStats.totalEarned.toFixed(2)}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-6">Share Your Referral Link</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your unique referral link:</p>
                  <div className="flex">
                    <Input 
                      value={referralLink} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button
                      className={`rounded-l-none ${copied ? 'bg-green-600' : 'bg-gradient-to-r from-amber-500 to-amber-700'}`}
                      onClick={handleCopyReferralLink}
                    >
                      {copied ? (
                        <span>Copied!</span>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your referral code:</p>
                  <div className="flex">
                    <Input 
                      value={referralCode} 
                      readOnly 
                      className="font-medium"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-3">How it works</h3>
                <ol className="space-y-3 list-decimal list-inside text-sm text-gray-600 dark:text-gray-400">
                  <li>Share your referral link with friends</li>
                  <li>Friends sign up and invest on AutoVest</li>
                  <li>You earn 5% of their initial investment as a reward</li>
                  <li>Your friends also get a 1% bonus on their first investment</li>
                </ol>
              </div>
            </GlassCard>
          </motion.div>
        </div>
        
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-6">Referral Rewards</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">5% Commission</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Earn 5% of your friend's first investment amount
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Tiered Bonuses</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Unlock higher commissions as you refer more investors
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Monthly Contests</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Top referrers each month win special prizes
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;