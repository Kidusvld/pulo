
import { fitnessCategoryMap, calculatePuloFitIndex } from "@/utils/fitnessIndex";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface PuloFitIndexProps {
  age: number;
  weight: number;
  minimal?: boolean;
  horizontal?: boolean;
}

export const PuloFitIndex = ({ age, weight, minimal = false, horizontal = false }: PuloFitIndexProps) => {
  const categoryKey = calculatePuloFitIndex(age, weight);
  const category = fitnessCategoryMap[categoryKey];
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case "yellow":
        return {
          bg: "bg-yellow-50/80",
          border: "border-yellow-200",
          text: "text-yellow-700",
          ring: "ring-yellow-200/50",
          label: "bg-yellow-100/50",
          title: "text-yellow-800"
        };
      case "green":
        return {
          bg: "bg-green-50/80",
          border: "border-green-200",
          text: "text-green-700",
          ring: "ring-green-200/50",
          label: "bg-green-100/50",
          title: "text-green-800"
        };
      case "orange":
        return {
          bg: "bg-orange-50/80",
          border: "border-orange-200",
          text: "text-orange-700",
          ring: "ring-orange-200/50",
          label: "bg-orange-100/50",
          title: "text-orange-800"
        };
      case "red":
        return {
          bg: "bg-red-50/80",
          border: "border-red-200",
          text: "text-red-700",
          ring: "ring-red-200/50",
          label: "bg-red-100/50",
          title: "text-red-800"
        };
      default:
        return {
          bg: "bg-purple-50/80",
          border: "border-purple-200",
          text: "text-purple-700",
          ring: "ring-purple-100/50",
          label: "bg-purple-100/50",
          title: "text-purple-800"
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

  if (horizontal) {
    return (
      <div className={`rounded-lg ${colorClasses.bg} ${colorClasses.border} shadow-sm ring-1 ${colorClasses.ring} transition-all duration-200`}>
        <div className="p-4">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-opacity-20" style={{ borderColor: `var(--${category.color}-500)` }}>
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${colorClasses.label}`}>
                <span className="text-xl">{category.emoji}</span>
              </div>
              <h3 className={`text-lg font-bold font-poppins ${colorClasses.title}`}>{category.name}</h3>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-full p-1.5 hover:bg-white/40 cursor-help transition-colors">
                    <InfoIcon className="h-4 w-4 text-purple-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Your PULO Fitness Index based on age and weight</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Message Section */}
          <div className="mb-3">
            <p className="text-sm text-purple-700 font-inter leading-relaxed">{category.message}</p>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-purple-500/70 italic font-inter">
              Based on your age and weight profile
            </p>
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${colorClasses.label} ${colorClasses.text}`}>
              Age: {age} • Weight: {weight} lbs
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg ${colorClasses.bg} ${colorClasses.border} shadow-sm ring-1 ${colorClasses.ring} transition-all duration-200`}>
      <div className="p-4">
        {/* Header with emoji and title */}
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-opacity-20" style={{ borderColor: `var(--${category.color}-500)` }}>
          <div className={`flex items-center justify-center w-9 h-9 rounded-full ${colorClasses.label}`}>
            <span className="text-xl">{category.emoji}</span>
          </div>
          <h3 className={`text-lg font-bold font-poppins ${colorClasses.title}`}>{category.name}</h3>
        </div>
        
        {/* Message in its own section */}
        <div className="mb-3">
          <p className="text-sm text-purple-700 font-inter leading-relaxed">{category.message}</p>
        </div>
        
        {/* Footer */}
        <div className="pt-2 border-t border-purple-100/30">
          <p className="text-xs text-purple-500/70 italic font-inter">
            Based on your age and weight profile
          </p>
        </div>
      </div>
    </div>
  );
};
