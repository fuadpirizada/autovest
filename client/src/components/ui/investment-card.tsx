import React from "react";
import { Package } from "@shared/schema";
import { Button } from "@/components/ui/button";
import GlassCard from "./glass-card";

interface InvestmentCardProps {
  investmentPackage: Package;
  onInvest: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investmentPackage,
  onInvest,
}) => {
  return (
    <GlassCard className="overflow-hidden transition-all hover:shadow-xl">
      <div className="relative">
        {investmentPackage.tier === "Supercar" && (
          <div className="absolute -top-1 -right-1 z-10">
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
              Most Popular
            </div>
          </div>
        )}
        <div className="h-48 overflow-hidden">
          <img
            src={investmentPackage.imageUrl || "https://via.placeholder.com/800x400?text=Car+Image"}
            alt={investmentPackage.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{investmentPackage.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {investmentPackage.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Weekly Return</p>
            <p className="text-xl font-bold text-teal-500">{investmentPackage.weeklyReturn}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Min. Investment</p>
            <p className="text-xl font-bold">${investmentPackage.minInvestment}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lock Period Options</p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-800">
              3 Months
            </span>
            <span className="px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-800">
              6 Months
            </span>
            <span className="px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-800">
              12 Months
            </span>
          </div>
        </div>

        <Button
          className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 text-white font-medium hover:opacity-90 transition-opacity"
          onClick={onInvest}
          disabled={!investmentPackage.isActive}
        >
          {investmentPackage.isActive ? "Invest Now" : "Currently Unavailable"}
        </Button>
      </div>
    </GlassCard>
  );
};

export default InvestmentCard;
