
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
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 p-4 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-300 group">
      <div className={`${bgColor} p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <span className="text-2xl font-bold text-slate-800 mb-1">{value}</span>
      <span className="text-sm text-slate-600 font-medium">{title}</span>
    </div>
  );
};
