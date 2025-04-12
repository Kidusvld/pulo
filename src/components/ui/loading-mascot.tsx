
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingMascotProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const LoadingMascot = ({ 
  size = "md", 
  showText = true,
  className 
}: LoadingMascotProps) => {
  // Size mapping for the logo
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        {/* The spinning container */}
        <div className={cn(
          sizeClasses[size],
          "animate-spin-slow transform-gpu rounded-full transition-all duration-300"
        )}>
          <img 
            src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png" 
            alt="PULO Loading"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Optional subtle glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse",
          sizeClasses[size]
        )}></div>
      </div>
      
      {showText && (
        <p className="text-white/80 animate-pulse text-sm font-medium mt-2">
          Creating your workout plan...
        </p>
      )}
    </div>
  );
};
