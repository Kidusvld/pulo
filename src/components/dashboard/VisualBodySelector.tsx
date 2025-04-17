
import React, { useState } from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface BodyPartMap {
  id: string;
  name: string;
  path: string;
  viewBox: string;
  description: string;
}

// Updated body parts with anatomically accurate paths
const frontBodyParts: BodyPartMap[] = [
  {
    id: "chest",
    name: "Chest",
    description: "Pectoralis major and minor",
    viewBox: "0 0 100 240",
    path: "M35,65 C35,73 40,80 50,85 C60,80 65,73 65,65 C65,60 60,55 50,55 C40,55 35,60 35,65 Z"
  },
  {
    id: "abs",
    name: "Abs",
    description: "Rectus abdominis and obliques",
    viewBox: "0 0 100 240",
    path: "M40,85 L60,85 L58,125 L42,125 Z M45,95 L55,95 M45,105 L55,105 M45,115 L55,115"
  },
  {
    id: "shoulders",
    name: "Shoulders",
    description: "Deltoids and rotator cuff",
    viewBox: "0 0 100 240",
    path: "M25,65 C25,60 30,55 35,60 C35,65 35,70 35,70 M65,60 C70,55 75,60 75,65 C75,70 65,70 65,70"
  },
  {
    id: "biceps",
    name: "Biceps",
    description: "Biceps brachii",
    viewBox: "0 0 100 240",
    path: "M25,65 C22,75 20,85 20,95 C20,100 22,105 25,105 C30,105 35,90 35,75 M75,65 C78,75 80,85 80,95 C80,100 78,105 75,105 C70,105 65,90 65,75"
  },
  {
    id: "forearms",
    name: "Forearms",
    description: "Flexors and extensors",
    viewBox: "0 0 100 240",
    path: "M25,105 C22,115 20,125 20,130 C20,135 22,140 25,140 C30,140 35,125 35,105 M75,105 C78,115 80,125 80,130 C80,135 78,140 75,140 C70,140 65,125 65,105"
  },
  {
    id: "quadriceps",
    name: "Quadriceps",
    description: "Front thigh muscles",
    viewBox: "0 0 100 240", 
    path: "M42,125 C38,140 35,155 35,170 C35,175 40,175 45,170 C47,155 48,140 48,125 M58,125 C62,140 65,155 65,170 C65,175 60,175 55,170 C53,155 52,140 52,125"
  },
  {
    id: "calves",
    name: "Calves",
    description: "Gastrocnemius and soleus",
    viewBox: "0 0 100 240",
    path: "M35,170 C32,185 30,200 30,210 C30,215 35,215 40,210 C42,195 45,180 45,170 M65,170 C68,185 70,200 70,210 C70,215 65,215 60,210 C58,195 55,180 55,170"
  }
];

const backBodyParts: BodyPartMap[] = [
  {
    id: "back",
    name: "Back",
    description: "Latissimus dorsi, rhomboids, and trapezius",
    viewBox: "0 0 100 240",
    path: "M35,55 C35,60 36,65 40,75 C43,80 50,85 50,85 C50,85 57,80 60,75 C64,65 65,60 65,55 L62,45 L58,35 L50,30 L42,35 L38,45 L35,55 Z M40,65 L60,65 M40,75 L60,75"
  },
  {
    id: "lower_back",
    name: "Lower Back",
    description: "Erector spinae",
    viewBox: "0 0 100 240",
    path: "M40,85 L60,85 L60,110 L40,110 Z M45,85 L45,110 M50,85 L50,110 M55,85 L55,110"
  },
  {
    id: "glutes",
    name: "Glutes",
    description: "Gluteus maximus, medius, and minimus",
    viewBox: "0 0 100 240",
    path: "M40,110 C36,120 35,125 38,135 C40,140 46,140 50,135 C54,140 60,140 62,135 C65,125 64,120 60,110 L55,110 L50,115 L45,110 L40,110 Z"
  },
  {
    id: "triceps",
    name: "Triceps",
    description: "Triceps brachii",
    viewBox: "0 0 100 240",
    path: "M25,65 C22,75 20,85 18,95 C18,100 20,105 25,105 C30,105 35,90 35,70 M75,65 C78,75 80,85 82,95 C82,100 80,105 75,105 C70,105 65,90 65,70"
  },
  {
    id: "hamstrings",
    name: "Hamstrings",
    description: "Back thigh muscles",
    viewBox: "0 0 100 240", 
    path: "M38,135 C38,145 38,150 35,160 C34,165 30,165 28,160 C28,155 36,140 38,135 M62,135 C62,145 62,150 65,160 C66,165 70,165 72,160 C72,155 64,140 62,135"
  },
  {
    id: "calves_back",
    name: "Calves",
    description: "Gastrocnemius and soleus (back view)",
    viewBox: "0 0 100 240",
    path: "M35,160 C34,170 33,180 34,190 C35,200 38,200 40,190 C42,180 41,165 41,160 M65,160 C66,170 67,180 66,190 C65,200 62,200 60,190 C58,180 59,165 59,160"
  }
];

interface VisualBodySelectorProps {
  selectedParts: string[];
  onSelectPart: (part: string) => void;
  className?: string;
  showComingSoon?: boolean;
}

