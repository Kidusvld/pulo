
import { fitnessCategoryMap, calculatePuloFitIndex } from "@/utils/fitnessIndex";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface PuloFitIndexProps {
  age: number;
  weight: number;
  minimal?: boolean;
}

export const PuloFitIndex = ({ age, weight, minimal = false }: PuloFitIndexProps) => {
  const categoryKey = calculatePuloFitIndex(age, weight);
  const category = fitnessCategoryMap[categoryKey];
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case "yellow":
        return {
          bg: "bg-yellow-50/80",
          border: "border-yellow-200",
          text: "text-yellow-700",
          ring: "ring-yellow-200/50"
        };
      case "green":
        return {
          bg: "bg-green-50/80",
          border: "border-green-200",
          text: "text-green-700",
          ring: "ring-green-200/50"
        };
      case "orange":
        return {
          bg: "bg-orange-50/80",
          border: "border-orange-200",
          text: "text-orange-700",
          ring: "ring-orange-200/50"
        };
      case "red":
        return {
          bg: "bg-red-50/80",
          border: "border-red-200",
          text: "text-red-700",
          ring: "ring-red-200/50"
        };
      default:
        return {
          bg: "bg-purple-50/80",
          border: "border-purple-100",
          text: "text-purple-700",
          ring: "ring-purple-100/50"
        };
    }
  };
  
  const colorClasses = getColorClasses(category.color);
  
  if (minimal) {
    return (
      <div className="inline-flex items-center gap-1 ml-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`rounded-full px-2 py-0.5 ${colorClasses.bg} ${colorClasses.border} shadow-sm ring-1 ${colorClasses.ring} transition-all duration-200`}>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{category.emoji}</span>
                  <span className={`text-xs font-semibold font-poppins ${colorClasses.text}`}>{category.name}</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className={`${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}`}>
              <p className="text-sm">{category.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 ${colorClasses.bg} ${colorClasses.border} shadow-sm ring-1 ${colorClasses.ring} transition-all duration-200`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{category.emoji}</span>
        <h3 className={`text-lg font-bold font-poppins ${colorClasses.text}`}>{category.name}</h3>
      </div>
      <p className="text-sm text-purple-700 font-inter">{category.message}</p>
      
      <p className="text-xs text-purple-500/70 italic font-inter mt-2">
        Based on your age and weight profile
      </p>
    </div>
  );
};
