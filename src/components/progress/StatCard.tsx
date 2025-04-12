
import { LucideIcon } from "lucide-react";

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
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-purple-200/10 p-3 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-300">
      <div className={`${bgColor} p-3 rounded-full mb-2`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-xs text-white/70 font-medium mt-1">{title}</span>
    </div>
  );
};
