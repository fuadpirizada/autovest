import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCard: React.FC<GlassCardProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div
      className={cn(
        "backdrop-blur-lg bg-white/10 dark:bg-gray-900/60 border border-white/10 dark:border-gray-800/50 rounded-xl shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
