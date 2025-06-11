
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  background?: "default" | "gradient" | "minimal";
  padding?: "none" | "sm" | "md" | "lg";
}

export const PageContainer = ({
  children,
  className,
  maxWidth = "2xl",
  background = "default",
  padding = "lg"
}: PageContainerProps) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    full: "max-w-full"
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 py-6",
    md: "px-6 py-8", 
    lg: "px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
  };

  const backgroundClasses = {
    default: "min-h-screen bg-saas-bg-primary",
    gradient: "min-h-screen bg-gradient-to-br from-saas-bg-primary via-white to-gray-50",
    minimal: "min-h-screen bg-white"
  };

  return (
    <motion.div 
      className={cn(backgroundClasses[background], className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-30 pointer-events-none" />
      
      {/* Subtle Gradient Overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-saas-brand-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-saas-brand-secondary/5 blur-3xl pointer-events-none" />
      
      <div className={cn(
        "relative z-10 mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding]
      )}>
        {children}
      </div>
    </motion.div>
  );
};