export const VisualBodySelector = ({
  selectedParts,
  onSelectPart,
  className,
  showComingSoon = true
}: VisualBodySelectorProps) => {
  const [view, setView] = useState<"front" | "back">("front");
  
  // Helper function to check if a body part is selected
  const isSelected = (partId: string) => selectedParts.includes(partId);
  
  return (
    <div className={cn("flex flex-col items-center gap-4 relative", className)}>
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
          {/* Enhanced body outline */}
          <path
            d="M50,20 
               C65,20 70,30 70,40 
               C70,45 68,50 65,60 
               C62,70 60,80 60,90 
               C60,100 62,110 65,125 
               C65,140 60,155 55,170 
               C50,185 48,200 50,220 
               C52,200 50,185 45,170 
               C40,155 35,140 35,125 
               C38,110 40,100 40,90 
               C40,80 38,70 35,60 
               C32,50 30,45 30,40 
               C30,30 35,20 50,20Z"
            fill="#fcf8ff"
            stroke="#e9d7ff"
            strokeWidth="0.8"
          />
          
          {/* Enhanced head shape */}
          <ellipse 
            cx="50" 
            cy="15" 
            rx="10" 
            ry="15" 
            fill="#fcf8ff" 
            stroke="#e9d7ff" 
            strokeWidth="0.8"
          />
          
          {/* Neck */}
          <path
            d="M45,20 C45,25 47,30 50,30 C53,30 55,25 55,20"
            fill="#fcf8ff"
            stroke="#e9d7ff"
            strokeWidth="0.5"
          />
          
          {/* Front view selectable muscle groups */}
          {view === "front" && frontBodyParts.map(part => (
            <TooltipProvider key={part.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path
                    d={part.path}
                    fill={isSelected(part.id) ? "rgba(156, 45, 145, 0.55)" : "rgba(232, 121, 249, 0.15)"}
                    stroke={isSelected(part.id) ? "#9b87f5" : "#e9d7ff"}
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
          
          {/* Back view selectable muscle groups */}
          {view === "back" && backBodyParts.map(part => (
            <TooltipProvider key={part.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path
                    d={part.path}
                    fill={isSelected(part.id) ? "rgba(156, 45, 145, 0.55)" : "rgba(232, 121, 249, 0.15)"}
                    stroke={isSelected(part.id) ? "#9b87f5" : "#e9d7ff"}
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

          {/* Enhanced muscle fiber details */}
          <g opacity="0.15" stroke="#bf0fff" strokeWidth="0.3">
            {view === "front" && (
              <>
                {/* Chest detail lines */}
                <path d="M40,65 C45,68 50,70 55,68" />
                <path d="M50,70 C48,72 45,73 42,72" />
                
                {/* Ab definition lines */}
                <path d="M45,90 C48,91 52,91 55,90" />
                <path d="M45,100 C48,101 52,101 55,100" />
                <path d="M45,110 C48,111 52,111 55,110" />
                <path d="M45,120 C48,121 52,121 55,120" />
                
                {/* Arm muscle definition */}
                <path d="M30,70 C28,80 25,90 25,95" />
                <path d="M70,70 C72,80 75,90 75,95" />
                
                {/* Leg muscle definition */}
                <path d="M40,140 C42,145 45,150 48,145" />
                <path d="M60,140 C58,145 55,150 52,145" />
              </>
            )}
            {view === "back" && (
              <>
                {/* Back detail lines */}
                <path d="M40,55 C45,53 55,53 60,55" />
                <path d="M40,65 C45,63 55,63 60,65" />
                <path d="M40,75 C45,73 55,73 60,75" />
                
                {/* Lower back lines */}
                <path d="M45,95 C48,96 52,96 55,95" />
                <path d="M45,105 C48,106 52,106 55,105" />
                
                {/* Glutes definition */}
                <path d="M45,120 C48,125 52,125 55,120" />
                
                {/* Leg muscle definition */}
                <path d="M40,145 C42,150 45,155 48,150" />
                <path d="M60,145 C58,150 55,155 52,150" />
              </>
            )}
          </g>
          
          {/* Additional anatomical details */}
          <g opacity="0.1" stroke="#333" strokeWidth="0.2">
            {/* Joint indicators */}
            <circle cx="25" cy="105" r="2" />
            <circle cx="75" cy="105" r="2" />
            <circle cx="35" cy="170" r="2" />
            <circle cx="65" cy="170" r="2" />
          </g>
        </svg>
        
        {/* Coming Soon Overlay */}
        {showComingSoon && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center">
            <Lock className="h-12 w-12 text-white/90 mb-3" />
            <p className="text-white text-xl font-bold font-montserrat">Coming Soon</p>
            <p className="text-white/80 text-sm max-w-[200px] text-center mt-2 font-opensans">
              This feature is still under development
            </p>
          </div>
        )}
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
      
      {/* Informational Alert */}
      {showComingSoon && (
        <Alert className="bg-purple-50 border-purple-200 mt-2">
          <AlertTitle className="text-purple-800 flex items-center gap-2">
            <Lock className="h-4 w-4" /> Feature In Development
          </AlertTitle>
          <AlertDescription className="text-purple-700/80">
            The body area selector is coming soon to help you target specific muscle groups in your workouts.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export const bodyPartsList = [...frontBodyParts, ...backBodyParts].map(part => part.id);
