
import React, { useState } from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BodyPartMap {
  id: string;
  name: string;
  path: string;
  viewBox: string;
  description: string;
}

const frontBodyParts: BodyPartMap[] = [
  {
    id: "chest",
    name: "Chest",
    description: "Pectoralis major and minor",
    viewBox: "0 0 100 200",
    path: "M50,70 C42,70 35,74 35,85 C35,95 38,100 50,105 C62,100 65,95 65,85 C65,74 58,70 50,70"
  },
  {
    id: "abs",
    name: "Abs",
    description: "Rectus abdominis and obliques",
    viewBox: "0 0 100 200",
    path: "M40,105 L60,105 L60,135 L40,135 Z"
  },
  {
    id: "shoulders",
    name: "Shoulders",
    description: "Deltoids and rotator cuff",
    viewBox: "0 0 100 200",
    path: "M30,70 C25,65 20,65 20,70 C20,75 25,80 30,76 Z M70,70 C75,65 80,65 80,70 C80,75 75,80 70,76 Z"
  },
  {
    id: "biceps",
    name: "Biceps",
    description: "Biceps brachii",
    viewBox: "0 0 100 200",
    path: "M20,75 L15,100 L23,100 L30,80 Z M80,75 L85,100 L77,100 L70,80 Z"
  },
  {
    id: "quadriceps",
    name: "Quadriceps",
    description: "Front thigh muscles",
    viewBox: "0 0 100 200", 
    path: "M40,135 L35,170 L45,170 L45,135 Z M60,135 L65,170 L55,170 L55,135 Z"
  },
  {
    id: "calves",
    name: "Calves",
    description: "Gastrocnemius and soleus",
    viewBox: "0 0 100 200",
    path: "M38,170 L36,195 L44,195 L42,170 Z M62,170 L64,195 L56,195 L58,170 Z"
  },
  {
    id: "forearms",
    name: "Forearms",
    description: "Flexors and extensors",
    viewBox: "0 0 100 200",
    path: "M15,100 L10,120 L18,120 L23,100 Z M85,100 L90,120 L82,120 L77,100 Z"
  }
];

const backBodyParts: BodyPartMap[] = [
  {
    id: "back",
    name: "Back",
    description: "Latissimus dorsi, rhomboids, and trapezius",
    viewBox: "0 0 100 200",
    path: "M35,70 L65,70 L65,105 L35,105 Z"
  },
  {
    id: "lower_back",
    name: "Lower Back",
    description: "Erector spinae",
    viewBox: "0 0 100 200",
    path: "M40,105 L60,105 L60,125 L40,125 Z"
  },
  {
    id: "glutes",
    name: "Glutes",
    description: "Gluteus maximus, medius, and minimus",
    viewBox: "0 0 100 200",
    path: "M40,125 L60,125 L62,145 L38,145 Z"
  },
  {
    id: "triceps",
    name: "Triceps",
    description: "Triceps brachii",
    viewBox: "0 0 100 200",
    path: "M20,75 L15,100 L23,100 L30,80 Z M80,75 L85,100 L77,100 L70,80 Z"
  },
  {
    id: "hamstrings",
    name: "Hamstrings",
    description: "Back thigh muscles",
    viewBox: "0 0 100 200", 
    path: "M40,145 L35,175 L45,175 L45,145 Z M60,145 L65,175 L55,175 L55,145 Z"
  }
];

interface VisualBodySelectorProps {
  selectedParts: string[];
  onSelectPart: (part: string) => void;
  className?: string;
}

export const VisualBodySelector = ({
  selectedParts,
  onSelectPart,
  className
}: VisualBodySelectorProps) => {
  const [view, setView] = useState<"front" | "back">("front");
  
  // Helper function to check if a body part is selected
  const isSelected = (partId: string) => selectedParts.includes(partId);
  
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* View toggle buttons */}
      <div className="flex rounded-lg overflow-hidden border border-purple-200 mb-2">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            view === "front"
              ? "bg-[#5C2D91] text-white"
              : "bg-purple-50 text-[#5C2D91] hover:bg-purple-100"
          }`}
          onClick={() => setView("front")}
        >
          Front View
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            view === "back"
              ? "bg-[#5C2D91] text-white"
              : "bg-purple-50 text-[#5C2D91] hover:bg-purple-100"
          }`}
          onClick={() => setView("back")}
        >
          Back View
        </button>
      </div>
      
      {/* Body figure SVG */}
      <div className="relative w-48 h-80 mx-auto">
        {/* Base body figure */}
        <svg
          viewBox="0 0 100 200"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))" }}
        >
          {/* Body outline */}
          <path
            d="M50,20 C60,20 65,25 65,35 C65,45 60,50 60,50 L60,55 C60,60 65,65 65,70 
               C65,85 60,90 60,100 L60,140 C60,160 65,170 65,180 C65,190 60,195 50,195 
               C40,195 35,190 35,180 C35,170 40,160 40,140 L40,100 C40,90 35,85 35,70 
               C35,65 40,60 40,55 L40,50 C40,50 35,45 35,35 C35,25 40,20 50,20"
            fill="#f8f7fa"
            stroke="#e2d1fa"
            strokeWidth="1"
          />
          {/* Head */}
          <circle cx="50" cy="25" r="15" fill="#f8f7fa" stroke="#e2d1fa" strokeWidth="1" />
          
          {/* Front view selectable muscle groups */}
          {view === "front" && frontBodyParts.map(part => (
            <TooltipProvider key={part.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path
                    d={part.path}
                    fill={isSelected(part.id) ? "rgba(156, 45, 145, 0.5)" : "rgba(156, 45, 145, 0.15)"}
                    stroke={isSelected(part.id) ? "#9b87f5" : "transparent"}
                    strokeWidth="1.5"
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:fill-purple-300/30",
                      isSelected(part.id) && "animate-pulse"
                    )}
                    onClick={() => onSelectPart(part.id)}
                  />
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-[#5C2D91] text-white border-purple-400">
                  <div>
                    <p className="font-bold">{part.name}</p>
                    <p className="text-xs">{part.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          
          {/* Back view selectable muscle groups */}
          {view === "back" && backBodyParts.map(part => (
            <TooltipProvider key={part.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path
                    d={part.path}
                    fill={isSelected(part.id) ? "rgba(156, 45, 145, 0.5)" : "rgba(156, 45, 145, 0.15)"}
                    stroke={isSelected(part.id) ? "#9b87f5" : "transparent"}
                    strokeWidth="1.5"
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:fill-purple-300/30",
                      isSelected(part.id) && "animate-pulse"
                    )}
                    onClick={() => onSelectPart(part.id)}
                  />
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-[#5C2D91] text-white border-purple-400">
                  <div>
                    <p className="font-bold">{part.name}</p>
                    <p className="text-xs">{part.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </svg>
      </div>
      
      {/* Selected muscle groups display */}
      {selectedParts.length > 0 && (
        <div className="w-full mt-2 p-3 bg-purple-50/50 rounded-lg border border-purple-100">
          <p className="text-sm font-medium text-[#5C2D91] mb-1">Selected Areas:</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedParts.map(partId => {
              const part = [...frontBodyParts, ...backBodyParts].find(p => p.id === partId);
              return (
                <div
                  key={partId}
                  className="px-2 py-1 bg-[#5C2D91] text-white text-xs rounded-full flex items-center"
                  onClick={() => onSelectPart(partId)}
                >
                  {part?.name || partId}
                  <span className="ml-1 text-purple-200 cursor-pointer">×</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const bodyPartsList = [...frontBodyParts, ...backBodyParts].map(part => part.id);
