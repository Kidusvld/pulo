
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

// Updated body parts with more anatomically correct paths
const frontBodyParts: BodyPartMap[] = [
  {
    id: "chest",
    name: "Chest",
    description: "Pectoralis major and minor",
    viewBox: "0 0 100 240",
    path: "M38,75 C38,82 42,88 50,92 C58,88 62,82 62,75 C62,68 58,65 50,65 C42,65 38,68 38,75 Z M50,92 C42,88 38,82 38,75 C38,68 35,70 30,70 M50,92 C58,88 62,82 62,75 C62,68 65,70 70,70"
  },
  {
    id: "abs",
    name: "Abs",
    description: "Rectus abdominis and obliques",
    viewBox: "0 0 100 240",
    path: "M43,93 L57,93 L58,130 L42,130 Z M43,93 C43,98 45,103 50,103 C55,103 57,98 57,93 M43,103 L57,103 M43,113 L57,113 M43,123 L57,123"
  },
  {
    id: "shoulders",
    name: "Shoulders",
    description: "Deltoids and rotator cuff",
    viewBox: "0 0 100 240",
    path: "M30,70 C25,65 20,65 18,72 C16,77 20,85 28,80 Z M70,70 C75,65 80,65 82,72 C84,77 80,85 72,80 Z"
  },
  {
    id: "biceps",
    name: "Biceps",
    description: "Biceps brachii",
    viewBox: "0 0 100 240",
    path: "M28,80 C28,85 27,95 26,100 C25,105 18,105 16,100 C14,95 16,85 18,75 M72,80 C72,85 73,95 74,100 C75,105 82,105 84,100 C86,95 84,85 82,75"
  },
  {
    id: "forearms",
    name: "Forearms",
    description: "Flexors and extensors",
    viewBox: "0 0 100 240",
    path: "M26,100 C25,110 23,120 21,130 C19,132 14,132 12,130 C10,125 12,115 16,100 M74,100 C75,110 77,120 79,130 C81,132 86,132 88,130 C90,125 88,115 84,100"
  },
  {
    id: "quadriceps",
    name: "Quadriceps",
    description: "Front thigh muscles",
    viewBox: "0 0 100 240", 
    path: "M42,130 C40,145 38,160 37,170 C36,175 40,175 43,170 C45,165 45,145 46,130 M58,130 C60,145 62,160 63,170 C64,175 60,175 57,170 C55,165 55,145 54,130"
  },
  {
    id: "calves",
    name: "Calves",
    description: "Gastrocnemius and soleus",
    viewBox: "0 0 100 240",
    path: "M37,170 C36,180 35,195 35,205 C35,210 38,215 40,210 C42,205 43,185 43,170 M63,170 C64,180 65,195 65,205 C65,210 62,215 60,210 C58,205 57,185 57,170"
  }
];

