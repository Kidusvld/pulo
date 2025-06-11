
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SaaSCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  border?: boolean;
  background?: "white" | "glass" | "gradient";
}

export const SaaSCard = ({
  children,
  className,
  hover = true,
  padding = "lg",
  shadow = "md", 
  border = true,
  background = "white"
}: SaaSCardProps) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl"
  };

  const backgroundClasses = {
    white: "bg-white",
    glass: "bg-white/90 backdrop-blur-xl",
    gradient: "bg-gradient-to-br from-white to-gray-50"
  };

  return (
    <motion.div
      className={cn(
        "rounded-2xl transition-all duration-300",
        backgroundClasses[background],
        border && "border border-saas-border",
        shadowClasses[shadow],
        hover && "hover:shadow-lg hover:-translate-y-0.5",
        paddingClasses[padding],
        className
      )}
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
