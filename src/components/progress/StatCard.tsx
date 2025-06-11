
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor
}: StatCardProps) => {
  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className={`${bgColor} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
        whileHover={{ scale: 1.15 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className={`h-6 w-6 ${color}`} />
      </motion.div>
      <motion.span 
        className="text-3xl md:text-4xl font-montserrat font-extrabold text-slate-800 mb-2 tracking-tight"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {value}
      </motion.span>
      <span className="text-sm md:text-base text-slate-600 font-opensans font-semibold tracking-wide">{title}</span>
    </motion.div>
  );
};
