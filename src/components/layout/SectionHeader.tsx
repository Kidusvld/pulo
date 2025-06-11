
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
  center?: boolean;
}

export const SectionHeader = ({
  title,
  subtitle,
  description,
  icon,
  actions,
  className,
  center = false
}: SectionHeaderProps) => {
  return (
    <motion.div 
      className={cn(
        "space-y-4 mb-8",
        center && "text-center",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {subtitle && (
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
          "bg-saas-brand-primary/10 text-saas-brand-primary border border-saas-brand-primary/20",
          center && "justify-center"
        )}>
          {icon}
          {subtitle}
        </div>
      )}
      
      <div className={cn("flex items-start justify-between gap-4", center && "flex-col items-center")}>
        <div className={cn("space-y-2", center && "text-center")}>
          <h1 className="text-3xl lg:text-4xl font-bold text-saas-text-primary tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-saas-text-secondary max-w-3xl">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
};