const backBodyParts: BodyPartMap[] = [
  {
    id: "back",
    name: "Back",
    description: "Latissimus dorsi, rhomboids, and trapezius",
    viewBox: "0 0 100 240",
    path: "M35,65 C35,70 36,75 40,85 C43,90 50,95 50,95 C50,95 57,90 60,85 C64,75 65,70 65,65 L62,55 L58,45 L50,40 L42,45 L38,55 L35,65 Z M40,75 L60,75 M40,85 L60,85"
  },
  {
    id: "lower_back",
    name: "Lower Back",
    description: "Erector spinae",
    viewBox: "0 0 100 240",
    path: "M42,95 L58,95 L60,120 L40,120 Z M45,95 L45,120 M50,95 L50,120 M55,95 L55,120"
  },
  {
    id: "glutes",
    name: "Glutes",
    description: "Gluteus maximus, medius, and minimus",
    viewBox: "0 0 100 240",
    path: "M40,120 C36,130 35,135 38,145 C40,150 46,150 50,145 C54,150 60,150 62,145 C65,135 64,130 60,120 L55,120 L50,125 L45,120 L40,120 Z"
  },
  {
    id: "triceps",
    name: "Triceps",
    description: "Triceps brachii",
    viewBox: "0 0 100 240",
    path: "M28,80 C28,85 27,95 24,100 C22,105 16,105 14,100 C12,95 14,85 18,75 M72,80 C72,85 73,95 76,100 C78,105 84,105 86,100 C88,95 86,85 82,75"
  },
  {
    id: "hamstrings",
    name: "Hamstrings",
    description: "Back thigh muscles",
    viewBox: "0 0 100 240", 
    path: "M38,145 C38,155 38,160 37,170 C36,175 32,175 30,170 C30,165 36,150 38,145 M62,145 C62,155 62,160 63,170 C64,175 68,175 70,170 C70,165 64,150 62,145"
  },
  {
    id: "calves_back",
    name: "Calves",
    description: "Gastrocnemius and soleus (back view)",
    viewBox: "0 0 100 240",
    path: "M37,170 C36,180 35,190 36,200 C37,210 40,210 42,200 C44,190 43,175 43,170 M63,170 C64,180 65,190 64,200 C63,210 60,210 58,200 C56,190 57,175 57,170"
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
  
  // Reference to the uploaded anatomy image
  const anatomyImageUrl = "public/lovable-uploads/6253decb-a67d-4f9b-ab62-467172c87ebf.png";
  
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
      
      {/* Body figure SVG with improved anatomy */}
      <div className="relative w-64 h-96 mx-auto">
        <svg
          viewBox="0 0 100 240"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))" }}
        >
          {/* Body outline - more anatomical */}
          <path
            d="M50,20 
               C63,20 68,25 71,30 
               C74,35 75,40 75,45 
               C75,50 72,60 70,65 
               C68,70 65,75 65,85 
               C65,95 68,100 70,110 
               C70,120 70,130 70,140
               C70,150 68,160 65,170
               C62,180 60,190 58,200
               C56,210 54,220 50,220
               C46,220 44,210 42,200
               C40,190 38,180 35,170
               C32,160 30,150 30,140
               C30,130 30,120 30,110
               C32,100 35,95 35,85
               C35,75 32,70 30,65
               C28,60 25,50 25,45
               C25,40 26,35 29,30
               C32,25 37,20 50,20Z"
            fill="#f9f5ff"
            stroke="#e9d5ff"
            strokeWidth="0.8"
          />
          
          {/* Head - improved shape */}
          <ellipse cx="50" cy="15" rx="12" ry="15" fill="#f9f5ff" stroke="#e9d5ff" strokeWidth="0.8" />
          
          {/* Front view selectable muscle groups with improved paths */}
          {view === "front" && frontBodyParts.map(part => (
            <TooltipProvider key={part.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path
                    d={part.path}
                    fill={isSelected(part.id) ? "rgba(156, 45, 145, 0.55)" : "rgba(232, 121, 249, 0.15)"}
                    stroke={isSelected(part.id) ? "#9b87f5" : "#e9d5ff"}
                    strokeWidth="0.8"
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:fill-purple-300/40",
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
          
          {/* Back view selectable muscle groups with improved paths */}
          {view === "back" && backBodyParts.map(part => (
            <TooltipProvider key={part.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path
                    d={part.path}
                    fill={isSelected(part.id) ? "rgba(156, 45, 145, 0.55)" : "rgba(232, 121, 249, 0.15)"}
                    stroke={isSelected(part.id) ? "#9b87f5" : "#e9d5ff"}
                    strokeWidth="0.8"
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:fill-purple-300/40",
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

          {/* Muscle fiber details - subtle overlay to enhance anatomical look */}
          <g opacity="0.15" stroke="#bf0fff" strokeWidth="0.3">
            {view === "front" && (
              <>
                <path d="M44,75 C46,80 50,82 53,80" />
                <path d="M56,75 C54,80 50,82 47,80" />
                <path d="M38,85 C42,87 46,88 50,88 C54,88 58,87 62,85" />
                <path d="M40,100 L60,100" />
                <path d="M45,95 L55,95" />
                <path d="M45,105 L55,105" />
              </>
            )}
            {view === "back" && (
              <>
                <path d="M42,80 L58,80" />
                <path d="M40,90 L60,90" />
                <path d="M45,100 L55,100" />
              </>
            )}
          </g>
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
